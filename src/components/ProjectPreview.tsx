"use client";

import { useState, useEffect } from "react";
import { Play, Square, ExternalLink, Loader2, AlertCircle, Download, FolderOpen, Code2 } from "lucide-react";
// CDN URLs for bare module specifiers
// esm.sh auto-bundles all sub-dependencies so @domql/utils etc. are included
const CDN_MAP: Record<string, string> = {
  smbls: "https://esm.sh/smbls@3?bundle",
};

// Resolve a relative import path against a base file path
function resolvePath(from: string, to: string, fileIndex: Set<string>): string {
  if (!to.startsWith(".")) return to;
  const fromParts = from.split("/").slice(0, -1);
  const toParts = to.split("/");
  for (const part of toParts) {
    if (part === "..") fromParts.pop();
    else if (part !== ".") fromParts.push(part);
  }
  let resolved = fromParts.join("/");
  if (!fileIndex.has(resolved) && !resolved.endsWith(".js")) {
    if (fileIndex.has(resolved + ".js")) resolved += ".js";
    else if (fileIndex.has(resolved + "/index.js")) resolved += "/index.js";
  }
  return resolved;
}

// Rewrite import/export specifiers in JS source code
function rewriteImports(
  source: string,
  filePath: string,
  blobUrlMap: Record<string, string>,
  fileIndex: Set<string>
): string {
  // Match: import ... from 'spec'  |  export ... from 'spec'  |  import('spec')
  return source.replace(
    /((?:import|export)\s+(?:.*?\s+from\s+)?['"])([^'"]+)(['"])/g,
    (_match, prefix, specifier, suffix) => {
      // Bare module specifier -> CDN (exact match first)
      if (CDN_MAP[specifier]) {
        return prefix + CDN_MAP[specifier] + suffix;
      }
      // Relative path -> blob URL
      if (specifier.startsWith(".")) {
        const resolved = resolvePath(filePath, specifier, fileIndex);
        if (blobUrlMap[resolved]) {
          return prefix + blobUrlMap[resolved] + suffix;
        }
      }
      // Any other bare specifier (npm package) -> esm.sh CDN
      if (!specifier.startsWith(".") && !specifier.startsWith("/") && !specifier.startsWith("http")) {
        return prefix + `https://esm.sh/${specifier}?bundle` + suffix;
      }
      return prefix + specifier + suffix;
    }
  );
}

