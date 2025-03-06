"use client";

import { useState } from "react";
import {
  FileIcon,
  LinkIcon,
  FileDirectoryIcon,
  ImageIcon,
  NoteIcon,
  KebabHorizontalIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
  CodeIcon,
  FileCodeIcon,
} from "@primer/octicons-react";

export interface Resource {
  id: string;
  name: string;
  type: "file" | "link" | "image" | "text" | "directory" | "code";
  source?: string;
  url?: string;
  content?: string;
  fileSize?: number; // Optional file size in bytes
}

interface ResourceItemProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
}

export function ResourceItem({
  resource,
  onEdit,
  onDelete,
}: ResourceItemProps) {
  const [showActions, setShowActions] = useState(false);

  // Check if a file is a code file based on extension
  const isCodeFile = (filename: string): boolean => {
    const extension = filename.split(".").pop()?.toLowerCase();
    return (
      !!extension &&
      [
        "js",
        "jsx",
        "ts",
        "tsx",
        "html",
        "css",
        "json",
        "go",
        "py",
        "java",
        "c",
        "cpp",
        "rb",
      ].includes(extension)
    );
  };

  // Determine if it's a text file that can be edited (not a code file)
  const isEditable = resource.type === "text" && !isCodeFile(resource.name);

  // Estimate file size based on resource type and content
  const estimateFileSize = (): string => {
    // Use the fileSize property if available
    if (resource.fileSize !== undefined) {
      const bytes = resource.fileSize;

      // Format the size
      if (bytes < 1024) {
        return `${bytes} B`;
      } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      } else {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }
    }

    // Check if we have stored file size information in content (legacy support)
    if (resource.content?.startsWith("filesize:")) {
      const bytes = parseInt(resource.content.replace("filesize:", ""), 10);

      // Format the size
      if (bytes < 1024) {
        return `${bytes} B`;
      } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      } else {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }
    }

    // For text and code files, use content length if available
    if (
      (resource.type === "text" || resource.type === "code") &&
      resource.content
    ) {
      const bytes = new TextEncoder().encode(resource.content).length;

      // Format the size
      if (bytes < 1024) {
        return `${bytes} B`;
      } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
      } else {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
      }
    }

    // For images and other files, show a placeholder or estimate
    switch (resource.type) {
      case "image":
        return "~2 MB"; // Placeholder for images
      case "directory":
        return ""; // No size for directories
      case "link":
        return "<1 KB"; // Links are typically small
      default:
        return "<1%"; // Default placeholder similar to GitHub's percentage
    }
  };

  // Get the appropriate icon based on resource type
  const getIcon = () => {
    switch (resource.type) {
      case "directory":
        return <FileDirectoryIcon size={20} className="text-blue-500" />;
      case "image":
        return <ImageIcon size={20} className="text-purple-500" />;
      case "text":
        // Check if it's actually a code file by extension
        if (isCodeFile(resource.name)) {
          return <FileCodeIcon size={20} className="text-orange-500" />;
        }
        return <NoteIcon size={20} className="text-green-500" />;
      case "code":
        return <FileCodeIcon size={20} className="text-orange-500" />;
      case "link":
        return <LinkIcon size={20} className="text-orange-500" />;
      case "file":
      default:
        return <FileIcon size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg group border-b border-gray-100 dark:border-gray-800 relative">
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Name column */}
        <div className="flex items-center gap-3">
          {getIcon()}
          <div className="font-medium text-sm">{resource.name}</div>
        </div>

        {/* Source column with file size */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 truncate max-w-[70%]">
            {resource.source || "—"}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* File size display */}
            <span className="text-xs text-gray-400 mr-2">
              {estimateFileSize()}
            </span>

            {isEditable && (
              <button
                onClick={() => onEdit(resource)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                aria-label="Edit"
              >
                <PencilIcon size={16} className="text-gray-500" />
              </button>
            )}

            <button
              onClick={() => setShowActions(!showActions)}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              aria-label="More actions"
            >
              <KebabHorizontalIcon size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions Popover */}
      {showActions && (
        <>
          <div
            className="fixed inset-0 z-[50]"
            onClick={() => setShowActions(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-[51] w-36">
            <div className="p-1">
              <button
                onClick={() => {
                  onDelete(resource.id);
                  setShowActions(false);
                }}
                className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-2 text-red-500"
              >
                <TrashIcon size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
