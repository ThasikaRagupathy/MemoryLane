"use client";

import React from "react";

export interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  kicker,
  title,
  description,
  action,
  children,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`mb-8 pb-6 border-b border-line/70 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {kicker && (
            <p className="text-xs uppercase tracking-widest text-olive font-medium mb-1.5">
              {kicker}
            </p>
          )}
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-normal tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-ink-muted mt-2 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
