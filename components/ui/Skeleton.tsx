"use client";

import React from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-paper-deep/70 rounded-[4px] ${className}`}
      aria-hidden="true"
    />
  );
}
