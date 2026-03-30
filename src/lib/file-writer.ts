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

  // Sanitize all parsed files — remove AI-injected create() boilerplate
  return files.map(f => ({
    ...f,
    content: sanitizeGeneratedContent(f.path, f.content)
  }));
}

/**
 * Sanitize file content by removing boilerplate that the AI sometimes injects
 * into every generated file. Only index.js should have create() and smbls imports.
 *
 * Problems this fixes:
 * - `import { create } from 'smbls'` in non-entry files → breaks module graph
 * - `create(app)` in non-entry files → causes undefined component errors
 * - `import * as app from './smbls'` in non-entry files → causes circular imports
 * - Empty or leftover import lines
 */
function sanitizeGeneratedContent(path: string, content: string): string {
  // Only sanitize files inside smbls/ — index.js (root) must keep create()
  if (!path.startsWith("smbls/")) return content;

  // Don't touch actual component files that the AI wrote correctly
  const isComponentFile = /smbls\/components\/[A-Z][\w]*\.js$/.test(path);
  const isPageFile = /smbls\/pages\/[a-z][\w]*\.js$/.test(path);
  const isStateFile = path === "smbls/state.js";
  const isConfigFile = path === "smbls/config.js";
  const isDesignTokenFile = /smbls\/designSystem\/[A-Z][\w]*\.js$/.test(path);
  const isDependencyFile = path === "smbls/dependencies.js";
  const isAppFile = path === "smbls/app.js";

  // For scaffold files (index.js files), always overwrite with correct content later.
  // For everything else, sanitize.
  const isScaffoldFile =
    path === "smbls/index.js" ||
    path === "smbls/pages/index.js" ||
    path === "smbls/components/index.js" ||
    path === "smbls/designSystem/index.js";

  if (isScaffoldFile) {
    // Strip smbls boilerplate — scaffold files will be regenerated
    let result = content
      .replace(/import\s*\{[^}]*\}\s*from\s*['"]smbls['"];?\n?/g, "")
      .replace(/import\s+\*\s+as\s+app\s+from\s+['"][^'"]+['"];?\n?/g, "")
      .replace(/import\s+app\s+from\s+['"][^'"]+['"];?\n?/g, "")
      .replace(/create\s*\([^)]*\);?\n?$/gm, "")
      .replace(/\ncreate\s*\([^)]*\);?\n?/g, "\n")
      .replace(/^import\s+['"][^'"]+['"];?\n?/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return result;
  }

  // For real content files (components, pages, state, config), remove smbls boilerplate
  if (isComponentFile || isPageFile || isStateFile || isConfigFile || isDesignTokenFile || isDependencyFile || isAppFile) {
    let result = content
      // Remove top-level import { create } from 'smbls'
      .replace(/^import\s*\{[^}]*\}\s*from\s*['"]smbls['"]\s*;?\n?/m, "")
      // Remove create() call at end of file
      .replace(/\n?create\s*\([^)]*\);?\s*$/, "")
      // Remove create() call as standalone line
      .replace(/\ncreate\s*\([^)]*\);?/, "")
      // Remove import * as app from smbls
      .replace(/^import\s*\*\s+as\s+app\s+from\s+['"][^'"]+['"]\s*;?\n?/m, "")
      // Remove import app from ./smbls/app.js
      .replace(/^import\s+app\s+from\s+['"][^'"]+['"]\s*;?\n?/m, "")
      // Clean up multiple blank lines
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return result;
  }

  return content;
}
 * This allows them to be included in client downloads even when filesystem is read-only.
 */
