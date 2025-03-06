"use client";

import { useState } from "react";
import { SPACE_ICONS, getIconComponent, type SpaceIcon } from "../../lib/icons";
import { ChevronDownIcon } from "@primer/octicons-react";

interface IconSelectProps {
  value: SpaceIcon;
  onChange: (icon: SpaceIcon) => void;
  color: string;
}

export function IconSelect({ value, onChange, color }: IconSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const IconComponent = getIconComponent(value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          {IconComponent && <IconComponent size={20} className="text-white" />}
        </div>
        <span className="flex-1 text-left text-sm">{value}</span>
        <ChevronDownIcon size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-40 w-full mt-1 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-auto">
            <div className="grid grid-cols-4 gap-2">
              {SPACE_ICONS.map((iconName) => {
                const Icon = getIconComponent(iconName);
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                    className={`p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex flex-col items-center gap-1.5 ${
                      value === iconName ? "bg-gray-50 dark:bg-gray-800" : ""
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      {Icon && <Icon size={20} className="text-white" />}
                    </div>
                    <span className="text-xs truncate w-full text-center text-gray-600 dark:text-gray-400">
                      {iconName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
