"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen } from "lucide-react";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
  content?: string;
}

interface FileTreeViewerProps {
  files: string[];
  projectPath: string;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
}

function buildFileTree(files: string[]): FileNode[] {
  const root: Record<string, any> = {};

  for (const filePath of files) {
    const parts = filePath.split(/[/\\]/);
    let current: Record<string, any> = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (!current[part]) {
        current[part] = {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          type: isLast ? "file" : "directory",
          children: isLast ? undefined : {},
        };
      }

      if (!isLast && current[part].children) {
        current = current[part].children;
      }
    }
  }

  function convertToArray(obj: Record<string, any>): FileNode[] {
    return Object.values(obj).map((node) => ({
      name: node.name,
      path: node.path,
      type: node.type,
      children: node.children ? convertToArray(node.children) : undefined,
    }));
  }

  return convertToArray(root);
}

function TreeNode({
  node,
  onFileSelect,
  selectedFile,
  level = 0,
}: {
  node: FileNode;
  onFileSelect: (path: string) => void;
  selectedFile: string | null;
  level?: number;
}) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const isSelected = selectedFile === node.path;

  if (node.type === "file") {
    return (
      <div
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent/10 rounded text-sm ${
          isSelected ? "bg-accent/20 text-accent" : ""
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onFileSelect(node.path)}
      >
        <FileCode size={14} className="flex-shrink-0" />
        <span className="truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent/10 rounded text-sm"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {isOpen ? <FolderOpen size={14} className="text-accent" /> : <Folder size={14} />}
        <span className="font-medium">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTreeViewer({ files, projectPath, onFileSelect, selectedFile }: FileTreeViewerProps) {
  const tree = buildFileTree(files);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-2 border-b border-border bg-background/50 sticky top-0">
        <div className="text-xs font-semibold text-muted">Project Files</div>
        <div className="text-xs text-muted/60 truncate">{projectPath}</div>
      </div>
      <div className="p-2">
        {tree.map((node) => (
          <TreeNode key={node.path} node={node} onFileSelect={onFileSelect} selectedFile={selectedFile} />
        ))}
      </div>
    </div>
  );
}
