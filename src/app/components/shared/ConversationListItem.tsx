"use client";

import { MessageCircle, Star } from "lucide-react";
import { type Conversation } from "../../data/mockConversations";
import { cn } from "../../../lib/utils";
import Link from "next/link";
import { getIconComponent } from "../../lib/icons";
import { spaces } from "../../data/spaces";

interface ConversationListItemProps {
  conversation: Conversation;
  variant?: "default" | "compact";
  isActive?: boolean;
  onClick?: () => void;
}

export function ConversationListItem({
  conversation,
  variant = "default",
  isActive = false,
  onClick,
}: ConversationListItemProps) {
  // Find the space if this conversation belongs to a space
  const space = conversation.spaceId
    ? spaces.find((s) => s.id === conversation.spaceId)
    : null;

  // Get the appropriate icon component for space conversations
  const SpaceIconComponent = space ? getIconComponent(space.icon) : null;

  return (
    <Link
      href={`/conversations/${conversation.id}`}
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg",
        "flex items-center gap-2",
        isActive
          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          : "text-gray-600 dark:text-gray-400",
        variant === "default" ? "text-base" : "text-sm"
      )}
    >
      {/* Display space icon for space conversations, or message circle for general conversations */}
      {/* {space ? (
        <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
          {SpaceIconComponent && (
            <SpaceIconComponent className="w-4 h-4 text-gray-500" />
          )}
        </div>
      ) : ( */}
      <div className="w-4 h-5 rounded-full flex items-center justify-center flex-shrink-0">
        <MessageCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      {/* )} */}
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm text-gray-800">
          {conversation.title}
        </div>
      </div>
    </Link>
  );
}
