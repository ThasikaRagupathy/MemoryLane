"use client";

import React, { useState } from "react";
import { Memory } from "@/types/memory";
import { parseLocalDate, getTodayDateString, formatEditorialDate } from "@/lib/date-utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Grid } from "lucide-react";
import { MemoryCard } from "../memory/MemoryCard";

export interface MonthCalendarProps {
  memories: Memory[];
  onSelectDate?: (dateStr: string) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthCalendar({ memories, onSelectDate }: MonthCalendarProps) {
  const todayStr = getTodayDateString();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month
  const firstDay = new Date(year, month, 1);
  const startingDayOfWeek = firstDay.getDay(); // 0-6

  // Total days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map of memories by date string "YYYY-MM-DD"
  const memoryMap = new Map<string, Memory[]>();
  for (const mem of memories) {
    if (!memoryMap.has(mem.date)) {
      memoryMap.set(mem.date, []);
    }
    memoryMap.get(mem.date)!.push(mem);
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedMemories = memoryMap.get(selectedDate) || [];

  return (
    <div className="flex flex-col gap-8">
      {/* Calendar Header Controls */}
      <div className="bg-white-warm border border-line rounded-[8px] p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-2xl text-ink font-normal">{monthName}</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="p-1.5 rounded hover:bg-paper-deep text-ink-muted hover:text-ink transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="p-1.5 rounded hover:bg-paper-deep text-ink-muted hover:text-ink transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const now = new Date();
                setCurrentDate(now);
                setSelectedDate(todayStr);
              }}
              className="text-xs px-2.5 py-1 rounded border border-line bg-paper-deep/60 hover:bg-paper-deep text-ink transition-colors"
            >
              Today
            </button>
            <div className="flex items-center border border-line rounded overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-1.5 transition-colors ${
                  viewMode === "grid" ? "bg-olive text-paper" : "bg-white-warm text-ink-muted hover:text-ink"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-1.5 transition-colors ${
                  viewMode === "list" ? "bg-olive text-paper" : "bg-white-warm text-ink-muted hover:text-ink"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div>
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {WEEKDAYS.map((day) => (
                <div key={day} className="text-xs font-medium text-ink-muted uppercase tracking-wider py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Empty padding before month start */}
              {Array.from({ length: startingDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-14 sm:h-20 rounded-[4px] bg-paper/20" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const dayMemories = memoryMap.get(dateStr) || [];
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                const hasMemories = dayMemories.length > 0;

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(dateStr);
                      if (onSelectDate) onSelectDate(dateStr);
                    }}
                    className={`h-14 sm:h-20 p-1.5 rounded-[4px] border text-left flex flex-col justify-between transition-all select-none ${
                      isSelected
                        ? "border-olive ring-2 ring-olive/40 bg-olive-light/60 font-medium"
                        : hasMemories
                        ? "border-line bg-paper-subtle hover:border-olive/60 hover:bg-paper-deep/60"
                        : "border-transparent hover:bg-paper-deep/40 text-ink-muted/80"
                    } ${isToday ? "border-dashed !border-olive" : ""}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={`text-xs ${
                          isToday
                            ? "w-5 h-5 rounded-full bg-olive text-paper flex items-center justify-center font-bold"
                            : isSelected
                            ? "text-olive font-bold"
                            : "text-ink"
                        }`}
                      >
                        {dayNum}
                      </span>
                      {hasMemories && (
                        <span className="text-[10px] text-olive font-semibold px-1 rounded bg-olive/15">
                          {dayMemories.length}
                        </span>
                      )}
                    </div>

                    {/* Dot indicators */}
                    {hasMemories && (
                      <div className="flex items-center gap-1 flex-wrap">
                        {dayMemories.slice(0, 3).map((m, mIdx) => (
                          <span
                            key={m.id || mIdx}
                            className="w-1.5 h-1.5 rounded-full bg-olive"
                            title={m.title}
                          />
                        ))}
                        {dayMemories.length > 3 && (
                          <span className="text-[9px] text-ink-muted">+{dayMemories.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Accessible List View */
          <div className="divide-y divide-line/60">
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const dayMemories = memoryMap.get(dateStr) || [];
              if (dayMemories.length === 0) return null;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`py-3 px-2 flex items-center justify-between cursor-pointer rounded transition-colors ${
                    selectedDate === dateStr ? "bg-olive-light/70" : "hover:bg-paper-deep/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-ink font-medium">
                      {formatEditorialDate(dateStr)}
                    </span>
                    <span className="text-xs bg-olive/15 text-olive px-2 py-0.5 rounded font-medium">
                      {dayMemories.length} {dayMemories.length === 1 ? "moment" : "moments"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Day Inspector */}
      <div className="border-t border-line/70 pt-6">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-olive font-medium">
              Selected Day
            </p>
            <h3 className="font-serif text-2xl text-ink font-normal">
              {formatEditorialDate(selectedDate)}
            </h3>
          </div>
          <span className="text-xs text-ink-muted">
            {selectedMemories.length} {selectedMemories.length === 1 ? "memory" : "memories"}
          </span>
        </div>

        {selectedMemories.length === 0 ? (
          <div className="border border-dashed border-line bg-paper/30 rounded-lg p-6 text-center text-ink-muted text-sm">
            No memories recorded on this date.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedMemories.map((mem) => (
              <MemoryCard key={mem.id} memory={mem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
