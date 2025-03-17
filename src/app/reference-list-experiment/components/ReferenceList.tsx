import { useState, useRef } from "react";
import { XIcon, AlertIcon } from "@primer/octicons-react";
import { ResourceItem } from "./ResourceItem";
import { Resource, ReferenceListConfig, ColumnConfig } from "../types";
import { TextFileModal } from "../../components/shared/resources/TextFileModal";
import { GitHubSelector } from "../../components/shared/resources/github/GitHubSelector";
import { ResourceActionPopover } from "../../components/shared/resources/ResourceActionPopover";
import {
  MAX_RESOURCE_SIZE_BYTES,
  wouldExceedLimit,
  calculateTotalResourceSize,
} from "../../components/shared/resources/utils/resourceSizeUtils";
import { Button } from "@/components/ui/button";

interface ReferenceListProps {
  resources: Resource[];
  onAddResource: (resource: Resource) => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (id: string) => void;
  onReorderResources?: (resources: Resource[]) => void;
  config: ReferenceListConfig;
}

export function ReferenceList({
  resources,
  onAddResource,
  onEditResource,
  onDeleteResource,
  onReorderResources,
  config,
}: ReferenceListProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isGitHubSelectorOpen, setIsGitHubSelectorOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<Resource | null>(null);
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
    const contentSize = new TextEncoder().encode(content).length;

    if (editingResource) {
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
      onEditResource({
        ...editingResource,
        name,
        content,
        type,
        fileSize: contentSize,
      });
    } else {
      onAddResource({
        id: Date.now().toString(),
        name,
        type,
        content,
        source: "Text file",
        fileSize: contentSize,
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (wouldExceedLimit(resources, file.size)) {
      setErrorMessage(
        `Cannot add ${file.name}: would exceed the 3MB resource limit`
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
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

    const newResource: Resource = {
      id: Date.now().toString(),
      name: file.name,
      type,
      source: `Upload`,
      fileSize: file.size,
    };

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
      onAddResource(newResource);
    }

    event.target.value = "";
  };

  const getUsagePercentage = (): number => {
    const currentUsage = calculateTotalResourceSize(resources);
    return Math.min(100, (currentUsage / MAX_RESOURCE_SIZE_BYTES) * 100);
  };

  const isLimitExceeded = (): boolean => {
    const currentUsage = calculateTotalResourceSize(resources);
    return currentUsage >= MAX_RESOURCE_SIZE_BYTES;
  };

  // Calculate total resource size
  const totalResourceSize = resources.reduce((total, resource) => {
    return total + (resource.fileSize || 0);
  }, 0);

  // Generate grid template columns based on visible columns and their widths
  const gridTemplateColumns = Object.entries(config.columns)
    .filter(([_, col]: [string, ColumnConfig]) => col.visible)
    .map(([_, col]: [string, ColumnConfig]) => col.width)
    .join(" ");

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    resource: Resource
  ) => {
    setDraggedItem(resource);
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget.classList) {
      e.currentTarget.classList.add("dragging");
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.classList) {
      e.currentTarget.classList.remove("dragging");
    }
    setDraggedItem(null);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    targetResource: Resource
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedItem && draggedItem.id !== targetResource.id) {
      e.currentTarget.classList.add("drop-target");
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("drop-target");
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetResource: Resource
  ) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drop-target");

    if (!draggedItem || draggedItem.id === targetResource.id) {
      return;
    }

    const reorderedResources = [...resources];
    const draggedIndex = reorderedResources.findIndex(
      (r) => r.id === draggedItem.id
    );
    const targetIndex = reorderedResources.findIndex(
      (r) => r.id === targetResource.id
    );

    if (draggedIndex !== -1 && targetIndex !== -1) {
      const [removed] = reorderedResources.splice(draggedIndex, 1);
      reorderedResources.splice(targetIndex, 0, removed);

      if (onReorderResources) {
        onReorderResources(reorderedResources);
      }
    }

    setDraggedItem(null);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold">References</h2>
        <div className="flex items-center">
          <div className="flex items-center gap-2 group">
            {isLimitExceeded() && (
              <span className="text-xs text-red-500 flex items-center">
                <AlertIcon size={12} className="mr-1" />
                Limit exceeded
              </span>
            )}
            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-300 bg-green-500"
                style={{ width: `${getUsagePercentage()}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {getUsagePercentage().toFixed(1)}%
            </span>
          </div>
          <Button
            onClick={() => setIsPopoverOpen(true)}
            disabled={isLimitExceeded()}
            variant="outline"
            size="sm"
            className={`ml-2 ${
              isLimitExceeded()
                ? "cursor-not-allowed"
                : "focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
            title={
              isLimitExceeded()
                ? "Remove some files to add more"
                : "Add new reference"
            }
          >
            Add
          </Button>
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

      {isLimitExceeded() && (
        <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-md">
          <div className="text-xs text-red-500 flex items-center justify-center">
            <AlertIcon size={12} className="mr-1" />
            Remove some files to add more references
          </div>
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
        <div
          className="grid gap-4 px-4 py-3 bg-gray-50 dark:bg-gray-900 text-xs font-medium text-gray-500 dark:text-gray-400"
          style={{ gridTemplateColumns }}
        >
          {config.columns.name.visible && <div>Name</div>}
          {config.columns.source.visible && (
            <div style={{ textAlign: config.columns.source.align || "left" }}>
              Source
            </div>
          )}
          {config.columns.size.visible && (
            <div style={{ textAlign: config.columns.size.align || "right" }}>
              Size
            </div>
          )}
          {config.columns.actions.visible && <div></div>}
        </div>

        {/* Resource list */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          <style jsx>{`
            .drop-target {
              box-shadow: 0 -2px 0 0 #3b82f6;
              background-color: rgba(59, 130, 246, 0.05);
            }
          `}</style>

          {resources.length === 0 ? (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No references added yet
            </div>
          ) : (
            resources.map((resource) => (
              <div
                key={resource.id}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, resource)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, resource)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, resource)}
                className={`group cursor-grab active:cursor-grabbing transition-colors duration-200 ${
                  draggedItem && draggedItem.id === resource.id
                    ? "opacity-50 bg-gray-100 dark:bg-gray-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
                style={{ gridTemplateColumns }}
              >
                <ResourceItem
                  resource={resource}
                  onEdit={handleEditTextFile}
                  onDelete={onDeleteResource}
                  totalResourceSize={totalResourceSize}
                  columns={config.columns}
                  displayOptions={config.displayOptions}
                />
              </div>
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
            onAddResources={(resources) => {
              resources.forEach((resource) => {
                const uniqueId = `github-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 9)}-${resource.name}`;
                onAddResource({
                  ...resource,
                  id: uniqueId,
                });
              });
            }}
            currentResources={resources}
          />
        )}
      </div>
    </div>
  );
}
