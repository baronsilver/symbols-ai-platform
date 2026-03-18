"use client";

import { useState } from "react";
import { Key, Eye, EyeOff } from "lucide-react";

interface ApiKeyInputProps {
  value: string;
  provider: "openrouter" | "claude";
  onChange: (key: string, provider: "openrouter" | "claude") => void;
}

export function ApiKeyInput({ value, provider, onChange }: ApiKeyInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {/* Provider Selection */}
      <select
        value={provider}
        onChange={(e) => onChange("", e.target.value as "openrouter" | "claude")}
        className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors"
      >
        <option value="openrouter">OpenRouter</option>
        <option value="claude">Claude</option>
      </select>

      {/* API Key Input */}
      <div className="relative flex items-center">
        <Key size={14} className="absolute left-3 text-muted" />
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value, provider)}
          placeholder={provider === "claude" ? "Claude API Key" : "OpenRouter API Key"}
          className="bg-surface border border-border rounded-lg pl-9 pr-9 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors w-56"
        />
        <button
          onClick={() => setVisible(!visible)}
          className="absolute right-2.5 text-muted hover:text-foreground transition-colors"
          type="button"
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}
