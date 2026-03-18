import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OUTPUT_BASE = path.join(process.cwd(), "output");

// Security check
function validatePath(projectName: string, filePath: string): string {
  const fullPath = path.join(OUTPUT_BASE, projectName, filePath);
  const normalizedPath = path.normalize(fullPath);
  const normalizedBase = path.normalize(OUTPUT_BASE);
  
  if (!normalizedPath.startsWith(normalizedBase)) {
    throw new Error("Invalid file path");
  }
  
  return fullPath;
}

// GET - Read file or list directory
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const filePath = searchParams.get("path") || "";
  const projectName = searchParams.get("project");

  if (!projectName) {
    return new Response(
      JSON.stringify({ error: "Missing project parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const fullPath = validatePath(projectName, filePath);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      // List directory
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      const items = entries.map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? "directory" : "file",
        path: path.join(filePath, entry.name),
      }));
      return new Response(
        JSON.stringify({ type: "directory", items }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      // Read file
      const content = await fs.readFile(fullPath, "utf-8");
      return new Response(
        JSON.stringify({ type: "file", content }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to read file";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST - Create file or directory
export async function POST(req: NextRequest) {
  try {
    const { projectName, path: filePath, content, isDirectory } = await req.json();

    if (!projectName || !filePath) {
      return new Response(
        JSON.stringify({ error: "Missing projectName or path" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fullPath = validatePath(projectName, filePath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    if (isDirectory) {
      await fs.mkdir(fullPath, { recursive: true });
    } else {
      await fs.writeFile(fullPath, content || "", "utf-8");
    }

    return new Response(
      JSON.stringify({ success: true, path: filePath }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create file";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PUT - Update file
export async function PUT(req: NextRequest) {
  try {
    const { projectName, path: filePath, content } = await req.json();

    if (!projectName || !filePath || content === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing projectName, path, or content" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fullPath = validatePath(projectName, filePath);
    const dir = path.dirname(fullPath);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(fullPath, content, "utf-8");

    return new Response(
      JSON.stringify({ success: true, path: filePath }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update file";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// DELETE - Delete file or directory
export async function DELETE(req: NextRequest) {
  try {
    const { projectName, path: filePath } = await req.json();

    if (!projectName || !filePath) {
      return new Response(
        JSON.stringify({ error: "Missing projectName or path" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const fullPath = validatePath(projectName, filePath);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }

    return new Response(
      JSON.stringify({ success: true, path: filePath }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete file";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