// Build a self-contained HTML preview that loads smbls from CDN
// All import rewriting happens here in TypeScript, not at runtime
function buildPreviewHtml(fileContents: Array<{ path: string; content: string }>): string {
  // Collect JS files
  const jsFiles: Record<string, string> = {};
  for (const file of fileContents) {
    if (file.path.endsWith(".js") || file.path.endsWith(".mjs")) {
      jsFiles[file.path] = file.content;
    }
  }

  const fileIndex = new Set(Object.keys(jsFiles));

  // Topological sort: process leaf modules first so their blob URLs
  // are available when parent modules are rewritten.
  // Simple approach: process files with deepest paths first.
  const sortedPaths = Object.keys(jsFiles).sort((a, b) => {
    const depthA = a.split("/").length;
    const depthB = b.split("/").length;
    return depthB - depthA; // deepest first
  });

  // Create blob URLs bottom-up
  const blobUrlMap: Record<string, string> = {};

  // We need to do multiple passes since a file at depth N may import
  // a sibling at the same depth. Do passes until no new URLs are created.
  let changed = true;
  const maxPasses = 10;
  let pass = 0;
  while (changed && pass < maxPasses) {
    changed = false;
    pass++;
    for (const filePath of sortedPaths) {
      if (blobUrlMap[filePath]) continue;

      // Check if all local imports of this file are already resolved
      const source = jsFiles[filePath];
      const importRegex = /(?:import|export)\s+(?:.*?\s+from\s+)?['"]([^'"]+)['"]/g;
      let allResolved = true;
      let m;
      while ((m = importRegex.exec(source)) !== null) {
        const spec = m[1];
        if (spec.startsWith(".")) {
          const resolved = resolvePath(filePath, spec, fileIndex);
          if (fileIndex.has(resolved) && !blobUrlMap[resolved]) {
            allResolved = false;
            break;
          }
        }
      }

      if (!allResolved) continue;

      // Rewrite this file's imports and create a blob URL
      const rewritten = rewriteImports(source, filePath, blobUrlMap, fileIndex);
      const blob = new Blob([rewritten], { type: "application/javascript" });
      blobUrlMap[filePath] = URL.createObjectURL(blob);
      changed = true;
    }
  }

  // Handle any remaining files that couldn't be resolved (circular deps etc)
  for (const filePath of sortedPaths) {
    if (blobUrlMap[filePath]) continue;
    const rewritten = rewriteImports(jsFiles[filePath], filePath, blobUrlMap, fileIndex);
    const blob = new Blob([rewritten], { type: "application/javascript" });
    blobUrlMap[filePath] = URL.createObjectURL(blob);
  }

  // Find the entry point
  const entryPath = jsFiles["index.js"] ? "index.js" : sortedPaths.find(f => f.endsWith("index.js")) || sortedPaths[0];
  const entryBlobUrl = blobUrlMap[entryPath] || "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Symbols Preview</title>
  <style>
    body { margin: 0; background: #000; color: #fff; font-family: system-ui, sans-serif; }
    .preview-error { padding: 20px; color: #f87171; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <script type="module">
    try {
      await import("${entryBlobUrl}");
    } catch(e) {
      console.error('Preview error:', e);
      const div = document.createElement('div');
      div.className = 'preview-error';
      div.textContent = 'Preview Error:\\n' + e.message + '\\n\\n' + (e.stack || '');
      document.body.appendChild(div);
    }
  </script>
</body>
</html>`;
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
  const [blobPreviewUrl, setBlobPreviewUrl] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);

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

  // Build and show inline blob preview
  const startBlobPreview = () => {
    if (!fileContents || fileContents.length === 0) {
      setError("No files to preview. Generate a project first.");
      return;
    }

    setSandboxLoading(true);
    setError(null);

    try {
      // Revoke previous blob URL
      if (blobPreviewUrl) URL.revokeObjectURL(blobPreviewUrl);

      const html = buildPreviewHtml(fileContents);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      setBlobPreviewUrl(url);
      setStatus("running");
    } catch (err) {
      console.error("Failed to build preview:", err);
      setError(err instanceof Error ? err.message : "Failed to start preview");
    } finally {
      setSandboxLoading(false);
    }
  };

  // Open preview in new tab
  const openPreviewInNewTab = () => {
    if (!fileContents || fileContents.length === 0) {
      setError("No files to preview. Generate a project first.");
      return;
    }

    try {
      const html = buildPreviewHtml(fileContents);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Failed to open preview:", err);
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
    if (blobPreviewUrl) URL.revokeObjectURL(blobPreviewUrl);
    setBlobPreviewUrl(null);
    setStatus("unavailable");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">{isDeployed ? "Browser Preview" : "Live Preview"}</span>
          {(status === "running" || blobPreviewUrl) && (
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
            blobPreviewUrl ? (
              <>
                <button
                  onClick={openPreviewInNewTab}
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
                onClick={startBlobPreview}
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
        {status === "unavailable" && !blobPreviewUrl && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
              <Code2 size={24} className="text-accent" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Preview Your Project</h3>
            <p className="text-xs text-muted max-w-sm mb-4">
              Preview your project directly in the browser, or download the files to run locally.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={startBlobPreview}
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
                    Start Preview
                  </>
                )}
              </button>
              <button
                onClick={openPreviewInNewTab}
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

        {/* Blob URL preview iframe for deployed environment */}
        {blobPreviewUrl && isDeployed && (
          <iframe
            src={blobPreviewUrl}
            className="w-full h-full border-0"
            title="Browser Preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        )}
      </div>
    </div>
  );
}
