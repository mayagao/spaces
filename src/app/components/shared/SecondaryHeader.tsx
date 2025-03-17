"use client";

import { FC, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { getIconComponent, type SpaceIcon } from "../../lib/icons";
import { Button } from "@/components/ui/button";
import { PencilIcon, SidebarExpandIcon } from "@primer/octicons-react";
import { SpaceSelector } from "./SpaceSelector";
import { type Space } from "../../data/spaces";
import { useRouter, usePathname } from "next/navigation";
import ReusableBreadcrumb from "./header/ReusableBreadcrumb";

interface SecondaryHeaderProps {
  showModelSelector?: boolean;
  showSpaceSelector?: boolean;
  selectedSpace?: Space | null;
  onSelectSpace?: (space: Space | null) => void;
  actions?: React.ReactNode;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  spaceIcon?: SpaceIcon;
  title?: string;
  spaceColor?: string;
  isScrolled: boolean;
}

export const SecondaryHeader: FC<SecondaryHeaderProps> = ({
  showModelSelector = true,
  showSpaceSelector = false,
  selectedSpace = null,
  onSelectSpace,
  actions,
  sidebarCollapsed,
  onToggleSidebar,
  spaceIcon,
  title,
  spaceColor,
  isScrolled,
}) => {
  const [selectedModel] = useState("GPT-4o");
  const router = useRouter();
  const pathname = usePathname();

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
              onClick={() => router.push("/")}
              title="New conversation"
            >
              <PencilIcon size={16} />
            </Button>
          </>
        )}

        {showSpaceSelector && onSelectSpace ? (
          // Case 1: Empty conversation - show current selector
          <SpaceSelector
            selectedSpace={selectedSpace}
            onSelectSpace={onSelectSpace}
          />
        ) : (
          // Cases 2-5: Show appropriate breadcrumb based on path
          <ReusableBreadcrumb
            title={title}
            spaceIcon={spaceIcon}
            spaceColor={spaceColor}
            showCopilot={false}
          />
        )}
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
