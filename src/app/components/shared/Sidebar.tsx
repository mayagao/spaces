"use client";

import { mockConversations } from "../../data/mockConversations";
import { ConversationList } from "./ConversationList";
import {
  ChevronLeftIcon,
  HomeIcon,
  PlusIcon,
  GearIcon,
  StarIcon,
  ZapIcon,
} from "@primer/octicons-react";
import { cn } from "../../../lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  if (collapsed) {
    return null; // Don't render the sidebar when collapsed
  }

  return (
    <aside className="w-80 flex flex-col border-r border-gray-200 dark:border-gray-800 h-screen">
      {/* Header - Sticky */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <ChevronLeftIcon size={20} />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90">
            <PlusIcon size={16} />
            <span className="text-sm font-medium">New</span>
          </button>
        </div>
      </div>

      {/* Services Section */}
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Services
          </h2>
          <nav className="space-y-1">
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
              isActive={pathname === "/spaces"}
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
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Recent Conversations
          </h2>
          <ConversationList
            conversations={mockConversations}
            variant="default"
            onConversationSelect={(conversation) => {
              console.log("Selected conversation:", conversation);
            }}
          />
        </div>
      </div>

      {/* Settings - Sticky Bottom */}
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
        <button className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <GearIcon size={16} />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  isActive,
}: {
  icon: any;
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
          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
