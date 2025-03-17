import { CopilotIcon, LightBulbIcon } from "@primer/octicons-react";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { spaces, type Space } from "../../data/spaces";
import { getIconComponent } from "../../lib/icons";
import { cn } from "../../../lib/utils";
import { SpacePreview } from "./SpacePreview";

interface SpaceSelectorProps {
  selectedSpace: Space | null;
  onSelectSpace: (space: Space | null) => void;
  className?: string;
}

export function SpaceSelector({
  selectedSpace,
  onSelectSpace,
  className,
}: SpaceSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [previewSpace, setPreviewSpace] = useState<Space | null>(null);
  const [showSpacePreview, setShowSpacePreview] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeDropdownItemRef = useRef<HTMLElement | null>(null);

  // Handle mouse enter for dropdown item
  const handleDropdownItemMouseEnter = (
    space: Space,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    setPreviewSpace(space);
    activeDropdownItemRef.current = event.currentTarget;

    previewTimeoutRef.current = setTimeout(() => {
      setShowSpacePreview(true);
    }, 300);
  };

  // Handle mouse leave for dropdown item
  const handleDropdownItemMouseLeave = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
    }

    previewTimeoutRef.current = setTimeout(() => {
      setShowSpacePreview(false);
    }, 500);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
        setShowSpacePreview(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("relative dropdown-container", className)}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
          setShowSpacePreview(false);
        }}
        ref={buttonRef}
        className={cn(
          "rounded-lg text-sm flex items-center gap-2 transition-colors",
          isDropdownOpen ? "text-gray-900" : ""
        )}
      >
        {selectedSpace ? (
          <>
            {/* <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: selectedSpace.color }}
            >
              {(() => {
                const SpaceIcon = getIconComponent(selectedSpace.icon);
                return (
                  SpaceIcon && <SpaceIcon className="w-3 h-3 text-white" />
                );
              })()}
            </div> */}
            <span className="text-gray-900 dark:text-white">
              {selectedSpace.title}
            </span>
          </>
        ) : (
          <span className="text-gray-700 dark:text-gray-300">
            Choose a space
          </span>
        )}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-400 transition-transform",
            isDropdownOpen && "transform rotate-180"
          )}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-64 z-[100] py-1">
          {/* Default Copilot option */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectSpace(null);
              setIsDropdownOpen(false);
            }}
            className={cn(
              "w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800",
              !selectedSpace ? "bg-gray-50 dark:bg-gray-800" : ""
            )}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center">
              <CopilotIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm">Default Copilot</span>
          </button>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          {/* Spaces list */}
          {spaces.map((space) => {
            const SpaceIcon = getIconComponent(space.icon);
            const isSelected = selectedSpace?.id === space.id;

            return (
              <button
                key={space.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpacePreview(false);
                  if (previewTimeoutRef.current) {
                    clearTimeout(previewTimeoutRef.current);
                  }
                  onSelectSpace(space);
                  setIsDropdownOpen(false);
                }}
                onMouseEnter={(e) => handleDropdownItemMouseEnter(space, e)}
                onMouseLeave={handleDropdownItemMouseLeave}
                className={cn(
                  "w-full px-3 py-2 flex items-center gap-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800",
                  isSelected ? "bg-gray-50 dark:bg-gray-800" : ""
                )}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: space.color }}
                >
                  {SpaceIcon && <SpaceIcon className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm">{space.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Space Preview Popover */}
      {previewSpace && showSpacePreview && (
        <SpacePreview
          space={previewSpace}
          isOpen={showSpacePreview}
          onClose={() => setShowSpacePreview(false)}
          anchorRef={activeDropdownItemRef}
          position="right"
        />
      )}
    </div>
  );
}
