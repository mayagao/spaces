"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { spaces, type Space } from "../../data/spaces";
import { getIconComponent } from "../../lib/icons";
import { cn } from "../../../lib/utils";
import React from "react";

interface ConversationFilterPillsProps {
  selectedSpaceIds: string[];
  onFilterChange: (spaceIds: string[]) => void;
}

export function ConversationFilterPills({
  selectedSpaceIds,
  onFilterChange,
}: ConversationFilterPillsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get the selected space if there is exactly one
  const selectedSpace =
    selectedSpaceIds.length === 1
      ? spaces.find((s) => s.id === selectedSpaceIds[0])
      : null;

  // Handle selecting a space
  const handleSelectSpace = (spaceId: string) => {
    onFilterChange([spaceId]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative dropdown-container">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
        className={cn(
          "px-2 py-1 rounded-lg text-sm flex items-center gap-1.5 transition-colors text-gray-900 dark:text-white",
          isDropdownOpen && "bg-gray-50 dark:bg-gray-800"
        )}
      >
        <div className="flex items-center gap-1.5 font-medium text-xs text-gray-500">
          {selectedSpace ? (
            <span className="truncate">{selectedSpace.title}</span>
          ) : (
            <span>All recent Conversations</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 text-gray-400 transition-transform",
            isDropdownOpen && "transform rotate-180"
          )}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-48 z-[100] py-1">
          {/* All option */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFilterChange([]);
              setIsDropdownOpen(false);
            }}
            className={cn(
              "w-full px-3 py-1.5 flex items-center gap-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800",
              selectedSpaceIds.length === 0 ? "bg-gray-50 dark:bg-gray-800" : ""
            )}
          >
            <span className="text-sm">All recent Conversations</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          {/* Spaces list */}
          {spaces.map((space) => {
            const SpaceIcon = getIconComponent(space.icon);
            const isSelected =
              selectedSpaceIds.length === 1 && selectedSpaceIds[0] === space.id;

            return (
              <button
                key={space.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectSpace(space.id);
                }}
                className={cn(
                  "w-full px-3 py-1.5 flex items-center gap-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800",
                  isSelected ? "bg-gray-50 dark:bg-gray-800" : ""
                )}
              >
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: space.color }}
                >
                  {SpaceIcon && (
                    <SpaceIcon className="w-2.5 h-2.5 text-white" />
                  )}
                </div>
                <span className="text-sm truncate">{space.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
