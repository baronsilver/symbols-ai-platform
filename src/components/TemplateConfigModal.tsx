import { useState, useEffect } from "react";
import { X, Wand2 } from "lucide-react";
import { Template } from "@/templates/index";

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

  // Reset state when a new template is selected
  useEffect(() => {
    if (template && isOpen) {
      setProjectName(`my-${template.id}-app`);
      setCustomInstructions("");
    }
  }, [template, isOpen]);

  if (!isOpen || !template) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine base template prompt with user instructions
    // Put custom instructions FIRST with strong emphasis so AI prioritizes them
    let finalPrompt = "";
    if (customInstructions.trim()) {
      finalPrompt = `⚠️ CRITICAL USER CUSTOMIZATION REQUEST - MUST FOLLOW ⚠️
The user wants to customize this template with the following instructions. These instructions OVERRIDE the default template design and content:

"${customInstructions.trim()}"

You MUST adapt the template below to match these customizations. Change the design, colors, content, branding, and structure as needed to fulfill the user's request. The template below is just a starting point - transform it according to the user's vision.

---

`;
    }
    finalPrompt += template.prompt;

    onSubmit(finalPrompt, projectName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-2/50">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 flex-1">
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
                Only lowercase letters, numbers, and dashes.
              </p>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2">
              <label htmlFor="customInstructions" className="text-sm font-medium text-foreground block">
                Custom Instructions <span className="text-muted font-normal">(Optional)</span>
              </label>
              <textarea
                id="customInstructions"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="E.g. Change the theme to use red and orange instead of blue. Add an extra section for team members."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-muted/50 min-h-[120px] resize-y"
              />
              <p className="text-xs text-muted">
                Tell the AI how to modify the base template to fit your needs.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-surface-2/50 flex justify-end gap-3">
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
        </form>
      </div>
    </div>
  );
}
