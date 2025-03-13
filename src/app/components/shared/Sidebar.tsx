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
} from "@primer/octicons-react";
import { cn } from "../../../lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { spaceConversations } from "../../data/spaceConversations";

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

  // Get all conversations (memoized to avoid recalculation on every render)
  const allConversations = useMemo(() => getAllConversations(), []);

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
    <aside className="w-80 flex flex-col border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-52px)]">
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
          <Button variant="outline" className="w-8 h-8">
            <PencilIcon size={16} />
          </Button>
        </div>
      </div>

      {/* Services Section */}
      <div className="p-4 overflow-y-auto">
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
          <h2 className="ml-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            Recent Conversations
          </h2>
          <ConversationList
            conversations={allConversations}
            variant="default"
            activeConversationId={activeConversationId}
            onConversationSelect={handleConversationSelect}
          />
        </div>
      </div>

      {/* Settings - Sticky Bottom */}
      {/* <div className=" p-4 h-[100px] border-t border-gray-200 dark:border-gray-800">
        <Button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <GearIcon size={16} />
          <span className="text-sm">Settings</span>
        </Button>
      </div> */}
    </aside>
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
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Link>
  );
}
