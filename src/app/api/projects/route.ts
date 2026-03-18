import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ProjectInfo {
  name: string;
  path: string;
  created: string;
  fileCount: number;
  files: string[];
}

async function getProjectFiles(projectPath: string): Promise<string[]> {
  const files: string[] = [];
  
  async function scan(dir: string, basePath: string = dir): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(basePath, fullPath);
        
        if (entry.isDirectory()) {
          await scan(fullPath, basePath);
        } else {
          files.push(relativePath.replace(/\\/g, "/"));
        }
      }
    } catch {
      // Skip directories that can't be read
    }
  }
  
  await scan(projectPath);
  return files;
}

export async function GET(req: NextRequest) {
  try {
    const outputDir = path.join(process.cwd(), "output");
    
    // Check if output directory exists
    try {
      await fs.access(outputDir);
    } catch {
      return new Response(
        JSON.stringify({ projects: [] }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const entries = await fs.readdir(outputDir, { withFileTypes: true });
    const projects: ProjectInfo[] = [];
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const projectPath = path.join(outputDir, entry.name);
        const stats = await fs.stat(projectPath);
        const files = await getProjectFiles(projectPath);
        
        projects.push({
          name: entry.name,
          path: entry.name,
          created: stats.birthtime.toISOString(),
          fileCount: files.length,
          files,
        });
      }
    }
    
    // Sort by creation date, newest first
    projects.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    
    return new Response(
      JSON.stringify({ projects }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Failed to list projects" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
