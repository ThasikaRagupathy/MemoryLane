"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Memory } from "@/types/memory";
import { MoodBadge } from "./MoodBadge";
import { formatEditorialDate, formatShortDate } from "@/lib/date-utils";
import { Heart, MapPin, Tag } from "lucide-react";
import { useMemoryLane } from "@/hooks/useMemoryLane";

export interface MemoryCardProps {
  memory: Memory;
  density?: "comfortable" | "compact";
  onSelect?: (memory: Memory) => void;
  className?: string;
}

export function MemoryCard({
  memory,
  density = "comfortable",
  onSelect,
  className = "",
}: MemoryCardProps) {
  const { toggleFavorite } = useMemoryLane();
  const [imgError, setImgError] = useState(false);

  const hasPhoto = memory.photos && memory.photos.length > 0;
  const primaryPhoto = hasPhoto ? memory.photos[0] : null;

  const handleCardClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(memory);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(memory.id);
  };

  const isCompact = density === "compact";

  return (
    <article
      className={`group relative bg-white-warm border border-line rounded-[6px] shadow-subtle hover:shadow-card hover:border-line-dark transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isCompact ? "p-3.5" : "p-5"
      } ${className}`}
    >
      <Link
        href={`/memories/${memory.id}`}
        onClick={handleCardClick}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-olive rounded-[4px]"
      >
        {/* Photo preview (if present) */}
        {primaryPhoto && !imgError && (
          <div className="mb-3.5 relative overflow-hidden rounded-[4px] border-2 border-white bg-paper-deep shadow-photo aspect-[16/10]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryPhoto.dataUrl}
              alt={primaryPhoto.altText || memory.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
            {memory.photos.length > 1 && (
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-ink/75 text-paper text-[10px] font-medium rounded backdrop-blur-sm">
                +{memory.photos.length - 1}
              </span>
            )}
          </div>
        )}

        {/* Date and Mood row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <time
            dateTime={memory.date}
            className="text-xs font-medium text-ink-muted tracking-tight"
            title={formatEditorialDate(memory.date)}
          >
            {formatShortDate(memory.date)}
          </time>
          {memory.mood && <MoodBadge mood={memory.mood} size="sm" />}
        </div>

        {/* Title */}
        <h3
          className={`font-serif text-ink font-normal leading-snug group-hover:text-olive transition-colors ${
            isCompact ? "text-lg mb-1.5" : "text-xl mb-2"
          }`}
        >
          {memory.title}
        </h3>

        {/* Note excerpt */}
        {memory.note && (
          <p
            className={`text-ink-muted text-xs sm:text-sm leading-relaxed line-clamp-3 font-normal ${
              isCompact ? "mb-2" : "mb-3"
            }`}
          >
            {memory.note}
          </p>
        )}
      </Link>

      {/* Card footer: place, tags, favorite button */}
      <div className="pt-2.5 mt-auto border-t border-line/50 flex items-center justify-between text-xs text-ink-muted">
        <div className="flex items-center gap-2 truncate">
          {memory.place && (
            <span
              className="inline-flex items-center gap-1 text-[11px] text-ink-muted truncate max-w-[130px]"
              title={memory.place}
            >
              <MapPin className="w-3 h-3 shrink-0 text-olive" />
              <span className="truncate">{memory.place}</span>
            </span>
          )}

          {memory.tags && memory.tags.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-ink-muted/80">
              <Tag className="w-2.5 h-2.5 shrink-0" />
              <span>#{memory.tags[0]}</span>
              {memory.tags.length > 1 && <span>+{memory.tags.length - 1}</span>}
            </span>
          )}
        </div>

        {/* Favorite toggle */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={memory.favorite ? "Remove favorite" : "Add to favorites"}
          className={`p-1.5 rounded-full transition-colors ${
            memory.favorite
              ? "text-terracotta hover:bg-terracotta/10"
              : "text-ink-muted/60 hover:text-ink hover:bg-paper-deep"
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              memory.favorite ? "fill-terracotta text-terracotta" : ""
            }`}
          />
        </button>
      </div>
    </article>
  );
}
