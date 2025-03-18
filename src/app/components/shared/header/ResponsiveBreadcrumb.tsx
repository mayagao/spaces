"use client";

import { FC, useState, useRef, useEffect } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@primer/octicons-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { spaces, type Space } from "../../../data/spaces";
import { getIconComponent, type SpaceIcon } from "../../../lib/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSpaceConversations,
  spaceConversations,
} from "../../../data/spaceConversations";
import { mockConversations } from "../../../data/mockConversations";

interface BreadcrumbItem {
  text: string;
  href?: string;
  icon?: SpaceIcon;
  iconColor?: string;
  spaceId?: string;
}

interface ResponsiveBreadcrumbProps {
  title?: string;
  spaceIcon?: SpaceIcon;
  spaceColor?: string;
  pathname?: string;
}

export const ResponsiveBreadcrumb: FC<ResponsiveBreadcrumbProps> = ({
  title,
  spaceIcon,
  spaceColor,
  pathname: propPathname,
}) => {
  const pathname = propPathname || usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Check viewport width and update collapsed state
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Define breadcrumb items based on the current path
  const items: BreadcrumbItem[] = [];

  if (pathname === "/spaces") {
    items.push({ text: "Spaces", href: "/spaces" });
  } else if (pathname.startsWith("/spaces/")) {
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
  } else if (pathname.startsWith("/conversations/")) {
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

  // If no items, return null
  if (items.length === 0) {
    return null;
  }

  // Render collapsed breadcrumb (dropdown style)
  if (isCollapsed) {
    const lastItem = items[items.length - 1];
    const IconComponent = lastItem.icon
      ? getIconComponent(lastItem.icon)
      : null;

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="p-1 flex items-center gap-2 h-auto hover:bg-transparent"
          >
            {lastItem.icon && IconComponent && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: lastItem.iconColor }}
              >
                <IconComponent size={12} className="text-white" />
              </div>
            )}
            <span className="text-sm font-medium">{lastItem.text}</span>
            <ChevronDownIcon size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start" sideOffset={8}>
          <div className="flex flex-col space-y-1">
            <div className="text-xs text-gray-500 px-2 py-1">Navigate to</div>
            <Button
              variant="ghost"
              className="justify-start px-2 py-2 h-auto text-left"
              onClick={() => router.push("/")}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">Dashboard</span>
              </div>
            </Button>
            {items.map((item, index) => {
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
                    {item.icon && ItemIconComponent && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.iconColor }}
                      >
                        <ItemIconComponent size={12} className="text-white" />
                      </div>
                    )}
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
      {items.map((item, index) => {
        const ItemIconComponent = item.icon
          ? getIconComponent(item.icon)
          : null;

        return (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon size={16} className="mx-2 text-gray-500" />
            )}

            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-2 hover:underline"
              >
                {item.icon && ItemIconComponent && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: item.iconColor }}
                  >
                    <ItemIconComponent size={12} className="text-white" />
                  </div>
                )}
                <span
                  className={cn(
                    "text-sm",
                    index === items.length - 1 ? "font-semibold" : "font-medium"
                  )}
                >
                  {item.text}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {item.icon && ItemIconComponent && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: item.iconColor }}
                  >
                    <ItemIconComponent size={12} className="text-white" />
                  </div>
                )}
                <span
                  className={cn(
                    "text-sm",
                    index === items.length - 1 ? "font-semibold" : "font-medium"
                  )}
                >
                  {item.text}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
