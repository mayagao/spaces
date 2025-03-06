"use client";

import { useState, useRef } from "react";
import { PlusIcon, XIcon, AlertIcon } from "@primer/octicons-react";
import { ResourceActionPopover } from "./ResourceActionPopover";
import { ResourceItem, Resource } from "./ResourceItem";
import { TextFileModal } from "./TextFileModal";
import { GitHubSelector } from "./github/GitHubSelector";
import {
  MAX_RESOURCE_SIZE_BYTES,
  wouldExceedLimit,
  calculateTotalResourceSize,
  calculateTotalPercentage,
} from "./utils/resourceSizeUtils";

interface ReferenceListProps {
  resources: Resource[];
  onAddResource: (resource: Resource) => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (id: string) => void;
}

export function ReferenceList({
  resources,
  onAddResource,
  onEditResource,
  onDeleteResource,
}: ReferenceListProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isGitHubSelectorOpen, setIsGitHubSelectorOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTextFile = () => {
    setIsPopoverOpen(false);
    setEditingResource(null);
    setIsTextModalOpen(true);
  };

  const handleEditTextFile = (resource: Resource) => {
    setEditingResource(resource);
    setIsTextModalOpen(true);
  };

  const handleTextFileSubmit = (name: string, content: string) => {
    // Check if it's a code file based on extension
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

    const type = isCodeFile(name) ? "code" : ("text" as Resource["type"]);

    // Calculate the size of the text content
    const contentSize = new TextEncoder().encode(content).length;

    // Check if adding this would exceed the limit
    if (editingResource) {
      // For editing, calculate the difference in size
      const oldSize = editingResource.content
        ? new TextEncoder().encode(editingResource.content).length
        : 0;

      if (wouldExceedLimit(resources, contentSize - oldSize)) {
        setErrorMessage("Cannot save: would exceed the 3MB resource limit");
        return;
      }
    } else if (wouldExceedLimit(resources, contentSize)) {
      setErrorMessage("Cannot add: would exceed the 3MB resource limit");
      return;
    }

    if (editingResource) {
      // Update existing resource
      onEditResource({
        ...editingResource,
        name,
        content,
        type,
        fileSize: contentSize, // Update the file size
      });
    } else {
      // Create new resource
      onAddResource({
        id: Date.now().toString(),
        name,
        type,
        content,
        source: "Text file",
        fileSize: contentSize, // Store the file size
      });
    }

    setIsTextModalOpen(false);
  };

  const handleCloseTextModal = () => {
    setIsTextModalOpen(false);
    setEditingResource(null);
  };

  const handleUploadFile = () => {
    setIsPopoverOpen(false);
    fileInputRef.current?.click();
  };

  const handleAddFromGitHub = () => {
    setIsPopoverOpen(false);
    setIsGitHubSelectorOpen(true);
  };

  const handleAddGitHubResources = (resources: Resource[]) => {
    // Calculate total size of GitHub resources
    const totalGitHubSize = resources.reduce((total, resource) => {
      return total + (resource.fileSize || 1024); // Use 1KB as default if size unknown
    }, 0);

    // Check if adding these would exceed the limit
    if (wouldExceedLimit(resources, totalGitHubSize)) {
      setErrorMessage(
        "Cannot add GitHub resources: would exceed the 3MB resource limit"
      );
      return;
    }

    // Add each resource with a unique ID based on both name and timestamp
    resources.forEach((resource) => {
      const uniqueId = `github-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}-${resource.name}`;
      onAddResource({
        ...resource,
        id: uniqueId,
      });
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if adding this file would exceed the limit
      if (wouldExceedLimit(resources, file.size)) {
        setErrorMessage(
          `Cannot add ${file.name}: would exceed the 3MB resource limit`
        );
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Get the file extension
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

      // Determine the resource type based on file type
      let type: Resource["type"] = "file";

      if (file.type.startsWith("image/")) {
        type = "image";
      } else if (
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
        ].includes(fileExtension)
      ) {
        type = "code";
      } else if (file.type.includes("text/")) {
        type = "text";
      }

      // Create a new resource from the file
      const newResource: Resource = {
        id: Date.now().toString(),
        name: file.name,
        type,
        source: `Upload`,
        fileSize: file.size, // Store the actual file size
      };

      // For text and code files, read the content
      if (type === "text" || type === "code") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onAddResource({
            ...newResource,
            content,
          });
        };
        reader.readAsText(file);
      } else {
        // Add the resource to the list
        onAddResource(newResource);
      }

      // Reset the file input
      event.target.value = "";
    }
  };

  // Calculate current usage percentage and check if limit exceeded
  const getUsagePercentage = (): number => {
    const currentUsage = calculateTotalResourceSize(resources);
    return Math.min(100, (currentUsage / MAX_RESOURCE_SIZE_BYTES) * 100);
  };

  const isLimitExceeded = (): boolean => {
    const currentUsage = calculateTotalResourceSize(resources);
    return currentUsage >= MAX_RESOURCE_SIZE_BYTES;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">References</h2>
        <div className="flex items-center gap-3">
          {/* Usage indicator */}
          <div className="flex items-center gap-2 group">
            {isLimitExceeded() && (
              <span className="text-xs text-red-500 flex items-center">
                <AlertIcon size={12} className="mr-1" />
                Limit exceeded
              </span>
            )}
            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isLimitExceeded()
                    ? "bg-red-500"
                    : getUsagePercentage() > 70
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${getUsagePercentage()}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {getUsagePercentage().toFixed(1)}%
            </span>
          </div>

          <button
            onClick={() => setIsPopoverOpen(true)}
            disabled={isLimitExceeded()}
            className={`flex items-center px-3 py-1.5 border rounded-md shadow-sm ${
              isLimitExceeded()
                ? "bg-gray-100 border-gray-300 cursor-not-allowed text-gray-400"
                : "bg-white border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
            title={
              isLimitExceeded()
                ? "Remove some files to add more"
                : "Add new reference"
            }
          >
            <PlusIcon size={16} className="mr-1" />
            Add
          </button>
          <div className="relative">
            <ResourceActionPopover
              isOpen={isPopoverOpen && !isLimitExceeded()}
              onClose={() => setIsPopoverOpen(false)}
              onAddTextFile={handleAddTextFile}
              onUploadFile={handleUploadFile}
              onAddFromGitHub={handleAddFromGitHub}
            />
          </div>
        </div>
      </div>

      {isLimitExceeded() && (
        <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-md">
          <div className="text-xs text-red-500 flex items-center justify-center">
            <AlertIcon size={12} className="mr-1" />
            Remove some files to add more references
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-900"
          >
            <XIcon size={16} />
          </button>
        </div>
      )}

      <div className="relative border border-purple-100 dark:border-purple-900/30 rounded-lg overflow-hidden">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Table header */}
        <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-400">
          <div>Name</div>
          <div className="flex justify-between group"></div>
        </div>

        {/* Resource list */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {resources.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No references added yet
            </div>
          ) : (
            resources.map((resource) => (
              <ResourceItem
                key={resource.id}
                resource={resource}
                onEdit={
                  resource.type === "text" ? handleEditTextFile : onEditResource
                }
                onDelete={onDeleteResource}
                totalResourceSize={calculateTotalResourceSize(resources)}
              />
            ))
          )}
        </div>

        <TextFileModal
          isOpen={isTextModalOpen}
          onClose={handleCloseTextModal}
          onAdd={handleTextFileSubmit}
          initialName={editingResource?.name || ""}
          initialContent={editingResource?.content || ""}
          isEditing={!!editingResource}
        />

        {isGitHubSelectorOpen && (
          <GitHubSelector
            isOpen={isGitHubSelectorOpen}
            onClose={() => setIsGitHubSelectorOpen(false)}
            onAddResources={handleAddGitHubResources}
            currentResources={resources}
          />
        )}
      </div>
    </div>
  );
}
