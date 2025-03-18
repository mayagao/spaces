"use client";

import { useState, useEffect } from "react";
import type { Space } from "../../data/spaces";
import { IconSelect } from "./IconSelect";
import { getRandomIcon, type SpaceIcon } from "../../lib/icons";
import { SyncIcon } from "@primer/octicons-react";
import { SPACE_COLORS } from "../../data/spaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    <form onSubmit={handleSubmit} className="space-y-4 text-sm ">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 flex-1">
          <div className="flex-grow-1">
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter space title"
              required
            />
          </div>
          <div className="w-[80px] mt-6 flex items-center justify-between mb-2 relative">
            <IconSelect
              value={formData.icon as SpaceIcon}
              onChange={(icon) => setFormData({ ...formData, icon })}
              color={formData.color}
            />
            <button
              type="button"
              onClick={handleGenerate}
              style={{ left: 32, top: 12 }}
              className="absolute bg-white flex items-center rounded-full justify-center border w-[32px] h-[32px] hover:bg-gray-100"
            >
              <SyncIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full h-32 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the purpose of this space"
          required
        />
      </div>

      <div className="flex justify-end gap-2 pb-1">
        <Button
          variant="outline"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          className="bg-green-700 text-white hover:bg-green-900"
        >
          {mode === "create" ? "Create Space" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
