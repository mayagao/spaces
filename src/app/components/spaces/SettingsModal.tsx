"use client";

import { useRef, useEffect } from "react";
import type { Space } from "../../data/spaces";
import { SpaceEditForm } from "./SpaceEditForm";
import { XIcon } from "@primer/octicons-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  space?: Space;
  onSubmit: (data: Omit<Space, "id">) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  mode,
  space,
  onSubmit,
}: SettingsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/25" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          ref={modalRef}
          className="relative bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full mx-4 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-semibold">
              {mode === "create" ? "Create a new Space" : "Edit Space"}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <XIcon size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <SpaceEditForm
              space={space}
              mode={mode}
              onSubmit={(data) => {
                onSubmit(data);
                onClose();
              }}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </>
  );
}
