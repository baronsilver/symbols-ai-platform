import fs from "fs/promises";
import path from "path";

// Output folder is at the project root (same level as package.json)
// process.cwd() returns the directory where Next.js is running from
const OUTPUT_BASE = path.join(process.cwd(), "output");

export interface GeneratedFile {
  path: string;
  content: string;
}

/**
 * Parse code blocks from AI response and extract file paths and content.
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
export function parseGeneratedFiles(text: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Pattern 1: ```lang // path/to/file.ext
  const pattern1 =
    /```\w*\s*\/\/\s*(.+?)\n([\s\S]*?)```/g;
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
  const pattern2 =
    /\/\/\s*FILE:\s*(.+?)\n\s*```\w*\n([\s\S]*?)```/g;
  while ((match = pattern2.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 3: **`path/to/file.ext`** followed by code block
  const pattern3 =
    /\*?\*?`([^`]+\.\w+)`\*?\*?\s*\n\s*```\w*\n([\s\S]*?)```/g;
  while ((match = pattern3.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content && filePath.includes("/")) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 4: **File: `path/to/file.ext`** followed by code block
  const pattern4 =
    /\*\*File:\s*`?([^`\n]+\.\w+)`?\*\*\s*\n\s*```\w*\n?([\s\S]*?)```/g;
  while ((match = pattern4.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content && filePath.includes("/")) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 5: **path/to/file.js** followed by code block (no "File:" prefix)
  const pattern5 =
    /\*\*([^\n*]+\.\w+)\*\*\s*\n\s*```\w*\n?([\s\S]*?)```/g;
  while ((match = pattern5.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content && filePath.includes("/") && !filePath.includes(" ")) {
      files.push({ path: filePath, content });
    }
  }

  if (files.length > 0) return files;

  // Pattern 6: path/to/file.js followed by code block (no special markers)
  const pattern6 =
    /(?:^|\n)([a-zA-Z0-9_\-\/]+\/[a-zA-Z0-9_\-]+\.\w+)\s*\n\s*```\w*\n?([\s\S]*?)```/g;
  while ((match = pattern6.exec(text)) !== null) {
    const filePath = match[1].trim();
    const content = match[2].trim();
    if (filePath && content && filePath.includes("/") && !filePath.includes(" ")) {
      files.push({ path: filePath, content });
    }
  }

  return files;
}

/**
 * Create the essential root files needed to run a Symbols project.
 * All files are created inline - no copying needed.
 */
async function createProjectRootFiles(projectDir: string): Promise<void> {
  // index.html - Parcel entry point
  await fs.writeFile(
    path.join(projectDir, "index.html"),
    `<html background="#000">
  <head>
    <title>Symbols App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta charset="UTF-8" />
  </head>
  <body>
    <script type="module" src="./index.js"></script>
  </body>
</html>
`,
    "utf-8"
  );

  // index.js - entry point, imports smbls/ directory as namespace (like symbols-ai-test)
  await fs.writeFile(
    path.join(projectDir, "index.js"),
    `'use strict'\n\nimport { create } from 'smbls'\nimport * as app from './smbls'\n\ncreate({}, app)\n`,
    "utf-8"
  );

  // package.json with parcel start script and Babel dependencies
  await fs.writeFile(
    path.join(projectDir, "package.json"),
    JSON.stringify({
      name: "symbols-project",
      version: "1.0.0",
      private: true,
      scripts: {
        start: "parcel index.html",
        build: "parcel build index.html"
      },
      dependencies: {
        smbls: "latest",
        "@supabase/supabase-js": "^2.45.0"
      },
      devDependencies: {
        "@babel/core": "^7.16.0",
        "@babel/preset-env": "^7.16.4",
        "@parcel/babel-preset-env": "^2.0.1",
        "@parcel/transformer-inline-string": "^2.9.1",
        "@parcel/transformer-raw": "^2.9.1",
        "buffer": "^6.0.3",
        "parcel": "^2.13.0"
      }
    }, null, 2),
    "utf-8"
  );

  // .parcelrc configuration
  await fs.writeFile(
    path.join(projectDir, ".parcelrc"),
    JSON.stringify({
      extends: "@parcel/config-default",
      transformers: {
        "*.woff2": ["@parcel/transformer-raw"],
        "*.otf": ["@parcel/transformer-raw"],
        "*.svg": ["@parcel/transformer-inline-string"]
      }
    }, null, 2),
    "utf-8"
  );
}

