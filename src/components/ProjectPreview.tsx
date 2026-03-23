"use client";

import { useState, useEffect } from "react";
import { Play, Square, ExternalLink, Loader2, AlertCircle, Download, FolderOpen, Code2 } from "lucide-react";
import sdk from "@stackblitz/sdk";

// Build StackBlitz project files from generated file contents
function buildStackBlitzFiles(fileContents: Array<{ path: string; content: string }>): Record<string, string> {
  const files: Record<string, string> = {};
  for (const file of fileContents) {
    files[file.path] = file.content;
  }
  return files;
}

interface ProjectPreviewProps {
  projectName: string;
  fileContents?: Array<{ path: string; content: string }>;
  onLocalFolderSelect?: (folderName: string, files: string[], fileContents: Array<{ path: string; content: string }>) => void;
}

export function ProjectPreview({ projectName, fileContents, onLocalFolderSelect }: ProjectPreviewProps) {
  const [status, setStatus] = useState<"stopped" | "starting" | "running" | "error" | "unavailable">("stopped");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeployed, setIsDeployed] = useState(false);
  const [stackblitzEmbedded, setStackblitzEmbedded] = useState(false);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const stackblitzContainerRef = useState<string>(`stackblitz-${Date.now()}`)[0];

  useEffect(() => {
    // Check if we're in a deployed environment (no localhost)
    const isLocalhost = typeof window !== "undefined" && 
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    setIsDeployed(!isLocalhost);
    
    if (isLocalhost) {
      checkStatus();
    } else {
      setStatus("unavailable");
    }
  }, [projectName]);

  // Embed StackBlitz preview inline
  const embedStackBlitz = async () => {
    if (!fileContents || fileContents.length === 0) {
      setError("No files to preview. Generate a project first.");
      return;
    }

    setSandboxLoading(true);
    setError(null);

    try {
      const files = buildStackBlitzFiles(fileContents);
      await sdk.embedProject(
        stackblitzContainerRef,
        {
          title: projectName,
          description: "Symbols Project Preview",
          template: "node",
          files,
        },
        {
          height: "100%",
          openFile: "index.js",
          view: "preview",
          hideNavigation: true,
          hideDevTools: true,
          theme: "dark",
        }
      );
      setStackblitzEmbedded(true);
      setStatus("running");
    } catch (err) {
      console.error("Failed to embed StackBlitz:", err);
      setError(err instanceof Error ? err.message : "Failed to start preview");
    } finally {
      setSandboxLoading(false);
    }
  };

  // Open StackBlitz in new tab
  const openInNewStackBlitz = async () => {
    if (!fileContents || fileContents.length === 0) {
      setError("No files to preview. Generate a project first.");
      return;
    }

    try {
      const files = buildStackBlitzFiles(fileContents);
      sdk.openProject(
        {
          title: projectName,
          description: "Symbols Project Preview",
          template: "node",
          files,
        },
        { openFile: "index.js", view: "preview" }
      );
    } catch (err) {
      console.error("Failed to open StackBlitz:", err);
      setError(err instanceof Error ? err.message : "Failed to open preview");
    }
  };

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
      setStatus("unavailable");
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
        // Check if it's a "project not found" error (deployed environment)
        if (data.error === "Project not found") {
          setStatus("unavailable");
          return;
        }
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

  const selectLocalFolder = async () => {
    try {
      // Use File System Access API to let user select a folder
      const dirHandle = await (window as any).showDirectoryPicker();
      
      // Recursively read all files from the folder
      const files: string[] = [];
      const fileContentsArray: Array<{ path: string; content: string }> = [];
      
      async function readDirectory(handle: any, path: string = "") {
        for await (const entry of handle.values()) {
          const entryPath = path ? `${path}/${entry.name}` : entry.name;
          
          if (entry.kind === "file") {
            // Skip node_modules and hidden files
            if (entryPath.includes("node_modules") || entry.name.startsWith(".")) {
              continue;
            }
            
            try {
              const file = await entry.getFile();
              const content = await file.text();
              files.push(entryPath);
              fileContentsArray.push({ path: entryPath, content });
            } catch (e) {
              console.warn(`Could not read file: ${entryPath}`, e);
            }
          } else if (entry.kind === "directory") {
            // Skip node_modules and hidden directories
            if (entry.name === "node_modules" || entry.name.startsWith(".")) {
              continue;
            }
            await readDirectory(entry, entryPath);
          }
        }
      }
      
      await readDirectory(dirHandle);
      
      if (files.length === 0) {
        alert("No files found in the selected folder.");
        return;
      }
      
      // Call the callback to update the visualizer
      if (onLocalFolderSelect) {
        onLocalFolderSelect(dirHandle.name, files, fileContentsArray);
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // User cancelled
        return;
      }
      console.error("Failed to select folder:", err);
      alert("Failed to select folder. Make sure you're using a modern browser that supports the File System Access API.");
    }
  };

  const downloadProject = async () => {
    if (!fileContents || fileContents.length === 0) {
      alert("No files to download. Generate a project first.");
      return;
    }

    try {
      // Dynamically import JSZip
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add files to zip with proper folder structure
      for (const file of fileContents) {
        zip.file(file.path, file.content);
      }

      // Generate zip blob
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to create ZIP:", err);
      // Fallback to text file if JSZip fails
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

  // Close/reset embedded preview
  const closeSandbox = () => {
    setStackblitzEmbedded(false);
    setStatus("unavailable");
    // Clear the container
    const container = document.getElementById(stackblitzContainerRef);
    if (container) container.innerHTML = "";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">{isDeployed ? "StackBlitz Preview" : "Live Preview"}</span>
          {(status === "running" || stackblitzEmbedded) && (
            <span className="flex items-center gap-1 text-xs text-success">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Running
            </span>
          )}
          {(status === "starting" || sandboxLoading) && (
            <span className="flex items-center gap-1 text-xs text-muted">
              <Loader2 size={12} className="animate-spin" />
              Starting...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Deployed environment controls */}
          {isDeployed ? (
            stackblitzEmbedded ? (
              <>
                <button
                  onClick={openInNewStackBlitz}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded hover:bg-accent/10 transition-colors"
                >
                  <ExternalLink size={12} />
                  Open in Tab
                </button>
                <button
                  onClick={closeSandbox}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded hover:bg-error/10 text-error transition-colors"
                >
                  <Square size={12} />
                  Close
                </button>
              </>
            ) : (
              <button
                onClick={embedStackBlitz}
                disabled={sandboxLoading || !fileContents || fileContents.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50"
              >
                {sandboxLoading ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Play size={12} />
                    Start Preview
                  </>
                )}
              </button>
            )
          ) : (
            /* Local environment controls */
            status === "stopped" || status === "error" ? (
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
            )
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 bg-surface relative">
        {status === "unavailable" && !stackblitzEmbedded && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
              <Code2 size={24} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Preview Your Project</h3>
            <p className="text-xs text-muted max-w-sm mb-4">
              Open your project in StackBlitz to preview it live, or download the files to run locally.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={embedStackBlitz}
                disabled={sandboxLoading || !fileContents || fileContents.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50"
              >
                {sandboxLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Starting Preview...
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Preview in StackBlitz
                  </>
                )}
              </button>
              <button
                onClick={openInNewStackBlitz}
                disabled={!fileContents || fileContents.length === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-xs rounded bg-accent/20 hover:bg-accent/30 text-accent transition-colors disabled:opacity-50"
              >
                <ExternalLink size={14} />
                Open in New Tab
              </button>
              <div className="border-t border-border my-2 w-full" />
              <button
                onClick={downloadProject}
                className="flex items-center gap-1.5 px-4 py-2 text-xs rounded hover:bg-surface-2 transition-colors"
              >
                <Download size={14} />
                Download Project Files
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

        {status === "running" && previewUrl && !isDeployed && (
          <iframe
            src={previewUrl}
            className="w-full h-full border-0"
            title="Project Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        )}

        {/* StackBlitz embed container for deployed environment */}
        {isDeployed && (
          <div
            id={stackblitzContainerRef}
            className={`w-full h-full ${stackblitzEmbedded ? '' : 'hidden'}`}
          />
        )}
      </div>
    </div>
  );
}
