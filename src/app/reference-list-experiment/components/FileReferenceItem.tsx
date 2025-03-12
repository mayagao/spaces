import React, { useState } from "react";
import {
  FileReferenceDisplay,
  getFileReferenceDisplay,
} from "../utils/displayOptions";
import "../styles/FileReference.css";

interface FileReferenceItemProps {
  repoName: string;
  filePath: string;
  displayOption: 1 | 2 | 3;
  maxWidth: number;
  onClick?: () => void;
}

/**
 * Component that displays a file reference based on the selected display option
 */
export const FileReferenceItem: React.FC<FileReferenceItemProps> = ({
  repoName,
  filePath,
  displayOption,
  maxWidth,
  onClick,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  // Get the display data based on the selected option
  const displayData = getFileReferenceDisplay(
    displayOption,
    repoName,
    filePath,
    maxWidth
  );

  // Handle click on the ellipsis
  const handleEllipsisClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopoverPosition({ x: e.clientX, y: e.clientY });
    setShowPopover(!showPopover);
  };

  // Handle click on the item
  const handleItemClick = () => {
    if (onClick) onClick();
  };

  // Find the ellipsis in the string and wrap it with a span
  const wrapEllipsis = (text: string) => {
    if (!text.includes("...")) return <span>{text}</span>;

    const parts = text.split("...");
    return (
      <>
        <span>{parts[0]}</span>
        <span
          className="ellipsis"
          onClick={handleEllipsisClick}
          style={{ cursor: "pointer", color: "blue" }}
        >
          ...
        </span>
        <span>{parts[1]}</span>
      </>
    );
  };

  return (
    <div className="file-reference-item" onClick={handleItemClick}>
      <div className="primary-content">
        {wrapEllipsis(displayData.primaryColumn)}

        {displayData.secondaryColumn && (
          <div className="secondary-column">
            {wrapEllipsis(displayData.secondaryColumn)}
          </div>
        )}
      </div>

      {displayData.secondLine && (
        <div className="second-line">
          {wrapEllipsis(displayData.secondLine)}
        </div>
      )}

      {/* Popover to show hidden segments */}
      {showPopover && displayData.hiddenSegments.length > 0 && (
        <div
          className="hidden-segments-popover"
          style={{
            position: "fixed",
            left: popoverPosition.x,
            top: popoverPosition.y,
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          <div className="popover-title">Hidden path segments:</div>
          <div className="popover-content">
            {displayData.hiddenSegments.map((segment, index) => (
              <div key={index} className="hidden-segment">
                {segment}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
