"use client";

import { useParams } from "next/navigation";
import { spaces } from "../../data/spaces";
import { getSpaceConversations } from "../../data/spaceConversations";
import { PageTitle } from "../../components/shared/PageTitle";
import { ChatInput } from "../../components/shared/ChatInput";
import { InstructionBlock } from "../../components/spaces/InstructionBlock";
import { ReferenceList } from "../../components/shared/resources/ReferenceList";
import { ConversationList } from "../../components/shared/ConversationList";
import { type Resource } from "../../components/shared/resources/ResourceItem";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "../../components/shared/IconButton";

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
  const space = spaces.find((s) => s.id === params.id);
  const contentRef = useRef<HTMLDivElement>(null);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const spaceConversations = getSpaceConversations(params.id as string);

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

  return (
    <div ref={contentRef} className="flex flex-col h-full overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <PageTitle
            icon={space.icon}
            title={space.title}
            description={space.description}
            backgroundColor={space.color}
          />
          <div className="mt-6">
            <ChatInput
              placeholder={`Ask ${space.title}...`}
              onSubmit={(value) => console.log("Submit chat:", value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column - Instructions and Resources */}
          <div className="col-span-2 space-y-6">
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

          {/* Right column - Recent Conversations */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Recent Conversations
            </h3>
            <ConversationList
              conversations={spaceConversations}
              variant="compact"
              onConversationSelect={(conversation) =>
                console.log("Selected conversation:", conversation)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
