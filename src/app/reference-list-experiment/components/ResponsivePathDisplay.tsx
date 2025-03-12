import React from "react";
import {
  getResponsiveTruncationStyles,
  splitPathForResponsiveDisplay,
} from "../utils/truncateMiddle";

interface ResponsivePathDisplayProps {
  path: string;
  className?: string;
}

export function ResponsivePathDisplay({
  path,
  className = "",
}: ResponsivePathDisplayProps) {
  const styles = getResponsiveTruncationStyles();
  const { segments, hasParts } = splitPathForResponsiveDisplay(path);

  return (
    <>
      <style jsx>{styles.css}</style>

      {!hasParts ? (
        // Simple text without path segments
        <div className={`${styles.containerClass} ${className}`}>
          <div className={styles.textClass}>{segments[0].text}</div>
        </div>
      ) : (
        // Path with multiple segments
        <div className={`responsive-truncation-path ${className}`}>
          {segments[0].text && (
            <>
              <span className={`responsive-truncation-path-segment first`}>
                {segments[0].text}
              </span>
              <span className="text-gray-500">/</span>
            </>
          )}

          {segments[1].text && (
            <>
              <span className={`responsive-truncation-path-segment middle`}>
                {segments[1].text}
              </span>
              <span className="text-gray-500">/</span>
            </>
          )}

          <span className={`responsive-truncation-path-segment filename`}>
            {segments[2].text}
          </span>
        </div>
      )}
    </>
  );
}
