"use client";

import React from "react";
import { FilterState, Mood } from "@/types/memory";
import { MOOD_LIST } from "@/lib/constants";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { getAllUniqueTags } from "@/lib/memory-utils";
import { Search, X, Heart, ArrowUpDown, Filter } from "lucide-react";
import { Button } from "../ui/Button";

export interface MemoryFiltersProps {
  filters: FilterState;
  onChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
}

export function MemoryFilters({ filters, onChange, onReset }: MemoryFiltersProps) {
  const { memories, collections } = useMemoryLane();
  const allTags = getAllUniqueTags(memories);

  const customCollections = collections.filter((c) => c.kind === "custom");

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.mood ||
      filters.collectionId ||
      filters.favoritesOnly ||
      filters.tag ||
      filters.year
  );

  return (
    <div className="flex flex-col gap-4 bg-paper-subtle border border-line rounded-[6px] p-4 sm:p-5 shadow-subtle mb-8">
      {/* Search and primary controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search moments, notes, places, tags..."
            className="w-full bg-white-warm border border-line rounded-[6px] pl-10 pr-9 py-2 text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ search: "" })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort and Favorites toggles */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onChange({ favoritesOnly: !filters.favoritesOnly })}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-[6px] border transition-colors ${
              filters.favoritesOnly
                ? "bg-terracotta/15 border-terracotta/40 text-terracotta"
                : "bg-white-warm border-line text-ink-muted hover:text-ink hover:bg-paper-deep/60"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                filters.favoritesOnly ? "fill-terracotta text-terracotta" : ""
              }`}
            />
            <span>Favorites</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onChange({ sortOrder: filters.sortOrder === "newest" ? "oldest" : "newest" })
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white-warm border border-line text-ink-muted hover:text-ink rounded-[6px] transition-colors"
            title={`Currently sorted ${filters.sortOrder}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="capitalize">{filters.sortOrder}</span>
          </button>
        </div>
      </div>

      {/* Mood Filter chips */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 border-t border-line/60">
        <span className="text-xs font-medium text-ink-muted shrink-0 flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-olive" />
          <span>Mood:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => onChange({ mood: undefined })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              !filters.mood
                ? "bg-olive text-paper border-olive font-medium"
                : "bg-white-warm text-ink-muted border-line hover:bg-paper-deep"
            }`}
          >
            All
          </button>
          {MOOD_LIST.map((m) => {
            const isSelected = filters.mood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange({ mood: isSelected ? undefined : (m.id as Mood) })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors inline-flex items-center gap-1.5 ${
                  isSelected
                    ? "font-medium shadow-sm"
                    : "bg-white-warm text-ink-muted border-line hover:bg-paper-deep"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: m.bgLight,
                        borderColor: m.border,
                        color: m.text,
                      }
                    : {}
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: m.dotColor }}
                />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary filter selectors (Collections & Tags) */}
      {(customCollections.length > 0 || allTags.length > 0) && (
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-ink-muted">
          {customCollections.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span>Collection:</span>
              <select
                value={filters.collectionId || ""}
                onChange={(e) => onChange({ collectionId: e.target.value || undefined })}
                className="bg-white-warm border border-line rounded px-2 py-1 text-xs text-ink focus:outline-none focus:border-olive"
              >
                <option value="">All Collections</option>
                {customCollections.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.name} ({col.memoryIds.length})
                  </option>
                ))}
              </select>
            </div>
          )}

          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span>Tag:</span>
              <select
                value={filters.tag || ""}
                onChange={(e) => onChange({ tag: e.target.value || undefined })}
                className="bg-white-warm border border-line rounded px-2 py-1 text-xs text-ink focus:outline-none focus:border-olive"
              >
                <option value="">All Tags</option>
                {allTags.map((t) => (
                  <option key={t.tag} value={t.tag}>
                    #{t.tag} ({t.count})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Active Filter Chips bar (if filters are active) */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-line/60">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-ink-muted mr-1">
              Active:
            </span>
            {filters.search && (
              <span className="inline-flex items-center gap-1 text-xs bg-paper-deep text-ink px-2 py-0.5 rounded border border-line">
                Search: &quot;{filters.search}&quot;
                <button onClick={() => onChange({ search: "" })} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.mood && (
              <span className="inline-flex items-center gap-1 text-xs bg-paper-deep text-ink px-2 py-0.5 rounded border border-line capitalize">
                Mood: {filters.mood}
                <button onClick={() => onChange({ mood: undefined })} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.favoritesOnly && (
              <span className="inline-flex items-center gap-1 text-xs bg-paper-deep text-ink px-2 py-0.5 rounded border border-line">
                Favorites
                <button
                  onClick={() => onChange({ favoritesOnly: false })}
                  className="hover:text-terracotta"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.collectionId && (
              <span className="inline-flex items-center gap-1 text-xs bg-paper-deep text-ink px-2 py-0.5 rounded border border-line">
                Collection
                <button
                  onClick={() => onChange({ collectionId: undefined })}
                  className="hover:text-terracotta"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.tag && (
              <span className="inline-flex items-center gap-1 text-xs bg-paper-deep text-ink px-2 py-0.5 rounded border border-line">
                #{filters.tag}
                <button onClick={() => onChange({ tag: undefined })} className="hover:text-terracotta">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs h-7">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
