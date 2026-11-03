"use client";

import React from "react";
import { Memory } from "@/types/memory";
import { groupMemoriesByYearAndMonth } from "@/lib/memory-utils";
import { MemoryCard } from "./MemoryCard";
import { EmptyState } from "../ui/EmptyState";
import { useMemoryLane } from "@/hooks/useMemoryLane";

export interface MemoryTimelineProps {
  memories: Memory[];
  onSelectMemory?: (memory: Memory) => void;
  onOpenAddMemory?: () => void;
}

export function MemoryTimeline({
  memories,
  onSelectMemory,
  onOpenAddMemory,
}: MemoryTimelineProps) {
  const { preferences } = useMemoryLane();

  if (memories.length === 0) {
    return (
      <EmptyState
        title="No moments recorded here yet"
        description="Try adjusting your filters or record a new memory to add to the timeline."
        actionLabel={onOpenAddMemory ? "Add a memory" : undefined}
        onAction={onOpenAddMemory}
      />
    );
  }

  const yearGroups = groupMemoriesByYearAndMonth(memories);

  return (
    <div className="flex flex-col gap-12 relative">
      {yearGroups.map((yg) => (
        <section key={yg.year} className="relative">
          {/* Year Header Marker */}
          <div className="sticky top-14 md:top-4 z-20 bg-paper/95 backdrop-blur py-2 mb-6 border-b border-line flex items-baseline justify-between">
            <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
              {yg.year}
            </h2>
            <span className="text-xs text-ink-muted">
              {yg.totalMemories} {yg.totalMemories === 1 ? "moment" : "moments"}
            </span>
          </div>

          {/* Month sections */}
          <div className="flex flex-col gap-10">
            {yg.monthGroups.map((mg) => (
              <div key={mg.monthKey} className="relative">
                {/* Month title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-olive/80" />
                  <h3 className="font-serif text-xl text-ink font-normal">{mg.monthTitle}</h3>
                  <div className="h-[1px] flex-1 bg-line/60" />
                </div>

                {/* Cards for this month */}
                <div
                  className={`grid ${
                    preferences.cardDensity === "compact"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  }`}
                >
                  {mg.memories.map((mem) => (
                    <MemoryCard
                      key={mem.id}
                      memory={mem}
                      density={preferences.cardDensity}
                      onSelect={onSelectMemory}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
