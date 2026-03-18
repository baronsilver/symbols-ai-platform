import { promises as fs } from "fs";
import path from "path";

const OUTPUT_BASE = path.join(process.cwd(), "output");

export interface FileOperation {
  type: "create" | "update" | "delete";
  path: string;
  content?: string;
}

export interface DirectoryInfo {
  name: string;
  type: "file" | "directory";
  path: string;
  size?: number;
  children?: DirectoryInfo[];
}

/**
 * Create a file with the given content
 */
export async function createFile(
  projectName: string,
  filePath: string,
  content: string
): Promise<void> {
  const fullPath = path.join(OUTPUT_BASE, projectName, filePath);
  const dir = path.dirname(fullPath);

  // Ensure directory exists
  await fs.mkdir(dir, { recursive: true });

  // Write file
  await fs.writeFile(fullPath, content, "utf-8");
}

/**
 * Create a directory
 */
export async function createDirectory(
  projectName: string,
  dirPath: string
): Promise<void> {
  const fullPath = path.join(OUTPUT_BASE, projectName, dirPath);
  await fs.mkdir(fullPath, { recursive: true });
}

/**
 * Read a file
 */
export async function readFile(
  projectName: string,
  filePath: string
): Promise<string> {
  const fullPath = path.join(OUTPUT_BASE, projectName, filePath);
  return fs.readFile(fullPath, "utf-8");
}

/**
 * Update a file (replace content)
 */
export async function updateFile(
  projectName: string,
  filePath: string,
  content: string
): Promise<void> {
  const fullPath = path.join(OUTPUT_BASE, projectName, filePath);
  const dir = path.dirname(fullPath);

  // Ensure directory exists
  await fs.mkdir(dir, { recursive: true });

  // Write file
  await fs.writeFile(fullPath, content, "utf-8");
}

/**
 * Delete a file
 */
export async function deleteFile(
  projectName: string,
  filePath: string
): Promise<void> {
  const fullPath = path.join(OUTPUT_BASE, projectName, filePath);
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }
}

/**
 * Delete a directory recursively
 */
export async function deleteDirectory(
  projectName: string,
  dirPath: string
): Promise<void> {
  const fullPath = path.join(OUTPUT_BASE, projectName, dirPath);
  try {
    await fs.rm(fullPath, { recursive: true, force: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
      throw err;
    }
  }
}

/**
 * List directory contents
 */
export async function listDirectory(
  projectName: string,
  dirPath: string = ""
): Promise<DirectoryInfo[]> {
  const fullPath = path.join(OUTPUT_BASE, projectName, dirPath);

  try {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    const results: DirectoryInfo[] = [];

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);
      const info: DirectoryInfo = {
        name: entry.name,
        type: entry.isDirectory() ? "directory" : "file",
        path: entryPath,
      };

      if (entry.isFile()) {
        const stat = await fs.stat(path.join(fullPath, entry.name));
        info.size = stat.size;
      }

      results.push(info);
    }

    return results;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

/**
 * Check if file/directory exists
 */
export async function exists(
  projectName: string,
  filePath: string
): Promise<boolean> {
  const fullPath = path.join(OUTPUT_BASE, projectName, filePath);
  try {
    await fs.access(fullPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file/directory info
 */
export async function getInfo(
  projectName: string,
  filePath: string
): Promise<DirectoryInfo | null> {
  const fullPath = path.join(OUTPUT_BASE, projectName, filePath);

  try {
    const stat = await fs.stat(fullPath);
    return {
      name: path.basename(filePath),
      type: stat.isDirectory() ? "directory" : "file",
      path: filePath,
      size: stat.isFile() ? stat.size : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Batch file operations
 */
export async function batchOperations(
  projectName: string,
  operations: FileOperation[]
): Promise<void> {
  for (const op of operations) {
    switch (op.type) {
      case "create":
        if (op.content !== undefined) {
          await createFile(projectName, op.path, op.content);
        } else {
          await createDirectory(projectName, op.path);
        }
        break;

      case "update":
        if (op.content !== undefined) {
          await updateFile(projectName, op.path, op.content);
        }
        break;

      case "delete":
        const isDir = op.path.endsWith("/");
        if (isDir) {
          await deleteDirectory(projectName, op.path.slice(0, -1));
        } else {
          await deleteFile(projectName, op.path);
        }
        break;
    }
  }
}
