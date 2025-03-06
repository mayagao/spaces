"use client";

import { spaces } from "../data/spaces";
import { PageTitle } from "../components/shared/PageTitle";
import { GridList } from "../components/shared/GridList";
import { Card } from "../components/shared/Card";
import { PlusIcon } from "@primer/octicons-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-[880px] mx-auto px-8">
      <PageTitle
        icon="star"
        title="Spaces"
        description="Create a centralized home for related to a specific project or knowledge areas."
        action={
          <Button
            onClick={handleCreate}
            className="bg-green-700 text-white hover:bg-green-600"
          >
            <PlusIcon size={16} />
            Create
          </Button>
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
