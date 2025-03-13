"use client";

import { MessageCircle } from "lucide-react";
import { type Conversation } from "../../data/mockConversations";
import { cn } from "../../../lib/utils";
import Link from "next/link";

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
      {variant === "compact" && (
        <MessageCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm">{conversation.title}</div>
      </div>
    </Link>
  );
}
