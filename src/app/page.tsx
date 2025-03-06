"use client";
import { SecondaryHeader } from "./components/shared/SecondaryHeader";
import { useSidebar } from "./contexts/SidebarContext";

export default function HomePage() {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();

  return (
    <>
      <SecondaryHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        isScrolled={false}
        actions={
          <div className="flex gap-2">
            {/* Example action buttons - customize based on page */}
            <button className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              Share
            </button>
            <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save
            </button>
          </div>
        }
      />
      <div className="p-8 ">
        <h1 className="text-3xl font-bold mb-4">Home</h1>
        <p className="text-gray-600">Welcome to the Copilot dashboard.</p>
      </div>
    </>
  );
}
