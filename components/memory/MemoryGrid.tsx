"use client";

import React from "react";
import { Memory } from "@/types/memory";
import { MemoryCard } from "./MemoryCard";
import { EmptyState } from "../ui/EmptyState";
import { useMemoryLane } from "@/hooks/useMemoryLane";

export interface MemoryGridProps {
  memories: Memory[];
  onSelectMemory?: (memory: Memory) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onOpenAddMemory?: () => void;
}

export function MemoryGrid({
  memories,
  onSelectMemory,
  emptyTitle = "No memories found",
  emptyDescription = "There are no memories that match this view.",
  onOpenAddMemory,
}: MemoryGridProps) {
  const { preferences } = useMemoryLane();

  if (memories.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onOpenAddMemory ? "Save a memory" : undefined}
        onAction={onOpenAddMemory}
      />
    );
  }

  const gridCols =
    preferences.cardDensity === "compact"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={`grid ${gridCols}`}>
      {memories.map((mem) => (
        <MemoryCard
          key={mem.id}
          memory={mem}
          density={preferences.cardDensity}
          onSelect={onSelectMemory}
        />
      ))}
    </div>
  );
}
