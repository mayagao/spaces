export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
}

export const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "How to implement a React component",
    lastMessage: "Here's how you can create a reusable React component...",
    timestamp: "2024-03-05T10:00:00Z",
    messages: [
      { role: "user", content: "How do I create a React component?" },
      {
        role: "assistant",
        content: "Here's how you can create a reusable React component...",
      },
    ],
  },
  {
    id: "2",
    title: "TypeScript type inference explanation",
    lastMessage: "TypeScript can automatically infer types in many cases...",
    timestamp: "2024-03-05T09:30:00Z",
    messages: [
      { role: "user", content: "Can you explain TypeScript type inference?" },
      {
        role: "assistant",
        content: "TypeScript can automatically infer types in many cases...",
      },
    ],
  },
  // Add 18 more mock conversations here with different titles and content
  {
    id: "3",
    title: "Setting up a Next.js project with TypeScript",
    lastMessage: "First, you'll need to create a new Next.js project...",
    timestamp: "2024-03-05T09:00:00Z",
    messages: [],
  },
  // ... more conversations
];
