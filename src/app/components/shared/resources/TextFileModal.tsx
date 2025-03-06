"use client";

import { useState, useEffect, useRef } from "react";
import { XIcon } from "@primer/octicons-react";

interface TextFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, content: string) => void;
  initialName?: string;
  initialContent?: string;
  isEditing?: boolean;
}

export function TextFileModal({
  isOpen,
  onClose,
  onAdd,
  initialName = "",
  initialContent = "",
  isEditing = false,
}: TextFileModalProps) {
  const [name, setName] = useState(initialName);
  const [content, setContent] = useState(initialContent);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Focus the name input when the modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Update form when initialName or initialContent changes
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setContent(initialContent);
    }
  }, [isOpen, initialName, initialContent]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setContent("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && content.trim()) {
      onAdd(name, content);
      setName("");
      setContent("");
      onClose();
    }
  };

  const isFormValid = name.trim() !== "" && content.trim() !== "";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/25 z-[60]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-lg w-full mx-4 pointer-events-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">
              {isEditing ? "Edit text file" : "Add a text file"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <XIcon size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Give the file a title"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter content here"
                className="w-full h-48 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-4 py-2 text-sm rounded-lg ${
                  isFormValid
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-green-600/50 text-white/70 cursor-not-allowed"
                }`}
              >
                {isEditing ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
