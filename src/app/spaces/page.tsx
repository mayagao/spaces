"use client";

import { spaces } from "../data/spaces";
import { PageTitle } from "../components/shared/PageTitle";
import { GridList } from "../components/shared/GridList";
import { Card } from "../components/shared/Card";
import { PlusIcon } from "@primer/octicons-react";
import { useCallback } from "react";

export default function SpacesPage() {
  // Function to open modal in create mode
  const handleCreate = useCallback(() => {
    // Get the modal state from the parent layout
    const event = new CustomEvent("openSpaceSettingsModal", {
      detail: { mode: "create" },
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <div className="p-8">
      <PageTitle
        icon="star"
        title="Spaces"
        description="Create a centralized home for related to a specific project or knowledge areas."
        action={
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            <PlusIcon size={16} />
            Create
          </button>
        }
      />

      <GridList>
        {spaces.map((space) => (
          <Card
            key={space.id}
            href={`/spaces/${space.id}`}
            icon={space.icon}
            iconColor={space.color}
            title={space.title}
            description={space.description}
          />
        ))}
      </GridList>
    </div>
  );
}
