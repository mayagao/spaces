"use client";

import { useState, useEffect, Suspense } from "react";
import { SecondaryHeader } from "./components/shared/SecondaryHeader";
import { useSidebar } from "./contexts/SidebarContext";
import { IcebreakerSuggestions } from "./components/shared/IcebreakerSuggestions";
import { ChatInput } from "./components/shared/ChatInput";
import { Button } from "@/components/ui/button";
import { ShareIcon, KebabHorizontalIcon } from "@primer/octicons-react";
import { type Space, spaces } from "./data/spaces";
import { useSearchParams } from "next/navigation";

function HomePageContent() {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const searchParams = useSearchParams();

  // Set selected space from URL parameter
  useEffect(() => {
    const spaceId = searchParams.get("spaceId");
    if (spaceId) {
      const space = spaces.find((s) => s.id === spaceId);
      if (space) {
        setSelectedSpace(space);
      }
    }
  }, [searchParams]);

  const handleIcebreakerSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  const handleChatSubmit = (value: string) => {
    console.log("Submitted:", value);
    // In a real app, you would send this message to the API
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8"
        onClick={() => console.log("Share")}
        title="Share conversation"
      >
        <ShareIcon size={16} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="w-8 h-8"
        onClick={() => console.log("Menu")}
        title="More options"
      >
        <KebabHorizontalIcon size={16} />
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <SecondaryHeader
        showModelSelector={true}
        showSpaceSelector={true}
        selectedSpace={selectedSpace}
        onSelectSpace={setSelectedSpace}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        isScrolled={false}
        actions={headerActions}
      />

      <div className="flex-1 overflow-y-auto">
        <IcebreakerSuggestions
          onSelect={handleIcebreakerSelect}
          selectedSpace={selectedSpace}
        />
      </div>

      <div>
        <div className="max-w-[880px] mx-auto px-8 pb-4">
          <ChatInput
            placeholder="Ask Copilot..."
            onSubmit={handleChatSubmit}
            initialValue={selectedPrompt}
          />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
