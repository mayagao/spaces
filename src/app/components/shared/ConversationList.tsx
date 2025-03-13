"use client";

import { type Conversation } from "../../data/mockConversations";
import { ConversationListItem } from "./ConversationListItem";

interface ConversationListProps {
  conversations: Conversation[];
  variant?: "default" | "compact";
  activeConversationId?: string | null;
  onConversationSelect?: (conversation: Conversation) => void;
}

export function ConversationList({
  conversations,
  variant = "default",
  activeConversationId = null,
  onConversationSelect,
}: ConversationListProps) {
  return (
    <div>
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.id}
          conversation={conversation}
          variant={variant}
          isActive={activeConversationId === conversation.id}
          onClick={() => onConversationSelect?.(conversation)}
        />
      ))}
    </div>
  );
}
