"use client";

import {
  mockConversations,
  type Conversation,
} from "../../data/mockConversations";
import { ConversationList } from "./ConversationList";
import {
  HomeIcon,
  PencilIcon,
  StarIcon,
  SidebarCollapseIcon,
  ZapIcon,
  XIcon,
} from "@primer/octicons-react";
import { cn } from "../../../lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useRef, useEffect } from "react";
import { spaceConversations } from "../../data/spaceConversations";
import { ConversationFilterPills } from "./ConversationFilterPills";
import { useSidebar } from "../../contexts/SidebarContext";

// Helper function to get all conversations (mock + space-specific)
function getAllConversations(): Conversation[] {
  // Start with the mock conversations
  const allConversations = [...mockConversations];

  // Add space-specific conversations
  for (const spaceId in spaceConversations) {
    const spaceConvos = spaceConversations[spaceId];
    // Add spaceId to conversations if not already set
    const conversationsWithSpaceId = spaceConvos.map((convo) =>
      convo.spaceId ? convo : { ...convo, spaceId }
    );
    allConversations.push(...conversationsWithSpaceId);
  }

  // Sort by timestamp (newest first)
  return allConversations.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Get the isFloatingSidebar value from context
  const { isFloatingSidebar } = useSidebar();
  // State for selected space ID for filtering (single selection)
  const [selectedSpaceIds, setSelectedSpaceIds] = useState<string[]>([]);
  // State for tracking if the filter area is sticky
  const [isSticky, setIsSticky] = useState(false);
  // Ref for the sticky header
  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  // Ref for the observer sentinel
  const observerRef = useRef<HTMLDivElement>(null);
  // Ref for the container
  const containerRef = useRef<HTMLDivElement>(null);

  // Get all conversations (memoized to avoid recalculation on every render)
  const allConversations = useMemo(() => getAllConversations(), []);

  // Filter conversations based on selected space ID (single selection)
  const filteredConversations = useMemo(() => {
    if (selectedSpaceIds.length === 0) {
      return allConversations;
    }
    const selectedSpaceId = selectedSpaceIds[0]; // Only one space can be selected
    return allConversations.filter(
      (convo) => convo.spaceId === selectedSpaceId
    );
  }, [allConversations, selectedSpaceIds]);

  // Use IntersectionObserver to detect when the header should be sticky
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel is not intersecting, the header should be sticky
        setIsSticky(!entry.isIntersecting);
      },
      {
        // The root is the scrollable container
        root: document.querySelector(".sidebar-scroll-container"),
        // The threshold is 0, meaning as soon as even 1px is visible, we consider it intersecting
        threshold: 0,
        // The rootMargin is negative the height of the header, so we trigger when the header would be at the top
        rootMargin: "-52px 0px 0px 0px",
      }
    );

    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (collapsed) {
    return null; // Don't render the sidebar when collapsed
  }

  // Extract conversation ID from the pathname if we're on a conversation page
  const conversationMatch = pathname.match(/\/conversations\/([^\/]+)/);
  const activeConversationId = conversationMatch ? conversationMatch[1] : null;

  const handleConversationSelect = (conversation: Conversation) => {
    console.log("Navigating to conversation:", conversation.id);
    router.push(`/conversations/${conversation.id}`);
  };

  return (
    <>
      {/* Add a backdrop overlay when sidebar is floating and not collapsed */}
      {isFloatingSidebar && !collapsed && (
        <div
          className="fixed inset-0 lg:hidden"
          onClick={onToggleCollapse}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "flex flex-col  border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-62px)]",
          isFloatingSidebar
            ? "fixed left-0 top-[62px] z-50 w-80 shadow-lg bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out"
            : "w-80",
          isFloatingSidebar && collapsed && "-translate-x-full"
        )}
        style={{
          zIndex: isFloatingSidebar ? 999 : 1,
        }}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 py-2">
            <Button
              variant="outline"
              className="w-8 h-8"
              onClick={onToggleCollapse}
            >
              <SidebarCollapseIcon size={16} />
            </Button>
            <Button
              variant="outline"
              className="w-8 h-8"
              onClick={() => router.push("/")}
              title="New conversation"
            >
              <PencilIcon size={16} />
            </Button>
          </div>
        </div>

        {/* Services Section */}
        <div
          className="p-4 overflow-y-auto sidebar-scroll-container"
          ref={containerRef}
        >
          <div className="mb-4">
            <nav className="">
              <NavItem
                icon={HomeIcon}
                label="Home"
                href="/"
                isActive={pathname === "/"}
              />
              <NavItem
                icon={StarIcon}
                label="Spaces"
                href="/spaces"
                isActive={
                  pathname === "/spaces" || pathname.startsWith("/spaces/")
                }
              />
              <NavItem
                icon={ZapIcon}
                label="Pipies"
                href="/pipes"
                isActive={pathname === "/pipes"}
              />
            </nav>
          </div>

          {/* Conversations Section */}
          <div>
            {/* Observer sentinel - placed right before the filter */}
            <div ref={observerRef} className="h-0 w-full" />

            {/* Sticky container for filter pills */}
            <div
              ref={stickyHeaderRef}
              className={cn(
                "bg-white dark:bg-gray-900 z-10",
                isSticky && "sticky -top-4 -mx-4 px-4 py-2"
              )}
            >
              <ConversationFilterPills
                selectedSpaceIds={selectedSpaceIds}
                onFilterChange={setSelectedSpaceIds}
              />
            </div>

            {/* Show message when no conversations match filter */}
            {filteredConversations.length === 0 && (
              <div className="py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No conversations found for the selected filter.
              </div>
            )}

            <ConversationList
              conversations={filteredConversations}
              variant="default"
              activeConversationId={activeConversationId}
              onConversationSelect={handleConversationSelect}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  isActive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-3 py-2 w-full rounded-lg",
        isActive
          ? "bg-gray-100 font-medium dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-400"
      )}
    >
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
