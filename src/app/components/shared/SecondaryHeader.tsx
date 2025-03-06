"use client";

import { FC, useState } from "react";
import { ChevronLeft, Plus, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";

interface SecondaryHeaderProps {
  showModelSelector?: boolean;
  actions?: React.ReactNode;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  visibility?: boolean;
}

export const SecondaryHeader: FC<SecondaryHeaderProps> = ({
  showModelSelector = true,
  actions,
  sidebarCollapsed,
  onToggleSidebar,
  visibility = true,
}) => {
  const [selectedModel, setSelectedModel] = useState("GPT-4o");

  return (
    <div
      className={`h-14 dark:border-gray-800 flex items-center px-4 ${
        visibility && "border-b border-gray-200 "
      }`}
    >
      {/* Left section - Only visible when sidebar is collapsed */}
      <div className="flex items-center gap-3">
        {sidebarCollapsed && (
          <>
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90">
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New</span>
            </button>
          </>
        )}
      </div>

      {/* Center section - Model selector */}
      <div
        className={cn(
          "flex-1 flex justify-center",
          sidebarCollapsed ? "ml-4" : ""
        )}
      >
        {showModelSelector && (
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <span className="text-sm font-medium">{selectedModel}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Right section - Action buttons */}
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
};
