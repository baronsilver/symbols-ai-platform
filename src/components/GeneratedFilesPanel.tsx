"use client";

import { FolderOpen, FileCode, Eye, Code2 } from "lucide-react";

interface GeneratedFilesPanelProps {
  projectName: string;
  files: string[];
  onViewProject?: () => void;
}

export function GeneratedFilesPanel({
  projectName,
  files,
  onViewProject,
}: GeneratedFilesPanelProps) {
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
      {onViewProject && (
        <button
          onClick={onViewProject}
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-accent hover:bg-accent/90 text-white transition-colors"
        >
          <Code2 size={16} />
          Open Project
        </button>
      )}
    </div>
  );
}
