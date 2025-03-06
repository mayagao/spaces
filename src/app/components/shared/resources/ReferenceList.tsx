"use client";

import { useState, useRef } from "react";
import { PlusIcon } from "@primer/octicons-react";
import { ResourceActionPopover } from "./ResourceActionPopover";
import { ResourceItem, Resource } from "./ResourceItem";
import { TextFileModal } from "./TextFileModal";
import { GitHubSelector } from "./github/GitHubSelector";

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

    if (editingResource) {
      // Update existing resource
      const updatedResource: Resource = {
        ...editingResource,
        name,
        content,
        type,
      };
      onEditResource(updatedResource);
    } else {
      // Create new resource
      const newResource: Resource = {
        id: Date.now().toString(),
        name,
        type,
        source: "Text file",
        content,
      };
      onAddResource(newResource);
    }
  };

  const handleCloseTextModal = () => {
    setIsTextModalOpen(false);
    setEditingResource(null);
  };

  const handleUploadFile = () => {
    fileInputRef.current?.click();
  };

  const handleAddFromGitHub = () => {
    setIsPopoverOpen(false);
    setIsGitHubSelectorOpen(true);
  };

  const handleAddGitHubResources = (resources: Resource[]) => {
    resources.forEach((resource) => {
      onAddResource(resource);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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

  return (
    <div className="relative border border-purple-100 dark:border-purple-900/30 rounded-lg overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-medium">References</h2>
        <button
          onClick={() => setIsPopoverOpen(true)}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-1.5 text-sm border border-gray-200 dark:border-gray-700"
        >
          <PlusIcon size={16} />
          <span>Add</span>
        </button>

        <div className="relative">
          <ResourceActionPopover
            isOpen={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
            onAddTextFile={handleAddTextFile}
            onUploadFile={handleUploadFile}
            onAddFromGitHub={handleAddFromGitHub}
          />
        </div>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-400">
        <div>Name</div>
        <div>Source</div>
      </div>

      {/* Resource list */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {resources.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
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

      <GitHubSelector
        isOpen={isGitHubSelectorOpen}
        onClose={() => setIsGitHubSelectorOpen(false)}
        onAddResources={handleAddGitHubResources}
      />
    </div>
  );
}
