"use client";

import { useEffect, useState } from "react";
import { Resource } from "./ResourceItem";
import {
  calculateTotalResourceSize,
  formatBytes,
} from "./utils/resourceSizeUtils";

interface ResourceLimitBarProps {
  resources: Resource[];
  maxSizeBytes: number;
}

export function ResourceLimitBar({
  resources,
  maxSizeBytes,
}: ResourceLimitBarProps) {
  const [totalSizeBytes, setTotalSizeBytes] = useState(0);
  const [usedPercentage, setUsedPercentage] = useState(0);
  const [remainingBytes, setRemainingBytes] = useState(maxSizeBytes);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update calculations when resources change
  useEffect(() => {
    const newTotalSize = calculateTotalResourceSize(resources);

    // If size has changed, trigger animation
    if (newTotalSize !== totalSizeBytes) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600); // Animation duration
    }

    setTotalSizeBytes(newTotalSize);
    setUsedPercentage(Math.min(100, (newTotalSize / maxSizeBytes) * 100));
    setRemainingBytes(Math.max(0, maxSizeBytes - newTotalSize));
  }, [resources, maxSizeBytes, totalSizeBytes]);

  // Determine color based on usage
  const getBarColor = (): string => {
    if (usedPercentage < 70) return "bg-green-500";
    if (usedPercentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-2 mb-4">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Resource Usage</span>
        <span className={isAnimating ? "font-bold" : ""}>
          {formatBytes(totalSizeBytes)} / {formatBytes(maxSizeBytes)} (
          {usedPercentage.toFixed(1)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className={`h-2.5 rounded-full ${getBarColor()} transition-all duration-500 ease-in-out ${
            isAnimating ? "pulse-animation" : ""
          }`}
          style={{ width: `${usedPercentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1 flex justify-between">
        <span>
          {remainingBytes > 0
            ? `${formatBytes(remainingBytes)} remaining`
            : "Resource limit reached"}
        </span>
        {usedPercentage >= 90 && (
          <span className="text-red-500 font-medium">
            {usedPercentage >= 100 ? "Limit reached!" : "Almost full!"}
          </span>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
        .pulse-animation {
          animation: pulse 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
