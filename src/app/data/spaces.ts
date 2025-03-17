import { type SpaceIcon } from "../lib/icons";

export interface Icebreaker {
  label: string;
  prompt: string;
  icon: "book" | "issue" | "clock" | "git-branch" | "code" | "link";
}

export interface Space {
  id: string;
  title: string;
  description: string;
  icon: SpaceIcon;
  color: string;
  icebreakers: Icebreaker[];
}

export const spaces: Space[] = [
  {
    id: "frontend-design",
    title: "Frontend & Design",
    description:
      "Best practices for modern web development, UI/UX patterns, and design systems implementation",
    icon: "paintbrush",
    color: "#22c55e", // green
    icebreakers: [
      {
        label: "Build a Design System Framework",
        prompt:
          "What's the best way to structure a design system for a large-scale React application?",
        icon: "book",
      },
      {
        label: "Improve Component Accessibility",
        prompt:
          "How can we improve our component's accessibility without sacrificing design?",
        icon: "issue",
      },
      {
        label: "Handle Complex Form Validations",
        prompt:
          "What are some modern UI patterns for handling complex form validation?",
        icon: "code",
      },
      {
        label: "Design System Component Library",
        prompt: "How should we organize and document our component library?",
        icon: "book",
      },
      {
        label: "State Management Architecture",
        prompt:
          "What's the best approach to manage state in a large React app?",
        icon: "code",
      },
    ],
  },
  {
    id: "devops-playbook",
    title: "DevOps Playbook",
    description:
      "Infrastructure, deployment strategies, and operational excellence guidelines for cloud-native applications",
    icon: "zap",
    color: "#eab308", // yellow
    icebreakers: [
      {
        label: "Set Up Production Kubernetes",
        prompt:
          "How should we set up our Kubernetes cluster for optimal resource utilization?",
        icon: "book",
      },
      {
        label: "Zero Downtime Deployment",
        prompt:
          "What's the best strategy for implementing zero-downtime deployments?",
        icon: "git-branch",
      },
      {
        label: "Optimize CI/CD Pipeline",
        prompt: "How can we improve our CI/CD pipeline performance?",
        icon: "code",
      },
      {
        label: "Container Resource Management",
        prompt: "What's the best way to manage container resources and limits?",
        icon: "issue",
      },
    ],
  },
  {
    id: "security-practices",
    title: "Security Best Practices",
    description:
      "Application security, authentication patterns, and infrastructure hardening guidelines",
    icon: "shield",
    color: "#3b82f6", // blue
    icebreakers: [
      {
        label: "OAuth2 Microservices Setup",
        prompt:
          "What are the best practices for implementing OAuth2 in a microservices architecture?",
        icon: "book",
      },
      {
        label: "Secure API Endpoints",
        prompt:
          "How can we protect our API endpoints from common security vulnerabilities?",
        icon: "issue",
      },
      {
        label: "User Session Security",
        prompt: "What's the most secure way to handle user session management?",
        icon: "link",
      },
      {
        label: "API Authentication Design",
        prompt: "How should we design our API authentication system?",
        icon: "code",
      },
      {
        label: "Security Monitoring Setup",
        prompt: "What's the best way to set up security monitoring?",
        icon: "clock",
      },
      {
        label: "Infrastructure Security",
        prompt: "How can we improve our infrastructure security?",
        icon: "git-branch",
      },
    ],
  },
  {
    id: "backend-api",
    title: "Backend API",
    description:
      "API design patterns, performance optimization, and scalable architecture solutions",
    icon: "gear",
    color: "#8b5cf6", // purple
    icebreakers: [
      {
        label: "Real Time API Updates",
        prompt:
          "How should we design our API to handle real-time updates efficiently?",
        icon: "git-branch",
      },
      {
        label: "API Rate Limiting",
        prompt:
          "What's the best way to implement rate limiting in our REST API?",
        icon: "clock",
      },
      {
        label: "Database Query Performance",
        prompt:
          "How can we optimize our database queries for better performance?",
        icon: "code",
      },
    ],
  },
  {
    id: "blackbird-search",
    title: "Blackbird Search",
    description:
      "Advanced search algorithms, relevance tuning, and vector search implementation strategies",
    icon: "search",
    color: "#64748b", // slate
    icebreakers: [
      {
        label: "Semantic Vector Search",
        prompt:
          "What's the best approach to implement semantic search with vector embeddings?",
        icon: "book",
      },
      {
        label: "Search Relevance Tuning",
        prompt: "How can we improve our search relevance scoring?",
        icon: "code",
      },
      {
        label: "Faceted Search Design",
        prompt: "What are the best practices for implementing faceted search?",
        icon: "link",
      },
      {
        label: "Search Performance Tips",
        prompt: "How can we optimize search query performance?",
        icon: "clock",
      },
      {
        label: "Search Analytics Setup",
        prompt: "What metrics should we track for search quality?",
        icon: "issue",
      },
    ],
  },
  {
    id: "capi",
    title: "CAPI",
    description:
      "AI model integration, prompt engineering, and LLM-powered application development",
    icon: "apps",
    color: "#f97316", // orange
    icebreakers: [
      {
        label: "LLM Prompt Templates",
        prompt: "How should we structure our prompts for better LLM responses?",
        icon: "book",
      },
      {
        label: "Chat Context Windows",
        prompt:
          "What's the best way to handle context windows in chat applications?",
        icon: "code",
      },
      {
        label: "Chain LLM Prompts",
        prompt:
          "How can we implement effective prompt chaining for complex tasks?",
        icon: "git-branch",
      },
      {
        label: "Model Response Handling",
        prompt: "What's the best way to handle and validate model responses?",
        icon: "issue",
      },
    ],
  },
];

// Predefined colors for new spaces
export const SPACE_COLORS = [
  "#22c55e", // green
  "#3b82f6", // blue
  "#f97316", // orange
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#64748b", // slate
] as const;
