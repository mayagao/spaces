"use client";

import { FC, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { getIconComponent, type SpaceIcon } from "../../lib/icons";
import { Button } from "@/components/ui/button";
import {
  PencilIcon,
  SidebarExpandIcon,
  SidebarCollapseIcon,
} from "@primer/octicons-react";

interface SecondaryHeaderProps {
  showModelSelector?: boolean;
  actions?: React.ReactNode;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  spaceIcon?: SpaceIcon;
  title?: string;
  spaceColor?: string;
  isScrolled: boolean;
  pathname?: string;
}

export const SecondaryHeader: FC<SecondaryHeaderProps> = ({
  showModelSelector = true,
  actions,
  sidebarCollapsed,
  onToggleSidebar,
  spaceIcon,
  title,
  spaceColor,
  isScrolled,
  pathname,
}) => {
  const [selectedModel] = useState("GPT-4o");
  const IconComponent = spaceIcon ? getIconComponent(spaceIcon) : null;

  return (
    <div className="h-[49px] flex items-center px-4 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-50">
      {/* Left section */}
      <div className="flex items-center gap-3 relative z-10">
        {sidebarCollapsed && (
          <>
            <Button
              variant="outline"
              className="w-8 h-8"
              onClick={onToggleSidebar}
            >
              <SidebarExpandIcon size={16} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={() => console.log("New")}
            >
              <PencilIcon size={16} />
            </Button>
          </>
        )}
        <div
          className={cn(
            "flex items-center gap-3 transition-all duration-200",
            isScrolled
              ? "opacity-100 translate-y-0"
              : "opacity-100 -translate-y-1"
          )}
        >
          {spaceIcon && (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: spaceColor }}
            >
              {IconComponent && (
                <IconComponent size={14} className="text-white" />
              )}
            </div>
          )}
          {title && <h2 className="text-sm font-medium mt-2">{title}</h2>}
        </div>
      </div>

      {/* Center section - Model selector */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {showModelSelector && (
          <button className="flex items-center gap-2 px-3 py-1.5 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
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
