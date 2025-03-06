"use client";

import {
  ProjectIcon,
  FileIcon,
  DownloadIcon,
  PlusIcon,
  RepoIcon,
  CodeIcon,
} from "@primer/octicons-react";

interface ResourceActionPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTextFile: () => void;
  onUploadFile: () => void;
  onAddFromGitHub: () => void;
}

export function ResourceActionPopover({
  isOpen,
  onClose,
  onAddTextFile,
  onUploadFile,
  onAddFromGitHub,
}: ResourceActionPopoverProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Fixed overlay to close when clicking outside */}
      <div className="fixed inset-0 z-[50]" onClick={onClose} />

      {/* Popover */}
      <div className="absolute top-[calc(100%+8px)] text-sm right-0 w-64 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-[51]">
        <div className="py-1">
          <div className="px-1">
            <button
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-2"
              onClick={() => {
                onAddFromGitHub();
                onClose();
              }}
            >
              <CodeIcon size={16} className="text-gray-500" />
              <span>Add code files</span>
            </button>
          </div>
          <div className="border-b border-gray-200 mb-1 mt-1 dark:border-gray-700"></div>
          <div className="px-1">
            <button
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-2"
              onClick={() => {
                onAddTextFile();
                onClose();
              }}
            >
              <FileIcon size={16} className="text-gray-500" />
              <span>Add a text file</span>
            </button>

            <button
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-2"
              onClick={() => {
                onUploadFile();
                onClose();
              }}
            >
              <DownloadIcon size={16} className="text-gray-500" />
              <span>Upload from computer</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
