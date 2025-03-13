"use client";

import { SecondaryHeader } from "../components/shared/SecondaryHeader";
import { useSidebar } from "../contexts/SidebarContext";
import { IconButton } from "../components/shared/IconButton";
import { ShareIcon, GearIcon } from "@primer/octicons-react";
import { usePathname, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { SettingsModal } from "../components/spaces/SettingsModal";
import { spaces, type Space } from "../data/spaces";

export default function SpacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const params = useParams();
  const isSpaceDetail = pathname !== "/spaces";
  const [isScrolled, setIsScrolled] = useState(false);

  // Get current space if on detail page
  const currentSpace = isSpaceDetail
    ? spaces.find((s) => s.id === params.id)
    : undefined;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedSpace, setSelectedSpace] = useState<Space | undefined>(
    currentSpace
  );

  // Listen for scroll events from the space detail page
  useEffect(() => {
    const handleSpaceScroll = (event: CustomEvent<{ isScrolled: boolean }>) => {
      setIsScrolled(event.detail.isScrolled);
    };

    window.addEventListener(
      "spaceContentScroll",
      handleSpaceScroll as EventListener
    );
    return () => {
      window.removeEventListener(
        "spaceContentScroll",
        handleSpaceScroll as EventListener
      );
    };
  }, []);

  // Update selected space when current space changes
  useEffect(() => {
    if (currentSpace) {
      setSelectedSpace(currentSpace);
    }
  }, [currentSpace]);

  const handleOpenModal = (mode: "create" | "edit", space?: Space) => {
    setModalMode(mode);
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: Omit<Space, "id">) => {
    if (modalMode === "create") {
      // TODO: Implement space creation
      console.log("Creating space:", data);
    } else {
      // TODO: Implement space update
      console.log("Updating space:", { id: selectedSpace?.id, ...data });
    }
  };

  // Listen for the custom event from the create button
  useEffect(() => {
    const handleModalEvent = (
      event: CustomEvent<{ mode: "create" | "edit"; space?: Space }>
    ) => {
      handleOpenModal(event.detail.mode, event.detail.space);
    };

    window.addEventListener(
      "openSpaceSettingsModal",
      handleModalEvent as EventListener
    );
    return () => {
      window.removeEventListener(
        "openSpaceSettingsModal",
        handleModalEvent as EventListener
      );
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Custom SecondaryHeader for Spaces page */}
      <SecondaryHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        showModelSelector={false}
        spaceTitle={currentSpace?.title}
        spaceColor={currentSpace?.color}
        isScrolled={isScrolled}
        actions={
          isSpaceDetail ? (
            <div className="flex gap-2">
              <IconButton
                icon={ShareIcon}
                label="Share space"
                variant="outline"
                size="sm"
                onClick={() => console.log("Share")}
              />
              <IconButton
                icon={GearIcon}
                label="Space settings"
                variant="outline"
                size="sm"
                onClick={() => handleOpenModal("edit", currentSpace)}
              />
            </div>
          ) : null
        }
      />
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        space={selectedSpace}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
