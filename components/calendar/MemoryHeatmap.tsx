"use client";

import React, { useState, useMemo } from "react";
import { Memory } from "@/types/memory";
import { formatDayAndMonth, isLeapYear, parseLocalDate } from "@/lib/date-utils";

export interface MemoryHeatmapProps {
  memories: Memory[];
  onSelectDate?: (dateStr: string) => void;
}

export function MemoryHeatmap({ memories, onSelectDate }: MemoryHeatmapProps) {
  // Discover available years from memories, default to latest year (or current year)
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    years.add(new Date().getFullYear().toString());
    for (const mem of memories) {
      years.add(mem.date.split("-")[0]);
    }
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [memories]);

  const [selectedYear, setSelectedYear] = useState<string>(
    availableYears[0] || new Date().getFullYear().toString()
  );
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
    visible: boolean;
  }>({ text: "", x: 0, y: 0, visible: false });

  // Map memory counts by date
  const countsByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const mem of memories) {
      if (mem.date.startsWith(selectedYear)) {
        map.set(mem.date, (map.get(mem.date) || 0) + 1);
      }
    }
    return map;
  }, [memories, selectedYear]);

  // Total memories for selected year
  const totalInYear = useMemo(() => {
    let sum = 0;
    countsByDate.forEach((count) => {
      sum += count;
    });
    return sum;
  }, [countsByDate]);

  // Build grid of 53 weeks x 7 days
  const yearNum = parseInt(selectedYear, 10);
  const isLeap = isLeapYear(yearNum);
  const daysInYear = isLeap ? 366 : 365;

  const startDate = new Date(yearNum, 0, 1);
  const startDayOfWeek = startDate.getDay(); // 0 is Sunday

  // Generate day items
  const days = useMemo(() => {
    const arr: { dateStr: string; month: number; day: number; count: number }[] = [];
    for (let i = 0; i < daysInYear; i++) {
      const d = new Date(yearNum, 0, i + 1);
      const mStr = String(d.getMonth() + 1).padStart(2, "0");
      const dStr = String(d.getDate()).padStart(2, "0");
      const dateStr = `${yearNum}-${mStr}-${dStr}`;
      const count = countsByDate.get(dateStr) || 0;
      arr.push({ dateStr, month: d.getMonth(), day: d.getDate(), count });
    }
    return arr;
  }, [yearNum, daysInYear, countsByDate]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-paper-deep/50 hover:border-line border border-transparent";
    if (count === 1) return "bg-sage hover:border-olive border border-sage-deep/60";
    if (count === 2) return "bg-sage-deep text-paper hover:border-olive border border-sage-deep";
    return "bg-olive text-paper hover:ring-2 hover:ring-olive border border-olive-dark";
  };

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <div className="bg-white-warm border border-line rounded-[8px] p-5 sm:p-6 shadow-subtle relative select-none">
      {/* Year selection and summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-serif text-2xl text-ink font-normal">Annual Rhythm</h3>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            {totalInYear} {totalInYear === 1 ? "moment" : "moments"} recorded in {selectedYear}
          </p>
        </div>

        {/* Year toggle buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {availableYears.map((yr) => (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className={`text-xs px-3 py-1.5 rounded-[4px] border transition-colors ${
                selectedYear === yr
                  ? "bg-olive text-paper border-olive font-medium"
                  : "bg-paper-deep/60 text-ink-muted hover:text-ink border-line"
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Grid with horizontal scroll on small screens */}
      <div className="overflow-x-auto pb-4 pt-1">
        <div className="min-w-[720px]">
          {/* Month labels */}
          <div className="flex justify-between text-[11px] text-ink-muted mb-2 px-1">
            {months.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          {/* 7-row grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {/* Blanks before Jan 1 */}
            {Array.from({ length: startDayOfWeek }).map((_, idx) => (
              <div key={`blank-${idx}`} className="w-3.5 h-3.5" />
            ))}

            {/* Cells */}
            {days.map((item) => {
              const label = `${item.count} ${item.count === 1 ? "memory" : "memories"} — ${formatDayAndMonth(item.dateStr)}`;

              return (
                <button
                  key={item.dateStr}
                  type="button"
                  aria-label={label}
                  onClick={() => onSelectDate && onSelectDate(item.dateStr)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      text: label,
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                      visible: true,
                    });
                  }}
                  onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
                  className={`w-3.5 h-3.5 rounded-[2px] transition-all relative ${getIntensityClass(
                    item.count
                  )}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend & Accessibility details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-line/60 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <span>Fewer</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-[2px] bg-paper-deep/50 border border-line" />
            <span className="w-3 h-3 rounded-[2px] bg-sage border border-sage-deep/60" />
            <span className="w-3 h-3 rounded-[2px] bg-sage-deep border border-sage-deep" />
            <span className="w-3 h-3 rounded-[2px] bg-olive border border-olive-dark" />
          </div>
          <span>More moments</span>
        </div>
        <p className="text-[11px] text-ink-muted/80">
          Tip: Click any day cell to inspect moments recorded on that date.
        </p>
      </div>

      {/* Tooltip portal */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1 bg-ink text-paper text-xs rounded shadow-lg whitespace-nowrap"
          style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
