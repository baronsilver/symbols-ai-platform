/**
 * Parse code blocks from AI response and extract file paths and content.
 * Pure client-safe function — no Node.js dependencies.
 *
 * Expected format:
 *   ```js // smbls/components/Navbar.js
 *   ...code...
 *   ```
 * Or:
 *   // FILE: smbls/components/Navbar.js
 *   ```js
 *   ...code...
 *   ```
 */
export function parseGeneratedFiles(text: string): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = [];

  // Pattern 1: ```lang // path/to/file.ext
  const pattern1 = /```\w*\s*\/\/\s*(.+?)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = pattern1.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 2: // FILE: path/to/file.ext followed by code block
  const pattern2 = /\/\/\s*FILE:\s*(.+?)\n\s*```\w*\n([\s\S]*?)```/g;
  while ((match = pattern2.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 3: **`path/to/file.ext`** followed by code block
  const pattern3 = /\*?\*?`([^`]+\.\w+)`\*?\*?\s*\n\s*```\w*\n([\s\S]*?)```/g;
  while ((match = pattern3.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content && filePath.includes("/")) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 4: **File: `path/to/file.ext`** followed by code block
  const pattern4 = /\*\*File:\s*`?([^`\n]+\.\w+)`?\*\*\s*\n\s*```\w*\n?([\s\S]*?)```/g;
  while ((match = pattern4.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content && filePath.includes("/")) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 5: **path/to/file.js** followed by code block (no "File:" prefix)
  const pattern5 = /\*\*([^\n*]+\.\w+)\*\*\s*\n\s*```\w*\n?([\s\S]*?)```/g;
  while ((match = pattern5.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content && filePath.includes("/") && !filePath.includes(" ")) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 6: path/to/file.js followed by code block (no special markers)
  const pattern6 = /(?:^|\n)([a-zA-Z0-9_\-\/]+\/[a-zA-Z0-9_\-]+\.\w+)\s*\n\s*```\w*\n?([\s\S]*?)```/g;
  while ((match = pattern6.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content && filePath.includes("/") && !filePath.includes(" ")) {
      files.push({ path: filePath, content });
    }
  }

  return files;
}
