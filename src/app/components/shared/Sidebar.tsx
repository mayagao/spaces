"use client";

import { mockConversations } from "../../data/mockConversations";
import { ConversationList } from "./ConversationList";
import { ChevronLeft, Home, Plus, Settings, Sparkles, Zap } from "lucide-react";
import { cn } from "../../../lib/utils";

export function Sidebar() {
  return (
    <aside className="w-80 flex flex-col border-r border-gray-200 dark:border-gray-800 h-screen">
      {/* Header - Sticky */}
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:opacity-90">
            <Plus className="w-4 h-4" />
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
            <NavItem icon={Home} label="Home" isActive />
            <NavItem icon={Sparkles} label="Spaces" />
            <NavItem icon={Zap} label="Pipies" />
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
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  isActive,
}: {
  icon: any;
  label: string;
  isActive?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-3 py-2 w-full rounded-lg",
        isActive
          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
