import { promises as fs } from 'fs';
import path from 'path';

const CONTEXT_FILE = path.join(process.cwd(), '.agent-context.json');

export interface AgentContext {
  /** Current task being worked on */
  currentTask?: string;
  /** What step we're on */
  currentStep?: string;
  /** Overall goal */
  goal?: string;
  /** Files being worked on */
  activeFiles?: string[];
  /** Decisions made */
  decisions?: string[];
  /** Last update timestamp */
  lastUpdated: string;
  /** Session ID */
  sessionId: string;
  /** Whether task is complete */
  isComplete: boolean;
  /** Pending questions for user */
  pendingQuestions?: string[];
  /** Key findings/notes */
  notes?: Record<string, string>;
}

/**
 * Save current agent context to disk
 */
export async function saveContext(context: Partial<AgentContext>): Promise<void> {
  const existing = await loadContext();
  const updated: AgentContext = {
    ...existing,
    ...context,
    lastUpdated: new Date().toISOString(),
    sessionId: existing.sessionId || generateSessionId(),
    isComplete: context.isComplete ?? existing.isComplete ?? false,
  };
  await fs.writeFile(CONTEXT_FILE, JSON.stringify(updated, null, 2), 'utf-8');
}

/**
 * Load agent context from disk
 */
export async function loadContext(): Promise<AgentContext> {
  try {
    const data = await fs.readFile(CONTEXT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      lastUpdated: new Date().toISOString(),
      sessionId: generateSessionId(),
      isComplete: false,
    };
  }
}

/**
 * Clear agent context
 */
export async function clearContext(): Promise<void> {
  try {
    await fs.unlink(CONTEXT_FILE);
  } catch {
    // File doesn't exist, that's fine
  }
}

/**
 * Generate a session ID
 */
function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a summary of current state for the agent to read on startup
 */
export async function getContextSummary(): Promise<string | null> {
  const ctx = await loadContext();
  
  if (!ctx.currentTask && !ctx.goal) {
    return null; // No active context
  }
  
  const lines = [
    '=== PREVIOUS SESSION CONTEXT ===',
    `Session: ${ctx.sessionId}`,
    `Last Updated: ${ctx.lastUpdated}`,
    '',
    `Goal: ${ctx.goal || 'Not set'}`,
    `Current Task: ${ctx.currentTask || 'None'}`,
    `Step: ${ctx.currentStep || 'Not specified'}`,
    '',
  ];
  
  if (ctx.activeFiles?.length) {
    lines.push('Active Files:');
    ctx.activeFiles.forEach(f => lines.push(`  - ${f}`));
    lines.push('');
  }
  
  if (ctx.decisions?.length) {
    lines.push('Key Decisions:');
    ctx.decisions.forEach(d => lines.push(`  - ${d}`));
    lines.push('');
  }
  
  if (ctx.notes && Object.keys(ctx.notes).length > 0) {
    lines.push('Notes:');
    Object.entries(ctx.notes).forEach(([k, v]) => lines.push(`  ${k}: ${v}`));
    lines.push('');
  }
  
  if (ctx.pendingQuestions?.length) {
    lines.push('Pending Questions:');
    ctx.pendingQuestions.forEach(q => lines.push(`  ? ${q}`));
    lines.push('');
  }
  
  if (ctx.isComplete) {
    lines.push('Status: ✅ Task marked as complete');
  } else {
    lines.push('Status: ⏳ Task in progress');
  }
  
  lines.push('=================================');
  
  return lines.join('\n');
}
