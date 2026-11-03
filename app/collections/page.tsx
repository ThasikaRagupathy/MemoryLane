"use client";

import React from "react";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { PageHeader } from "@/components/layout/PageHeader";
import { CollectionGrid } from "@/components/collections/CollectionGrid";

export default function CollectionsPage() {
  const { collections } = useMemoryLane();

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        kicker="Archives"
        title="Curated Collections"
        description="Revisit your moments through the people, chapters, and emotional rhythms that define them."
      />

      <CollectionGrid collections={collections} />
    </div>
  );
}
