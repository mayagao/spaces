"use client";

import { FC, useEffect, useState } from "react";
import { ChevronRightIcon } from "@primer/octicons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { mockConversations } from "../../../data/mockConversations";
import { spaceConversations } from "../../../data/spaceConversations";
import { spaces } from "../../../data/spaces";
import { getIconComponent, type SpaceIcon } from "../../../lib/icons";

interface BreadcrumbItemProps {
  text: string;
  href?: string;
  isLast: boolean;
  icon?: SpaceIcon;
  iconColor?: string;
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({
  text,
  href,
  isLast,
  icon,
  iconColor,
}) => {
  const IconComponent = icon ? getIconComponent(icon) : null;

  const content = (
    <div className="flex items-center gap-2">
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
  }> = [{ text: "Copilot", href: "/" }];

  if (pathname === "/spaces") {
    items.push({ text: "Spaces", href: "/spaces" });
  } else if (pathname.startsWith("/spaces/") && spaceTitle) {
    items.push({ text: "Spaces", href: "/spaces" });
    items.push({
      text: spaceTitle,
      icon: spaceIcon || undefined,
      iconColor: spaceColor || undefined,
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
        />
      ))}
    </div>
  );
};
