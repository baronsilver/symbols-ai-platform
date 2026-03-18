"use client";

import { useState, useEffect } from "react";
import { FolderOpen, ChevronDown, Calendar, FileCode, Loader2 } from "lucide-react";

interface Project {
  name: string;
  path: string;
  created: string;
  fileCount: number;
  files: string[];
}

interface ProjectSelectorProps {
  onSelectProject: (project: Project | null) => void;
  currentProject: string | null;
}

export function ProjectSelector({ onSelectProject, currentProject }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const selectedProject = projects.find((p) => p.name === currentProject);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted">
        <Loader2 size={12} className="animate-spin" />
        Loading projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="px-3 py-2 text-xs text-muted">
        No projects yet
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent/10 transition-colors text-sm w-full"
      >
        <FolderOpen size={14} className="text-accent flex-shrink-0" />
        <div className="flex-1 text-left min-w-0">
          {selectedProject ? (
            <div className="truncate">{selectedProject.name}</div>
          ) : (
            <div className="text-muted">Select a project</div>
          )}
        </div>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => {
                  onSelectProject(null);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-accent/10 transition-colors text-sm text-muted"
              >
                Clear selection
              </button>
              {projects.map((project) => (
                <button
                  key={project.name}
                  onClick={() => {
                    onSelectProject(project);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-accent/10 transition-colors ${
                    currentProject === project.name ? "bg-accent/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{project.name}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <Calendar size={10} />
                          {formatDate(project.created)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted">
                          <FileCode size={10} />
                          {project.fileCount} files
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
