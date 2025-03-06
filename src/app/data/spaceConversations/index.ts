import { Conversation } from "../mockConversations";
import { frontendDesignConversations } from "./frontendDesign";
import { devopsPlaybookConversations } from "./devopsPlaybook";
import { securityPracticesConversations } from "./securityPractices";
import { backendApiConversations } from "./backendApi";
import { blackbirdSearchConversations } from "./blackbirdSearch";
import { capiConversations } from "./capi";

// Map of space IDs to their conversations
export const spaceConversations: Record<string, Conversation[]> = {
  "frontend-design": frontendDesignConversations,
  "devops-playbook": devopsPlaybookConversations,
  "security-practices": securityPracticesConversations,
  "backend-api": backendApiConversations,
  "blackbird-search": blackbirdSearchConversations,
  capi: capiConversations,
};

// Helper function to get conversations for a specific space
export function getSpaceConversations(spaceId: string): Conversation[] {
  return spaceConversations[spaceId] || [];
}
