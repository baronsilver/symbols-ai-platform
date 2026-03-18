"use client";

import { useState, useEffect } from "react";
import { FolderOpen, FolderPlus, AlertCircle, Check } from "lucide-react";
import {
  isFileSystemAccessSupported,
  selectLocalFolder,
  getFolderHandle,
  saveFolderHandle,
  clearFolderHandle,
} from "@/lib/local-file-system";

interface LocalFolderManagerProps {
  projectName: string;
  onFolderSelected?: (handle: FileSystemDirectoryHandle) => void;
}

export function LocalFolderManager({
  projectName,
  onFolderSelected,
}: LocalFolderManagerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [folderPath, setFolderPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if API is supported and load saved folder
  useEffect(() => {
    const checkSupport = async () => {
      const supported = isFileSystemAccessSupported();
      setIsSupported(supported);

      if (supported) {
        try {
          const saved = await getFolderHandle(projectName);
          if (saved) {
            setFolderHandle(saved);
            setFolderPath(`Local: ${projectName}`);
          }
        } catch (err) {
          console.warn("Could not restore folder handle:", err);
        }
      }
    };

    checkSupport();
  }, [projectName]);

  const handleSelectFolder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const handle = await selectLocalFolder();
      setFolderHandle(handle);
      setFolderPath(`Local: ${handle.name}`);

      // Save for future use
      await saveFolderHandle(projectName, handle);

      onFolderSelected?.(handle);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to select folder";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFolder = async () => {
    setIsLoading(true);
    try {
      await clearFolderHandle(projectName);
      setFolderHandle(null);
      setFolderPath("");
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to clear folder";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
        <AlertCircle size={16} className="text-yellow-600" />
        <span className="text-yellow-700">
          Local file system access not supported in this browser. Use Chrome, Edge, or Opera.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {folderHandle ? (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
          <Check size={16} className="text-green-600" />
          <span className="text-sm text-green-700 flex-1">{folderPath}</span>
          <button
            onClick={handleClearFolder}
            disabled={isLoading}
            className="text-xs px-2 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-700 rounded transition-colors disabled:opacity-50"
          >
            Change
          </button>
        </div>
      ) : (
        <button
          onClick={handleSelectFolder}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          <FolderPlus size={16} />
          {isLoading ? "Selecting..." : "Select Local Folder"}
        </button>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm">
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <p className="text-xs text-muted">
        {folderHandle
          ? "Files will be created in your selected local folder"
          : "Select a folder on your computer to save generated projects locally"}
      </p>
    </div>
  );
}
