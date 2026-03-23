import { NextRequest, NextResponse } from "next/server";

// Store project files in memory (keyed by project name)
// Each project stores: { html: string, files: Record<string, string> }
const projectStore = new Map<string, { html: string; files: Record<string, string> }>();

// Resolve a relative import path against a source file
function resolveImportPath(from: string, to: string, fileKeys: Set<string>): string {
  if (!to.startsWith(".")) return to;
  const fromParts = from.split("/").slice(0, -1);
  for (const seg of to.split("/")) {
    if (seg === "..") fromParts.pop();
    else if (seg !== ".") fromParts.push(seg);
  }
  let resolved = fromParts.join("/");
  if (!fileKeys.has(resolved) && !resolved.endsWith(".js")) {
    if (fileKeys.has(resolved + ".js")) resolved += ".js";
    else if (fileKeys.has(resolved + "/index.js")) resolved += "/index.js";
  }
  return resolved;
}

// Rewrite import specifiers in JS source code
function rewriteImports(source: string, filePath: string, projectName: string, fileKeys: Set<string>): string {
  return source.replace(
    /(\bimport\s+[^;]*?from\s+|\bexport\s+[^;]*?from\s+|\bimport\s*\(|\bimport\s+)(['"])([^'"]+)\2/g,
    (_match, prefix, quote, spec) => {
      // Already a URL — skip
      if (spec.startsWith("http") || spec.startsWith("/")) return _match;
      // Relative import — resolve and rewrite to same-origin API URL
      if (spec.startsWith(".")) {
        const resolved = resolveImportPath(filePath, spec, fileKeys);
        return prefix + quote + `/api/preview-html?project=${encodeURIComponent(projectName)}&file=${encodeURIComponent(resolved)}` + quote;
      }
      // Bare specifier (npm package) — rewrite to esm.sh CDN
      return prefix + quote + `https://esm.sh/${spec}?bundle` + quote;
    }
  );
}

// POST - Store all project files and generate the preview HTML
export async function POST(request: NextRequest) {
  try {
    const { projectName, files } = await request.json();
    if (!projectName || !files) {
      return NextResponse.json({ error: "Missing projectName or files" }, { status: 400 });
    }

    // files is Record<string, string> (path -> content) for JS files
    const fileKeys = new Set(Object.keys(files));

    // Rewrite imports in all JS files
    const rewrittenFiles: Record<string, string> = {};
    for (const [filePath, source] of Object.entries(files) as [string, string][]) {
      rewrittenFiles[filePath] = rewriteImports(source, filePath, projectName, fileKeys);
    }

    // Find entry point
    const entryPath = files["index.js"]
      ? "index.js"
      : Object.keys(files).find((f: string) => f.endsWith("index.js")) || Object.keys(files)[0] || "index.js";

    // Build the HTML page
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Symbols Preview</title>
  <style>
    body { margin: 0; background: #000; color: #fff; font-family: system-ui, sans-serif; }
    .preview-error { padding: 20px; color: #f87171; font-family: monospace; font-size: 13px; white-space: pre-wrap; }
  </style>
</head>
<body>
  <script type="module">
    window.addEventListener('error', function(ev) {
      var d = document.createElement('div'); d.className = 'preview-error';
      d.textContent = 'Error: ' + ev.message; document.body.appendChild(d);
    });
    window.addEventListener('unhandledrejection', function(ev) {
      var d = document.createElement('div'); d.className = 'preview-error';
      d.textContent = 'Error: ' + (ev.reason && ev.reason.message || ev.reason);
      document.body.appendChild(d);
    });
    try {
      await import("/api/preview-html?project=${encodeURIComponent(projectName)}&file=${encodeURIComponent(entryPath)}");
    } catch(e) {
      console.error('[Preview]', e);
      var d = document.createElement('div'); d.className = 'preview-error';
      d.textContent = 'Preview Error:\\n' + e.message + '\\n\\n' + (e.stack || '');
      document.body.appendChild(d);
    }
  </script>
</body>
</html>`;

    projectStore.set(projectName, { html, files: rewrittenFiles });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET - Serve preview HTML page or individual JS files
export async function GET(request: NextRequest) {
  const projectName = request.nextUrl.searchParams.get("project");
  const filePath = request.nextUrl.searchParams.get("file");

  if (!projectName) {
    return new NextResponse("Missing project parameter", { status: 400 });
  }

  const project = projectStore.get(projectName);
  if (!project) {
    return new NextResponse("<html><body><p>No preview available. Click Start Preview first.</p></body></html>", {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Serve individual JS file
  if (filePath) {
    const content = project.files[filePath];
    if (!content) {
      return new NextResponse(`// File not found: ${filePath}\nexport default {};\n`, {
        headers: {
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/javascript",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Serve the HTML page
  return new NextResponse(project.html, {
    headers: { "Content-Type": "text/html" },
  });
}
