"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Memory } from "@/types/memory";
import { matchesOnThisDay, getYearsAgoText, formatEditorialDate } from "@/lib/date-utils";
import { Sparkles, Calendar, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { MoodBadge } from "./MoodBadge";
import { Button } from "../ui/Button";

export interface OnThisDayCardProps {
  memories: Memory[];
  targetDate?: string;
  onOpenAddMemory?: () => void;
  onSelectMemory?: (memory: Memory) => void;
}

export function OnThisDayCard({
  memories,
  targetDate,
  onOpenAddMemory,
  onSelectMemory,
}: OnThisDayCardProps) {
  // Find matching memories from prior years
  const matchingMemories = memories.filter((m) => matchesOnThisDay(m.date, targetDate));
  const [currentIndex, setCurrentIndex] = useState(0);

  if (matchingMemories.length === 0) {
    return (
      <div className="relative overflow-hidden bg-white-warm/80 border border-line rounded-[8px] p-6 sm:p-7 shadow-subtle">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-olive font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-olive" />
          <span>On This Day</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal mb-2">
          A quiet day in history
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed max-w-md mb-4">
          No memories saved on this calendar day in previous years. Maybe something small and lovely will happen today that deserves keeping.
        </p>
        {onOpenAddMemory && (
          <Button variant="outline" size="sm" onClick={onOpenAddMemory}>
            Record a moment for today
          </Button>
        )}
      </div>
    );
  }

  const activeMemory = matchingMemories[currentIndex] || matchingMemories[0];
  const yearsAgoText = getYearsAgoText(activeMemory.date, targetDate);
  const primaryPhoto = activeMemory.photos?.[0];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white-warm to-paper-subtle border border-line rounded-[8px] p-6 sm:p-7 shadow-card">
      {/* Decorative time capsule kicker */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-olive font-medium">
          <Sparkles className="w-4 h-4 text-olive" />
          <span>On This Day &bull; {yearsAgoText}</span>
        </div>

        {matchingMemories.length > 1 && (
          <div className="flex items-center gap-1 text-xs text-ink-muted">
            <span>
              {currentIndex + 1} of {matchingMemories.length}
            </span>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev > 0 ? prev - 1 : matchingMemories.length - 1))
              }
              aria-label="Previous on this day memory"
              className="p-1 hover:bg-paper-deep rounded"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev < matchingMemories.length - 1 ? prev + 1 : 0))
              }
              aria-label="Next on this day memory"
              className="p-1 hover:bg-paper-deep rounded"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Photo thumbnail if exists */}
        {primaryPhoto && (
          <div className="md:col-span-4 overflow-hidden rounded-[4px] border-2 border-white bg-paper-deep shadow-photo aspect-[4/3] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryPhoto.dataUrl}
              alt={primaryPhoto.altText || activeMemory.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className={primaryPhoto ? "md:col-span-8 flex flex-col justify-between" : "md:col-span-12"}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <time
                dateTime={activeMemory.date}
                className="text-xs text-ink-muted flex items-center gap-1"
              >
                <Calendar className="w-3 h-3 text-olive" />
                <span>{formatEditorialDate(activeMemory.date)}</span>
              </time>
              {activeMemory.mood && <MoodBadge mood={activeMemory.mood} size="sm" />}
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal tracking-tight mb-2">
              {activeMemory.title}
            </h3>

            {activeMemory.note && (
              <p className="text-sm text-ink-muted line-clamp-3 leading-relaxed mb-4">
                &ldquo;{activeMemory.note}&rdquo;
              </p>
            )}
          </div>

          <div>
            <Link
              href={`/memories/${activeMemory.id}`}
              onClick={(e) => {
                if (onSelectMemory) {
                  e.preventDefault();
                  onSelectMemory(activeMemory);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-olive hover:text-olive-dark tracking-wide uppercase transition-colors"
            >
              <span>Revisit this moment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
