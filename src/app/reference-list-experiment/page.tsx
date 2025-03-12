"use client";

import { useState } from "react";
import { ReferenceList } from "../components/shared/resources/ReferenceList";
import { initialResources } from "../data/initialResources";
import { Button } from "@/components/ui/button";

const widthOptions = [
  { label: "Narrow (400px)", value: "400px" },
  { label: "Medium (600px)", value: "600px" },
  { label: "Wide (800px)", value: "800px" },
  { label: "Full", value: "100%" },
];

const displayOptions = [
  { label: "Default", value: "default" },
  { label: "Truncate Middle", value: "truncate-middle" },
  { label: "Show Full Path", value: "full-path" },
  { label: "Compact", value: "compact" },
];

export default function ReferenceListExperiment() {
  const [resources, setResources] = useState(initialResources);
  const [selectedWidth, setSelectedWidth] = useState("600px");
  const [displayMode, setDisplayMode] = useState<
    "default" | "truncate-middle" | "full-path" | "compact"
  >("default");

  const handleAddResource = (resource: any) => {
    setResources((current) => [resource, ...current]);
  };

  const handleEditResource = (resource: any) => {
    setResources((current) =>
      current.map((r) => (r.id === resource.id ? resource : r))
    );
  };

  const handleDeleteResource = (id: string) => {
    setResources((current) => current.filter((r) => r.id !== id));
  };

  const handleReorderResources = (reorderedResources: any[]) => {
    setResources(reorderedResources);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      {/* Controls */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-wrap items-center gap-6">
            {/* Width selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Width:</span>
              <div className="flex gap-2">
                {widthOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      selectedWidth === option.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedWidth(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Display mode selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">
                Display:
              </span>
              <div className="flex gap-2">
                {displayOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={
                      displayMode === option.value ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setDisplayMode(
                        option.value as
                          | "default"
                          | "truncate-middle"
                          | "full-path"
                          | "compact"
                      )
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content area with top padding to account for fixed controls */}
      <div className="pt-24">
        <div className="mx-auto" style={{ width: selectedWidth }}>
          <ReferenceList
            resources={resources}
            onAddResource={handleAddResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
            onReorderResources={handleReorderResources}
            displayMode={displayMode}
          />
        </div>
      </div>
    </div>
  );
}
