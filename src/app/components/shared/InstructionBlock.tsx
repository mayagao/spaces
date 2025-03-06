"use client";

import { PencilIcon } from "@primer/octicons-react";
import { useState } from "react";

interface InstructionBlockProps {
  initialContent: string;
  onSave: (content: string) => void;
}

export function InstructionBlock({
  initialContent,
  onSave,
}: InstructionBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    onSave(content);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium">Instructions</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <PencilIcon size={16} />
        </button>
      </div>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300">{content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
