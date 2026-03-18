"use client";

import { FolderOpen, FileCode, Eye } from "lucide-react";

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
        {onViewProject && (
          <button
            onClick={onViewProject}
            className="flex items-center gap-1.5 px-3 py-1 text-xs rounded bg-success/20 hover:bg-success/30 text-success transition-colors"
          >
            <Eye size={12} />
            View Project
          </button>
        )}
      </div>
      <div className="text-xs text-muted mb-2">
        Saved to <span className="font-mono text-foreground/80">output/{projectName}/</span>
      </div>
      <div className="space-y-1 max-h-40 overflow-y-auto">
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
    </div>
  );
}
