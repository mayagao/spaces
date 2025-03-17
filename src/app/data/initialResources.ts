import { Resource } from "../components/shared/resources/types";

export const initialResources: Resource[] = [
  // Local uploads (2)
  {
    id: "upload-1",
    name: "architecture-diagram.png",
    type: "image",
    source: "Upload",
    fileSize: 1.21 * 1024 * 1024, // 1.5MB
  },
  {
    id: "upload-2",
    name: "skill-requirements.pdf",
    type: "file",
    source: "Upload",
    fileSize: 500 * 1024, // 500KB
  },

  // Text note (1)
  {
    id: "note-1",
    name: "System Architecture Overview",
    type: "text",
    source: "Text file",
    content:
      "The system consists of three main components:\n\n1. Skill Registry\n2. Orchestrator\n3. Execution Engine\n\nEach component is designed to be modular and independently scalable...",
    fileSize: 2048, // 2KB
  },

  // Code-lens repository files (4)
  {
    id: "code-lens-1",
    name: "src/components/CodeLens/CodeLensView.tsx",
    type: "code",
    source: "code-lens",
    fileSize: 15 * 1024, // 15KB
  },
  {
    id: "code-lens-2",
    name: "src/lib/parser/typescript/parseTypeScript.ts",
    type: "code",
    source: "code-lens",
    fileSize: 8 * 1024, // 8KB
  },
  {
    id: "code-lens-3",
    name: "src/hooks/useCodeAnalysis.ts",
    type: "code",
    source: "code-lens",
    fileSize: 5 * 1024, // 5KB
  },
  {
    id: "code-lens-4",
    name: "src/styles/syntax-highlighting.css",
    type: "code",
    source: "code-lens",
    fileSize: 3 * 1024, // 3KB
  },

  // Fluid prompt editor files (5)
  {
    id: "fluid-1",
    name: "src/components/editor/PromptEditor/PromptCanvas.tsx",
    type: "code",
    source: "fluid-prompt-editor",
    fileSize: 12 * 1024, // 12KB
  },
  {
    id: "fluid-2",
    name: "src/components/editor/blocks/CodeBlock/CodeBlockView.tsx",
    type: "code",
    source: "fluid-prompt-editor",
    fileSize: 7 * 1024, // 7KB
  },
  {
    id: "fluid-3",
    name: "src/lib/promptEngine/evaluateTemplate.ts",
    type: "code",
    source: "fluid-prompt-editor",
    fileSize: 6 * 1024, // 6KB
  },
  {
    id: "fluid-4",
    name: "src/hooks/usePromptVariables.ts",
    type: "code",
    source: "fluid-prompt-editor",
    fileSize: 4 * 1024, // 4KB
  },
  {
    id: "fluid-5",
    name: "src/components/shared/ui/ResizablePanel.tsx",
    type: "code",
    source: "fluid-prompt-editor",
    fileSize: 3 * 1024, // 3KB
  },
];
