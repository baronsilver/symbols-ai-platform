"use client";

import { useState, useEffect } from "react";
import { FileTreeViewer } from "./FileTreeViewer";
import { CodeViewer } from "./CodeViewer";
import { ProjectPreview } from "./ProjectPreview";
import { X, ExternalLink, Code2, Monitor } from "lucide-react";

interface ProjectVisualizerProps {
  projectName: string;
  files: string[];
  fileContents?: Array<{ path: string; content: string }>;
  onClose: () => void;
}

export function ProjectVisualizer({ projectName, files, fileContents, onClose }: ProjectVisualizerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");

  useEffect(() => {
    if (selectedFile) {
      loadFileContent(selectedFile);
    }
  }, [selectedFile]);

  const loadFileContent = async (filePath: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/files?path=${encodeURIComponent(filePath)}&project=${encodeURIComponent(projectName)}`
      );
      const data = await res.json();
      if (data.content) {
        setFileContent(data.content);
      } else {
        setFileContent("// Error loading file content");
      }
    } catch (err) {
      setFileContent(`// Error: ${err instanceof Error ? err.message : "Failed to load file"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInExplorer = () => {
    // This would need a backend endpoint to open the folder
    alert(`Project location: output/${projectName}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold">Project Visualizer</h2>
            <p className="text-xs text-muted">{projectName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenInExplorer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded hover:bg-accent/10 transition-colors"
            >
              <ExternalLink size={12} />
              Open Folder
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-accent/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree */}
          <div className="w-64 border-r border-border bg-background/50">
            <FileTreeViewer
              files={files}
              projectPath={projectName}
              onFileSelect={setSelectedFile}
              selectedFile={selectedFile}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-border bg-background/50">
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border-b-2 ${
                  activeTab === "code"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <Code2 size={14} />
                Code
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors border-b-2 ${
                  activeTab === "preview"
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <Monitor size={14} />
                Preview
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "code" ? (
                selectedFile ? (
                  loading ? (
                    <div className="flex items-center justify-center h-full text-muted text-sm">
                      Loading...
                    </div>
                  ) : (
                    <CodeViewer filePath={selectedFile} content={fileContent} />
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                      <Code2 size={20} className="text-accent" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">Select a file to view</h3>
                    <p className="text-xs text-muted max-w-sm">
                      Choose a file from the tree on the left to view its contents
                    </p>
                  </div>
                )
              ) : (
                <ProjectPreview projectName={projectName} fileContents={fileContents} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
