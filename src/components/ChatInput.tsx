"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  activeProject?: string | null;
}

export function ChatInput({ onSend, isLoading, disabled, activeProject }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || isLoading || disabled) return;
    onSend(input);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-background px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={activeProject
              ? `Chat input for editing ${activeProject}. Press Enter to send.`
              : "Chat input to describe the Symbols project you want to create. Press Enter to send."}
            aria-multiline="true"
            placeholder={activeProject 
              ? `Ask me to edit ${activeProject}... (e.g., "fix the navbar", "add a cart modal")`
              : "Describe the Symbols project you want to create..."
            }
            rows={1}
            disabled={disabled}
            className="w-full resize-none bg-surface border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          className={`flex-shrink-0 p-3 rounded-xl transition-all ${
            isLoading
              ? "bg-error/20 text-error hover:bg-error/30"
              : input.trim() && !disabled
              ? "bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20"
              : "bg-surface text-muted cursor-not-allowed"
          }`}
          title={isLoading ? "Stop" : "Send"}
        >
          {isLoading ? <Square size={18} /> : <Send size={18} />}
        </button>
      </div>
    </div>
  );
}
