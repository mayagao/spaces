"use client";

import { PlusIcon } from "@primer/octicons-react";
import { Resource, ResourceItem } from "./ResourceItem";
import { useState } from "react";

interface ResourceListProps {
  resources: Resource[];
  onAddResource: () => void;
  onEditResource: (resource: Resource) => void;
  onDeleteResource: (id: string) => void;
}

export function ResourceList({
  resources,
  onAddResource,
  onEditResource,
  onDeleteResource,
}: ResourceListProps) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium">References</h3>
        <button
          onClick={onAddResource}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded flex items-center gap-1 text-sm"
        >
          <PlusIcon size={16} />
          <span>Add</span>
        </button>
      </div>
      <div className="p-2">
        {resources.map((resource) => (
          <ResourceItem
            key={resource.id}
            resource={resource}
            onEdit={onEditResource}
            onDelete={onDeleteResource}
          />
        ))}
        {resources.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-500">
            No references added yet
          </div>
        )}
      </div>
    </div>
  );
}
