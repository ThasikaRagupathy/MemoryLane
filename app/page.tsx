"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { formatEditorialDate, getTimeOfDayGreeting, getTodayDateString } from "@/lib/date-utils";
import { MOOD_LIST } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { MemoryForm } from "@/components/memory/MemoryForm";
import { OnThisDayCard } from "@/components/memory/OnThisDayCard";
import { MemoryCard } from "@/components/memory/MemoryCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Plus, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { memories, isLoaded } = useMemoryLane();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const todayStr = getTodayDateString();
  const formattedToday = formatEditorialDate(todayStr);
  const greeting = getTimeOfDayGreeting();

  // If loading from local storage
  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-8 max-w-5xl mx-auto py-6">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-80" />
          <Skeleton className="h-4 w-60" />
        </div>
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    );
  }

  // Sort memories newest first
  const sortedMemories = [...memories].sort((a, b) => b.date.localeCompare(a.date));
  const recentMemories = sortedMemories.slice(0, 3);

  // Compute moods breakdown from actual saved memories
  const moodCounts = new Map<string, number>();
  for (const mem of memories) {
    if (mem.mood) {
      moodCounts.set(mem.mood, (moodCounts.get(mem.mood) || 0) + 1);
    }
  }

  // Filter moods that have at least 1 memory, sorted by frequency
  const activeMoods = MOOD_LIST.filter((m) => (moodCounts.get(m.id) || 0) > 0).sort(
    (a, b) => (moodCounts.get(b.id) || 0) - (moodCounts.get(a.id) || 0)
  );

  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto">
      {/* Editorial Hero Banner */}
      <section className="pt-2 sm:pt-4">
        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted uppercase tracking-widest mb-3">
          <span>{greeting}</span>
          <span>&bull;</span>
          <span>{formattedToday}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-line/70">
          <div className="max-w-2xl">
            <h1 className="font-serif text-4xl sm:text-6xl text-ink font-normal tracking-tight leading-[1.1]">
              A life, in little moments.
            </h1>
            <p className="font-serif italic text-lg sm:text-xl text-ink-muted mt-3 max-w-xl">
              &ldquo;Keep the things you don&apos;t want time to blur.&rdquo;
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="lg"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddOpen(true)}
              className="shadow-card"
            >
              Add a memory
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {memories.length === 0 ? (
        <EmptyState
          title="Every story starts somewhere."
          description="Save a small moment today. You can add a photo, a few words, or both."
          actionLabel="Save your first memory"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <>
          {/* "On This Day" Time Capsule Card */}
          <section>
            <OnThisDayCard
              memories={memories}
              targetDate={todayStr}
              onOpenAddMemory={() => setIsAddOpen(true)}
            />
          </section>

          {/* Recently Remembered */}
          <section>
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-olive font-medium mb-1">
                  Recent Additions
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
                  Recently Remembered
                </h2>
              </div>
              <Link
                href="/timeline"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-olive hover:text-olive-dark tracking-wide uppercase transition-colors"
              >
                <span>View full timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentMemories.map((mem) => (
                <MemoryCard key={mem.id} memory={mem} />
              ))}
            </div>
          </section>

          {/* "Your Moods Lately" Section */}
          {activeMoods.length > 0 && (
            <section className="bg-paper-subtle border border-line rounded-[8px] p-6 shadow-subtle">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-ink font-normal">
                    How it has felt lately
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
                    Moments in your journal organized by emotional tone.
                  </p>
                </div>
                <Link
                  href="/collections"
                  className="text-xs text-olive font-medium hover:underline shrink-0"
                >
                  All collections &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {activeMoods.slice(0, 4).map((m) => {
                  const count = moodCounts.get(m.id) || 0;
                  return (
                    <Link
                      key={m.id}
                      href={`/collections/${m.id}`}
                      className="p-3.5 rounded-[6px] border transition-all hover:-translate-y-0.5 flex flex-col justify-between"
                      style={{
                        backgroundColor: m.bgLight,
                        borderColor: m.border,
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: m.dotColor }}
                        />
                        <span
                          className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-white/60"
                          style={{ color: m.text }}
                        >
                          {count}
                        </span>
                      </div>
                      <span className="font-serif text-lg font-medium" style={{ color: m.text }}>
                        {m.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Bottom reflective footer note */}
          <section className="text-center py-6 border-t border-line/60">
            <p className="font-serif italic text-sm text-ink-muted">
              &ldquo;Some moments deserve more than a camera roll.&rdquo;
            </p>
          </section>
        </>
      )}

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
