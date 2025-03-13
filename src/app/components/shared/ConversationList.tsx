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
  // Sort conversations by timestamp in descending order (newest first)
  const sortedConversations = [...conversations].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div>
      {sortedConversations.map((conversation) => (
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
