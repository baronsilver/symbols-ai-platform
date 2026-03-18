"use client";

import { useState, useRef } from "react";
import { ArrowRight, Code2, Sparkles, Upload, X, FolderOpen, FileCode, Trash2 } from "lucide-react";

const FRAMEWORKS = [
  { id: "auto", name: "Auto-detect", description: "Let AI detect the framework" },
  { id: "react", name: "React / JSX", description: "React components with JSX" },
  { id: "vue", name: "Vue", description: "Vue Single File Components" },
  { id: "angular", name: "Angular", description: "Angular templates" },
  { id: "html", name: "HTML / Tailwind", description: "Plain HTML with Tailwind CSS" },
];

interface SourceFile {
  name: string;
  path: string;
  content: string;
}

interface ConversionToolProps {
  onConvert: (code: string, framework: string, projectName: string, customInstructions?: string) => void;
  disabled?: boolean;
}

export function ConversionTool({ onConvert, disabled }: ConversionToolProps) {
  const [code, setCode] = useState("");
  const [framework, setFramework] = useState("auto");
  const [projectName, setProjectName] = useState("my-converted-app");
  const [customInstructions, setCustomInstructions] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [sourceFiles, setSourceFiles] = useState<SourceFile[]>([]);
  const [inputMode, setInputMode] = useState<"paste" | "folder">("paste");
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine all source files or use pasted code
    let finalCode = "";
    if (inputMode === "folder" && sourceFiles.length > 0) {
      finalCode = sourceFiles.map(f => `// File: ${f.path}\n${f.content}`).join("\n\n---\n\n");
    } else {
      finalCode = code;
    }
    
    if (!finalCode.trim()) return;
    onConvert(finalCode, framework, projectName, customInstructions.trim() || undefined);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch {
      // Clipboard access denied
    }
  };

  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validExtensions = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html', '.css', '.scss'];
    const ignoreDirs = ['node_modules', '.git', 'dist', 'build', '.next'];
    
    const newFiles: SourceFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = file.webkitRelativePath || file.name;
      
      // Skip ignored directories
      if (ignoreDirs.some(dir => path.includes(`/${dir}/`) || path.includes(`\\${dir}\\`))) {
        continue;
      }
      
      // Only include valid source files
      if (!validExtensions.some(ext => file.name.endsWith(ext))) {
        continue;
      }
      
      try {
        const content = await file.text();
        newFiles.push({
          name: file.name,
          path: path,
          content: content
        });
      } catch {
        // Skip files that can't be read
      }
    }
    
    setSourceFiles(newFiles);
    
    // Auto-detect framework from files
    if (newFiles.some(f => f.name.endsWith('.vue'))) {
      setFramework('vue');
    } else if (newFiles.some(f => f.name.endsWith('.tsx') || f.name.endsWith('.jsx'))) {
      setFramework('react');
    } else if (newFiles.some(f => f.content.includes('@Component') || f.content.includes('@NgModule'))) {
      setFramework('angular');
    }
  };

  const removeFile = (path: string) => {
    setSourceFiles(prev => prev.filter(f => f.path !== path));
  };

  const clearFiles = () => {
    setSourceFiles([]);
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  const hasContent = inputMode === "folder" ? sourceFiles.length > 0 : code.trim().length > 0;

  if (!isExpanded) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <button
          onClick={() => setIsExpanded(true)}
          disabled={disabled}
          className={`group w-full flex items-center justify-between gap-4 px-6 py-5 rounded-2xl border-2 transition-all ${
            disabled
              ? "opacity-40 cursor-not-allowed border-border bg-surface/50"
              : "border-accent/30 hover:border-accent bg-gradient-to-br from-surface to-surface-2/50 hover:shadow-lg hover:shadow-accent/10 cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent/20 transition-all">
              <Code2 size={22} className="text-accent" />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold text-foreground mb-0.5">Convert Existing Code</p>
              <p className="text-sm text-muted">Select a project folder or paste code to convert to Symbols</p>
            </div>
          </div>
          <ArrowRight size={20} className="text-muted group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-accent/30 bg-surface overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-2/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
              <Code2 size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Code Converter</h3>
              <p className="text-xs text-muted">Convert React, Vue, Angular, or Tailwind to Symbols</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Input Mode Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">Source Input</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode("folder")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  inputMode === "folder"
                    ? "bg-accent text-white"
                    : "bg-surface-2 text-muted hover:text-foreground border border-border hover:border-accent/40"
                }`}
              >
                <FolderOpen size={14} />
                Select Folder
              </button>
              <button
                type="button"
                onClick={() => setInputMode("paste")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  inputMode === "paste"
                    ? "bg-accent text-white"
                    : "bg-surface-2 text-muted hover:text-foreground border border-border hover:border-accent/40"
                }`}
              >
                <Upload size={14} />
                Paste Code
              </button>
            </div>
          </div>

          {/* Folder Input */}
          {inputMode === "folder" && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  ref={folderInputRef}
                  type="file"
                  /* @ts-expect-error webkitdirectory is not in standard types */
                  webkitdirectory=""
                  directory=""
                  multiple
                  onChange={handleFolderSelect}
                  className="hidden"
                  id="folder-input"
                />
                <label
                  htmlFor="folder-input"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-surface-2 text-foreground border border-border hover:border-accent/40 cursor-pointer transition-all"
                >
                  <FolderOpen size={16} />
                  {sourceFiles.length > 0 ? "Change Folder" : "Choose Project Folder"}
                </label>
                {sourceFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-muted hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 size={12} />
                    Clear
                  </button>
                )}
              </div>

              {/* File List */}
              {sourceFiles.length > 0 && (
                <div className="bg-background border border-border rounded-xl p-3 max-h-48 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-foreground">
                      {sourceFiles.length} file{sourceFiles.length !== 1 ? 's' : ''} selected
                    </span>
                    <span className="text-xs text-muted">
                      {(sourceFiles.reduce((acc, f) => acc + f.content.length, 0) / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div className="space-y-1">
                    {sourceFiles.map((file) => (
                      <div
                        key={file.path}
                        className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-surface-2/50 group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCode size={12} className="text-accent flex-shrink-0" />
                          <span className="text-xs text-foreground truncate">{file.path}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.path)}
                          className="p-1 rounded text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sourceFiles.length === 0 && (
                <div className="bg-background border border-dashed border-border rounded-xl p-8 text-center">
                  <FolderOpen size={32} className="mx-auto text-muted/50 mb-2" />
                  <p className="text-sm text-muted">Select a project folder to convert</p>
                  <p className="text-xs text-muted/70 mt-1">Supports .js, .jsx, .ts, .tsx, .vue, .html, .css files</p>
                </div>
              )}
            </div>
          )}

          {/* Code Paste Input */}
          {inputMode === "paste" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Paste Your Code</label>
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                >
                  <Upload size={12} />
                  Paste from clipboard
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`// Paste your ${FRAMEWORKS.find(f => f.id === framework)?.name || 'React'} code here...

const MyComponent = () => {
  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-lg">
      <img src="/avatar.png" className="w-12 h-12 rounded-full" />
      <div>
        <h2 className="text-lg font-bold text-gray-900">John Doe</h2>
        <p className="text-sm text-gray-500">Software Engineer</p>
      </div>
      <button className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg">
        Follow
      </button>
    </div>
  );
};`}
                className="w-full h-48 bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground font-mono focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted/40 resize-y"
              />
            </div>
          )}

          {/* Framework selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">Source Framework</label>
            <div className="flex flex-wrap gap-2">
              {FRAMEWORKS.map((fw) => (
                <button
                  key={fw.id}
                  type="button"
                  onClick={() => setFramework(fw.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    framework === fw.id
                      ? "bg-accent text-white"
                      : "bg-surface-2 text-muted hover:text-foreground border border-border hover:border-accent/40"
                  }`}
                >
                  {fw.name}
                </button>
              ))}
            </div>
          </div>

          {/* Project name */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase())}
              placeholder="my-converted-app"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted/50"
            />
            <p className="text-xs text-muted">
              Output will be saved to: <code className="text-accent/80">output/{projectName}/</code>
            </p>
          </div>

          {/* Custom Instructions */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              Custom Instructions <span className="text-muted font-normal">(Optional)</span>
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="E.g. Change the color scheme to use purple instead of blue. Add dark mode support. Simplify the component structure."
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted/50 min-h-[80px] resize-y"
            />
            <p className="text-xs text-muted">
              Tell the AI how to modify or improve the code during conversion.
            </p>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!hasContent || disabled}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} />
              Convert to Symbols
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
