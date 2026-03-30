"use client";

import { useState, useEffect } from "react";
import { Play, Square, ExternalLink, Loader2, AlertCircle, Download, FolderOpen, Code2, Copy, Check } from "lucide-react";

interface ProjectPreviewProps {
  projectName: string;
  fileContents?: Array<{ path: string; content: string }>;
  onLocalFolderSelect?: (
    folderName: string,
    files: string[],
    fileContents: Array<{ path: string; content: string }>,
    dirHandle?: any
  ) => void;
}

const PREVIEW_PORT = 1234;

export function ProjectPreview({ projectName, fileContents, onLocalFolderSelect }: ProjectPreviewProps) {
  const [status, setStatus] = useState<"stopped" | "running" | "error" | "unavailable">("stopped");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localFolderName, setLocalFolderName] = useState<string | null>(null);

  useEffect(() => {
    const isLocalhost = typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    setIsDeployed(!isLocalhost);
  }, []);

  // Reset preview state when opening/switching projects.
  // Users should explicitly start their dev server before previewing.
  useEffect(() => {
    setPreviewUrl(null);
    setError(null);
    setCopied(false);
    setLocalFolderName(null);
    setStatus("stopped");
  }, [projectName]);

  const startPreview = async () => {
    setPreviewUrl(`http://localhost:${PREVIEW_PORT}`);
    setStatus("running");
  };

  const stopPreview = () => {
    setPreviewUrl(null);
    setStatus("stopped");
  };

  const copyCommands = () => {
    const folderName = localFolderName || projectName;
    const commands = `cd ${folderName}
npm install
npm start`;
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadProject = async () => {
    if (!fileContents || fileContents.length === 0) {
      alert("No files to download. Generate a project first.");
      return;
    }

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      for (const file of fileContents) {
        zip.file(file.path, file.content);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to create ZIP:", err);
      const content = fileContents.map(f =>
        `// FILE: ${f.path}\n${f.content}\n`
      ).join("\n" + "=".repeat(80) + "\n\n");

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}-files.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  const selectLocalFolder = async () => {
    try {
      const dirHandle = await (window as any).showDirectoryPicker();
      const files: string[] = [];
      const fileContentsArray: Array<{ path: string; content: string }> = [];

      async function readDirectory(handle: any, path: string = "") {
        for await (const entry of handle.values()) {
          const entryPath = path ? `${path}/${entry.name}` : entry.name;

          if (entry.kind === "file") {
            if (entryPath.includes("node_modules") || entry.name.startsWith(".")) {
              continue;
            }
            const file = await entry.getFile();
            const content = await file.text();
            files.push(entryPath);
            fileContentsArray.push({ path: entryPath, content });
          } else if (entry.kind === "directory" && entry.name !== "node_modules") {
            await readDirectory(entry, entryPath);
          }
        }
      }

      await readDirectory(dirHandle);
      setLocalFolderName(dirHandle.name);
      setStatus("stopped"); // Show instructions instead of download screen
      onLocalFolderSelect?.(dirHandle.name, files, fileContentsArray, dirHandle);
    } catch (err) {
      console.error("Failed to select folder:", err);
      setError(err instanceof Error ? err.message : "Failed to select folder");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">Local Preview</span>
          {status === "running" && (
            <span className="flex items-center gap-1 text-xs text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Running on port {PREVIEW_PORT}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {status === "stopped" || status === "error" ? (
            <button
              onClick={startPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors"
            >
              <Play size={12} />
              Start Preview
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
        {status === "unavailable" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
              <Code2 size={24} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Preview Your Project</h3>
            <p className="text-xs text-muted max-w-sm mb-4">
              Download the project and run it locally, then preview it here.
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button
                onClick={downloadProject}
                disabled={!fileContents || fileContents.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50"
              >
                <Download size={14} />
                Download Project (ZIP)
              </button>
              <button
                onClick={() => selectLocalFolder()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs rounded hover:bg-surface-2 transition-colors"
              >
                <FolderOpen size={14} />
                Open Local Folder
              </button>
            </div>
            {error && (
              <p className="text-xs text-error mt-4">{error}</p>
            )}
          </div>
        )}

        {status === "stopped" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
              <Play size={24} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Preview Not Running</h3>
            <p className="text-xs text-muted max-w-sm mb-4">
              Start the dev server locally, then click "Start Preview" to see your project.
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

      {/* Instructions Panel */}
      {status === "running" && (
        <div className="border-t border-border bg-background/50 p-4">
          <h4 className="text-xs font-semibold mb-2">Quick Start</h4>
          <div className="bg-surface-2 rounded p-3 mb-2">
            {localFolderName ? (
              <>
                <p className="text-xs text-muted mb-2">Run these commands in your local folder:</p>
                <div className="flex gap-2 items-start">
                  <code className="text-xs bg-surface-3 px-2 py-1 rounded flex-1 font-mono">
                    cd {localFolderName}<br />
                    npm install<br />
                    npm start
                  </code>
                  <button
                    onClick={copyCommands}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-muted mb-2">1. Download the project as ZIP</p>
                <p className="text-xs text-muted mb-2">2. Extract and run these commands:</p>
                <div className="flex gap-2 items-start">
                  <code className="text-xs bg-surface-3 px-2 py-1 rounded flex-1 font-mono">
                    cd {projectName}<br />
                    npm install<br />
                    npm start
                  </code>
                  <button
                    onClick={copyCommands}
                    className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </>
            )}
          </div>
          <p className="text-xs text-muted">
            The dev server runs on <code className="bg-surface-2 px-1 rounded">http://localhost:{PREVIEW_PORT}</code>
          </p>
        </div>
      )}
    </div>
  );
}
