"use client";

import React, { useState, useMemo } from "react";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { FilterState, Memory } from "@/types/memory";
import { filterAndSortMemories } from "@/lib/memory-utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { MemoryFilters } from "@/components/memory/MemoryFilters";
import { MemoryTimeline } from "@/components/memory/MemoryTimeline";
import { Dialog } from "@/components/ui/Dialog";
import { MemoryForm } from "@/components/memory/MemoryForm";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

const INITIAL_FILTERS: FilterState = {
  search: "",
  favoritesOnly: false,
  sortOrder: "newest",
};

export default function TimelinePage() {
  const { memories, collections } = useMemoryLane();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleFilterUpdate = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleFilterReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  const filteredMemories = useMemo(() => {
    return filterAndSortMemories(memories, filters, collections);
  }, [memories, filters, collections]);

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        kicker="Chronicle"
        title="The story so far"
        description="Every preserved moment, arranged through the quiet passage of months and seasons."
        action={
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddOpen(true)}
          >
            Add a memory
          </Button>
        }
      />

      {/* Search and Filters */}
      <MemoryFilters
        filters={filters}
        onChange={handleFilterUpdate}
        onReset={handleFilterReset}
      />

      {/* Chronological Timeline with Year & Month groupings */}
      <MemoryTimeline
        memories={filteredMemories}
        onOpenAddMemory={() => setIsAddOpen(true)}
      />

      {/* Add Memory Modal */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Record a Moment"
        description="Preserve what you don't want time to blur."
        maxWidth="lg"
      >
        <MemoryForm
          onSaveSuccess={() => {
            setIsAddOpen(false);
          }}
          onCancel={() => setIsAddOpen(false)}
        />
      </Dialog>
    </div>
  );
}
