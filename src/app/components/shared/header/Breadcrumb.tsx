"use client";

import { FC, useEffect, useState, useRef } from "react";
import { ChevronRightIcon } from "@primer/octicons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { mockConversations } from "../../../data/mockConversations";
import { spaceConversations } from "../../../data/spaceConversations";
import { spaces, type Space } from "../../../data/spaces";
import { getIconComponent, type SpaceIcon } from "../../../lib/icons";
import { SpacePreview } from "../SpacePreview";

interface BreadcrumbItemProps {
  text: string;
  href?: string;
  isLast: boolean;
  icon?: SpaceIcon;
  iconColor?: string;
  spaceId?: string;
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({
  text,
  href,
  isLast,
  icon,
  iconColor,
  spaceId,
}) => {
  const IconComponent = icon ? getIconComponent(icon) : null;
  const [showSpacePreview, setShowSpacePreview] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const space = spaceId ? spaces.find((s) => s.id === spaceId) : null;

  // Handle mouse enter to show space preview
  const handleMouseEnter = () => {
    if (space) {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
      // Add a small delay to prevent flickering on quick mouse movements
      previewTimeoutRef.current = setTimeout(() => {
        setShowSpacePreview(true);
      }, 300);
    }
  };

  // Handle mouse leave to hide space preview
  const handleMouseLeave = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }

    // Add a delay before hiding to allow moving to the preview
    previewTimeoutRef.current = setTimeout(() => {
      setShowSpacePreview(false);
    }, 300);
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
      {icon && IconComponent && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          <IconComponent size={12} className="text-white" />
        </div>
      )}
      <span
        className={`text-sm ${
          isLast ? "font-semibold text-gray-800" : "font-medium text-gray-700"
        }`}
      >
        {text}
      </span>

      {/* Space Preview Popover */}
      {space && showSpacePreview && (
        <SpacePreview
          space={space}
          isOpen={showSpacePreview}
          onClose={() => setShowSpacePreview(false)}
          anchorRef={itemRef}
          position="below"
        />
      )}
    </div>
  );

  return (
    <>
      {href ? <Link href={href}>{content}</Link> : content}
      {!isLast && <ChevronRightIcon size={16} className="mx-2 text-fg-muted" />}
    </>
  );
};

export const Breadcrumb: FC = () => {
  const pathname = usePathname();
  const [conversationSpaceId, setConversationSpaceId] = useState<string | null>(
    null
  );
  const [spaceTitle, setSpaceTitle] = useState<string | null>(null);
  const [spaceIcon, setSpaceIcon] = useState<SpaceIcon | null>(null);
  const [spaceColor, setSpaceColor] = useState<string | null>(null);

  useEffect(() => {
    // Get conversation info if on a conversation page
    const conversationMatch = pathname.match(/\/conversations\/([^\/]+)/);
    if (conversationMatch) {
      const conversationId = conversationMatch[1];

      // First, try to find the conversation in mockConversations
      let foundConversation = mockConversations.find(
        (c) => c.id === conversationId
      );

      // If not found, check all space conversations
      if (!foundConversation) {
        // Check each space's conversations
        for (const spaceId in spaceConversations) {
          const spaceConvos = spaceConversations[spaceId];
          const found = spaceConvos.find((c) => c.id === conversationId);
          if (found) {
            foundConversation = found;
            // Set the spaceId if it's not already set
            if (!foundConversation.spaceId) {
              foundConversation = {
                ...foundConversation,
                spaceId: spaceId,
              };
            }
            break;
          }
        }
      }

      if (foundConversation) {
        setConversationSpaceId(foundConversation.spaceId || null);

        // If conversation belongs to a space, get the space details
        if (foundConversation.spaceId) {
          const space = spaces.find((s) => s.id === foundConversation?.spaceId);
          setSpaceTitle(space?.title || null);
          setSpaceIcon(space?.icon || null);
          setSpaceColor(space?.color || null);
        } else {
          setSpaceTitle(null);
          setSpaceIcon(null);
          setSpaceColor(null);
        }
      } else {
        setConversationSpaceId(null);
        setSpaceTitle(null);
        setSpaceIcon(null);
        setSpaceColor(null);
      }
    } else {
      setConversationSpaceId(null);

      // Get space details if on a space page
      const spaceMatch = pathname.match(/\/spaces\/([^\/]+)/);
      if (spaceMatch) {
        const spaceId = spaceMatch[1];
        const space = spaces.find((s) => s.id === spaceId);
        if (space) {
          setSpaceTitle(space.title);
          setSpaceIcon(space.icon);
          setSpaceColor(space.color);
        } else {
          setSpaceTitle(`Space ${spaceId}`);
          setSpaceIcon(null);
          setSpaceColor(null);
        }
      } else {
        setSpaceTitle(null);
        setSpaceIcon(null);
        setSpaceColor(null);
      }
    }
  }, [pathname]);

  // Define breadcrumb items based on the current path
  const items: Array<{
    text: string;
    href?: string;
    icon?: SpaceIcon;
    iconColor?: string;
    spaceId?: string;
  }> = [{ text: "Copilot", href: "/" }];

  if (pathname === "/spaces") {
    items.push({ text: "Spaces", href: "/spaces" });
  } else if (pathname.startsWith("/spaces/") && spaceTitle) {
    const spaceId = pathname.split("/")[2]; // Get space ID from URL
    items.push({ text: "Spaces", href: "/spaces" });
    items.push({
      text: spaceTitle,
      icon: spaceIcon || undefined,
      iconColor: spaceColor || undefined,
      spaceId: spaceId,
    });
  } else if (pathname === "/pipes") {
    items.push({ text: "Pipies", href: "/pipes" });
  } else if (pathname.startsWith("/conversations/")) {
    // If this conversation belongs to a space, show the space in the breadcrumb
    if (conversationSpaceId && spaceTitle) {
      items.push({ text: "Spaces", href: "/spaces" });
      items.push({
        text: spaceTitle,
        href: `/spaces/${conversationSpaceId}`,
        icon: spaceIcon || undefined,
        iconColor: spaceColor || undefined,
        spaceId: conversationSpaceId,
      });
    }
  }

  return (
    <div className="flex items-center">
      {items.map((item, index) => (
        <BreadcrumbItem
          key={index}
          text={item.text}
          href={item.href}
          isLast={index === items.length - 1}
          icon={item.icon}
          iconColor={item.iconColor}
          spaceId={item.spaceId}
        />
      ))}
    </div>
  );
};
