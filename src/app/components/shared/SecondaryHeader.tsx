"use client";

import { FC, useState, useEffect } from "react";
import { ChevronLeft, Plus, ChevronDown, Icon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { getIconComponent, type SpaceIcon } from "../../lib/icons";
import { IconButton } from "./IconButton";

interface SecondaryHeaderProps {
  showModelSelector?: boolean;
  actions?: React.ReactNode;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  visibility?: boolean;
  spaceIcon?: SpaceIcon;
  spaceTitle?: string;
  spaceColor?: string;
  isScrolled: boolean;
}

export const SecondaryHeader: FC<SecondaryHeaderProps> = ({
  showModelSelector = true,
  actions,
  sidebarCollapsed,
  onToggleSidebar,
  visibility = true,
  spaceIcon,
  spaceTitle,
  spaceColor,
  isScrolled,
}) => {
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const IconComponent = spaceIcon ? getIconComponent(spaceIcon) : null;

  return (
    <div className="h-[49px] flex items-center px-4 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-50">
      {/* Left section */}
      <div className="flex items-center gap-3 relative z-10">
        {sidebarCollapsed && (
          <>
            <IconButton icon={ChevronLeft} onClick={onToggleSidebar} />
            <IconButton icon={Plus} onClick={() => console.log("New")} />
          </>
        )}
        <div
          className={cn(
            "flex items-center gap-3 ml-2 transition-all duration-200",
            isScrolled
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1"
          )}
        >
          {spaceIcon && spaceTitle && (
            <>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: spaceColor }}
              >
                {IconComponent && (
                  <IconComponent size={14} className="text-white" />
                )}
              </div>
              <h2 className="text-sm">{spaceTitle}</h2>
            </>
          )}
        </div>
      </div>

      {/* Center section - Model selector */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {showModelSelector && (
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <span className="text-sm font-medium">{selectedModel}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Right section - Action buttons */}
      <div className="flex items-center gap-2 ml-auto relative z-10">
        {actions}
      </div>
    </div>
  );
};
