/**
 * Client-side file operations utility
 * Communicates with /api/files endpoint
 */

export interface FileItem {
  name: string;
  type: "file" | "directory";
  path: string;
}

export interface DirectoryContents {
  type: "directory";
  items: FileItem[];
}

export interface FileContents {
  type: "file";
  content: string;
}

/**
 * Read a file
 */
export async function readFile(projectName: string, filePath: string): Promise<string> {
  const res = await fetch(`/api/files?project=${encodeURIComponent(projectName)}&path=${encodeURIComponent(filePath)}`);
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to read file");
  }

  const data: FileContents = await res.json();
  if (data.type !== "file") {
    throw new Error("Path is a directory, not a file");
  }

  return data.content;
}

/**
 * List directory contents
 */
export async function listDirectory(projectName: string, dirPath: string = ""): Promise<FileItem[]> {
  const res = await fetch(`/api/files?project=${encodeURIComponent(projectName)}&path=${encodeURIComponent(dirPath)}`);
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to list directory");
  }

  const data: DirectoryContents = await res.json();
  if (data.type !== "directory") {
    throw new Error("Path is a file, not a directory");
  }

  return data.items;
}

/**
 * Create a file
 */
export async function createFile(
  projectName: string,
  filePath: string,
  content: string
): Promise<void> {
  const res = await fetch("/api/files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName,
      path: filePath,
      content,
      isDirectory: false,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create file");
  }
}

/**
 * Create a directory
 */
export async function createDirectory(projectName: string, dirPath: string): Promise<void> {
  const res = await fetch("/api/files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName,
      path: dirPath,
      isDirectory: true,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create directory");
  }
}

/**
 * Update a file
 */
export async function updateFile(
  projectName: string,
  filePath: string,
  content: string
): Promise<void> {
  const res = await fetch("/api/files", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName,
      path: filePath,
      content,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update file");
  }
}

/**
 * Delete a file or directory
 */
export async function deleteFile(projectName: string, filePath: string): Promise<void> {
  const res = await fetch("/api/files", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      projectName,
      path: filePath,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete file");
  }
}

/**
 * Check if file/directory exists
 */
export async function exists(projectName: string, filePath: string): Promise<boolean> {
  try {
    await readFile(projectName, filePath);
    return true;
  } catch {
    try {
      await listDirectory(projectName, filePath);
      return true;
    } catch {
      return false;
    }
  }
}
