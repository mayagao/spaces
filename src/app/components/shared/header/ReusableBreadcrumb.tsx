"use client";

import { FC, useState, useRef, useEffect } from "react";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  HomeIcon,
  StarIcon,
} from "@primer/octicons-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { spaces } from "../../../data/spaces";
import { getIconComponent, type SpaceIcon } from "../../../lib/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { spaceConversations } from "../../../data/spaceConversations";
import { mockConversations } from "../../../data/mockConversations";
import { SpacePreview } from "../SpacePreview";

export interface BreadcrumbItem {
  text: string;
  href?: string;
  icon?: SpaceIcon;
  iconColor?: string;
  spaceId?: string;
}

export interface ReusableBreadcrumbProps {
  title?: string;
  spaceIcon?: SpaceIcon;
  spaceColor?: string;
  pathname?: string;
  displayMode?: "full" | "responsive" | "last-only";
  copilotName?: string;
  showCopilot?: boolean;
}

interface BreadcrumbItemComponentProps {
  item: BreadcrumbItem;
  isLast: boolean;
  onNavigate?: () => void;
}

const BreadcrumbItemComponent: FC<BreadcrumbItemComponentProps> = ({
  item,
  isLast,
  onNavigate,
}) => {
  const IconComponent = item.icon ? getIconComponent(item.icon) : null;
  const [showSpacePreview, setShowSpacePreview] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  // Check if we're on a space detail page
  const isSpaceDetailPage = item.spaceId
    ? pathname.startsWith(`/spaces/${item.spaceId}`)
    : false;

  // Handle mouse enter to show space preview
  const handleMouseEnter = () => {
    if (item.spaceId && !isSpaceDetailPage) {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
      previewTimeoutRef.current = setTimeout(() => {
        setShowSpacePreview(true);
      }, 500);
    }
  };

  // Handle mouse leave to hide space preview
  const handleMouseLeave = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
    setShowSpacePreview(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
    };
  }, []);

  const content = (
    <div
      ref={itemRef}
      className="flex items-center gap-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.icon && IconComponent && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: item.iconColor }}
        >
          <div className="h-[12px] w-[12px] flex items-center justify-center">
            <IconComponent className="text-white h-full w-full" />
          </div>
        </div>
      )}
      <span
        className={cn(
          "text-sm font-medium text-gray-700 truncate",
          // If it's a conversation title and not part of a space (no icon), give it more width
          item.icon ? "max-w-[160px]" : "max-w-[240px]",
          isLast && "text-gray-800"
        )}
      >
        {item.text}
      </span>

      {/* Space Preview Popover */}
      {item.spaceId && showSpacePreview && !isSpaceDetailPage && (
        <SpacePreview
          space={spaces.find((s) => s.id === item.spaceId)!}
          isOpen={showSpacePreview}
          onClose={() => setShowSpacePreview(false)}
          anchorRef={itemRef}
          position="below"
        />
      )}
    </div>
  );

  const handleClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <>
      {item.href ? (
        <Link href={item.href} onClick={handleClick}>
          {content}
        </Link>
      ) : (
        content
      )}
      {!isLast && <ChevronRightIcon size={16} className="mx-2 text-gray-400" />}
    </>
  );
};

