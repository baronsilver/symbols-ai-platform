"use client";

import { Wrench, CheckCircle, Loader2 } from "lucide-react";

interface ToolActivityItem {
  name: string;
  status: "calling" | "done" | "error";
  preview?: string;
}

export function ToolActivityPanel({ tools }: { tools: ToolActivityItem[] }) {
  if (tools.length === 0) return null;

  return (
    <div className="mx-4 mb-2 p-3 rounded-lg bg-accent-muted/50 border border-accent/20">
      <div className="flex items-center gap-2 mb-2">
        <Wrench size={14} className="text-accent" />
        <span className="text-xs font-medium text-accent">MCP Tools</span>
      </div>
      <div className="space-y-1.5">
        {tools.map((tool) => (
          <div key={tool.name} className="flex items-center gap-2 text-xs">
            {tool.status === "calling" ? (
              <Loader2 size={12} className="text-accent animate-spin" />
            ) : (
              <CheckCircle size={12} className="text-success" />
            )}
            <span className="text-foreground/80 font-mono">{tool.name}</span>
            <span className="text-muted">
              {tool.status === "calling" ? "running..." : "done"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
