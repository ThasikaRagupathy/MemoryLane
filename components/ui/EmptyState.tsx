"use client";

import React from "react";
import { Button } from "./Button";
import { BookOpen } from "lucide-react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title = "Every story starts somewhere.",
  description = "Save a small moment today. You can add a photo, a few words, or both.",
  actionLabel,
  onAction,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`border border-dashed border-line bg-paper/50 rounded-lg p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-paper-deep border border-line flex items-center justify-center text-ink-muted mb-4">
        {icon || <BookOpen className="w-6 h-6 stroke-[1.5]" />}
      </div>
      <h3 className="font-serif text-2xl text-ink font-normal">{title}</h3>
      <p className="text-sm text-ink-muted mt-2 max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