export function getEssentialProjectFiles(): GeneratedFile[] {
  return [
    {
      path: "index.html",
      content: `<html background="#000">
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
`
    },
    {
      path: "index.js",
      content: `'use strict'\n\nimport { create } from 'smbls'\nimport { app } from './smbls'\n\ncreate(app)\n`
    },
    {
      path: "package.json",
      content: JSON.stringify({
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
      }, null, 2)
    },
    {
      path: ".parcelrc",
      content: JSON.stringify({
        extends: "@parcel/config-default",
        transformers: {
          "*.woff2": ["@parcel/transformer-raw"],
          "*.otf": ["@parcel/transformer-raw"],
          "*.svg": ["@parcel/transformer-inline-string"]
        }
      }, null, 2)
    },
    // smbls/index.js — the smbls namespace barrel, exports { app } for index.js
    {
      path: "smbls/index.js",
      content: `export { default as app } from './app.js'
export * as components from './components/index.js'
export { default as pages } from './pages/index.js'
export { default as designSystem } from './designSystem/index.js'
`
    },
    // smbls/app.js — root component, required by smbls/index.js
    {
      path: "smbls/app.js",
      content: `export default {
  tag: 'main',
  id: 'app',
  padding: '0',
  margin: '0',
  minHeight: '100vh'
}
`
    },
    // smbls/components/index.js — placeholder, re-exported components go here
    {
      path: "smbls/components/index.js",
      content: `export default {}\n`
    },
    // smbls/pages/index.js — route registry
    {
      path: "smbls/pages/index.js",
      content: `export default {}\n`
    },
    // smbls/designSystem/index.js — design tokens placeholder
    {
      path: "smbls/designSystem/index.js",
      content: `export default {}\n`
    }
  ];
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

  // index.js - entry point
  // Import app from the smbls namespace. smbls/index.js always exports { app }.
  // This way Parcel resolves ./smbls → ./smbls/index.js even if smbls/app.js doesn't exist yet.
  await fs.writeFile(
    path.join(projectDir, "index.js"),
    `'use strict'\n\nimport { create } from 'smbls'\nimport { app } from './smbls'\n\ncreate(app)\n`,
    "utf-8"
  );

  // Create a minimal smbls/index.js so Parcel can resolve the local './smbls' import
  // This gets overwritten by createPlaceholderIndexFiles when actual files are generated
  const smblsDir = path.join(projectDir, "smbls");
  await fs.mkdir(smblsDir, { recursive: true });
  await fs.writeFile(
    path.join(smblsDir, "index.js"),
    `// Minimal smbls entry - placeholder until actual project files are generated\nexport default {}\n`,
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

  // Create placeholder index.js for each standard directory.
  // We ALWAYS regenerate these to ensure correct content — the AI may have
  // injected broken smbls boilerplate (create(), smbls imports) into them.
  for (const dir of standardDirs) {
    const indexPath = path.join(projectDir, "smbls", dir, "index.js");
    const dirPath = path.dirname(indexPath);
    await fs.mkdir(dirPath, { recursive: true });

    // For components directory, create re-exports of all component files
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
      // For pages, designSystem, etc., always use correct scaffold content
      // The AI may have written broken smbls boilerplate here
      if (dir === "pages") {
        await fs.writeFile(indexPath,
          `import { main } from './main.js'\n\nexport default {\n  '/': main\n}\n`, "utf-8");
      } else if (dir === "designSystem") {
        // designSystem/index.js re-exports tokens
        const tokenFiles = generatedFiles.filter(f =>
          f.path.match(/smbls[/\\]designSystem[/\\][A-Z][\w]*\.js$/) &&
          f.path !== "smbls/designSystem/index.js"
        );
        const reExports = tokenFiles.map(f => {
          const fileName = path.basename(f.path);
          const tokenName = fileName.replace('.js', '');
          return `export { ${tokenName} } from './${fileName}'`;
        }).join("\n");
        await fs.writeFile(indexPath,
          reExports ? `${reExports}\nexport { default as designSystem } from './designSystem.js'\n` : "export default {}\n", "utf-8");
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
    // Always export app from smbls/index.js — index.js imports { app } from './smbls'
    exports.push(`export { default as app } from './app.js'`);
    // Always include these standard exports
    // Note: 'export * as components' is OK here because components/index.js uses named re-exports
    // (export { Foo } from './Foo.js'), so the namespace gets flattened properly.
    exports.push(`export * as components from './components/index.js'`);
    exports.push(`export { default as pages } from './pages/index.js'`);
    exports.push(`export { default as designSystem } from './designSystem/index.js'`);
    if (hasConfig) exports.push(`export { default as config } from './config.js'`);
    if (hasState) exports.push(`export { default as state } from './state.js'`);
    if (hasDeps) exports.push(`export { default as dependencies } from './dependencies.js'`);
    if (hasShared) exports.push(`export { default as sharedLibraries } from './sharedLibraries.js'`);
    if (hasEnvs) exports.push(`export { default as envs } from './envs.js'`);
    const content = `${exports.join("\n")}\n`;
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

    // Skip essential scaffold files — writeGeneratedFiles must preserve correct scaffold content
    const essentialPaths = new Set(
      getEssentialProjectFiles().map(f => f.path)
    );

    // Write the generated files (skip essential scaffold — these have correct content already)
    for (const file of files) {
      if (essentialPaths.has(file.path)) {
        // Don't overwrite correct essential scaffold with AI-generated content
        continue;
      }
      const fullPath = path.join(projectDir, file.path);
      const dir = path.dirname(fullPath);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, file.content, "utf-8");
      written.push(file.path);
    }

    // Create smbls/app.js — always use correct content.
    // The AI may have generated it with broken smbls boilerplate, which sanitization
    // strips away, leaving an empty file. We must always write a valid app component.
    const appFile = files.find(f => f.path.match(/smbls[/\\]app\.js$/));
    const appContent = appFile?.content?.trim();
    const appJsPath = path.join(projectDir, "smbls", "app.js");

    if (!appContent) {
      // No AI-generated app.js, or it was emptied by sanitization — write the fallback
      await fs.writeFile(
        appJsPath,
        `export default {
  tag: 'main',
  id: 'app',
  padding: '0',
  margin: '0',
  minHeight: '100vh'
}
`,
        "utf-8"
      );
    } else {
      // AI generated a real app.js — use it (it's already been sanitized)
      await fs.writeFile(appJsPath, appFile!.content, "utf-8");
    }

    // Create placeholder index.js files for any missing directories
    await createPlaceholderIndexFiles(projectDir, files);

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
