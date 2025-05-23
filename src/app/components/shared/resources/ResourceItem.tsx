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
  FileCodeIcon,
} from "@primer/octicons-react";
import { MAX_RESOURCE_SIZE_BYTES } from "./utils/resourceSizeUtils";

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
  totalResourceSize: number; // Total size of all resources
}

export function ResourceItem({
  resource,
  onEdit,
  onDelete,
  totalResourceSize,
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

  // Calculate file size as percentage of total resources
  const estimateFileSize = (): string => {
    let bytes = 0;

    // Use the fileSize property if available
    if (resource.fileSize !== undefined) {
      bytes = resource.fileSize;
    }
    // Check if we have stored file size information in content (legacy support)
    else if (resource.content?.startsWith("filesize:")) {
      bytes = parseInt(resource.content.replace("filesize:", ""), 10);
    }
    // Estimate size based on content length for text and code resources
    else if (
      (resource.type === "text" || resource.type === "code") &&
      resource.content
    ) {
      bytes = new TextEncoder().encode(resource.content).length;
    }
    // Estimate sizes for other resource types
    else {
      switch (resource.type) {
        case "image":
          bytes = 2 * 1024 * 1024; // Estimate 2MB for images
          break;
        case "link":
          bytes = 100; // Estimate 100 bytes for links
          break;
        case "directory":
          bytes = 0; // Directories themselves don't count
          break;
        default:
          bytes = 1024; // Default estimate: 1KB
      }
    }

    // Calculate percentage of total resources
    if (totalResourceSize === 0) return "0%";
    const percentage = (bytes / MAX_RESOURCE_SIZE_BYTES) * 100;
    return percentage < 0.1 ? "<0.1%" : `${percentage.toFixed(1)}%`;
  };

  // Get the appropriate icon based on resource type
  const getIcon = () => {
    switch (resource.type) {
      case "directory":
        return <FileDirectoryIcon size={16} className="text-gray-500" />;
      case "image":
        return <ImageIcon size={16} className="text-gray-500" />;
      case "text":
        // Check if it's actually a code file by extension
        if (isCodeFile(resource.name)) {
          return <FileCodeIcon size={16} className="text-gray-500" />;
        }
        return <NoteIcon size={16} className="text-gray-500" />;
      case "code":
        return <FileCodeIcon size={16} className="text-gray-500" />;
      case "link":
        return <LinkIcon size={16} className="text-gray-500" />;
      case "file":
      default:
        return <FileIcon size={16} className="text-gray-500" />;
    }
  };

  // Format source to show only repo name
  const formatSource = (source: string | undefined): string => {
    if (!source) return "—";
    if (source === "Text file" || source === "Upload") return source;
    // Extract repo name from "username/repo" format
    return source.split("/").pop() || source;
  };

  return (
    <div className="flex items-center justify-between py-2 pr-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg group dark:border-gray-800 relative">
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Name column */}
        <div className="flex items-center gap-3">
          {getIcon()}
          <div className="truncate text-sm">{resource.name}</div>
        </div>

        {/* Source column with file size */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 truncate max-w-[70%]">
            {formatSource(resource.source)}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* File size display as percentage */}
            <span
              className={`text-xs text-gray-400 w-16 text-right transition-opacity duration-200 ${
                totalResourceSize / MAX_RESOURCE_SIZE_BYTES > 0.7
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {estimateFileSize()}
            </span>

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
          <div className="absolute right-0 bottom-full mb-1 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-[51] w-36">
            <div className="p-1">
              {isEditable && (
                <button
                  onClick={() => {
                    onEdit(resource);
                    setShowActions(false);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-2"
                >
                  <PencilIcon size={16} className="text-gray-500" />
                  <span>Edit</span>
                </button>
              )}
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
