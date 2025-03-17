"use client";

import { useParams, useRouter } from "next/navigation";
import { spaces } from "../../data/spaces";
import { getSpaceConversations } from "../../data/spaceConversations";
import { PageTitle } from "../../components/shared/PageTitle";
import { ChatInput } from "../../components/shared/ChatInput";
import { InstructionBlock } from "../../components/spaces/InstructionBlock";
import { ReferenceList } from "../../components/shared/resources/ReferenceList";
import { ConversationList } from "../../components/shared/ConversationList";
import { type Resource } from "../../components/shared/resources/ResourceItem";
import { useEffect, useRef, useState } from "react";
import { type Conversation } from "../../data/mockConversations";

// Example initial resources
const initialResources: Resource[] = [
  {
    id: "1",
    name: "skill-diagram-2.png",
    type: "image",
    source: "Upload",
  },
  {
    id: "2",
    name: "orchestrator.go",
    type: "code",
    source: "copilot-api",
  },
  {
    id: "3",
    name: "How skills systems work",
    type: "text",
    source: "Text file",
  },
];

export default function SpaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const space = spaces.find((s) => s.id === params.id);
  const contentRef = useRef<HTMLDivElement>(null);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const spaceConversations = getSpaceConversations(params.id as string);

  // Extract conversation ID from the pathname if we're on a conversation page
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const conversationMatch = pathname.match(/\/conversations\/([^\/]+)/);
  const activeConversationId = conversationMatch ? conversationMatch[1] : null;

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      const scrolled = content.scrollTop > 60;
      console.log(
        "Scroll position:",
        content.scrollTop,
        "isScrolled:",
        scrolled
      );
      // Dispatch custom event to notify parent layout
      window.dispatchEvent(
        new CustomEvent("spaceContentScroll", {
          detail: { isScrolled: scrolled },
        })
      );
    };

    // Check initial scroll position
    handleScroll();
    content.addEventListener("scroll", handleScroll);
    return () => content.removeEventListener("scroll", handleScroll);
  }, []);

  if (!space) {
    return <div>Space not found</div>;
  }

  const handleAddResource = (resource: Resource) => {
    setResources((current) => [resource, ...current]);
  };

  const handleEditResource = (resource: Resource) => {
    setResources((current) =>
      current.map((r) => (r.id === resource.id ? resource : r))
    );
  };

  const handleDeleteResource = (id: string) => {
    setResources((current) => current.filter((r) => r.id !== id));
  };

  const handleReorderResources = (reorderedResources: Resource[]) => {
    setResources(() => reorderedResources);
  };

  const handleConversationSelect = (conversation: Conversation) => {
    console.log("Navigating to conversation:", conversation.id);
    router.push(`/conversations/${conversation.id}`);
  };

  return (
    <div ref={contentRef} className="flex flex-col h-full overflow-auto">
      <div className="mx-auto max-w-[880px] px-8 pb-24 pt-8">
        <div className="mb-8">
          <PageTitle
            icon={space.icon}
            title={space.title}
            description={space.description}
            backgroundColor={space.color}
          />
          <div className="">
            <ChatInput
              placeholder={`Ask ${space.title}...`}
              onSubmit={(value) => console.log("Submit chat:", value)}
            />
          </div>
        </div>

        {/* Container for responsive layout */}
        <div className="flex flex-col space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
          {/* Recent Conversations Section - Appears first on mobile */}
          <div className="order-first mb-6 sm:mb-0 sm:col-span-1 sm:row-start-1 sm:order-last">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Recent Conversations
            </h3>
            {spaceConversations.length > 0 ? (
              <ConversationList
                conversations={spaceConversations}
                variant="compact"
                activeConversationId={activeConversationId}
                onConversationSelect={handleConversationSelect}
              />
            ) : (
              <div className="text-sm text-gray-500">
                No conversations in this space yet.
              </div>
            )}
          </div>

          {/* Instructions and Resources - Appears second on mobile */}
          <div className="order-last space-y-6 sm:col-span-2 sm:row-start-1 sm:order-first">
            <InstructionBlock
              initialContent="Your role is to ensure that AI skill orchestration are efficient, reliable, and maintainable. This involves designing, implementing, and optimizing an orchestrator and registry that dynamically manages AI skills, while ensuring..."
              onSave={(content) => console.log("Save instructions:", content)}
            />

            <ReferenceList
              resources={resources}
              onAddResource={handleAddResource}
              onEditResource={handleEditResource}
              onDeleteResource={handleDeleteResource}
              onReorderResources={handleReorderResources}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
