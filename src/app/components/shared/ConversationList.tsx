"use client";

import { type Conversation } from "../../data/mockConversations";
import { ConversationListItem } from "./ConversationListItem";

interface ConversationListProps {
  conversations: Conversation[];
  variant?: "default" | "compact";
  onConversationSelect?: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  variant = "default",
  onConversationSelect,
}: ConversationListProps) {
  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          variant={variant}
          onClick={() => onConversationSelect?.(conversation)}
        />
      ))}
    </div>
  );
}
