"use client";

import { useState } from "react";
import { ReferenceList } from "./components/ReferenceList";
import { Resource, ReferenceListConfig } from "./types";
import { initialResources } from "../data/initialResources";
import { Button } from "@/components/ui/button";
import { displayModes, getConfigForMode } from "./utils/referenceListConfig";

const widthOptions = [
  { label: "Narrow (400px)", value: "400px" },
  { label: "Medium (540px)", value: "540px" },
  { label: "Wide (800px)", value: "800px" },
  { label: "Full", value: "100%" },
];

export default function ReferenceListExperiment() {
  const [resources, setResources] = useState(initialResources);
  const [selectedWidth, setSelectedWidth] = useState("540px");
  const [selectedMode, setSelectedMode] = useState(displayModes[0]);
  const [columnConfig, setColumnConfig] = useState<ReferenceListConfig>(
    getConfigForMode(displayModes[0].value)
  );

  const handleAddResource = (resource: Resource) => {
    setResources((current) => [resource, ...current]);
  };

  const handleEditResource = (resource: Resource) => {
    setResources((current) =>
      current.map((r) => (r.id === resource.id ? resource : r))
    );
  };

  const handleDeleteResource = (id: string) => {
    setResources((current) => current.filter((r) => r.id !== id));
  };

  const handleReorderResources = (reorderedResources: Resource[]) => {
    setResources(reorderedResources);
  };

  const handleModeChange = (mode: (typeof displayModes)[0]) => {
    setSelectedMode(mode);
    setColumnConfig(getConfigForMode(mode.value));
  };

  return (
    <div className="min-h-screen p-8">
      {/* Controls */}
      <div className="fixed top-0 left-0 right-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 z-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-wrap items-start gap-6">
            {/* Width selector */}
            {/* <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-500">Width</span>
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
            </div> */}

            {/* Display mode selector */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2 mx-auto">
                {displayModes.map((mode) => (
                  <Button
                    key={mode.value}
                    variant={
                      selectedMode.value === mode.value ? "default" : "outline"
                    }
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleModeChange(mode)}
                  >
                    {mode.label}
                  </Button>
                ))}
              </div>
              <div className="text-sm text-gray-500 text-center">
                {selectedMode.description}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="pt-20">
        <div className="mx-auto" style={{ width: selectedWidth }}>
          <ReferenceList
            resources={resources}
            onAddResource={handleAddResource}
            onEditResource={handleEditResource}
            onDeleteResource={handleDeleteResource}
            onReorderResources={handleReorderResources}
            config={columnConfig}
          />
        </div>
      </div>
    </div>
  );
}
