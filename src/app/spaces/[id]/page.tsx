"use client";

import { useParams } from "next/navigation";
import { spaces } from "../../data/spaces";
import { mockConversations } from "../../data/mockConversations";
import { PageTitle } from "../../components/shared/PageTitle";
import { ChatInput } from "../../components/shared/ChatInput";
import { InstructionBlock } from "../../components/shared/InstructionBlock";
import { ResourceList } from "../../components/shared/resources/ResourceList";
import { ConversationList } from "../../components/shared/ConversationList";
import { type Resource } from "../../components/shared/resources/ResourceItem";

export default function SpaceDetailPage() {
  const params = useParams();
  const space = spaces.find((s) => s.id === params.id);

  if (!space) {
    return <div>Space not found</div>;
  }

  // Example resources
  const resources: Resource[] = [
    {
      id: "1",
      name: "skill-diagram-2.png",
      type: "file",
      source: "Upload",
    },
    {
      id: "2",
      name: "orchestrator.go",
      type: "file",
      source: "copilot-api",
    },
    {
      id: "3",
      name: "How skills systems work",
      type: "file",
      source: "Text file",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <PageTitle
            icon={space.icon}
            title={space.title}
            description={space.description}
          />

          <div className="grid grid-cols-3 gap-6">
            {/* Left column - Instructions and Resources */}
            <div className="col-span-2 space-y-6">
              <InstructionBlock
                initialContent="Your role is to ensure that AI skill orchestration are efficient, reliable, and maintainable. This involves designing, implementing, and optimizing an orchestrator and registry that dynamically manages AI skills, while ensuring..."
                onSave={(content) => console.log("Save instructions:", content)}
              />

              <ResourceList
                resources={resources}
                onAddResource={() => console.log("Add resource")}
                onEditResource={(resource) =>
                  console.log("Edit resource:", resource)
                }
                onDeleteResource={(id) => console.log("Delete resource:", id)}
              />
            </div>

            {/* Right column - Recent Conversations */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Recent Conversations
              </h3>
              <ConversationList
                conversations={mockConversations}
                variant="compact"
                onConversationSelect={(conversation) =>
                  console.log("Selected conversation:", conversation)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chat input at the bottom */}
      <ChatInput
        placeholder={`Ask ${space.title}...`}
        onSubmit={(value) => console.log("Submit chat:", value)}
      />
    </div>
  );
}
