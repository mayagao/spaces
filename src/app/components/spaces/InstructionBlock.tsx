"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface InstructionBlockProps {
  initialContent: string;
  onSave: (content: string) => void;
  maxLength?: number;
}

export function InstructionBlock({
  initialContent,
  onSave,
  maxLength = 2000,
}: InstructionBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">Instructions</h3>
        {!isEditing ? (
          <Button
            size="sm"
            onClick={() => setIsEditing(true)}
            variant="outline"
          >
            Edit
          </Button>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-green-700 text-white hover:bg-green-600"
                onClick={handleSave}
                variant="default"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="w-[536px] w-full">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
            className="w-full h-32 px-3 text-sm py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the main responsibilities, limitations, and expertise."
          />
          <div className="text-sm text-gray-500">
            {content.length}/{maxLength} characters
          </div>
        </div>
      ) : (
        <div className="text-sm/5.5 text-gray-500 line-clamp-3">
          {content || "No descriptions added"}
        </div>
      )}
    </div>
  );
}
