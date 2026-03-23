import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { createServer } from "http";

const execAsync = promisify(exec);

// Store running dev servers: project name -> { port, server }
export const runningServers = new Map<string, { port: number; server: any }>();

// Find an available port starting from 3001
async function getAvailablePort(startPort = 3001): Promise<number> {
  for (let port = startPort; port < 4000; port++) {
    try {
      await execAsync(`netstat -tuln | grep :${port} || true`);
      // If grep returns nothing, port is available
      return port;
    } catch {
      return port;
    }
  }
  throw new Error("No available ports found");
}

// Create a simple HTTP server that serves files from a directory
function createFileServer(dir: string, port: number): any {
  const server = createServer(async (req, res) => {
    let url = req.url || "/";
    if (url === "/") url = "/index.html";

    const filePath = path.join(dir, url);
    try {
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        // Try index.html or index.js
        try {
          const indexHtml = path.join(filePath, "index.html");
          await fs.access(indexHtml);
          const content = await fs.readFile(indexHtml, "utf-8");
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content);
          return;
        } catch {
          try {
            const indexJs = path.join(filePath, "index.js");
            await fs.access(indexJs);
            const content = await fs.readFile(indexJs, "utf-8");
            res.writeHead(200, { "Content-Type": "application/javascript" });
            res.end(content);
            return;
          } catch {
            res.writeHead(404);
            res.end("Not found");
            return;
          }
        }
      }

      const content = await fs.readFile(filePath);
      const ext = path.extname(filePath);
      const mimeTypes: Record<string, string> = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
      };
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  server.listen(port, "127.0.0.1");
  return server;
}

// POST - Start a dev server for the project
export async function POST(request: NextRequest) {
  try {
    const { projectName, files } = await request.json();
    if (!projectName || !files) {
      return NextResponse.json({ error: "Missing projectName or files" }, { status: 400 });
    }

    // Stop existing server if running
    const existing = runningServers.get(projectName);
    if (existing) {
      existing.server.close();
      runningServers.delete(projectName);
    }

    // Create temp directory
    const tempDir = path.join(process.env.TMPDIR || "/tmp", `symbols-preview-${projectName}-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    // Write all files
    for (const [filePath, content] of Object.entries(files) as [string, string][]) {
      const fullPath = path.join(tempDir, filePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });

      // Rewrite index.html to use proxy URLs
      let fileContent = content;
      if (filePath === "index.html") {
        // Replace ./index.js with absolute proxy URL
        const proxyUrl = `/api/preview-proxy?project=${encodeURIComponent(projectName)}&path=/index.js`;
        fileContent = content.replace(/src=["']\.\/index\.js["']/g, `src="${proxyUrl}"`);
      }

      await fs.writeFile(fullPath, fileContent, "utf-8");
    }

    // Skip npm install — smbls from esm.sh CDN already bundles all dependencies
    // No native compilation needed

    // Start a simple HTTP server
    const port = await getAvailablePort();
    const server = createFileServer(tempDir, port);
    runningServers.set(projectName, { port, server });

    return NextResponse.json({ ok: true, port });
  } catch (err) {
    console.error("Failed to start preview server:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET - Check if a server is running and get its port
export async function GET(request: NextRequest) {
  const projectName = request.nextUrl.searchParams.get("project");
  if (!projectName) {
    return NextResponse.json({ error: "Missing project parameter" }, { status: 400 });
  }

  const serverInfo = runningServers.get(projectName);
  if (!serverInfo) {
    return NextResponse.json({ running: false });
  }

  return NextResponse.json({ running: true, port: serverInfo.port });
}

// DELETE - Stop a running server
export async function DELETE(request: NextRequest) {
  const projectName = request.nextUrl.searchParams.get("project");
  if (!projectName) {
    return NextResponse.json({ error: "Missing project parameter" }, { status: 400 });
  }

  const serverInfo = runningServers.get(projectName);
  if (serverInfo) {
    serverInfo.server.close();
    runningServers.delete(projectName);
  }

  return NextResponse.json({ ok: true });
}
