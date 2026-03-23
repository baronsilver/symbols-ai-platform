"use client";

import { Copy, Check, Edit2, Save, X } from "lucide-react";
import { useState, useMemo } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import markdown from "highlight.js/lib/languages/markdown";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("markdown", markdown);

interface CodeViewerProps {
  filePath: string;
  content: string;
  language?: string;
  onSave?: (newContent: string) => Promise<void>;
  isEditable?: boolean;
}

export function CodeViewer({ filePath, content, language, onSave, isEditable = false }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedContent : content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    if (!onSave) return;
    setIsSaving(true);
    try {
      await onSave(editedContent);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save file");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const getLanguage = () => {
    if (language) return language;
    const ext = filePath.split(".").pop()?.toLowerCase();
    const langMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      json: "json",
      html: "html",
      css: "css",
      md: "markdown",
      toml: "text",
      sql: "text",
    };
    return langMap[ext || ""] || "text";
  };

  const highlightedHtml = useMemo(() => {
    const lang = getLanguage();
    try {
      if (lang !== "text" && hljs.getLanguage(lang)) {
        return hljs.highlight(content, { language: lang }).value;
      }
    } catch {
      // fallback to plain text
    }
    return null;
  }, [content, filePath, language]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50 sticky top-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-muted truncate">{filePath}</span>
        </div>
        <div className="flex items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-2 py-1 text-xs rounded bg-accent hover:bg-accent/90 text-white transition-colors flex-shrink-0 disabled:opacity-50"
              >
                <Save size={12} />
                <span>{isSaving ? "Saving..." : "Save"}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-2 py-1 text-xs rounded hover:bg-error/10 text-error transition-colors flex-shrink-0"
              >
                <X size={12} />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <>
              {isEditable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs rounded hover:bg-accent/10 transition-colors flex-shrink-0"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2 py-1 text-xs rounded hover:bg-accent/10 transition-colors flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-green-500" />
                    <span className="text-green-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full p-4 text-xs font-mono leading-relaxed bg-background text-foreground border-none outline-none resize-none"
            spellCheck="false"
          />
        ) : (
          <pre className="p-4 text-xs font-mono leading-relaxed">
            {highlightedHtml ? (
              <code
                className={`language-${getLanguage()} hljs`}
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
              />
            ) : (
              <code className={`language-${getLanguage()}`}>{content}</code>
            )}
          </pre>
        )}
      </div>
    </div>
  );
}
