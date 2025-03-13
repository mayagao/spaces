"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  mockConversations,
  type Conversation,
} from "../../data/mockConversations";
import { PageTitle } from "../../components/shared/PageTitle";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  TagIcon,
  ShareIcon,
  KebabHorizontalIcon,
} from "@primer/octicons-react";
import { spaces } from "../../data/spaces";
import { spaceConversations } from "../../data/spaceConversations";
import { SecondaryHeader } from "../../components/shared/SecondaryHeader";
import { ChatInput } from "../../components/shared/ChatInput";
import { ChatInputDisplay } from "../../components/chat/ChatInputDisplay";
import { ChatOutputDisplay } from "../../components/chat/ChatOutputDisplay";
import { useSidebar } from "../../contexts/SidebarContext";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const conversationId = params.id as string;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [spaceName, setSpaceName] = useState<string | null>(null);
  const [spaceColor, setSpaceColor] = useState<string | null>(null);
  const [spaceIcon, setSpaceIcon] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // First, try to find the conversation in mockConversations
    let foundConversation = mockConversations.find(
      (c) => c.id === conversationId
    );

    // If not found, check all space conversations
    if (!foundConversation) {
      // Check each space's conversations
      for (const spaceId in spaceConversations) {
        const spaceConvos = spaceConversations[spaceId];
        const found = spaceConvos.find((c) => c.id === conversationId);
        if (found) {
          foundConversation = found;
          // Set the spaceId if it's not already set
          if (!foundConversation.spaceId) {
            foundConversation = {
              ...foundConversation,
              spaceId: spaceId,
            };
          }
          break;
        }
      }
    }

    setConversation(foundConversation || null);

    // Get space name if conversation belongs to a space
    if (foundConversation?.spaceId) {
      const space = spaces.find((s) => s.id === foundConversation?.spaceId);
      setSpaceName(space?.title || null);
      setSpaceColor(space?.color || null);
      setSpaceIcon(space?.icon || null);
    } else {
      setSpaceName(null);
      setSpaceColor(null);
      setSpaceIcon(null);
    }
  }, [conversationId]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      const scrolled = content.scrollTop > 60;
      setIsScrolled(scrolled);
    };

    // Check initial scroll position
    handleScroll();
    content.addEventListener("scroll", handleScroll);
    return () => content.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChatSubmit = (value: string) => {
    console.log("Submitted:", value);
    // In a real app, you would send this message to the API
  };

  const handleShare = () => {
    console.log("Share conversation:", conversationId);
    // In a real app, you would implement sharing functionality
  };

  const handleMenuOpen = () => {
    console.log("Open menu for conversation:", conversationId);
    // In a real app, you would show a dropdown menu
  };

  // Custom header actions for the secondary header
  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={handleShare}
        title="Share conversation"
      >
        <ShareIcon size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={handleMenuOpen}
        title="More options"
      >
        <KebabHorizontalIcon size={16} />
      </Button>
    </div>
  );

  if (!conversation) {
    return (
      <div className="p-6">
        <PageTitle title="Conversation not found" />
        <p className="text-gray-500 mt-4">
          The conversation you're looking for doesn't exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SecondaryHeader
        showModelSelector={true}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
        title={conversation.title}
        spaceColor={spaceColor || undefined}
        isScrolled={isScrolled}
        actions={headerActions}
        pathname={pathname}
      />

      <div ref={contentRef} className="flex-1 overflow-y-auto">
        <div className="max-w-[880px] mx-auto px-8">
          <div className="mt-6 space-y-6">
            {conversation.messages.map((message, index) =>
              message.role === "user" ? (
                <ChatInputDisplay key={index} content={message.content} />
              ) : (
                <ChatOutputDisplay key={index} content={message.content} />
              )
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="max-w-[880px] mx-auto px-8 pb-4">
          <ChatInput placeholder="Ask Copilot..." onSubmit={handleChatSubmit} />
        </div>
      </div>
    </div>
  );
}