/**
 * Create placeholder index.js files for standard Symbols directories
 * to prevent import errors when the AI doesn't generate all files
 */
async function createPlaceholderIndexFiles(projectDir: string, generatedFiles: GeneratedFile[]): Promise<void> {
  const standardDirs = [
    "components",
    "pages", 
    "snippets",
    "functions",
    "methods",
    "designSystem",
    "files",
    "sharedLibraries",
    "dependencies",
    "state",
    "envs"
  ];

  // Check which directories are referenced in generated files
  const referencedDirs = new Set<string>();
  for (const file of generatedFiles) {
    const parts = file.path.split(/[/\\]/);
    if (parts[0] === "smbls" && parts.length > 1) {
      referencedDirs.add(parts[1]);
    }
  }

  // Create placeholder index.js for each standard directory that doesn't have one
  for (const dir of standardDirs) {
    const indexPath = path.join(projectDir, "smbls", dir, "index.js");
    const hasIndexFile = generatedFiles.some(f => 
      f.path === `smbls/${dir}/index.js` || f.path === `smbls\\${dir}\\index.js`
    );

    if (!hasIndexFile && (referencedDirs.has(dir) || standardDirs.includes(dir))) {
      const dirPath = path.dirname(indexPath);
      await fs.mkdir(dirPath, { recursive: true });
      
      // For components directory, create proper re-exports of all component files
      if (dir === "components" && referencedDirs.has("components")) {
        const componentFiles = generatedFiles.filter(f => 
          f.path.match(/smbls[/\\]components[/\\][^/\\]+\.js$/)
        );
        const reExports = componentFiles.map(f => {
          const fileName = path.basename(f.path);
          const componentName = fileName.replace('.js', '');
          return `export { ${componentName} } from './${fileName}'`;
        }).join("\n");
        await fs.writeFile(indexPath, reExports ? `${reExports}\n` : "export default {}\n", "utf-8");
      } else {
        await fs.writeFile(indexPath, "export default {}\n", "utf-8");
      }
    }
  }

  // Always generate root smbls/index.js with named exports (matching symbols-ai-test pattern)
  // Even if AI generates one, we overwrite it to ensure correct pattern
  {
    const smblsDir = path.join(projectDir, "smbls");
    await fs.mkdir(smblsDir, { recursive: true });

    // Detect which files were generated to build the exports
    const hasState = generatedFiles.some(f => f.path.match(/smbls[/\\]state\.js/)) || referencedDirs.has("state");
    const hasDeps = generatedFiles.some(f => f.path.match(/smbls[/\\]dependencies\.js/)) || referencedDirs.has("dependencies");
    const hasShared = generatedFiles.some(f => f.path.match(/smbls[/\\]sharedLibraries\.js/));
    const hasConfig = generatedFiles.some(f => f.path.match(/smbls[/\\]config\.js/));
    const hasEnvs = generatedFiles.some(f => f.path.match(/smbls[/\\]envs\.js/));

    const exports: string[] = [];
    if (hasState) exports.push(`export { default as state } from './state.js'`);
    if (hasDeps) exports.push(`export { default as dependencies } from './dependencies.js'`);
    // Always include these standard exports
    exports.push(`export * as components from './components/index.js'`);
    exports.push(`export * as snippets from './snippets/index.js'`);
    exports.push(`export { default as pages } from './pages/index.js'`);
    exports.push(`export * as functions from './functions/index.js'`);
    exports.push(`export * as methods from './methods/index.js'`);
    exports.push(`export { default as designSystem } from './designSystem/index.js'`);
    exports.push(`export { default as files } from './files/index.js'`);
    if (hasShared) exports.push(`export { default as sharedLibraries } from './sharedLibraries.js'`);
    if (hasConfig) exports.push(`export { default as config } from './config.js'`);
    if (hasEnvs) exports.push(`export { default as envs } from './envs.js'`);

    const content = exports.length > 0 ? `${exports.join("\n")}\n` : `export default {}\n`;

    await fs.writeFile(path.join(smblsDir, "index.js"), content, "utf-8");
  }
}

