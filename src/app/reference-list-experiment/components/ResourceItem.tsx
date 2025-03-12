import { useState, useEffect, useRef } from "react";
import {
  FileIcon,
  LinkIcon,
  FileDirectoryIcon,
  ImageIcon,
  NoteIcon,
  KebabHorizontalIcon,
  FileCodeIcon,
} from "@primer/octicons-react";
import { formatFileSize } from "../../components/shared/resources/utils/resourceSizeUtils";
import { truncateMiddle } from "../utils/truncateMiddle";
import { Resource, ColumnConfig } from "../types";

interface ResourceItemProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (id: string) => void;
  totalResourceSize: number;
  columns: {
    name: ColumnConfig;
    source: ColumnConfig;
    size: ColumnConfig;
    actions: ColumnConfig;
  };
  displayOptions: {
    showDirectoryInSource: boolean;
    showFullRepoPath: boolean;
    sourceTextStyle?: "normal" | "subdued";
    directoryTextStyle?: "normal" | "subdued";
    showSecondLine?: boolean;
  };
}

// Resource icon component
function ResourceIcon({ type }: { type: Resource["type"] }) {
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

// Resource item menu component
function ResourceItemMenu({
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 z-50">
      <div className="p-1">
        <button
          onClick={onEdit}
          className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function ResourceItem({
  resource,
  onEdit,
  onDelete,
  totalResourceSize,
  columns,
  displayOptions,
}: ResourceItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    }

    if (showPopover) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", () => setShowPopover(false), true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", () => setShowPopover(false), true);
    };
  }, [showPopover]);

  // Extract filename and path parts
  const getFileNameAndPath = (name: string) => {
    const parts = name.split("/");
    const fileName = parts.pop() || name;
    const path = parts.join("/");
    return { fileName, path };
  };

  // Format source based on display option
  const formatSource = (source: string | undefined): string => {
    if (!source) return "—";
    if (source === "Text file" || source === "Upload") return source;

    // For Option 2, source is just the repo name
    if (displayOptions.showFullRepoPath && columns.source.width === "1fr") {
      return source.split("/")[0] || source;
    }

    // For other cases
    const { fileName, path } = getFileNameAndPath(source);
    const repoName = source.split("/")[0] || "";

    if (path) {
      return `${repoName}/${path}`;
    }

    return repoName;
  };

  // Handle hover on the ellipsis
  const handleEllipsisHover = (
    e: React.MouseEvent,
    hiddenSegments: string[]
  ) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setPopoverPosition({ x: rect.left, y: rect.bottom + 4 });
    setShowPopover(true);
  };

  // Find the ellipsis in the string and wrap it with a span
  const wrapEllipsis = (text: string, hiddenSegments: string[] = []) => {
    if (!text.includes("...")) return <span>{text}</span>;

    const parts = text.split("...");
    return (
      <>
        <span>{parts[0]}</span>
        <span
          className="ellipsis"
          onMouseEnter={(e) => handleEllipsisHover(e, hiddenSegments)}
          onMouseLeave={() => setShowPopover(false)}
        >
          ...
        </span>
        <span>{parts[1]}</span>
      </>
    );
  };

  // Generate grid template columns based on visible columns and their widths
  const gridTemplateColumns = Object.values(columns)
    .filter((col) => col.visible)
    .map((col) => col.width)
    .join(" ");

  // Helper for text style classes
  const getTextStyle = (style?: "normal" | "subdued") => {
    return style === "subdued" ? "text-gray-400" : "text-gray-500";
  };

  // Process name and source based on display option
  const processNameAndSource = () => {
    const { fileName, path } = getFileNameAndPath(resource.name);
    const source = resource.source || "";
    const repoName = source.split("/")[0] || "";

    // Option 1: Show only filename in first column, repo+path in second column
    if (!displayOptions.showSecondLine && columns.source.width === "1.5fr") {
      // First column is just the filename
      const nameResult = { displayPath: fileName, hiddenSegments: [] };

      // For the second column, handle different source types
      let sourceContent = "";

      if (source === "Text file" || source === "Upload") {
        // For text files or uploads, just use the source as is
        sourceContent = source;
      } else {
        // For repo sources, combine repo name with path from resource name
        // Extract the path from the resource name (which contains the full path)
        const pathParts = resource.name.split("/");
        pathParts.pop(); // Remove the filename
        const pathWithoutFile = pathParts.join("/");

        if (pathWithoutFile) {
          sourceContent = `${source}/${pathWithoutFile}`;
        } else {
          sourceContent = source;
        }
      }

      // Use a larger width to show more content
      const maxWidth = 60; // Increased to show more of the path
      const sourceResult = truncateMiddle(sourceContent, maxWidth);

      return {
        name: nameResult,
        source: sourceResult,
        secondLine: null,
      };
    }

    // Option 2: Show full path in first column, repo name in second column
    if (!displayOptions.showSecondLine && columns.source.width === "1fr") {
      const maxWidth = 40;
      const nameResult = truncateMiddle(resource.name, maxWidth);

      const sourceResult = { displayPath: repoName, hiddenSegments: [] };

      return {
        name: nameResult,
        source: sourceResult,
        secondLine: null,
      };
    }

    // Option 3: Show filename in first line, repo+path in second line (no second column)
    if (displayOptions.showSecondLine) {
      const nameResult = { displayPath: fileName, hiddenSegments: [] };

      const secondLineContent = `${repoName}/${path}`;
      const maxWidth = 40; // Use the same fixed width as Option 1
      const secondLineResult = truncateMiddle(secondLineContent, maxWidth);

      return {
        name: nameResult,
        source: { displayPath: "", hiddenSegments: [] },
        secondLine: secondLineResult,
      };
    }

    // Default fallback
    const maxWidth = Math.floor(parseInt(columns.name.width) * 15);
    const nameResult = truncateMiddle(resource.name, maxWidth);

    return {
      name: nameResult,
      source: {
        displayPath: formatSource(resource.source),
        hiddenSegments: [],
      },
      secondLine: null,
    };
  };

  const { name, source, secondLine } = processNameAndSource();

  return (
    <div
      className="group items-center px-4 py-2 grid gap-4"
      style={{ gridTemplateColumns }}
    >
      <style jsx>{`
        .ellipsis {
          color: #0066cc;
          cursor: pointer;
          font-weight: bold;
        }

        .ellipsis:hover {
          text-decoration: underline;
        }

        .hidden-segments-popover {
          background-color: white;
          border: 1px solid #eee;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 6px;
          z-index: 1000;
        }

        .hidden-segment {
          padding: 2px 0;
          word-break: break-all;
        }
      `}</style>

      {columns.name.visible && (
        <div className="flex items-center min-w-0">
          <ResourceIcon type={resource.type} />
          <div className="ml-3 min-w-0">
            <div className="flex items-center">
              <div className="text-sm truncate">
                {wrapEllipsis(name.displayPath, name.hiddenSegments)}
              </div>
            </div>

            {/* Second line for Option 3 */}
            {displayOptions.showSecondLine && secondLine && (
              <div className="text-xs text-gray-500 mt-1">
                {wrapEllipsis(
                  secondLine.displayPath,
                  secondLine.hiddenSegments
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {columns.source.visible && columns.source.width !== "0fr" && (
        <div
          className="text-xs min-w-0"
          style={{ textAlign: columns.source.align || "left" }}
        >
          <div className="flex flex-col">
            {displayOptions.showDirectoryInSource && resource.directoryPath && (
              <div
                className={`truncate ${getTextStyle(
                  displayOptions.directoryTextStyle
                )}`}
              >
                {wrapEllipsis(resource.directoryPath)}
              </div>
            )}
            <div
              className={`truncate ${getTextStyle(
                displayOptions.sourceTextStyle
              )}`}
            >
              {wrapEllipsis(source.displayPath, source.hiddenSegments)}
            </div>
          </div>
        </div>
      )}

      {columns.size.visible && (
        <div
          className="text-xs text-gray-500"
          style={{ textAlign: columns.size.align || "right" }}
        >
          {resource.fileSize &&
            formatFileSize(resource.fileSize, totalResourceSize)}
        </div>
      )}

      {columns.actions.visible && (
        <div className="flex justify-end">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <KebabHorizontalIcon size={16} className="text-gray-500" />
            </button>

            <ResourceItemMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              onEdit={() => {
                setIsMenuOpen(false);
                onEdit(resource);
              }}
              onDelete={() => {
                setIsMenuOpen(false);
                onDelete(resource.id);
              }}
            />
          </div>
        </div>
      )}

      {/* Popover for hidden segments */}
      {showPopover && (
        <div
          ref={popoverRef}
          className="hidden-segments-popover"
          style={{
            position: "fixed",
            left: popoverPosition.x,
            top: popoverPosition.y,
            backgroundColor: "white",
            border: "1px solid #eee",
            padding: "6px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 1000,
            fontSize: "12px",
            minWidth: "160px",
          }}
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
        >
          <div className="popover-content" style={{ lineHeight: "1.5" }}>
            {name.hiddenSegments.length > 0
              ? name.hiddenSegments.map((segment, index) => (
                  <div
                    key={`name-${index}`}
                    className="hidden-segment"
                    style={{
                      paddingLeft: `${index * 12}px`,
                      color:
                        index === name.hiddenSegments.length - 1
                          ? "#000"
                          : "#666",
                    }}
                  >
                    {segment}
                  </div>
                ))
              : source.hiddenSegments.length > 0
              ? source.hiddenSegments.map((segment, index) => (
                  <div
                    key={`source-${index}`}
                    className="hidden-segment"
                    style={{
                      paddingLeft: `${index * 12}px`,
                      color:
                        index === source.hiddenSegments.length - 1
                          ? "#000"
                          : "#666",
                    }}
                  >
                    {segment}
                  </div>
                ))
              : secondLine && secondLine.hiddenSegments.length > 0
              ? secondLine.hiddenSegments.map((segment, index) => (
                  <div
                    key={`secondLine-${index}`}
                    className="hidden-segment"
                    style={{
                      paddingLeft: `${index * 12}px`,
                      color:
                        index === secondLine.hiddenSegments.length - 1
                          ? "#000"
                          : "#666",
                    }}
                  >
                    {segment}
                  </div>
                ))
              : null}
          </div>
        </div>
      )}
    </div>
  );
}
