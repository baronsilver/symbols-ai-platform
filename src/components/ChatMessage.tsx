"use client";

import { Message } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div
      className={`flex gap-3 px-4 py-5 ${
        isUser ? "bg-transparent" : "bg-surface/40"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isUser ? "bg-accent-muted text-accent" : "bg-surface-2 text-muted"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted">
            {isUser ? "You" : message.model ?? "Assistant"}
          </span>
          <span className="text-xs text-muted/50">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre({ children, ...props }) {
                const codeEl = children as React.ReactElement<{
                  children: string;
                  className?: string;
                }>;
                const codeStr =
                  typeof codeEl === "string"
                    ? codeEl
                    : codeEl?.props?.children ?? "";
                const codeId = `code-${message.id}-${Math.random().toString(36).slice(2, 6)}`;

                return (
                  <div className="relative group my-3">
                    <button
                      onClick={() => copyCode(String(codeStr), codeId)}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-surface-2/80 text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy code"
                    >
                      {copied === codeId ? (
                        <Check size={14} />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                    <pre {...props}>{children}</pre>
                  </div>
                );
              },
              a({ href, children, ...props }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover underline"
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
