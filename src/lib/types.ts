export interface Message {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  toolResults?: ToolResult[];
  model?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  callId: string;
  name: string;
  content: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  model: string;
  autoMcp: boolean;
}

export interface StreamChunk {
  type: "text" | "tool_call" | "tool_result" | "files" | "error" | "done";
  content?: string;
  toolCall?: ToolCall;
  toolResult?: ToolResult;
  files?: GeneratedFile[];
}

export const OPENROUTER_MODELS = [
  { id: "anthropic/claude-opus-4.6", name: "Claude Opus 4.6", provider: "Anthropic" },
  { id: "anthropic/claude-sonnet-4.6", name: "Claude Sonnet 4.6", provider: "Anthropic" },
  { id: "anthropic/claude-sonnet-4.5", name: "Claude Sonnet 4.5", provider: "Anthropic" },
  { id: "google/gemini-3.1-pro-preview", name: "Gemini 3.1 Pro", provider: "Google" },
  { id: "google/gemini-3-flash-preview", name: "Gemini 3 Flash", provider: "Google" },
  { id: "google/gemini-3.1-flash-lite-preview", name: "Gemini 3.1 Flash Lite", provider: "Google" },
  { id: "openai/gpt-5.3-codex", name: "GPT-5.3 Codex", provider: "OpenAI" },
  { id: "moonshotai/kimi-k2.5", name: "Kimi K2.5", provider: "Moonshot AI" },
  { id: "minimax/minimax-m2.5", name: "MiniMax M2.5", provider: "MiniMax" },
  { id: "mistralai/devstral-2512", name: "Devstral 2512", provider: "Mistral AI" },
  { id: "openai/gpt-oss-120b:free", name: "GPT OSS 120B (Free)", provider: "OpenAI" },
  { id: "qwen/qwen3-coder:free", name: "Qwen3 Coder (Free)", provider: "Qwen" },
] as const;

export const CLAUDE_MODELS = [
  { id: "claude-opus-4-6", name: "Claude Opus 4.6", provider: "Anthropic" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "Anthropic" },
  { id: "claude-haiku-4-5-20251001", name: "Claude Haiku 4.5", provider: "Anthropic" },
] as const;

export type ModelId = (typeof OPENROUTER_MODELS)[number]["id"] | (typeof CLAUDE_MODELS)[number]["id"];

export type ApiProvider = "openrouter" | "claude";
