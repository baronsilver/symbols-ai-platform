"use client";

import { useState, useEffect } from "react";
import { X, Wand2, ChevronDown, ChevronRight, Eye, SlidersHorizontal, Copy, Check } from "lucide-react";
import { Template } from "@/templates/index";
import { parseTemplatePrompt, reconstructPrompt, ParsedTemplate } from "@/lib/template-parser";

interface TemplateConfigModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string, projectName: string) => void;
}

export function TemplateConfigModal({
  template,
  isOpen,
  onClose,
  onSubmit,
}: TemplateConfigModalProps) {
  const [projectName, setProjectName] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [parsed, setParsed] = useState<ParsedTemplate | null>(null);
  const [editedSections, setEditedSections] = useState<Record<string, string>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"quick" | "advanced">("quick");
  const [showPreview, setShowPreview] = useState(false);
  const [previewCopied, setPreviewCopied] = useState(false);

  useEffect(() => {
    if (template && isOpen) {
      setProjectName(`my-${template.id}-app`);
      setCustomInstructions("");

      const parsedTemplate = parseTemplatePrompt(template.prompt);
      setParsed(parsedTemplate);

      const initialEdits: Record<string, string> = {};
      for (const section of parsedTemplate.sections) {
        initialEdits[section.title] = section.content;
      }
      setEditedSections(initialEdits);

      const defaultOpen = new Set<string>();
      for (const section of parsedTemplate.sections) {
        if (section.defaultOpen) defaultOpen.add(section.title);
      }
      setExpandedSections(defaultOpen);

      setActiveTab("quick");
      setShowPreview(false);
    }
  }, [template, isOpen]);

  if (!isOpen || !template) return null;

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const handleSectionEdit = (title: string, value: string) => {
    setEditedSections(prev => ({ ...prev, [title]: value }));
  };

  const resetSection = (title: string) => {
    if (!parsed) return;
    const original = parsed.sections.find(s => s.title === title);
    if (original) {
      setEditedSections(prev => ({ ...prev, [title]: original.content }));
    }
  };

  const isModified = (title: string) => {
    if (!parsed) return false;
    const original = parsed.sections.find(s => s.title === title);
    return original !== undefined && editedSections[title] !== original.content;
  };

  const getModifiedCount = () => {
    if (!parsed) return 0;
    return parsed.sections.filter(s => isModified(s.title)).length;
  };

  const buildFinalPrompt = () => {
    if (!parsed) return "";
    return reconstructPrompt(parsed, editedSections, customInstructions);
  };

  const getSectionColor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("navbar") || t.includes("hero") || t.includes("footer") || t.includes("section") || t.includes("banner") || t.includes("card") || t.includes("grid") || t.includes("table") || t.includes("modal") || t.includes("form") || t.includes("chart") || t.includes("sidebar") || t.includes("top bar") || t.includes("navigation") || t.includes("featured")) return "text-violet-400";
    if (t.includes("state")) return "text-emerald-400";
    if (t.includes("design system")) return "text-pink-400";
    if (t.includes("interactivity")) return "text-amber-400";
    if (t.includes("config")) return "text-sky-400";
    if (t.includes("main.js")) return "text-cyan-400";
    if (t.includes("files")) return "text-orange-400";
    return "text-gray-400";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrompt = buildFinalPrompt();
    onSubmit(finalPrompt, projectName);
    onClose();
  };

  const copyPreview = () => {
    navigator.clipboard.writeText(buildFinalPrompt());
    setPreviewCopied(true);
    setTimeout(() => setPreviewCopied(false), 2000);
  };

  const modifiedCount = getModifiedCount();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-2/50 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Configure Project</h2>
            <p className="text-xs text-muted">Starting from: <span className="text-accent font-medium">{template.name}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-0.5 px-6 pt-4 bg-surface-2/30 border-b border-border/50 shrink-0">
          <button
            onClick={() => { setActiveTab("quick"); setShowPreview(false); }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-all mr-1 ${
              activeTab === "quick" && !showPreview
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <SlidersHorizontal size={12} />
            Quick Setup
          </button>
          <button
            onClick={() => { setActiveTab("advanced"); setShowPreview(false); }}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-all mr-1 ${
              activeTab === "advanced" && !showPreview
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <SlidersHorizontal size={12} />
            Template Sections
            {modifiedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent text-white">
                {modifiedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-all ${
              showPreview
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Eye size={12} />
            Preview
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Quick Setup Tab */}
          {activeTab === "quick" && !showPreview && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <label htmlFor="projectName" className="text-sm font-medium text-foreground block">
                  Project Name
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase())}
                  placeholder="my-awesome-app"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted/50"
                  required
                />
                <p className="text-xs text-muted">
                  Lowercase letters, numbers, and dashes only.
                </p>
              </div>

              {/* Custom Instructions */}
              <div className="space-y-2">
                <label htmlFor="customInstructions" className="text-sm font-medium text-foreground block">
                  Custom Instructions
                  <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent border border-accent/30 align-middle">
                    AI Priority
                  </span>
                </label>
                <p className="text-xs text-muted -mt-1">
                  These instructions are sent to the AI first — use this to override template defaults.
                </p>
                <textarea
                  id="customInstructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="E.g. Use a red and orange color scheme instead of blue. Add a team members section. Change the hero headline to 'Build Faster with AI'."
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted/50 min-h-[140px] resize-y font-mono"
                />
              </div>

              {/* Hint */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/5 border border-accent/20">
                <SlidersHorizontal size={13} className="text-accent shrink-0" />
                <p className="text-xs text-muted">
                  Want to edit specific sections like components, colors, or interactivity rules?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("advanced")}
                    className="text-accent font-medium hover:underline"
                  >
                    Switch to Template Sections
                  </button>
                  {" "}to customize each part individually.
                </p>
              </div>
            </div>
          )}

          {/* Advanced Sections Tab */}
          {activeTab === "advanced" && !showPreview && (
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {/* Project Overview - Editable */}
              {parsed?.intro && (
                <div className="rounded-xl border border-border overflow-hidden bg-background/50 mb-3">
                  <button
                    type="button"
                    onClick={() => toggleSection("__intro__")}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface/50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-foreground">Project Overview</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-2 text-muted border border-border">Intro</span>
                    {isModified("__intro__") && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent border border-accent/30 shrink-0">
                        Modified
                      </span>
                    )}
                    <div className="flex-1" />
                    {isModified("__intro__") && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); resetSection("__intro__"); }}
                        className="text-[10px] px-2 py-0.5 rounded border border-muted/40 text-muted hover:border-error/50 hover:text-error transition-colors shrink-0 mr-1"
                      >
                        Reset
                      </button>
                    )}
                    {expandedSections.has("__intro__") ? (
                      <ChevronDown size={14} className="text-muted shrink-0" />
                    ) : (
                      <ChevronRight size={14} className="text-muted shrink-0" />
                    )}
                  </button>
                  
                  {expandedSections.has("__intro__") && (
                    <div className="border-t border-border">
                      <textarea
                        value={editedSections["__intro__"] ?? parsed.intro}
                        onChange={(e) => handleSectionEdit("__intro__", e.target.value)}
                        className="w-full bg-surface border-0 rounded-b-xl px-4 py-3 text-xs text-foreground focus:outline-none transition-all min-h-[140px] resize-y font-mono leading-relaxed"
                        spellCheck={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Sections Accordion */}
              {parsed?.sections.map((section) => {
                const isOpen = expandedSections.has(section.title);
                const hasChanges = isModified(section.title);
                const colorClass = getSectionColor(section.title);
                return (
                  <div key={section.title} className="rounded-xl border border-border overflow-hidden bg-background/50">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.title)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface/50 transition-colors"
                    >
                      <span className={`text-sm font-semibold ${colorClass}`}>
                        {section.title}
                      </span>
                      {hasChanges && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent border border-accent/30 shrink-0">
                          Modified
                        </span>
                      )}
                      <div className="flex-1" />
                      {hasChanges && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); resetSection(section.title); }}
                          className="text-[10px] px-2 py-0.5 rounded border border-muted/40 text-muted hover:border-error/50 hover:text-error transition-colors shrink-0 mr-1"
                        >
                          Reset
                        </button>
                      )}
                      {isOpen ? (
                        <ChevronDown size={14} className="text-muted shrink-0" />
                      ) : (
                        <ChevronRight size={14} className="text-muted shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="border-t border-border">
                        <textarea
                          value={editedSections[section.title] ?? section.content}
                          onChange={(e) => handleSectionEdit(section.title, e.target.value)}
                          className="w-full bg-surface border-0 rounded-b-xl px-4 py-3 text-xs text-foreground focus:outline-none transition-all min-h-[140px] resize-y font-mono leading-relaxed"
                          spellCheck={false}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Custom Instructions in Advanced */}
              {customInstructions && (
                <div className="rounded-xl border border-accent/30 overflow-hidden bg-accent/5">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-accent/20">
                    <span className="text-sm font-medium text-accent">Custom Instructions</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent border border-accent/30">AI Priority</span>
                  </div>
                  <div className="px-4 py-3">
                    <textarea
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="E.g. Use a red and orange color scheme instead of blue..."
                      className="w-full bg-transparent text-xs text-foreground focus:outline-none min-h-[80px] resize-y font-mono leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview Tab - Editable */}
          {showPreview && (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-6 py-3 border-b border-border/50 bg-surface-2/20 shrink-0">
                <p className="text-xs text-muted">Full prompt that will be sent to AI — you can edit directly</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="text-xs text-accent hover:underline"
                  >
                    Back to Sections
                  </button>
                  <button
                    type="button"
                    onClick={copyPreview}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-surface hover:bg-surface-2 transition-colors text-muted hover:text-foreground border border-border"
                  >
                    {previewCopied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                    {previewCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <textarea
                  value={buildFinalPrompt()}
                  onChange={(e) => {
                    // Allow direct editing of the full prompt
                    // This will be treated as custom instructions override
                    setCustomInstructions(e.target.value);
                  }}
                  className="w-full h-full bg-surface px-6 py-4 text-xs text-foreground focus:outline-none resize-none font-mono leading-relaxed"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-surface-2/50 shrink-0">
            {(modifiedCount > 0 && activeTab === "advanced") && (
              <p className="text-xs text-muted mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {modifiedCount} section{modifiedCount > 1 ? "s" : ""} modified
                <span className="text-muted/50">—</span>
                <button
                  type="button"
                  onClick={() => {
                    if (!parsed) return;
                    const resets: Record<string, string> = {};
                    for (const s of parsed.sections) resets[s.title] = s.content;
                    setEditedSections(resets);
                  }}
                  className="text-accent hover:underline font-medium"
                >
                  Reset all
                </button>
              </p>
            )}
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted">
                {activeTab === "quick"
                  ? "Tip: Custom instructions override template defaults."
                  : showPreview
                  ? "Review your prompt, then generate."
                  : `${parsed?.sections.length ?? 0} sections — ${modifiedCount} modified`}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wand2 size={16} />
                  Generate Project
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
