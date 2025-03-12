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
import { formatFileSize } from "./utils/resourceSizeUtils";
import { ResourceIcon } from "./ResourceIcon";
import { Resource } from "./types";

// Resource item menu component
function ResourceItemMenu({
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-1">
        <button
          onClick={onEdit}
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    // Keep the full repo path for GitHub sources
    return source;
  };

  return (
    <div className="grid grid-cols-[1.5fr_1fr_20px_40px] gap-4 px-4 py-2 group items-center">
      <div className="flex items-center min-w-0">
        <ResourceIcon type={resource.type} />
        <div className="ml-3 min-w-0">
          <div className="flex items-center">
            <span className="text-sm truncate">{resource.name}</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 min-w-0">
        <div className="flex flex-col">
          {resource.directoryPath && (
            <div className="truncate text-gray-400">
              {resource.directoryPath}
            </div>
          )}
          <div className="truncate">{formatSource(resource.source)}</div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-right">
        {resource.fileSize &&
          formatFileSize(resource.fileSize, totalResourceSize)}
      </div>

      <div className="flex justify-end">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <KebabHorizontalIcon size={16} className="text-gray-500" />
          </button>

          <ResourceItemMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onEdit={() => {
              setIsMenuOpen(false);
              onEdit(resource);
            }}
            onDelete={() => {
              setIsMenuOpen(false);
              onDelete(resource.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