export async function writeGeneratedFiles(
  files: GeneratedFile[],
  projectName: string
): Promise<string[]> {
  const projectDir = path.join(OUTPUT_BASE, projectName);
  const written: string[] = [];

  // Try to create project directory - may fail on read-only file systems (Railway, etc.)
  try {
    await fs.mkdir(projectDir, { recursive: true });
  } catch (err) {
    console.warn("[file-writer] Could not create project directory (read-only filesystem?):", err);
    // Return file paths anyway - client will handle storage
    return files.map(f => f.path);
  }

  // Try to write files - may fail on read-only file systems
  try {
    // Create essential root files (index.html, index.js, package.json)
    await createProjectRootFiles(projectDir);

    // Then write the generated files
    for (const file of files) {
      const fullPath = path.join(projectDir, file.path);
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, file.content, "utf-8");
      written.push(file.path);
    }

    // Create placeholder index.js files for any missing directories
    await createPlaceholderIndexFiles(projectDir, files);

    // Create default app.js if not generated
    const hasAppJs = files.some(f => f.path.match(/smbls[/\\]app\.js$/));
    if (!hasAppJs) {
      await fs.writeFile(
        path.join(projectDir, "smbls", "app.js"),
        `export default {
  tag: 'main',
  id: 'app',
  padding: '0',
  margin: '0',
  minHeight: '100vh'
}\n`,
        "utf-8"
      );
    }

    // Ensure pages directory and index.js exist (but don't override AI-generated main.js)
    const hasPages = files.some(f => f.path.match(/smbls[/\\]pages[/\\]/));
    if (!hasPages) {
      // Only create the pages/index.js registry - AI must generate main.js with actual components
      await fs.mkdir(path.join(projectDir, "smbls", "pages"), { recursive: true });
      
      // Check if main.js already exists (from AI generation)
      const mainJsPath = path.join(projectDir, "smbls", "pages", "main.js");
      try {
        await fs.access(mainJsPath);
        // main.js exists, just ensure index.js points to it
      } catch {
        // main.js doesn't exist - this is an error, AI should have generated it
        console.warn("[file-writer] WARNING: AI did not generate pages/main.js - project may not render correctly");
      }
      
      // Always ensure pages/index.js exists and imports main
      await fs.writeFile(
        path.join(projectDir, "smbls", "pages", "index.js"),
        `import { main } from './main.js'

export default {
  '/': main
}\n`,
        "utf-8"
      );
    }

    return written;
  } catch (err) {
    console.warn("[file-writer] Could not write files to disk (read-only filesystem?):", err);
    // Return file paths anyway - client will handle storage
    return files.map(f => f.path);
  }
}

export async function listOutputProjects(): Promise<string[]> {
  try {
    const entries = await fs.readdir(OUTPUT_BASE, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch {
    return [];
  }
}

/**
 * Read all files from a generated project for context injection
 */
export async function readProjectFiles(projectName: string): Promise<{ path: string; content: string }[]> {
  const projectDir = path.join(OUTPUT_BASE, projectName, "smbls");
  const files: { path: string; content: string }[] = [];

  async function readDir(dir: string, relativePath: string = "") {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
        
        if (entry.isDirectory()) {
          await readDir(fullPath, relPath);
        } else if (entry.name.endsWith(".js")) {
          try {
            const content = await fs.readFile(fullPath, "utf-8");
            files.push({ path: `smbls/${relPath}`, content });
          } catch {
            // Skip unreadable files
          }
        }
      }
    } catch {
      // Directory doesn't exist
    }
  }

  await readDir(projectDir);
  return files;
}
