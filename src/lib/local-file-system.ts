/**
 * Local file system access using File System Access API
 * Works in modern browsers (Chrome, Edge, Opera)
 * Requires user to grant permission to a folder
 */

export interface LocalFileHandle {
  name: string;
  kind: "file" | "directory";
  handle: FileSystemHandle;
}

export interface LocalFileSystemState {
  rootHandle: FileSystemDirectoryHandle | null;
  projectPath: string;
  isSupported: boolean;
}

// Check if File System Access API is supported
export function isFileSystemAccessSupported(): boolean {
  return typeof window !== "undefined" && "showDirectoryPicker" in window;
}

// Request user to select a local folder
export async function selectLocalFolder(): Promise<FileSystemDirectoryHandle> {
  if (!isFileSystemAccessSupported()) {
    throw new Error("File System Access API is not supported in this browser");
  }

  try {
    const dirHandle = await (window as any).showDirectoryPicker({
      mode: "readwrite",
      startIn: "documents",
    });
    return dirHandle;
  } catch (err) {
    if ((err as DOMException).name === "AbortError") {
      throw new Error("User cancelled folder selection");
    }
    throw err;
  }
}

// Get file handle from directory
export async function getFileHandle(
  dirHandle: FileSystemDirectoryHandle,
  filePath: string,
  create: boolean = false
): Promise<FileSystemFileHandle> {
  const parts = filePath.split("/").filter((p) => p);
  let currentHandle: any = dirHandle;

  for (let i = 0; i < parts.length - 1; i++) {
    currentHandle = await currentHandle.getDirectoryHandle(parts[i], {
      create,
    });
  }

  return currentHandle.getFileHandle(parts[parts.length - 1], { create });
}

// Get directory handle from directory
export async function getDirectoryHandle(
  dirHandle: FileSystemDirectoryHandle,
  dirPath: string,
  create: boolean = false
): Promise<FileSystemDirectoryHandle> {
  const parts = dirPath.split("/").filter((p) => p);
  let currentHandle: any = dirHandle;

  for (const part of parts) {
    currentHandle = await currentHandle.getDirectoryHandle(part, { create });
  }

  return currentHandle;
}

// Read file content
export async function readLocalFile(
  dirHandle: FileSystemDirectoryHandle,
  filePath: string
): Promise<string> {
  const fileHandle = await getFileHandle(dirHandle, filePath);
  const file = await fileHandle.getFile();
  return file.text();
}

// Write file content
export async function writeLocalFile(
  dirHandle: FileSystemDirectoryHandle,
  filePath: string,
  content: string
): Promise<void> {
  const fileHandle = await getFileHandle(dirHandle, filePath, true);
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

// Create directory
export async function createLocalDirectory(
  dirHandle: FileSystemDirectoryHandle,
  dirPath: string
): Promise<void> {
  await getDirectoryHandle(dirHandle, dirPath, true);
}

// List directory contents
export async function listLocalDirectory(
  dirHandle: FileSystemDirectoryHandle,
  dirPath: string = ""
): Promise<LocalFileHandle[]> {
  let currentHandle = dirHandle;

  if (dirPath) {
    currentHandle = await getDirectoryHandle(dirHandle, dirPath);
  }

  const items: LocalFileHandle[] = [];

  for await (const [name, handle] of (currentHandle as any).entries()) {
    items.push({
      name,
      kind: handle.kind,
      handle,
    });
  }

  return items;
}

// Delete file
export async function deleteLocalFile(
  dirHandle: FileSystemDirectoryHandle,
  filePath: string
): Promise<void> {
  const parts = filePath.split("/").filter((p) => p);
  let currentHandle: any = dirHandle;

  for (let i = 0; i < parts.length - 1; i++) {
    currentHandle = await currentHandle.getDirectoryHandle(parts[i]);
  }

  await currentHandle.removeEntry(parts[parts.length - 1]);
}

// Delete directory
export async function deleteLocalDirectory(
  dirHandle: FileSystemDirectoryHandle,
  dirPath: string
): Promise<void> {
  const parts = dirPath.split("/").filter((p) => p);
  let currentHandle: any = dirHandle;

  for (let i = 0; i < parts.length - 1; i++) {
    currentHandle = await currentHandle.getDirectoryHandle(parts[i]);
  }

  await currentHandle.removeEntry(parts[parts.length - 1], { recursive: true });
}

// Check if file/directory exists
export async function localFileExists(
  dirHandle: FileSystemDirectoryHandle,
  filePath: string
): Promise<boolean> {
  try {
    const parts = filePath.split("/").filter((p) => p);
    let currentHandle: any = dirHandle;

    for (const part of parts) {
      currentHandle = await currentHandle.getDirectoryHandle(part);
    }

    return true;
  } catch {
    return false;
  }
}

// Get file info
export async function getLocalFileInfo(
  dirHandle: FileSystemDirectoryHandle,
  filePath: string
): Promise<{ size: number; modified: number } | null> {
  try {
    const fileHandle = await getFileHandle(dirHandle, filePath);
    const file = await fileHandle.getFile();
    return {
      size: file.size,
      modified: file.lastModified,
    };
  } catch {
    return null;
  }
}

// Store folder handle in IndexedDB for persistence
const DB_NAME = "SymbolsAI";
const STORE_NAME = "folderHandles";

export async function saveFolderHandle(
  projectName: string,
  handle: FileSystemDirectoryHandle
): Promise<void> {
  if (typeof window === "undefined") return;

  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(handle, projectName);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Retrieve folder handle from IndexedDB
export async function getFolderHandle(
  projectName: string
): Promise<FileSystemDirectoryHandle | null> {
  if (typeof window === "undefined") return null;

  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(projectName);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

// Clear stored folder handle
export async function clearFolderHandle(projectName: string): Promise<void> {
  if (typeof window === "undefined") return;

  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(projectName);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}
