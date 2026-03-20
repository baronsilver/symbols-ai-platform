const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
  tool_calls?: {
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }[];
}

export interface McpToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

function mcpToolsToOpenAI(mcpTools: McpToolDef[]) {
  return mcpTools.map((t) => ({
    type: "function" as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
    },
  }));
}

function mcpToolsToClaude(mcpTools: McpToolDef[]) {
  return mcpTools.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.inputSchema,
  }));
}

export async function* streamChat(
  messages: OpenRouterMessage[],
  model: string,
  apiKey: string,
  mcpTools?: McpToolDef[],
  provider: "openrouter" | "claude" = "openrouter"
): AsyncGenerator<string> {
  if (provider === "claude") {
    // Claude API format
    const systemMessage = messages.find(m => m.role === "system");
    const userMessages = messages.filter(m => m.role !== "system");
    
    const body: Record<string, unknown> = {
      model,
      max_tokens: 32000,
      messages: userMessages,
      stream: true,
    };

    if (systemMessage) {
      body.system = systemMessage.content;
    }

    if (mcpTools && mcpTools.length > 0) {
      body.tools = mcpToolsToClaude(mcpTools);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    try {
      const res = await fetch(CLAUDE_API_URL, {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Claude error ${res.status}: ${err}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") return;
          yield data;
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  } else {
    // OpenRouter API format
    const body: Record<string, unknown> = {
      model,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 32000,
    };

    if (mcpTools && mcpTools.length > 0) {
      body.tools = mcpToolsToOpenAI(mcpTools);
      body.tool_choice = "auto";
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

    try {
      const res = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://symbols-ai-platform.local",
          "X-Title": "Symbols AI Platform",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenRouter error ${res.status}: ${err}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") return;
          yield data;
        }
      }
    } finally {
      clearTimeout(timeout);
    }
  }
}
