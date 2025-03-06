"use client";

import { spaces } from "../data/spaces";
import { PageTitle } from "../components/shared/PageTitle";
import { GridList } from "../components/shared/GridList";
import { SpaceCard } from "../components/shared/SpaceCard";
import { PlusIcon } from "@primer/octicons-react";

export default function SpacesPage() {
  return (
    <div className="p-8">
      <PageTitle
        icon="star"
        title="Spaces"
        description="Create a centralized home for related to a specific project or knowledge areas."
        action={
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2">
            <PlusIcon size={16} />
            Create
          </button>
        }
      />

      <GridList>
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </GridList>
    </div>
  );
}
