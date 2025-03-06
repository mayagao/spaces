"use client";

import {
  FileIcon,
  LinkIcon,
  KebabHorizontalIcon,
} from "@primer/octicons-react";

export interface Resource {
  id: string;
  name: string;
  type: "file" | "link";
  source?: string;
  url?: string;
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
  return (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg group">
      <div className="flex items-center gap-3">
        {resource.type === "file" ? (
          <FileIcon size={16} className="text-gray-400" />
        ) : (
          <LinkIcon size={16} className="text-gray-400" />
        )}
        <div>
          <div className="font-medium text-sm">{resource.name}</div>
          {resource.source && (
            <div className="text-xs text-gray-500">{resource.source}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
        <button
          onClick={() => onEdit(resource)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <KebabHorizontalIcon size={16} />
        </button>
      </div>
    </div>
  );
}