export const ReusableBreadcrumb: FC<ReusableBreadcrumbProps> = ({
  title,
  spaceIcon,
  spaceColor,
  pathname: propPathname,
  displayMode = "responsive",
  copilotName = "Copilot",
  showCopilot = true,
}) => {
  const pathname = propPathname || usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Check viewport width and update collapsed state
  useEffect(() => {
    if (displayMode === "responsive") {
      const handleResize = () => {
        setIsCollapsed(window.innerWidth < 1024);
      };

      // Set initial state
      handleResize();

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    } else {
      setIsCollapsed(displayMode === "last-only");
    }
  }, [displayMode]);

  // Define breadcrumb items based on the current path
  const items: BreadcrumbItem[] = [];

  // Only add Copilot as the first item if showCopilot is true
  if (showCopilot) {
    items.push({ text: copilotName, href: "/" });
  }

  // Empty conversation state
  if (pathname === "/") {
    // If it's an empty conversation, add nothing more
  }
  // Space listings state
  else if (pathname === "/spaces") {
    items.push({ text: "Spaces", href: "/spaces" });
  }
  // Space detail or space conversation state
  else if (pathname.startsWith("/spaces/")) {
    const spaceId = pathname.split("/")[2]; // Get space ID from URL
    const space = spaces.find((s) => s.id === spaceId);

    items.push({ text: "Spaces", href: "/spaces" });

    if (space) {
      items.push({
        text: space.title,
        href: `/spaces/${space.id}`,
        icon: space.icon,
        iconColor: space.color,
        spaceId: space.id,
      });
    }

    // If there's a conversation (deeper path)
    if (pathname.split("/").length > 3) {
      const conversationTitle = title || "Conversation";
      items.push({
        text: conversationTitle,
      });
    }
  }
  // Non-space conversation state
  else if (pathname.startsWith("/conversations/")) {
    const conversationId = pathname.split("/")[2];

    // Try to find the conversation to get its space
    let foundConversation = mockConversations.find(
      (c) => c.id === conversationId
    );

    // If not found in mockConversations, search in spaceConversations
    if (!foundConversation) {
      for (const spaceId in spaceConversations) {
        const spaceConvos = spaceConversations[spaceId];
        const found = spaceConvos.find((c) => c.id === conversationId);
        if (found) {
          foundConversation = { ...found, spaceId };
          break;
        }
      }
    }

    // If we found the conversation and it belongs to a space
    if (foundConversation?.spaceId) {
      const space = spaces.find((s) => s.id === foundConversation?.spaceId);

      items.push({ text: "Spaces", href: "/spaces" });

      if (space) {
        items.push({
          text: space.title,
          href: `/spaces/${space.id}`,
          icon: space.icon,
          iconColor: space.color,
          spaceId: space.id,
        });
      }

      items.push({
        text: foundConversation.title || title || "Conversation",
      });
    } else {
      // If conversation doesn't belong to a space or wasn't found
      items.push({ text: title || "Conversation" });
    }
  } else if (pathname === "/pipes") {
    items.push({ text: "Pipes", href: "/pipes" });
  }

  // If no items (besides possibly Copilot), return null
  if (items.length === (showCopilot ? 1 : 0)) {
    return null;
  }

  // For last-only display mode or collapsed responsive mode
  if (isCollapsed) {
    // Get the last item, or if only Copilot is present and we should show it, use Copilot
    const lastItem = items[items.length - 1];

    // For conversations that are part of a space, show the space icon alongside conversation title
    let iconToShow = lastItem.icon;
    let iconColorToShow = lastItem.iconColor;

    // If this is a conversation in a space and the last item doesn't have an icon
    // (i.e., it's the conversation title), look for the space icon from previous items
    if (
      pathname.startsWith("/conversations/") ||
      (pathname.startsWith("/spaces/") && pathname.split("/").length > 3)
    ) {
      if (!lastItem.icon) {
        // Find the space item (should be the item before the last if this is a space conversation)
        const spaceItem = items.find((item) => item.spaceId && item.icon);
        if (spaceItem) {
          iconToShow = spaceItem.icon;
          iconColorToShow = spaceItem.iconColor;
        }
      }
    }

    const IconComponent = iconToShow ? getIconComponent(iconToShow) : null;

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="p-1 flex items-center gap-2 h-auto hover:bg-gray-100"
          >
            {IconComponent && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconColorToShow }}
              >
                <IconComponent
                  style={{ width: 12 }}
                  className="text-white flex-grow-0"
                />
              </div>
            )}
            <span className="text-sm font-medium text-gray-800">
              {lastItem.text}
            </span>
            <ChevronDownIcon size={16} className="text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start" sideOffset={8}>
          <div className="flex flex-col">
            <div className="text-xs text-gray-500 px-2 py-1">Navigate to</div>
            <Button
              variant="ghost"
              className="justify-start px-2 py-2 h-auto text-left"
              onClick={() => {
                router.push("/");
                setIsOpen(false);
              }}
            >
              <div className="flex items-center gap-2">
                <HomeIcon size={14} className="text-gray-500 mx-0.5" />
                <span className="text-sm">Dashboard</span>
              </div>
            </Button>
            {items
              .filter((item) => item.href)
              .map((item, index) => {
                // Use the space icon if it exists, otherwise check if it's a Spaces link
                const isSpacesLink =
                  item.text === "Spaces" && item.href === "/spaces";
                const ItemIconComponent = item.icon
                  ? getIconComponent(item.icon)
                  : null;

                return (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start px-2 py-2 h-auto text-left"
                    onClick={() => {
                      if (item.href) {
                        router.push(item.href);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && ItemIconComponent ? (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: item.iconColor }}
                        >
                          <ItemIconComponent
                            style={{ width: 12 }}
                            className="text-white flex-grow-0"
                          />
                        </div>
                      ) : isSpacesLink ? (
                        <StarIcon size={16} className="text-gray-500 mx-0.5" />
                      ) : null}
                      <span className="text-sm">{item.text}</span>
                    </div>
                  </Button>
                );
              })}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Render full breadcrumb
  return (
    <div className="flex items-center">
      {items.map((item, index) => (
        <BreadcrumbItemComponent
          key={index}
          item={item}
          isLast={index === items.length - 1}
          onNavigate={() => setIsOpen(false)}
        />
      ))}
    </div>
  );
};

export default ReusableBreadcrumb;
