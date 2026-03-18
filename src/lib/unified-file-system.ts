/**
 * Unified file system - works with both local and web storage
 * Automatically uses local file system if available, falls back to web API
 */

import {
  readLocalFile,
  writeLocalFile,
  createLocalDirectory,
  listLocalDirectory,
  deleteLocalFile,
  deleteLocalDirectory,
  localFileExists,
} from "./local-file-system";
import {
  readFile as readWebFile,
  listDirectory as listWebDirectory,
  createFile as createWebFile,
  createDirectory as createWebDirectory,
  updateFile as updateWebFile,
  deleteFile as deleteWebFile,
} from "./file-client";

export type FileSystemType = "local" | "web";

export interface UnifiedFileSystem {
  type: FileSystemType;
  projectName: string;
  localHandle?: FileSystemDirectoryHandle;
}

/**
 * Read a file from either local or web storage
 */
export async function readFile(
  fs: UnifiedFileSystem,
  filePath: string
): Promise<string> {
  if (fs.type === "local" && fs.localHandle) {
    return readLocalFile(fs.localHandle, filePath);
  }
  return readWebFile(fs.projectName, filePath);
}

/**
 * Write a file to either local or web storage
 */
export async function writeFile(
  fs: UnifiedFileSystem,
  filePath: string,
  content: string
): Promise<void> {
  if (fs.type === "local" && fs.localHandle) {
    return writeLocalFile(fs.localHandle, filePath, content);
  }
  return updateWebFile(fs.projectName, filePath, content);
}

/**
 * Create a file in either local or web storage
 */
export async function createFile(
  fs: UnifiedFileSystem,
  filePath: string,
  content: string
): Promise<void> {
  if (fs.type === "local" && fs.localHandle) {
    return writeLocalFile(fs.localHandle, filePath, content);
  }
  return createWebFile(fs.projectName, filePath, content);
}

/**
 * Create a directory in either local or web storage
 */
export async function createDirectory(
  fs: UnifiedFileSystem,
  dirPath: string
): Promise<void> {
  if (fs.type === "local" && fs.localHandle) {
    return createLocalDirectory(fs.localHandle, dirPath);
  }
  return createWebDirectory(fs.projectName, dirPath);
}

/**
 * List directory contents from either local or web storage
 */
export async function listDirectory(
  fs: UnifiedFileSystem,
  dirPath: string = ""
): Promise<Array<{ name: string; type: "file" | "directory"; path: string }>> {
  if (fs.type === "local" && fs.localHandle) {
    const items = await listLocalDirectory(fs.localHandle, dirPath);
    return items.map((item) => ({
      name: item.name,
      type: item.kind,
      path: dirPath ? `${dirPath}/${item.name}` : item.name,
    }));
  }

  const items = await listWebDirectory(fs.projectName, dirPath);
  return items;
}

/**
 * Delete a file from either local or web storage
 */
export async function deleteFile(
  fs: UnifiedFileSystem,
  filePath: string
): Promise<void> {
  if (fs.type === "local" && fs.localHandle) {
    return deleteLocalFile(fs.localHandle, filePath);
  }
  return deleteWebFile(fs.projectName, filePath);
}

/**
 * Delete a directory from either local or web storage
 */
export async function deleteDirectory(
  fs: UnifiedFileSystem,
  dirPath: string
): Promise<void> {
  if (fs.type === "local" && fs.localHandle) {
    return deleteLocalDirectory(fs.localHandle, dirPath);
  }
  return deleteWebFile(fs.projectName, dirPath);
}

/**
 * Check if file exists in either local or web storage
 */
export async function fileExists(
  fs: UnifiedFileSystem,
  filePath: string
): Promise<boolean> {
  if (fs.type === "local" && fs.localHandle) {
    return localFileExists(fs.localHandle, filePath);
  }

  try {
    await readWebFile(fs.projectName, filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Batch operations on either local or web storage
 */
export async function batchOperations(
  fs: UnifiedFileSystem,
  operations: Array<{
    type: "create" | "update" | "delete";
    path: string;
    content?: string;
    isDirectory?: boolean;
  }>
): Promise<void> {
  for (const op of operations) {
    switch (op.type) {
      case "create":
        if (op.isDirectory) {
          await createDirectory(fs, op.path);
        } else {
          await createFile(fs, op.path, op.content || "");
        }
        break;

      case "update":
        await writeFile(fs, op.path, op.content || "");
        break;

      case "delete":
        if (op.isDirectory) {
          await deleteDirectory(fs, op.path);
        } else {
          await deleteFile(fs, op.path);
        }
        break;
    }
  }
}
