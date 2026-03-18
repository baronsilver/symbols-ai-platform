"use client";

import { useChat } from "@/lib/use-chat";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ModelSelector } from "@/components/ModelSelector";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { ToolActivityPanel } from "@/components/ToolActivity";
import { GeneratedFilesPanel } from "@/components/GeneratedFilesPanel";
import { ProjectVisualizer } from "@/components/ProjectVisualizer";
import { ProjectSelector } from "@/components/ProjectSelector";
import { ContextPanel } from "@/components/ContextPanel";
import { TemplateGallery } from "@/components/TemplateGallery";
import { TemplateConfigModal } from "@/components/TemplateConfigModal";
import { ConversionTool } from "@/components/ConversionTool";
import { Template } from "@/templates/index";
import {
  Trash2,
  Zap,
  Settings,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";


export default function Home() {
  const {
    messages,
    isLoading,
    error,
    toolActivity,
    generatedFiles,
    activeProject,
    sendMessage,
    clearMessages,
    model,
    setModel,
    apiKey,
    apiProvider,
    setApiKey,
    autoMcp,
    setAutoMcp,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedProject, setSelectedProject] = useState<{
    name: string;
    path: string;
    created: string;
    fileCount: number;
    files: string[];
  } | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, toolActivity]);

  const hasMessages = messages.length > 0;

  // Determine which project to display in the visualizer
  const displayProject = selectedProject || generatedFiles;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center p-1.5">
              <Image
                src="/logo.svg"
                alt="Symbols"
                width={24}
                height={24}
                className="text-white"
              />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Symbols AI</h1>
              <p className="text-xs text-muted">DOMQL v3 Project Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-64">
              <ProjectSelector
                onSelectProject={(project) => {
                  setSelectedProject(project);
                  if (project) {
                    setShowVisualizer(true);
                  }
                }}
                currentProject={selectedProject?.name || null}
              />
            </div>

            <ModelSelector
              value={model}
              onChange={setModel}
              disabled={isLoading}
              provider={apiProvider}
            />

            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings
                  ? "bg-accent text-white"
                  : "bg-surface text-muted hover:text-foreground hover:bg-surface-2"
              }`}
              title="Settings"
            >
              {showSettings ? <X size={16} /> : <Settings size={16} />}
            </button>

            {hasMessages && (
              <button
                onClick={clearMessages}
                className="p-2 rounded-lg bg-surface text-muted hover:text-error hover:bg-error/10 transition-colors"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="border-t border-border bg-surface/50 px-4 py-3 space-y-3">
            <div className="max-w-5xl mx-auto flex items-center gap-6 flex-wrap">
              <ApiKeyInput value={apiKey} provider={apiProvider} onChange={setApiKey} />

              <ModelSelector value={model} onChange={setModel} provider={apiProvider} />

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setAutoMcp(!autoMcp)}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                    autoMcp ? "bg-accent" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      autoMcp ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-accent" />
                  <span className="text-xs text-foreground/80">Auto MCP</span>
                </div>
              </label>

              <span className="text-xs text-muted">
                {autoMcp
                  ? "MCP tools auto-loaded for context"
                  : "MCP tools disabled"}
              </span>
            </div>
            
            {/* Agent Context Panel */}
            <div className="max-w-5xl mx-auto">
              <ContextPanel />
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex flex-col items-center py-16 px-4">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center p-2.5 shadow-lg shadow-accent/20">
                  <Image
                    src="/logo.svg"
                    alt="Symbols"
                    width={32}
                    height={32}
                    style={{ filter: "brightness(0) saturate(100%) invert(100%)" }}
                  />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Symbols AI</h1>
              </div>
              <p className="text-base text-muted/90 max-w-2xl mx-auto leading-relaxed">
                Build production-ready <span className="text-foreground font-medium">Symbols/DOMQL v3</span> projects in seconds.
                <br className="hidden sm:block" />
                Start from templates, convert existing code, or describe your vision.
              </p>
            </div>

            {!apiKey && (
              <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-error/10 to-error/5 border border-error/20 max-w-lg mx-auto">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-error text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-error/90 mb-1">API Key Required</p>
                    <p className="text-xs text-error/70">Set your OpenRouter API key in Settings to start generating projects.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Conversion Tool Section */}
            <div className="w-full max-w-4xl mb-16">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">Convert Existing Code</h2>
                <p className="text-sm text-muted">Transform React, Vue, Angular, or Tailwind projects to Symbols</p>
              </div>
              <ConversionTool
                onConvert={(code, framework, projectName, customInstructions) => {
                  let prompt = "";
                  
                  // Add custom instructions with high priority if provided
                  if (customInstructions) {
                    prompt += `⚠️ CRITICAL USER CUSTOMIZATION REQUEST - MUST FOLLOW ⚠️
