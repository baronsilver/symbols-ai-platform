"use client";

import { useState, useEffect, useRef } from "react";
import { FileTreeViewer } from "./FileTreeViewer";
import { CodeViewer } from "./CodeViewer";
import { ProjectPreview } from "./ProjectPreview";
import { ChatMessage } from "./ChatMessage";
import { X, ExternalLink, Code2, Monitor, Send, Loader, MessageSquare, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Message } from "@/lib/types";
import { writeLocalFile } from "@/lib/local-file-system";
import { parseGeneratedFiles } from "@/lib/parse-files";

interface ProjectVisualizerProps {
  projectName: string;
  files: string[];
  fileContents?: Array<{ path: string; content: string }>;
  onClose: () => void;
}

export function ProjectVisualizer({ projectName: initialProjectName, files: initialFiles, fileContents: initialFileContents, onClose }: ProjectVisualizerProps) {
  const [currentProjectName, setCurrentProjectName] = useState(initialProjectName);
  const [currentFiles, setCurrentFiles] = useState(initialFiles);
  const [currentFileContents, setCurrentFileContents] = useState(initialFileContents);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "chat">("code");
  const [isLocalFolder, setIsLocalFolder] = useState(false);
  const [localDirHandle, setLocalDirHandle] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatApiProvider, setChatApiProvider] = useState<"openrouter" | "claude">("claude");
  const [chatApiKey, setChatApiKey] = useState("");
  const [chatModel, setChatModel] = useState("claude-opus-4-6");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [pushStatus, setPushStatus] = useState<"idle" | "checking" | "pushing" | "success" | "error">("idle");
  const [pushMessage, setPushMessage] = useState<string | null>(null);
  const [smblsInstalled, setSmblsInstalled] = useState<boolean | null>(null);
  const [smblsLoggedIn, setSmblsLoggedIn] = useState<boolean | null>(null);

  // Check smbls CLI status on mount (only for non-local projects)
  useEffect(() => {
    if (!isLocalFolder) {
      fetch("/api/smbls")
        .then(res => res.json())
        .then(data => {
          setSmblsInstalled(data.installed);
          setSmblsLoggedIn(data.loggedIn);
        })
        .catch(() => {
          setSmblsInstalled(false);
          setSmblsLoggedIn(false);
        });
    }
  }, [isLocalFolder]);

  // Load API key and provider from localStorage on mount
  useEffect(() => {
    const storedProvider = localStorage.getItem("api-provider") as "openrouter" | "claude" | null;
    const claudeKey = localStorage.getItem("claude-api-key");
    const openrouterKey = localStorage.getItem("openrouter-api-key");

    let provider = storedProvider;
    if (!provider) {
      provider = claudeKey ? "claude" : "openrouter";
    }

    setChatApiProvider(provider);
    setChatModel(provider === "claude" ? "claude-opus-4-6" : "anthropic/claude-opus-4.6");
    const key = provider === "claude" ? claudeKey : openrouterKey;
    if (key) setChatApiKey(key);
  }, []);

  const handlePushToSymbols = async () => {
    setPushStatus("checking");
    setPushMessage(null);

    const manualInstructions = [
      "This web environment can't run your local smbls CLI.",
      "Run these commands in your terminal:",
      `cd output/${currentProjectName}`,
      "npm i -g @symbo.ls/cli",
      "smbls login",
      "smbls push",
    ].join("\n");

    const isLocalhost = typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    if (!isLocalhost) {
      setPushStatus("idle");
      setPushMessage(manualInstructions);
      return;
    }

    try {
      // Check status first
      const statusRes = await fetch("/api/smbls");
      const statusData = await statusRes.json();

      if (!statusData.installed) {
        setPushStatus("error");
        setPushMessage("smbls CLI not installed. Run: npm i -g @symbo.ls/cli");
        return;
      }

      if (!statusData.loggedIn) {
        setPushStatus("error");
        setPushMessage("Not logged in. Run 'smbls login' in your terminal first.");
        return;
      }

      setPushStatus("pushing");
      const pushRes = await fetch("/api/smbls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: currentProjectName, action: "push" }),
      });

      const pushData = await pushRes.json();

      if (pushData.error) {
        setPushStatus("error");
        setPushMessage(pushData.error + (pushData.details ? `: ${pushData.details}` : ""));
        return;
      }

      setPushStatus("success");
      setPushMessage(pushData.previewUrl
        ? `Pushed! Preview: ${pushData.previewUrl}`
        : "Project pushed to Symbols platform successfully!"
      );

      // Reset after 5 seconds
      setTimeout(() => {
        setPushStatus("idle");
        setPushMessage(null);
      }, 5000);
    } catch (err) {
      setPushStatus("error");
      setPushMessage(err instanceof Error ? err.message : "Failed to push project");
    }
  };

  // Handle local folder selection from ProjectPreview
  const handleLocalFolderSelect = (folderName: string, files: string[], fileContents: Array<{ path: string; content: string }>, dirHandle?: any) => {
    setCurrentProjectName(folderName);
    setCurrentFiles(files);
    setCurrentFileContents(fileContents);
    setIsLocalFolder(true);
    setLocalDirHandle(dirHandle || null);
    setSelectedFile(null);
    setFileContent("");
    setActiveTab("code");
  };

  useEffect(() => {
    if (selectedFile) {
      loadFileContent(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessageContent = chatInput;
    setChatInput("");
    
    // Create user message with proper Message type
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessageContent,
      timestamp: Date.now(),
    };
    
    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      model: chatModel,
    };
    
    setChatMessages((prev) => [...prev, userMessage]);
    setChatLoading(true);
    setStreamingMessageId(assistantMessage.id);

    try {
      // Build context with file contents for local folders
      let contextMessage = "";
      if (isLocalFolder && currentFileContents && currentFileContents.length > 0) {
        contextMessage = `[LOCAL PROJECT: ${currentProjectName}]\nThe user is editing a local project. Here are the current files:\n\n`;
        for (const file of currentFileContents) {
          contextMessage += `**${file.path}**\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
        }
        contextMessage += `\nWhen editing files, provide the complete updated file content. The user can save changes directly.`;
      }

      const messagesWithContext = contextMessage 
        ? [{ role: "system", content: contextMessage }, ...chatMessages.map(m => ({ role: m.role, content: m.content })), { role: "user", content: userMessageContent }]
        : chatMessages.map(m => ({ role: m.role, content: m.content })).concat([{ role: "user", content: userMessageContent }]);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-api-provider": chatApiProvider,
      };
      if (chatApiKey) {
        headers["x-api-key"] = chatApiKey;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: messagesWithContext,
          model: chatModel,
          autoMcp: !isLocalFolder,
          activeProject: isLocalFolder ? undefined : currentProjectName,
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      // Add assistant message and stream into it
      setChatMessages((prev) => [...prev, assistantMessage]);
      setChatLoading(false);

      let streamedContent = "";

      const reader = res.body?.getReader();
      if (reader) {
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

              if (data.type === "text" && data.content) {
                streamedContent += data.content;
                setChatMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMessage.id
                      ? { ...m, content: m.content + data.content }
                      : m
                  )
                );
              }

              if (data.type === "files" && data.files && isLocalFolder && localDirHandle) {
                // Write files to local folder
                const files = Array.isArray(data.files) ? data.files : data.fileContents;
                for (const file of files) {
                  try {
                    await writeLocalFile(localDirHandle, file.path, file.content);
                    setCurrentFileContents(prev =>
                      prev?.map(f => f.path === file.path ? { ...f, content: file.content } : f)
                    );
                  } catch (err) {
                    console.error(`Failed to write file ${file.path}:`, err);
                  }
                }
              }
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }

      // Parse files from the streamed content if we have a local folder
      if (isLocalFolder && localDirHandle && streamedContent) {
        const parsed = parseGeneratedFiles(streamedContent);
        for (const file of parsed) {
          try {
            await writeLocalFile(localDirHandle, file.path, file.content);
            setCurrentFileContents(prev => {
              const exists = prev?.some(f => f.path === file.path);
              if (exists) {
                return prev?.map(f => f.path === file.path ? { ...f, content: file.content } : f);
              } else {
                return [...(prev || []), { path: file.path, content: file.content }];
              }
            });
          } catch (err) {
            console.error(`Failed to write file ${file.path}:`, err);
          }
        }
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `Sorry, I encountered an error: ${err instanceof Error ? err.message : "Unknown error"}`,
        timestamp: Date.now(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
      setStreamingMessageId(null);
    }
  };

  const loadFileContent = async (filePath: string) => {
    setLoading(true);
    try {
      // If we have local file contents, use them directly
      if (currentFileContents) {
        const file = currentFileContents.find(f => f.path === filePath);
        if (file) {
          setFileContent(file.content);
          setLoading(false);
          return;
        }
      }
      
      // Otherwise fetch from API
      const res = await fetch(
        `/api/files?path=${encodeURIComponent(filePath)}&project=${encodeURIComponent(currentProjectName)}`
      );
      const data = await res.json();
      if (data.content) {
        setFileContent(data.content);
      } else {
        setFileContent("// Error loading file content");
      }
    } catch (err) {
      setFileContent(`// Error: ${err instanceof Error ? err.message : "Failed to load file"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFile = async (newContent: string) => {
    if (!selectedFile) return;
    try {
      // If working with local folder, update the local file contents
      if (isLocalFolder && currentFileContents) {
        setCurrentFileContents(prev => 
          prev?.map(f => f.path === selectedFile ? { ...f, content: newContent } : f)
        );
        setFileContent(newContent);
        return;
      }
      
      // Otherwise save via API
      const res = await fetch("/api/files", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: selectedFile,
          project: currentProjectName,
          content: newContent,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save file");
      }

      setFileContent(newContent);
    } catch (err) {
      throw err;
    }
  };

  const handleOpenInExplorer = () => {
    // This would need a backend endpoint to open the folder
    alert(`Project location: ${isLocalFolder ? currentProjectName : `output/${currentProjectName}`}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold">Project Visualizer</h2>
            <p className="text-xs text-muted">{currentProjectName}{isLocalFolder ? " (Local)" : ""}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Push to Symbols button */}
            {!isLocalFolder && (
              <button
                onClick={handlePushToSymbols}
                disabled={pushStatus === "checking" || pushStatus === "pushing"}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-colors ${
                  pushStatus === "success"
                    ? "bg-success/20 text-success"
                    : pushStatus === "error"
                    ? "bg-error/20 text-error hover:bg-error/30"
                    : "bg-accent/20 text-accent hover:bg-accent/30"
                } disabled:opacity-50`}
                title={pushMessage || "Push project to Symbols platform"}
              >
                {pushStatus === "checking" || pushStatus === "pushing" ? (
                  <Loader size={12} className="animate-spin" />
                ) : pushStatus === "success" ? (
                  <CheckCircle size={12} />
                ) : pushStatus === "error" ? (
                  <AlertCircle size={12} />
                ) : (
                  <Upload size={12} />
                )}
                {pushStatus === "checking" ? "Checking..." :
                 pushStatus === "pushing" ? "Pushing..." :
                 pushStatus === "success" ? "Pushed!" :
                 pushStatus === "error" ? "Retry Push" :
                 "Push to Symbols"}
              </button>
            )}
            <button
              onClick={handleOpenInExplorer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded hover:bg-accent/10 transition-colors"
            >
              <ExternalLink size={12} />
              Open Folder
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-accent/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Push status message */}
        {pushMessage && (
          <div className={`px-4 py-2 text-xs flex items-center gap-2 ${
            pushStatus === "success" ? "bg-success/10 text-success border-b border-success/20" :
            pushStatus === "error" ? "bg-error/10 text-error border-b border-error/20" :
            "bg-accent/10 text-accent border-b border-accent/20"
          }`}>
            {pushStatus === "success" ? <CheckCircle size={12} /> : 
             pushStatus === "error" ? <AlertCircle size={12} /> :
             <Loader size={12} className="animate-spin" />}
            <span className="flex-1">{pushMessage}</span>
            <button
              onClick={() => { setPushMessage(null); if (pushStatus !== "pushing" && pushStatus !== "checking") setPushStatus("idle"); }}
              className="hover:opacity-70"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree */}
          <div className="w-64 border-r border-border bg-background/50">
            <FileTreeViewer
              files={currentFiles}
              projectPath={currentProjectName}
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-border bg-background/50">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border-b-2 ${
                  activeTab === "code"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <Code2 size={14} />
                Code
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border-b-2 ${
                  activeTab === "preview"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <Monitor size={14} />
                Preview
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border-b-2 ${
                  activeTab === "chat"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <Send size={14} />
                AI Edit
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "code" ? (
                selectedFile ? (
                  loading ? (
                    <div className="flex items-center justify-center h-full text-muted text-sm">
                      Loading...
                    </div>
                  ) : (
                    <CodeViewer 
                      filePath={selectedFile} 
                      content={fileContent}
                      onSave={handleSaveFile}
                      isEditable={true}
                    />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                      <Code2 size={20} className="text-accent" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">Select a file to view</h3>
                    <p className="text-xs text-muted max-w-sm">
                      Choose a file from the tree on the left to view its contents
                    </p>
                  </div>
                )
              ) : activeTab === "preview" ? (
                <ProjectPreview projectName={currentProjectName} fileContents={currentFileContents} onLocalFolderSelect={handleLocalFolderSelect} />
              ) : (
                <div className="flex flex-col h-full">
                  {/* Chat Messages - Same style as main page */}
                  <div className="flex-1 overflow-y-auto">
                    {chatMessages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <MessageSquare size={24} className="text-accent mb-4" />
                        <h3 className="text-sm font-semibold mb-1">Ask AI to edit your code</h3>
                        <p className="text-xs text-muted max-w-sm">
                          Ask the AI to make changes to your project. It will update files directly.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {chatMessages.map((msg) => (
                          <ChatMessage key={msg.id} message={msg} />
                        ))}
                      </div>
                    )}
                    {chatLoading && (
                      <div className="flex gap-3 px-4 py-5 bg-surface/40">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-surface-2 text-muted">
                          <Loader size={16} className="animate-spin" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs text-muted">Thinking...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-border p-3 bg-background/50">
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask AI to edit the code..."
                        disabled={chatLoading}
                        className="flex-1 px-3 py-2 text-xs rounded bg-surface border border-border text-foreground placeholder-muted outline-none focus:border-accent transition-colors disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={chatLoading || !chatInput.trim()}
                        className="px-3 py-2 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        <Send size={12} />
                        Send
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
