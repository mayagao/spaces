"use client";

import { SecondaryHeader } from "../components/shared/SecondaryHeader";
import { useSidebar } from "../contexts/SidebarContext";

export default function SpacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      {/* Custom SecondaryHeader for Spaces page */}
      <SecondaryHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        showModelSelector={false} // Hide model selector for Spaces page
        actions={<div className="flex gap-2">&nbsp;</div>}
      />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
