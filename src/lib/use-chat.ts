"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Message, ModelId, GeneratedFile } from "./types";

interface ToolActivity {
  name: string;
  status: "calling" | "done" | "error";
  preview?: string;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  toolActivity: ToolActivity[];
  generatedFiles: { projectName: string; files: string[]; fileContents?: Array<{ path: string; content: string }> } | null;
  activeProject: string | null;
  sendMessage: (content: string, options?: { customProjectName?: string; goal?: string; task?: string }) => Promise<void>;
  clearMessages: () => void;
  model: ModelId;
  setModel: (m: ModelId) => void;
  apiKey: string;
  apiProvider: "openrouter" | "claude";
  setApiKey: (k: string, provider: "openrouter" | "claude") => void;
  autoMcp: boolean;
  setAutoMcp: (v: boolean) => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toolActivity, setToolActivity] = useState<ToolActivity[]>([]);
  const [generatedFiles, setGeneratedFiles] = useState<{
    projectName: string;
    files: string[];
    fileContents?: Array<{ path: string; content: string }>;
  } | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [model, setModel] = useState<ModelId>("anthropic/claude-opus-4.6");
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState<"openrouter" | "claude">("openrouter");
  const [autoMcp, setAutoMcp] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  // Load API key and provider from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const storedProvider = localStorage.getItem("api-provider") as "openrouter" | "claude" | null;
    const storedKey = localStorage.getItem(storedProvider === "claude" ? "claude-api-key" : "openrouter-api-key");
    if (storedProvider) {
      setApiProvider(storedProvider);
      // Set default model for the provider
      if (storedProvider === "claude") {
        setModel("claude-opus-4-6" as ModelId);
      } else {
        setModel("anthropic/claude-opus-4.6" as ModelId);
      }
    }
    if (storedKey) setApiKey(storedKey);
  }, []);

  const setApiKeyWithStorage = useCallback((key: string, provider: "openrouter" | "claude") => {
    if (typeof window !== "undefined") {
      // Always update provider first
      setApiProvider(provider);
      localStorage.setItem("api-provider", provider);
      
      // Handle key update
      if (key === "") {
        // Switching providers - load the stored key for that provider
        const storedKey = localStorage.getItem(provider === "claude" ? "claude-api-key" : "openrouter-api-key");
        setApiKey(storedKey || "");
      } else {
        // Key provided - save it
        setApiKey(key);
        localStorage.setItem(provider === "claude" ? "claude-api-key" : "openrouter-api-key", key);
      }
      
      // Switch to appropriate default model for the provider
      if (provider === "claude") {
        setModel("claude-opus-4-6" as ModelId);
      } else {
        setModel("anthropic/claude-opus-4.6" as ModelId);
      }
    } else {
      setApiKey(key);
      setApiProvider(provider);
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string, options?: { customProjectName?: string; goal?: string; task?: string }) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);
      setToolActivity([]);
      setGeneratedFiles(null);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        model,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      abortRef.current = new AbortController();

      try {
        const allMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "x-api-provider": apiProvider,
          },
          body: JSON.stringify({
            messages: allMessages,
            model,
            autoMcp,
            projectName: options?.customProjectName,
            activeProject: activeProject || options?.customProjectName,
            goal: options?.goal,
            task: options?.task,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(trimmed.slice(6));

              switch (data.type) {
                case "text":
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: m.content + data.content }
                        : m
                    )
                  );
                  break;

                case "tool_call":
                  setToolActivity((prev) => [
                    ...prev.filter((t) => t.name !== data.name),
                    { name: data.name, status: data.status },
                  ]);
                  break;

                case "tool_result":
                  setToolActivity((prev) =>
                    prev.map((t) =>
                      t.name === data.name
                        ? { ...t, status: "done", preview: data.preview }
                        : t
                    )
                  );
                  break;

                case "files":
                  setGeneratedFiles({
                    projectName: data.projectName,
                    files: data.files,
                    fileContents: data.fileContents,
                  });
                  setActiveProject(data.projectName);
                  break;

                case "error":
                  setError(data.content);
                  break;

                case "status":
                  // Status messages (MCP connection info, etc.)
                  break;

                case "done":
                  break;
              }
            } catch {
              // skip non-JSON
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unknown error");
        // Remove empty assistant message on error
        setMessages((prev) =>
          prev.filter(
            (m) => m.id !== assistantMessage.id || m.content.length > 0
          )
        );
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, model, apiKey, autoMcp, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setToolActivity([]);
    setGeneratedFiles(null);
    setActiveProject(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    toolActivity,
    generatedFiles,
    activeProject,
    sendMessage,
    clearMessages,
    model,
    setModel,
    apiKey,
    apiProvider,
    setApiKey: setApiKeyWithStorage,
    autoMcp,
    setAutoMcp,
  };
}
