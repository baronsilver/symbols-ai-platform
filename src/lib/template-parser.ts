/**
 * Parses a template prompt string into structured, editable sections.
 * Template prompts have consistent section headers that we can split on.
 */

export interface ParsedTemplate {
  intro: string;
  sections: TemplateSection[];
  criticalBlocks: CriticalBlock[];
  filesToGenerate: string;
}

export interface TemplateSection {
  title: string;        // e.g. "NAVBAR", "STATE"
  content: string;      // the raw content between headers
  defaultOpen: boolean; // whether to start expanded
}

export interface CriticalBlock {
  title: string;    // e.g. "config.js MUST have", "main.js MUST use actual components"
  content: string;
  type: "config" | "main" | "interactivity" | "filelist";
}

const SECTION_HEADERS = [
  "**STATE:",
  "**DESIGN SYSTEM",
  "**CRITICAL INTERACTIVITY:",
  "**CRITICAL - config.js",
  "**CRITICAL - main.js",
  "**FILES TO GENERATE:",
];

const SECTION_DEFAULTS: Record<string, boolean> = {
  "**STATE": true,
  "**DESIGN SYSTEM": false,
  "**CRITICAL INTERACTIVITY:": false,
  "**CRITICAL - config.js": false,
  "**CRITICAL - main.js": false,
  "**FILES TO GENERATE:": false,
};

export function parseTemplatePrompt(prompt: string): ParsedTemplate {
  // Find the first section header to separate intro from sections
  let firstHeaderIndex = prompt.length;
  let firstHeader: string | null = null;
  for (const header of SECTION_HEADERS) {
    const idx = prompt.indexOf(header);
    if (idx !== -1 && idx < firstHeaderIndex) {
      firstHeaderIndex = idx;
      firstHeader = header;
    }
  }

  const intro = firstHeader ? prompt.slice(0, firstHeaderIndex).trim() : prompt;

  // Extract the remainder after the first header
  const remainder = firstHeader ? prompt.slice(firstHeaderIndex) : "";

  // Split remainder into sections
  const parts: Array<{ header: string; content: string }> = [];
  let currentPos = 0;
  const headersFound: Array<{ header: string; pos: number }> = [];

  for (const header of SECTION_HEADERS) {
    const idx = remainder.indexOf(header, currentPos);
    if (idx !== -1) {
      headersFound.push({ header, pos: idx });
    }
  }

  headersFound.sort((a, b) => a.pos - b.pos);

  for (let i = 0; i < headersFound.length; i++) {
    const { header, pos } = headersFound[i];
    const nextPos = i + 1 < headersFound.length ? headersFound[i + 1].pos : remainder.length;
    const content = remainder.slice(pos + header.length, nextPos).trim();
    parts.push({ header, content });
    currentPos = nextPos;
  }

  const sections: TemplateSection[] = [];
  const criticalBlocks: CriticalBlock[] = [];

  for (const { header, content } of parts) {
    if (header === "**FILES TO GENERATE:") {
      sections.push({
        title: "Files to Generate",
        content,
        defaultOpen: false,
      });
      continue;
    }

    if (header.startsWith("**CRITICAL")) {
      let type: CriticalBlock["type"] = "interactivity";
      if (header.includes("config.js")) type = "config";
      else if (header.includes("main.js")) type = "main";
      else if (header.includes("FILES")) type = "filelist";
      else if (header.includes("INTERACTIVITY")) type = "interactivity";

      criticalBlocks.push({
        title: header.replace(/\*\*/g, "").trim(),
        content,
        type,
      });

      sections.push({
        title: header.replace(/\*\*/g, "").trim(),
        content,
        defaultOpen: false,
      });
    } else {
      sections.push({
        title: header.replace(/\*\*/g, "").trim(),
        content,
        defaultOpen: SECTION_DEFAULTS[header] ?? false,
      });
    }
  }

  return { intro, sections, criticalBlocks, filesToGenerate: "" };
}

/**
 * Reconstructs a prompt string from edited sections.
 */
export function reconstructPrompt(parsed: ParsedTemplate, editedSections: Record<string, string>, customInstructions: string): string {
  const lines: string[] = [];

  // Intro + custom instructions
  if (parsed.intro) {
    lines.push(parsed.intro);
  }

  if (customInstructions.trim()) {
    lines.push("");
    lines.push(`**CUSTOM INSTRUCTIONS:**`);
    lines.push(customInstructions.trim());
  }

  // Sections in original order
  for (const section of parsed.sections) {
    const edited = editedSections[section.title];
    if (edited !== undefined) {
      lines.push("");
      lines.push(`**${section.title}:**`);
      lines.push(edited);
    }
  }

  return lines.join("\n");
}
