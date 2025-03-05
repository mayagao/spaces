"use client";

import { SecondaryHeader } from "../components/shared/SecondaryHeader";
import { useSidebar } from "../contexts/SidebarContext";

export default function PipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      {/* Custom SecondaryHeader for Pipes page */}
      <SecondaryHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        showModelSelector={true} // Hide model selector for Pipes page
        actions={
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              Sort
            </button>
            <button className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
              New Pipe
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
