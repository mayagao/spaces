"use client";

import { useState, useEffect } from "react";
import type { Space } from "../../data/spaces";
import { IconSelect } from "./IconSelect";
import { getRandomIcon, type SpaceIcon } from "../../lib/icons";
import { SyncIcon } from "@primer/octicons-react";
import { SPACE_COLORS } from "../../data/spaces";

interface SpaceEditFormProps {
  space?: Space;
  onSubmit: (data: Omit<Space, "id">) => void;
  onCancel: () => void;
  mode: "create" | "edit";
}

export function SpaceEditForm({
  space,
  onSubmit,
  onCancel,
  mode,
}: SpaceEditFormProps) {
  const [formData, setFormData] = useState<Omit<Space, "id">>({
    title: space?.title || "",
    description: space?.description || "",
    icon: space?.icon || (mode === "create" ? getRandomIcon() : "star"),
    color:
      space?.color ||
      SPACE_COLORS[Math.floor(Math.random() * SPACE_COLORS.length)],
    icebreakers: space?.icebreakers || [],
  });

  // Update form data when space changes
  useEffect(() => {
    if (space) {
      setFormData({
        title: space.title,
        description: space.description,
        icon: space.icon,
        color: space.color,
        icebreakers: space.icebreakers,
      });
    }
  }, [space]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleGenerate = () => {
    setFormData((data) => ({
      ...data,
      icon: getRandomIcon(),
      color: SPACE_COLORS[Math.floor(Math.random() * SPACE_COLORS.length)],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter space title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full h-32 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the purpose of this space"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Icon</label>
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <SyncIcon size={12} />
            Generate
          </button>
        </div>
        <IconSelect
          value={formData.icon as SpaceIcon}
          onChange={(icon) => setFormData({ ...formData, icon })}
          color={formData.color}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {mode === "create" ? "Create Space" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
