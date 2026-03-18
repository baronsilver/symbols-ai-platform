import { NextRequest } from "next/server";
import { spawn, ChildProcess } from "child_process";
import path from "path";
import fs from "fs/promises";

// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Store running dev servers
const runningServers = new Map<string, { process: ChildProcess; port: number }>();
let nextPort = 3100;

function getAvailablePort(): number {
  return nextPort++;
}

export async function POST(req: NextRequest) {
  const { projectName, action } = await req.json();

  if (!projectName) {
    return new Response(
      JSON.stringify({ error: "Project name is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const projectPath = path.resolve(process.cwd(), "..", "output", projectName);

  // Check if project exists
  try {
    await fs.access(projectPath);
  } catch {
    return new Response(
      JSON.stringify({ error: "Project not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  if (action === "start") {
    // Check if already running
    if (runningServers.has(projectName)) {
      const existing = runningServers.get(projectName)!;
      return new Response(
        JSON.stringify({ 
          status: "running", 
          port: existing.port,
          url: `http://localhost:${existing.port}`
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Start new dev server
    const port = getAvailablePort();
    
    try {
      // Clear parcel cache to avoid stale build artifacts
      try {
        await fs.rm(path.join(projectPath, ".parcel-cache"), { recursive: true, force: true });
      } catch { /* ignore */ }

      // Check if node_modules exists, if not run npm install
      const nodeModulesPath = path.join(projectPath, "node_modules");
      try {
        await fs.access(nodeModulesPath);
      } catch {
        // Run npm install to install dependencies
        await new Promise<void>((resolve, reject) => {
          const installProcess = spawn("npm", ["install"], {
            cwd: projectPath,
            shell: true,
            stdio: "pipe",
          });

          installProcess.on("close", (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`npm install failed with code ${code}`));
            }
          });

          installProcess.on("error", reject);
        });
      }

      // Spawn parcel directly with explicit port
      const serverProcess = spawn(
        "npx",
        ["parcel", "index.html", "--port", port.toString()],
        {
          cwd: projectPath,
          shell: true,
          stdio: ["ignore", "pipe", "pipe"],
        }
      );

      let serverReady = false;

      // Wait for server to be ready - parcel outputs "Server running at http://..."
      const readyPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Server startup timeout after 60s"));
        }, 60000);

        const checkReady = (data: Buffer) => {
          const output = data.toString();
          console.log(`[${projectName}] ${output}`);
          if (output.includes("Server running at") || output.includes(`localhost:${port}`)) {
            serverReady = true;
            clearTimeout(timeout);
            resolve();
          }
        };

        serverProcess.stdout?.on("data", checkReady);

        serverProcess.stderr?.on("data", (data) => {
          const output = data.toString();
          console.error(`[${projectName}] Error: ${output}`);
          // Parcel may also log to stderr
          if (output.includes("Server running at") || output.includes(`localhost:${port}`)) {
            serverReady = true;
            clearTimeout(timeout);
            resolve();
          }
        });

        serverProcess.on("error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });

        serverProcess.on("exit", (code) => {
          if (!serverReady) {
            clearTimeout(timeout);
            reject(new Error(`Server exited with code ${code}`));
          }
        });
      });

      await readyPromise;

      runningServers.set(projectName, { process: serverProcess, port });

      return new Response(
        JSON.stringify({ 
          status: "started", 
          port,
          url: `http://localhost:${port}`
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to start dev server", 
          details: err instanceof Error ? err.message : String(err)
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  } else if (action === "stop") {
    const server = runningServers.get(projectName);
    if (server) {
      server.process.kill();
      runningServers.delete(projectName);
      return new Response(
        JSON.stringify({ status: "stopped" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ status: "not_running" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } else if (action === "status") {
    const server = runningServers.get(projectName);
    if (server) {
      return new Response(
        JSON.stringify({ 
          status: "running", 
          port: server.port,
          url: `http://localhost:${server.port}`
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ status: "stopped" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ error: "Invalid action" }),
    { status: 400, headers: { "Content-Type": "application/json" } }
  );
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const projectName = searchParams.get("project");

  if (!projectName) {
    // Return all running servers
    const servers = Array.from(runningServers.entries()).map(([name, { port }]) => ({
      name,
      port,
      url: `http://localhost:${port}`
    }));
    return new Response(
      JSON.stringify({ servers }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // Return status for specific project
  const server = runningServers.get(projectName);
  if (server) {
    return new Response(
      JSON.stringify({ 
        status: "running", 
        port: server.port,
        url: `http://localhost:${server.port}`
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ status: "stopped" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
