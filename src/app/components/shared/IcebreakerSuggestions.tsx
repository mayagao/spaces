import { LightBulbIcon } from "@primer/octicons-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { spaces, type Space, type Icebreaker } from "../../data/spaces";
import { getIconComponent } from "../../lib/icons";
import { cn } from "../../../lib/utils";
import { SpacePreview } from "./SpacePreview";
import {
  BookIcon,
  IssueOpenedIcon,
  ClockIcon,
  GitBranchIcon,
  CodeIcon,
  LinkIcon,
} from "@primer/octicons-react";

interface IcebreakerSuggestionsProps {
  onSelect: (prompt: string) => void;
  selectedSpace: Space | null;
}

// Helper function to get the icon component for an icebreaker
function getIcebreakerIcon(icon: Icebreaker["icon"]) {
  switch (icon) {
    case "book":
      return BookIcon;
    case "issue":
      return IssueOpenedIcon;
    case "clock":
      return ClockIcon;
    case "git-branch":
      return GitBranchIcon;
    case "code":
      return CodeIcon;
    case "link":
      return LinkIcon;
  }
}

// Default icebreakers when no space is selected
const defaultIcebreakers: Icebreaker[] = [
  {
    label: "Share Technical Challenge",
    prompt:
      "What's the most challenging technical problem you've solved recently?",
    icon: "issue",
  },
  {
    label: "Discuss Current Project",
    prompt: "Tell me about a project you're excited about.",
    icon: "code",
  },
  {
    label: "Explore Learning Goals",
    prompt: "What's a concept or technology you'd like to understand better?",
    icon: "book",
  },
  {
    label: "Debug Complex Issue",
    prompt: "What's a tricky bug you've encountered and how did you solve it?",
    icon: "issue",
  },
  {
    label: "Review System Architecture",
    prompt: "Can you walk me through your current system architecture?",
    icon: "git-branch",
  },
];

export function IcebreakerSuggestions({
  onSelect,
  selectedSpace,
}: IcebreakerSuggestionsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [previewSpace, setPreviewSpace] = useState<Space | null>(null);
  const [showSpacePreview, setShowSpacePreview] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeDropdownItemRef = useRef<HTMLElement | null>(null);

  // Get current icebreakers based on selected space
  const currentIcebreakers = selectedSpace
    ? selectedSpace.icebreakers
    : defaultIcebreakers;

  // Handle selecting a space
  const handleSelectSpace = (space: Space | null) => {
    setIsDropdownOpen(false);
  };

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
    <div className="flex flex-col items-center justify-center h-full max-w-[800px] mx-auto px-8">
      {/* Space Selector */}

      {/* Copilot Icon */}
      <div
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center mb-4",
          selectedSpace ? "bg-opacity-10" : "bg-gray-100 dark:bg-gray-800"
        )}
        style={
          selectedSpace ? { backgroundColor: selectedSpace.color } : undefined
        }
      >
        {selectedSpace ? (
          (() => {
            const SpaceIcon = getIconComponent(selectedSpace.icon);
            return SpaceIcon && <SpaceIcon size={32} className="text-white" />;
          })()
        ) : (
          <LightBulbIcon
            size={32}
            className="text-gray-500 dark:text-gray-400"
          />
        )}
      </div>

      {selectedSpace && (
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
          {selectedSpace.title}
        </h2>
      )}
      {selectedSpace && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
          {selectedSpace.description}
        </p>
      )}

      {/* Icebreaker buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {currentIcebreakers.map((icebreaker, index) => {
          const IcebreakIcon = getIcebreakerIcon(icebreaker.icon);
          return (
            <Button
              key={index}
              variant="outline"
              className="flex items-center gap-2 h-auto rounded-full px-6 py-2 whitespace-normal hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => onSelect(icebreaker.prompt)}
            >
              <IcebreakIcon
                size={16}
                className="text-gray-500 dark:text-gray-400 flex-shrink-0"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {icebreaker.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
