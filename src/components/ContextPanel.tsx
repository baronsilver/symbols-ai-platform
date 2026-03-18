"use client";

import { useState, useEffect } from "react";

interface AgentContext {
  currentTask?: string;
  currentStep?: string;
  goal?: string;
  activeFiles?: string[];
  decisions?: string[];
  lastUpdated: string;
  sessionId: string;
  isComplete: boolean;
  pendingQuestions?: string[];
  notes?: Record<string, string>;
}

export function ContextPanel() {
  const [context, setContext] = useState<AgentContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchContext = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        setContext(data);
      }
    } catch (err) {
      console.error("Failed to load context:", err);
    }
  };

  const clearContext = async () => {
    setLoading(true);
    try {
      await fetch("/api/chat", { method: "DELETE" });
      setContext(null);
    } catch (err) {
      console.error("Failed to clear context:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContext();
    // Refresh every 30 seconds
    const interval = setInterval(fetchContext, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!context || (!context.currentTask && !context.goal)) {
    return (
      <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
        No active context
      </div>
    );
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleTimeString();
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-900">Agent Context</span>
          {context.isComplete ? (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Complete</span>
          ) : (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Active</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100"
          >
            {expanded ? "Collapse" : "Expand"}
          </button>
          <button
            onClick={clearContext}
            disabled={loading}
            className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100 disabled:opacity-50"
          >
            {loading ? "..." : "Clear"}
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-2">
        Last updated: {formatDate(context.lastUpdated)}
      </div>

      {context.goal && (
        <div className="mb-2">
          <span className="font-medium text-gray-700">Goal:</span>
          <p className="text-gray-600 mt-0.5">{context.goal}</p>
        </div>
      )}

      {context.currentTask && !expanded && (
        <div className="mb-2">
          <span className="font-medium text-gray-700">Current:</span>
          <p className="text-gray-600 mt-0.5 truncate">{context.currentTask}</p>
        </div>
      )}

      {expanded && (
        <>
          {context.currentTask && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Current Task:</span>
              <p className="text-gray-600 mt-0.5">{context.currentTask}</p>
            </div>
          )}

          {context.currentStep && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Step:</span>
              <p className="text-gray-600 mt-0.5">{context.currentStep}</p>
            </div>
          )}

          {context.activeFiles && context.activeFiles.length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Active Files ({context.activeFiles.length}):</span>
              <ul className="text-gray-600 mt-0.5 text-xs max-h-20 overflow-y-auto">
                {context.activeFiles.slice(0, 10).map((f, i) => (
                  <li key={i} className="truncate">• {f}</li>
                ))}
                {context.activeFiles.length > 10 && (
                  <li className="text-gray-400">... and {context.activeFiles.length - 10} more</li>
                )}
              </ul>
            </div>
          )}

          {context.decisions && context.decisions.length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Key Decisions:</span>
              <ul className="text-gray-600 mt-0.5 text-xs">
                {context.decisions.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>
          )}

          {context.notes && Object.keys(context.notes).length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Notes:</span>
              <div className="text-gray-600 mt-0.5 text-xs">
                {Object.entries(context.notes).map(([k, v]) => (
                  <div key={k} className="mb-1">
                    <span className="font-medium">{k}:</span> {v}
                  </div>
                ))}
              </div>
            </div>
          )}

          {context.pendingQuestions && context.pendingQuestions.length > 0 && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">Pending Questions:</span>
              <ul className="text-gray-600 mt-0.5 text-xs">
                {context.pendingQuestions.map((q, i) => (
                  <li key={i} className="text-amber-600">? {q}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
