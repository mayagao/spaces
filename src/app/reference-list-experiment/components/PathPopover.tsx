import { RefObject } from "react";

interface PathPopoverProps {
  popoverRef: RefObject<HTMLDivElement | null>;
  showPopover: boolean;
  position: { x: number; y: number };
  name: {
    fullPath?: string;
    hiddenSegments: string[];
  };
  source: {
    hiddenSegments: string[];
  };
  secondLine?: {
    hiddenSegments: string[];
  } | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function PathPopover({
  popoverRef,
  showPopover,
  position,
  name,
  source,
  secondLine,
  onMouseEnter,
  onMouseLeave,
}: PathPopoverProps) {
  if (!showPopover) return null;

  return (
    <div
      ref={popoverRef}
      className="hidden-segments-popover"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        backgroundColor: "white",
        border: "1px solid #eee",
        padding: "8px",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
        fontSize: "12px",
        minWidth: "160px",
        fontFamily: "monospace",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="popover-content" style={{ lineHeight: "1.5" }}>
        {name.fullPath
          ? // Tree view for full path
            name.fullPath
              .split("/")
              .map((segment: string, index: number, array: string[]) => (
                <div
                  key={`path-${index}`}
                  className="path-segment"
                  style={{
                    paddingLeft: `${index * 12}px`,
                    color: index === array.length - 1 ? "#000" : "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {index < array.length - 1 ? (
                    <>
                      <span style={{ color: "#999" }}>└─</span>
                      <span>{segment}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ color: "#999" }}>└─</span>
                      <span style={{ fontWeight: "bold" }}>{segment}</span>
                    </>
                  )}
                </div>
              ))
          : // Original hidden segments display
          name.hiddenSegments.length > 0
          ? name.hiddenSegments.map((segment, index) => (
              <div
                key={`name-${index}`}
                className="hidden-segment"
                style={{
                  paddingLeft: `${index * 12}px`,
                  color:
                    index === name.hiddenSegments.length - 1 ? "#000" : "#666",
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
  );
}
