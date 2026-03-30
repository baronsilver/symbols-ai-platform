import { readFileSync, existsSync } from "fs";
import { join } from "path";

// Embedded MCP tools - these replace the external Python MCP server
export interface McpToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

// Load agent instructions from the embedded file
function loadAgentInstructions(): string {
  const instructionsPath = join(process.cwd(), "public", "agent-instructions.md");
  try {
    if (existsSync(instructionsPath)) {
      return readFileSync(instructionsPath, "utf-8");
    }
  } catch (err) {
    console.warn("Could not load agent instructions:", err);
  }
  
  // Fallback instructions — authoritative DOMQL v3 rules
  return `# Symbols / DOMQL v3 — AI Agent Instructions

You are working inside a Symbols/DOMQL v3 project. These rules are absolute and override any general coding instincts.

## DOMQL v3 Syntax Reference

### Element Anatomy
Components are plain JS objects. Every key has a specific role:

export const MyCard = {
  tag: 'section',             // HTML tag (default: div)
  padding: 'B C',             // CSS props (top-level, promoted)
  flow: 'column',            // 'x' = row, 'y' = column
  theme: 'dialog',            // semantic surface theme
  round: 'C',                // borderRadius shorthand

  // HTML attributes (auto-detected by attrs-in-props)
  role: 'region',
  ariaLabel: 'My card',      // camelCase → aria-label

  // State
  state: { open: false },

  // Events (v3 top-level)
  onClick: (event, el, state) => { state.update({ open: !state.open }) },
  onRender: (el, s) => { console.log('rendered') },

  // Children (PascalCase keys create child elements)
  Header: { text: ({ props }) => props.title },
  Body: { html: ({ props }) => props.content }
}

### Core Rules

## 1. Components are OBJECTS — never functions
Components are plain objects with PascalCase keys. Never use function components.

export const Header = { flow: 'x', padding: 'A' }  // CORRECT
export const Header = () => ({ padding: 'A' })           // WRONG

## 2. NO imports between project files
Reference components by PascalCase key name in the tree. No import statements between components/, pages/, functions/, etc.

export const Navbar = {
  // Reference components by PascalCase key — no imports
  Logo: { text: 'Brand' },
  Link: { text: 'About' },
}

## 3. Pages use flow: 'column', minHeight: '100dvh' — NOT 'extends: Page'
export const main = { flow: 'column', minHeight: '100dvh', ... }  // CORRECT
export const main = { extends: 'Page', ... }                   // WRONG

pages/index.js IS the exception — imports are allowed there:
import { main } from './main.js'
import { dashboard } from './dashboard.js'
export default { '/': main, '/dashboard': dashboard }

## 4. For images, use extends: 'Img'
CORRECT: { extends: 'Img', src: '...', width: '100%' }
WRONG:  { tag: 'img', src: '...' }  // loses Img component benefits

## 5. Use align for Flex alignment
{ flow: 'x', align: 'center center' }  // CORRECT: alignItems justifyContent
{ flow: 'x', flexAlign: 'center center' } // WRONG — no such property

## 6. State — use s.update(), never mutate directly
Lifecycle events: onInit, onRender, onUpdate → (el, s) => {}
DOM events: onClick, onInput, onKeydown → (event, el, s) => {}

onClick: (e, el, s) => s.update({ count: s.count + 1 })  // CORRECT
onClick: (e, el, s) => { s.count++ }                    // WRONG

## 7. Global state in DOM events — use el.getRootState()
For UI-only state changes, pass { preventFetch: true }:
onClick: (e, el) => el.getRootState().update({ modalOpen: true }, { preventFetch: true })

## 8. Children collections — use children + childExtends
children: (el, s) => s.items,
childExtends: 'ListItem'

Child components need state: true to receive individual item state:
export const ListItem = { state: true, ... }

## 9. Conditional rendering
if: (el, s) => s.open        // removes from DOM
hide: (el, s) => !s.open     // display:none !important
For animated show/hide, use opacity + pointerEvents + transition + transform

## 10. All folders are flat — no subfolders
components/Navbar.js       ✅
components/nav/Navbar.js   ❌

## 11. CSS props flat at root — no style: {} wrapper
CORRECT: Box: { padding: 'A B', color: 'primary' }
WRONG:  Box: { style: { padding: '16px', color: '#333' } }

## 12. Design tokens for all spacing and colors
padding: 'A'  (16px), gap: 'B' (26px), color: 'primary'
NEVER raw px values (padding: '4px 10px') or hex colors (color: '#202124')

## 13. Design system files use lowercase keys
export default { color, theme, typography }   // CORRECT
export default { COLOR, THEME, TYPOGRAPHY }   // WRONG — UPPERCASE banned

## 14. Spacing tokens
Tokens: X=3px, Z=10px, A=16px, B=26px, C=42px, D=67px
Use: padding: 'A B', gap: 'Z', round: 'B'

## 15. Hover/focus/active states as nested objects
Button: {
  ':hover': { opacity: 0.9 },
  ':active': { transform: 'scale(0.98)' },
  ':focus-visible': { outline: 'solid Y blue.3' },
}

## 16. Responsive breakpoints
'@tabletS': { columns: 'repeat(2, 1fr)' }
'@mobileL': { columns: '1fr' }
'@dark': { background: 'codGray' }

## 17. Transitions
transition: 'B defaultBezier', transitionProperty: 'opacity, transform'
Always animate transform and opacity — NEVER layout properties (width, height)

## 18. Never use document.createElement / el.node manipulation
Always use declarative DOMQL patterns. Rewrite any imperative DOM code.

## 19. Template state binding
state: { name: 'World' }
P: { text: 'Hello, {{ name }}!' }  // CORRECT
Do NOT use el.node.textContent for reactive text.

## 20. Always generate complete file contents
Include all required project structure files. Never partial snippets.`;


}

