"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeViewerProps {
  filePath: string;
  content: string;
  language?: string;
}

export function CodeViewer({ filePath, content, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguage = () => {
    if (language) return language;
    const ext = filePath.split(".").pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      json: "json",
      html: "html",
      css: "css",
      md: "markdown",
    };
    return langMap[ext || ""] || "text";
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50 sticky top-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-muted truncate">{filePath}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded hover:bg-accent/10 transition-colors flex-shrink-0"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-xs font-mono leading-relaxed">
          <code className={`language-${getLanguage()}`}>{content}</code>
        </pre>
      </div>
    </div>
  );
}
