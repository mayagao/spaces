import { type SpaceIcon } from "../lib/icons";

export interface Space {
  id: string;
  title: string;
  description: string;
  icon: SpaceIcon;
  color: string;
}

export const spaces: Space[] = [
  {
    id: "frontend-design",
    title: "Frontend & Design",
    description: "Help your team get started and understand concepts...",
    icon: "paintbrush",
    color: "#22c55e", // green
  },
  {
    id: "devops-playbook",
    title: "DevOps Playbook",
    description: "Help your team get started and understand concepts...",
    icon: "zap",
    color: "#eab308", // yellow
  },
  {
    id: "security-practices",
    title: "Security Best Practices",
    description: "Help your team get started and understand concepts...",
    icon: "shield",
    color: "#3b82f6", // blue
  },
  {
    id: "backend-api",
    title: "Backend API",
    description: "Help your team get started and understand concepts...",
    icon: "gear",
    color: "#8b5cf6", // purple
  },
  {
    id: "blackbird-search",
    title: "Blackbird Search",
    description: "Help your team get started and understand concepts...",
    icon: "search",
    color: "#64748b", // slate
  },
  {
    id: "capi",
    title: "CAPI",
    description: "Help your team get started and understand concepts...",
    icon: "apps",
    color: "#f97316", // orange
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
