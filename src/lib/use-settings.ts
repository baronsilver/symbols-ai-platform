import { useState, useEffect } from "react";

export type ApiProvider = "claude" | "openrouter";

interface Settings {
  apiProvider: ApiProvider;
  claudeApiKey: string;
  openrouterApiKey: string;
  selectedModel: string;
}

const DEFAULT_SETTINGS: Settings = {
  apiProvider: "claude",
  claudeApiKey: "",
  openrouterApiKey: "",
  selectedModel: "claude-opus-4-1",
};

const STORAGE_KEY = "symbols-ai-settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save settings:", err);
    }
  };

  const setApiProvider = (provider: ApiProvider) => {
    updateSettings({ apiProvider: provider });
  };

  const setClaudeApiKey = (key: string) => {
    updateSettings({ claudeApiKey: key });
  };

  const setOpenrouterApiKey = (key: string) => {
    updateSettings({ openrouterApiKey: key });
  };

  const setSelectedModel = (model: string) => {
    updateSettings({ selectedModel: model });
  };

  return {
    settings,
    isLoaded,
    updateSettings,
    setApiProvider,
    setClaudeApiKey,
    setOpenrouterApiKey,
    setSelectedModel,
  };
}
