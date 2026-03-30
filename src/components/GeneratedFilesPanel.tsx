"use client";

import { FolderOpen, FileCode, Code2, Download } from "lucide-react";

interface GeneratedFilesPanelProps {
  projectName: string;
  files: string[];
  fileContents?: Array<{ path: string; content: string }>;
  onViewProject?: () => void;
}

export function GeneratedFilesPanel({
  projectName,
  files,
  fileContents,
  onViewProject,
}: GeneratedFilesPanelProps) {
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
      // Fallback: download as plain text
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

  return (
    <div className="mx-4 mb-3 p-4 rounded-lg bg-success/10 border border-success/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen size={16} className="text-success" />
          <span className="text-sm font-medium text-success">
            Project Generated
          </span>
        </div>
        <span className="text-xs text-muted">{files.length} files</span>
      </div>
      <div className="text-xs text-muted mb-3">
        Saved to <span className="font-mono text-foreground/80">output/{projectName}/</span>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto mb-3">
        {files.map((file) => (
          <div
            key={file}
            className="flex items-center gap-2 text-xs text-foreground/70"
          >
            <FileCode size={12} className="text-muted flex-shrink-0" />
            <span className="font-mono truncate">{file}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={downloadProject}
          disabled={!fileContents || fileContents.length === 0}
          className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium rounded-lg bg-accent hover:bg-accent/90 text-white transition-colors disabled:opacity-50"
        >
          <Download size={16} />
          Download ZIP
        </button>
        {onViewProject && (
          <button
            onClick={onViewProject}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-surface-2 hover:bg-border text-foreground transition-colors"
          >
            <Code2 size={16} />
            Open Project
          </button>
        )}
      </div>
    </div>
  );
}
