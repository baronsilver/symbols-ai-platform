import fs from "fs/promises";
import path from "path";

const SYMBOLS_DIR = path.resolve(process.cwd(), "..", "symbols");

interface FileContent {
  path: string;
  content: string;
}

async function readDirRecursive(dir: string, baseDir: string = dir): Promise<FileContent[]> {
  const files: FileContent[] = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);
      
      if (entry.isDirectory()) {
        const subFiles = await readDirRecursive(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.isFile() && !entry.name.startsWith(".")) {
        // Only read text files (js, json, html, css, md, etc.)
        const ext = path.extname(entry.name).toLowerCase();
        const textExts = [".js", ".json", ".html", ".css", ".md", ".txt", ".jsx", ".ts", ".tsx"];
        
        if (textExts.includes(ext)) {
          try {
            const content = await fs.readFile(fullPath, "utf-8");
            files.push({ path: relativePath, content });
          } catch {
            // Skip files that can't be read
          }
        }
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

export async function getSymbolsContext(): Promise<string> {
  try {
    const files = await readDirRecursive(SYMBOLS_DIR);
    
    if (files.length === 0) {
      return "No reference Symbols project found in symbols/ directory.";
    }
    
    let context = "# Reference Symbols Project Structure\n\n";
    context += "The following is the current Symbols project in `symbols-ai-platform/symbols/` that you should use as a reference for structure and patterns:\n\n";
    
    // Group files by directory
    const filesByDir = new Map<string, FileContent[]>();
    
    for (const file of files) {
      const dir = path.dirname(file.path);
      if (!filesByDir.has(dir)) {
        filesByDir.set(dir, []);
      }
      filesByDir.get(dir)!.push(file);
    }
    
    // Output directory structure first
    context += "## Directory Structure\n```\n";
    const dirs = Array.from(filesByDir.keys()).sort();
    for (const dir of dirs) {
      const fileList = filesByDir.get(dir)!;
      const indent = dir === "." ? "" : "  ".repeat(dir.split(path.sep).length);
      const dirName = dir === "." ? "symbols/" : `${path.basename(dir)}/`;
      context += `${indent}${dirName}\n`;
      for (const file of fileList) {
        context += `${indent}  ${path.basename(file.path)}\n`;
      }
    }
    context += "```\n\n";
    
    // Output file contents
    context += "## File Contents\n\n";
    
    for (const file of files.sort((a, b) => a.path.localeCompare(b.path))) {
      context += `### \`${file.path}\`\n\`\`\`${getLanguage(file.path)}\n${file.content}\n\`\`\`\n\n`;
    }
    
    return context;
  } catch (err) {
    return `Error reading symbols directory: ${err instanceof Error ? err.message : err}`;
  }
}

function getLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const langMap: Record<string, string> = {
    ".js": "js",
    ".jsx": "jsx",
    ".ts": "ts",
    ".tsx": "tsx",
    ".json": "json",
    ".html": "html",
    ".css": "css",
    ".md": "markdown",
  };
  return langMap[ext] || "";
}