// Get all available MCP tools
export function getAvailableMcpTools(): McpToolDef[] {
  return [
    {
      name: "get_project_rules",
      description:
        "Retrieve Symbols/DOMQL v3 framework rules and best practices. " +
        "STEP 1: Call this tool before writing any component code. " +
        "STEP 2: Review the returned rules — they override general coding instincts. " +
        "STEP 3: Apply the rules to all code generation tasks. " +
        "STEP 4: Verify compliance before completing a task. " +
        "Key rules: Components are plain OBJECTS (not functions), NO imports between project files, " +
        "use flow for layout, state uses s.update() not direct mutation, all folders are flat, " +
        "use extends: 'Img' for images, never raw hex colors.",
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    },
    {
      name: "search_symbols_docs",
      description:
        "Search the Symbols documentation knowledge base for framework-specific patterns and examples. " +
        "STEP 1: Formulate a query using natural language (e.g., 'how to handle state updates' or 'image component'). " +
        "STEP 2: Call this tool with your query and optional max_results (1-5, default 3). " +
        "STEP 3: Review matched sections with surrounding context. " +
        "STEP 4: Apply the documented patterns to your implementation. " +
        "STEP 5: If no results found, fall back to get_project_rules for core framework rules.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Natural language search query describing the pattern or concept you need. " +
              "Examples: 'state management', 'Flex component', 'event handlers', 'nested components'",
          },
          max_results: {
            type: "number",
            description: "Maximum number of results to return (1-5, default: 3)",
            default: 3,
          },
        },
        required: ["query"],
      },
    },
  ];
}

// Call an MCP tool
export async function callEmbeddedMcpTool(
  toolName: string,
  toolInput: Record<string, unknown>
): Promise<string> {
  if (toolName === "get_project_rules") {
    return loadAgentInstructions();
  }

  if (toolName === "search_symbols_docs") {
    const query = String(toolInput.query || "").toLowerCase();
    const instructions = loadAgentInstructions();

    // Simple search - find sections matching the query
    const lines = instructions.split("\n");
    const results: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(query)) {
        // Include context around the match
        const start = Math.max(0, i - 1);
        const end = Math.min(lines.length, i + 3);
        const context = lines.slice(start, end).join("\n");
        if (!results.includes(context)) {
          results.push(context);
        }
      }
    }

    if (results.length > 0) {
      return (
        `Search results for "${query}":\n` +
        `---\n\n` +
        results.join("\n\n---\n\n") +
        `\n\n[STEP-BY-STEP APPLICATION]\n` +
        `1. Review the matched rules above.\n` +
        `2. Identify the CORRECT vs WRONG patterns shown.\n` +
        `3. Apply the correct pattern to your current task.\n` +
        `4. Verify your code matches the CORRECT examples.\n` +
        `5. Double-check: no imports between project files, use flow, use s.update() for state.`
      );
    }

    return (
      `No documentation results found for "${query}".\n\n` +
      `Fallback: Use get_project_rules() to retrieve the authoritative DOMQL v3 patterns.`
    );
  }

  throw new Error(`Unknown MCP tool: ${toolName}`);
}