The user wants to customize the conversion with the following instructions:

"${customInstructions}"

Apply these customizations during the conversion process.

---

`;
                  }
                  
                  prompt += `Convert the following ${framework === 'auto' ? '' : framework + ' '}code to a complete Symbols/DOMQL v3 project.

**SOURCE CODE:**
\`\`\`
${code}
\`\`\`

**CONVERSION INSTRUCTIONS:**
1. Analyze the code structure and styling
2. Convert all components to Symbols v3 object syntax
3. Convert Tailwind/CSS classes to Symbols design tokens (A, B, C, etc.)
4. Create proper state management if needed
5. Generate a complete project with all required files

**CRITICAL RULES - MUST FOLLOW:**
1. **Page Pattern**: NEVER use \`extends: 'Page'\` in main.js. Always use:
   \`\`\`js
   export const main = {
     extends: 'Flex',
     flow: 'column',
     minHeight: '100vh',
     background: 'pageBg', // or appropriate color
     // ...
   }
   \`\`\`

2. **Reactive Visibility**: For any toggleable UI (menus, modals, dropdowns), use reactive display:
   \`\`\`js
   display: (el, s) => s.root.isOpen ? 'flex' : 'none'
   \`\`\`
   NOT static \`display: 'none'\`

3. **State-Driven UI**: All interactive elements (buttons, toggles, tabs) must update state and UI must react to state changes

4. **Spacing Tokens**: Use design system tokens (A, B, C, D, E, F, X, Y, Z) instead of pixel values

5. **No Imports**: No imports between component files - components reference each other by name only

6. **flexAlign**: Use \`flexAlign: 'center space-between'\` NOT \`align\` or \`justify\`

**IMPORTANT:** Follow all Symbols v3 rules - components are objects (not functions), use spacing tokens, no imports between component files.`;
                  
                  sendMessage(prompt, {
                    customProjectName: projectName,
                    goal: `Convert ${framework} code to Symbols project: ${projectName}`,
                    task: `Converting ${framework} code to Symbols/DOMQL v3 format`,
                  });
                }}
                disabled={!apiKey || isLoading}
              />
            </div>

            {/* Divider */}
            <div className="w-full max-w-4xl mb-16">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-xs text-muted uppercase tracking-wider">Or</span>
                </div>
              </div>
            </div>

            {/* Templates Section */}
            <div className="w-full mb-8">
              <TemplateGallery
                onSelectTemplate={(template) => setSelectedTemplate(template)}
                disabled={!apiKey || isLoading}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Tool activity */}
            <ToolActivityPanel tools={toolActivity} />

            {/* Generated files */}
            {generatedFiles && (
              <GeneratedFilesPanel
                projectName={generatedFiles.projectName}
                files={generatedFiles.files}
                onViewProject={() => setShowVisualizer(true)}
              />
            )}

            {/* Typing indicator */}
            {isLoading &&
              messages[messages.length - 1]?.content === "" && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-muted">
                    <div className="typing-dot w-2 h-2 rounded-full bg-accent" />
                    <div className="typing-dot w-2 h-2 rounded-full bg-accent" />
                    <div className="typing-dot w-2 h-2 rounded-full bg-accent" />
                  </div>
                </div>
              )}

            {/* Error */}
            {error && (
              <div className="mx-4 mb-3 p-3 rounded-lg bg-error/10 border border-error/20 text-sm text-error">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        disabled={!apiKey}
        activeProject={activeProject}
      />

      {/* Project Visualizer */}
      {showVisualizer && displayProject && (
        <ProjectVisualizer
          projectName={"projectName" in displayProject ? displayProject.projectName : displayProject.name}
          files={displayProject.files}
          fileContents={"fileContents" in displayProject ? displayProject.fileContents : undefined}
          onClose={() => {
            setShowVisualizer(false);
            setSelectedProject(null);
          }}
        />
      )}

      {/* Template Config Modal */}
      <TemplateConfigModal
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onSubmit={(prompt, projectName) => {
          sendMessage(prompt, { 
            customProjectName: projectName,
            goal: `Generate ${selectedTemplate?.name} project: ${projectName}`,
            task: `Creating ${selectedTemplate?.name} template with project name "${projectName}"`,
          });
          setSelectedTemplate(null);
        }}
      />
    </div>
  );
}
