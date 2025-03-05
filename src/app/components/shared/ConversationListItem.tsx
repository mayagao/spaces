"use client";

import { MessageCircle } from "lucide-react";
import { type Conversation } from "../../data/mockConversations";
import { cn } from "../../../lib/utils";

interface ConversationListItemProps {
  conversation: Conversation;
  variant?: "default" | "compact";
  onClick?: () => void;
}

export function ConversationListItem({
  conversation,
  variant = "default",
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg",
        "flex items-center gap-2",
        variant === "default" ? "text-base" : "text-sm"
      )}
    >
      {variant === "compact" && (
        <MessageCircle className="w-4 h-4 text-gray-500 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="truncate font-medium">{conversation.title}</div>
        {variant === "default" && (
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {conversation.lastMessage}
          </div>
        )}
      </div>
    </button>
  );
}
