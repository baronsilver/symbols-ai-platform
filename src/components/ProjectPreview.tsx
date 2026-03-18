"use client";

import { useState, useEffect } from "react";
import { Play, Square, ExternalLink, Loader2, AlertCircle } from "lucide-react";

interface ProjectPreviewProps {
  projectName: string;
}

export function ProjectPreview({ projectName }: ProjectPreviewProps) {
  const [status, setStatus] = useState<"stopped" | "starting" | "running" | "error">("stopped");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, [projectName]);

  const checkStatus = async () => {
    try {
      const res = await fetch(`/api/preview?project=${encodeURIComponent(projectName)}`);
      const data = await res.json();
      if (data.status === "running") {
        setStatus("running");
        setPreviewUrl(data.url);
      } else {
        setStatus("stopped");
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Failed to check preview status:", err);
    }
  };

  const startPreview = async () => {
    setStatus("starting");
    setError(null);
    
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, action: "start" }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error + (data.details ? `: ${data.details}` : ""));
        setStatus("error");
        return;
      }

      setStatus("running");
      setPreviewUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start preview");
      setStatus("error");
    }
  };

  const stopPreview = async () => {
    try {
      await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, action: "stop" }),
      });

      setStatus("stopped");
      setPreviewUrl(null);
    } catch (err) {
      console.error("Failed to stop preview:", err);
    }
  };

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">Live Preview</span>
          {status === "running" && (
            <span className="flex items-center gap-1 text-xs text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Running
            </span>
          )}
          {status === "starting" && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <Loader2 size={12} className="animate-spin" />
              Starting...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status === "stopped" || status === "error" ? (
            <button
              onClick={startPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50"
            >
              <Play size={12} />
              Start Preview
            </button>
          ) : status === "starting" ? (
            <button
              disabled
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-accent/50 text-white transition-colors opacity-50 cursor-not-allowed"
            >
              <Loader2 size={12} className="animate-spin" />
              Starting...
            </button>
          ) : (
            <>
              <button
                onClick={openInNewTab}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded hover:bg-accent/10 transition-colors"
              >
                <ExternalLink size={12} />
                Open in Tab
              </button>
              <button
                onClick={stopPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded hover:bg-error/10 text-error transition-colors"
              >
                <Square size={12} />
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-surface relative">
        {status === "stopped" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
              <Play size={24} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Preview Not Running</h3>
            <p className="text-xs text-muted max-w-sm mb-4">
              Click "Start Preview" to run the Symbols dev server and see your project live
            </p>
          </div>
        )}

        {status === "starting" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Loader2 size={32} className="text-accent animate-spin mb-4" />
            <h3 className="text-sm font-semibold mb-1">Starting Dev Server...</h3>
            <p className="text-xs text-muted max-w-sm">
              Installing dependencies and starting the Symbols platform
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-error/20 flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-error" />
            </div>
            <h3 className="text-sm font-semibold mb-1 text-error">Preview Failed</h3>
            <p className="text-xs text-muted max-w-sm mb-4">{error}</p>
            <button
              onClick={startPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors"
            >
              <Play size={12} />
              Retry
            </button>
          </div>
        )}

        {status === "running" && previewUrl && (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Project Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        )}
      </div>
    </div>
  );
}
