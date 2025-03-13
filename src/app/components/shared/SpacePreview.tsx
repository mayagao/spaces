"use client";

import { useState, useRef, useEffect } from "react";
import { PencilIcon, PlusIcon } from "lucide-react";
import { type Space } from "../../data/spaces";
import { getIconComponent } from "../../lib/icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SpacePreviewProps {
  space: Space;
  isOpen: boolean;
  onClose: () => void;
  anchorRef: { current: HTMLElement | null };
  position?: "right" | "below"; // Add position prop with default to right
}

export function SpacePreview({
  space,
  isOpen,
  onClose,
  anchorRef,
  position = "right", // Default to right positioning
}: SpacePreviewProps) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [coordinates, setCoordinates] = useState({ top: 0, left: 0 });
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hoverIntentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update position based on anchor element
  useEffect(() => {
    if (isOpen && anchorRef.current && previewRef.current) {
      const updatePosition = () => {
        const anchorRect = anchorRef.current?.getBoundingClientRect();
        if (!anchorRect) return;

        if (position === "below") {
          // Position below the anchor
          const top = anchorRect.bottom + 8;
          // Center horizontally with the anchor
          const left =
            anchorRect.left +
            anchorRect.width / 2 -
            (previewRef.current?.offsetWidth || 0) / 2;

          setCoordinates({ top, left });
        } else {
          // Position to the right of the anchor
          const top = anchorRect.top;
          const left = anchorRect.right + 8;

          setCoordinates({ top, left });
        }
      };

      updatePosition();
      // Update position on resize
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, anchorRef, position]);

  // Handle mouse enter/leave for the preview itself
  const handlePreviewMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (hoverIntentTimeoutRef.current) {
      clearTimeout(hoverIntentTimeoutRef.current);
      hoverIntentTimeoutRef.current = null;
    }
  };

  const handlePreviewMouseLeave = () => {
    // Use a longer timeout to make it more forgiving
    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 500);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (hoverIntentTimeoutRef.current) {
        clearTimeout(hoverIntentTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const SpaceIcon = getIconComponent(space.icon);

  return (
    <div
      ref={previewRef}
      className="fixed bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 w-72 z-[100] p-4"
      style={{
        top: `${coordinates.top}px`,
        left: `${coordinates.left}px`,
        maxWidth: "calc(100vw - 32px)",
      }}
      onMouseEnter={handlePreviewMouseEnter}
      onMouseLeave={handlePreviewMouseLeave}
    >
      {/* Space header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: space.color }}
        >
          {SpaceIcon && <SpaceIcon className="w-5 h-5 text-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
            {space.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{space.id}</p>
        </div>
      </div>

      {/* Space description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
        {space.description || "No description available for this space."}
      </p>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 flex items-center gap-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            router.push(`/?spaceId=${space.id}`);
          }}
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>New Conversation</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <PencilIcon className="w-3.5 h-3.5" />
          <span>Edit</span>
        </Button>
      </div>
    </div>
  );
}
