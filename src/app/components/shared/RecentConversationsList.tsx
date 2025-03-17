"use client";

import { useState, useEffect, useRef } from "react";
import { mockConversations } from "../../data/mockConversations";
import { ConversationList } from "./ConversationList";
import { ConversationFilterPills } from "./ConversationFilterPills";

interface RecentConversationsListProps {
  spaceConversations?: any[]; // You can replace this with the actual type of space conversations
  maxItems?: number;
}

export function RecentConversationsList({
  spaceConversations = [],
  maxItems = 10,
}: RecentConversationsListProps) {
  // State for selected space IDs for filtering
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<string[]>([]);
  // State for tracking if the filter area is sticky
  const [isSticky, setIsSticky] = useState(false);
  // Ref for the sticky header
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  // Ref for the container
  const containerRef = useRef<HTMLDivElement>(null);

  // Combine mock conversations and space conversations
  const allConversations = [...mockConversations, ...spaceConversations];

  // Filter conversations based on selected space IDs
  const filteredConversations =
    selectedSpaceIds.length > 0
      ? allConversations.filter(
          (convo) => convo.spaceId && selectedSpaceIds.includes(convo.spaceId)
        )
      : allConversations;

  // Limit the number of conversations to display
  const limitedConversations = filteredConversations.slice(0, maxItems);

  // Handle scroll to make filter pills sticky
  useEffect(() => {
    const handleScroll = () => {
      if (stickyHeaderRef.current && containerRef.current) {
        const { top } = containerRef.current.getBoundingClientRect();
        const headerHeight = 60; // Approximate header height
        setIsSticky(top < headerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="space-y-1">
      <h2 className="text-lg font-medium mb-2">Recent Conversations</h2>

      {/* Sticky container for filter pills */}
      <div
        ref={stickyHeaderRef}
        className={`${
          isSticky
            ? "sticky top-[60px] bg-white dark:bg-gray-900 z-10 py-2 shadow-sm"
            : ""
        }`}
      >
        <ConversationFilterPills
          selectedSpaceIds={selectedSpaceIds}
          onFilterChange={setSelectedSpaceIds}
        />
      </div>

      {/* Show message when no conversations match filter */}
      {limitedConversations.length === 0 && (
        <div className="py-4 text-center text-gray-500 dark:text-gray-400">
          No conversations found for the selected filters.
        </div>
      )}

      <ConversationList
        conversations={limitedConversations}
        variant="default"
      />
    </div>
  );
}
