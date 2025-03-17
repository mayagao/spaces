"use client";

import { useState, useRef } from "react";
import { PlusIcon } from "@primer/octicons-react";
import { ResourceActionPopover } from "./ResourceActionPopover";
import { ResourceItem } from "./ResourceItem";
import { Resource } from "./types";
import { TextFileModal } from "./TextFileModal";
import { GitHubSelector } from "./github/GitHubSelector";

interface ResourceListProps {
  resources: Resource[];
  onAddResource: (resource: Resource) => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (id: string) => void;
}

export function ResourceList({
  resources,
  onAddResource,
  onEditResource,
  onDeleteResource,
}: ResourceListProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isGitHubSelectorOpen, setIsGitHubSelectorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTextFile = () => {
    setIsPopoverOpen(false);
    setIsTextModalOpen(true);
  };

  const handleTextFileSubmit = (name: string, content: string) => {
    const newResource: Resource = {
      id: Date.now().toString(),
      name,
      type: "text",
      source: "Text file",
      content,
    };
    onAddResource(newResource);
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
      // Determine the resource type based on file extension or path
      let type: Resource["type"] = "file";

      if (resource.name.endsWith("/")) {
        type = "directory";
      } else {
        const extension = resource.name.split(".").pop()?.toLowerCase();
        if (extension) {
          if (
            ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)
          ) {
            type = "image";
          } else if (
            [
              "txt",
              "md",
              "js",
              "jsx",
              "ts",
              "tsx",
              "html",
              "css",
              "json",
            ].includes(extension)
          ) {
            type = "text";
          }
        }
      }

      onAddResource({
        ...resource,
        type,
      });
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
        file.type.includes("text/") ||
        ["js", "jsx", "ts", "tsx", "html", "css", "json", "md"].includes(
          fileExtension
        )
      ) {
        type = "text";
      }

      // Create a new resource from the file
      const newResource: Resource = {
        id: Date.now().toString(),
        name: file.name,
        type,
        source: `Upload`,
      };

      // Add the resource to the list
      onAddResource(newResource);

      // Reset the file input
      event.target.value = "";
    }
  };

  // Calculate total resource size for the ResourceItem component
  const calculateTotalResourceSize = () => {
    return resources.reduce((total, resource) => {
      return total + (resource.fileSize || 0);
    }, 0);
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Resources
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsPopoverOpen(true)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center gap-1 text-sm"
          >
            <PlusIcon size={16} />
            <span>Add</span>
          </button>

          <ResourceActionPopover
            isOpen={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
            onAddTextFile={handleAddTextFile}
            onUploadFile={handleUploadFile}
            onAddFromGitHub={handleAddFromGitHub}
          />
        </div>
      </div>

      {/* Resource list */}
      <div className="space-y-1">
        {resources.map((resource) => (
          <ResourceItem
            key={resource.id}
            resource={resource}
            onEdit={() => onEditResource(resource)}
            onDelete={() => onDeleteResource(resource.id)}
            totalResourceSize={calculateTotalResourceSize()}
          />
        ))}
      </div>

      <TextFileModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        onAdd={handleTextFileSubmit}
      />

      <GitHubSelector
        isOpen={isGitHubSelectorOpen}
        onClose={() => setIsGitHubSelectorOpen(false)}
        onAddResources={handleAddGitHubResources}
        currentResources={resources}
      />
    </div>
  );
}
