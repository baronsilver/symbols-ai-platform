"use client";

import { OPENROUTER_MODELS, CLAUDE_MODELS, ModelId } from "@/lib/types";
import { ChevronDown } from "lucide-react";

interface ModelSelectorProps {
  value: ModelId;
  onChange: (model: ModelId) => void;
  disabled?: boolean;
  provider: "openrouter" | "claude";
}

export function ModelSelector({ value, onChange, disabled, provider }: ModelSelectorProps) {
  const models = provider === "claude" ? CLAUDE_MODELS : OPENROUTER_MODELS;
  const selected = models.find((m) => m.id === value);

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ModelId)}
        disabled={disabled}
        className="appearance-none bg-surface border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground hover:border-border-hover focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      />
    </div>
  );
}
