export interface Resource {
  id: string;
  name: string;
  type: "file" | "link" | "image" | "text" | "directory" | "code";
  source?: string;
  url?: string;
  content?: string;
  fileSize?: number;
  directoryPath?: string;
}
