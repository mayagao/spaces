import {
  FileIcon,
  FileDirectoryIcon,
  ImageIcon,
  FileCodeIcon,
} from "@primer/octicons-react";
import { Resource } from "./types";

export function ResourceIcon({ type }: { type: Resource["type"] }) {
  switch (type) {
    case "directory":
      return <FileDirectoryIcon size={16} className="text-gray-500" />;
    case "image":
      return <ImageIcon size={16} className="text-gray-500" />;
    case "text":
      return <FileIcon size={16} className="text-gray-500" />;
    case "code":
      return <FileCodeIcon size={16} className="text-gray-500" />;
    default:
      return <FileIcon size={16} className="text-gray-500" />;
  }
}
