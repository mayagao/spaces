export interface Space {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const spaces: Space[] = [
  {
    id: "frontend-design",
    title: "Frontend & Design",
    description: "Help your team get started and understand concepts...",
    icon: "paintbrush",
    color: "#22c55e", // green-500
  },
  {
    id: "devops-playbook",
    title: "DevOps Playbook",
    description: "Help your team get started and understand concepts...",
    icon: "zap",
    color: "#eab308", // yellow-500
  },
  {
    id: "security-practices",
    title: "Security Best Practices",
    description: "Help your team get started and understand concepts...",
    icon: "shield-lock",
    color: "#3b82f6", // blue-500
  },
  {
    id: "backend-api",
    title: "Backend API",
    description: "Help your team get started and understand concepts...",
    icon: "gear",
    color: "#64748b", // slate-500
  },
  {
    id: "blackbird-search",
    title: "Blackbird Search",
    description: "Help your team get started and understand concepts...",
    icon: "search",
    color: "#0f172a", // slate-900
  },
  {
    id: "capi",
    title: "CAPI",
    description: "Help your team get started and understand concepts...",
    icon: "apps",
    color: "#f97316", // orange-500
  },
];
