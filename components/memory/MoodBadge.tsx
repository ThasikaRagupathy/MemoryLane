"use client";

import React from "react";
import { Mood } from "@/types/memory";
import { MOODS } from "@/lib/constants";

export interface MoodBadgeProps {
  mood?: Mood;
  size?: "sm" | "md";
  showDotOnly?: boolean;
  className?: string;
}

export function MoodBadge({
  mood,
  size = "md",
  showDotOnly = false,
  className = "",
}: MoodBadgeProps) {
  if (!mood) return null;
  const meta = MOODS[mood];
  if (!meta) return null;

  if (showDotOnly) {
    return (
      <span
        title={meta.label}
        className={`inline-block rounded-full ${
          size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5"
        } ${className}`}
        style={{ backgroundColor: meta.dotColor }}
      />
    );
  }

  const sizeClasses =
    size === "sm" ? "text-[11px] px-2 py-0.5 gap-1.5" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${sizeClasses} ${className}`}
      style={{
        backgroundColor: meta.bgLight,
        borderColor: meta.border,
        color: meta.text,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: meta.dotColor }}
      />
      <span>{meta.label}</span>
    </span>
  );
}
