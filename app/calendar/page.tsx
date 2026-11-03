"use client";

import React from "react";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { PageHeader } from "@/components/layout/PageHeader";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { MemoryHeatmap } from "@/components/calendar/MemoryHeatmap";

export default function CalendarPage() {
  const { memories } = useMemoryLane();

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10">
      <PageHeader
        kicker="Calendar"
        title="A year in moments"
        description="Notice the quiet cadence of your life across days, weeks, and seasons."
      />

      {/* Heatmap Year View */}
      <section>
        <MemoryHeatmap memories={memories} />
      </section>

      {/* Monthly Interactive Calendar */}
      <section>
        <MonthCalendar memories={memories} />
      </section>
    </div>
  );
}
