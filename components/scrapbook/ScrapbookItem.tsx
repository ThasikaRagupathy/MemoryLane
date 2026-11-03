"use client";

import React, { useState } from "react";
import { ScrapbookItem as IScrapbookItem } from "@/types/memory";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { MoodBadge } from "../memory/MoodBadge";
import { formatShortDate } from "@/lib/date-utils";
import {
  RotateCw,
  BringToFront,
  SendToBack,
  Trash2,
  Move,
  Pin,
  Calendar,
} from "lucide-react";

export interface ScrapbookItemProps {
  item: IScrapbookItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<IScrapbookItem>) => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  isDragging?: boolean;
}

export function ScrapbookItem({
  item,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onBringForward,
  onSendBackward,
  isDragging = false,
}: ScrapbookItemProps) {
  const { memories } = useMemoryLane();
  const [showControls, setShowControls] = useState(false);

  const rotate = () => {
    // Rotate between -6 and +6 degrees nicely
    const nextRot = item.rotation >= 6 ? -6 : item.rotation + 3;
    onUpdate({ rotation: nextRot });
  };

  const referencedMemory = item.type === "memory" ? memories.find((m) => m.id === item.memoryId) : null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      style={{
        transform: `rotate(${item.rotation}deg)`,
        zIndex: isDragging ? 999 : item.zIndex,
      }}
      className={`relative cursor-grab active:cursor-grabbing transition-shadow select-none group ${
        isSelected ? "ring-2 ring-olive shadow-float" : "hover:shadow-card shadow-photo"
      }`}
    >
      {/* Floating control bar on hover or select */}
      {(showControls || isSelected) && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-ink/90 text-paper px-2 py-1 rounded-[6px] shadow-lg backdrop-blur text-[11px]"
        >
          <button
            type="button"
            onClick={rotate}
            title="Rotate card"
            className="p-1 hover:bg-white/20 rounded"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onBringForward}
            title="Bring forward"
            className="p-1 hover:bg-white/20 rounded"
          >
            <BringToFront className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onSendBackward}
            title="Send backward"
            className="p-1 hover:bg-white/20 rounded"
          >
            <SendToBack className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Remove from board"
            className="p-1 hover:bg-terracotta/80 text-terracotta-light rounded"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Item Type 1: Photograph Card (Polaroid / print style) */}
      {item.type === "photo" && (
        <div className="w-64 bg-white-warm border border-line p-3 pb-5 rounded-[3px] shadow-subtle flex flex-col">
          {/* Subtle tape / pin effect at top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-butter/60 backdrop-blur-sm -rotate-2 rounded-[1px] shadow-sm pointer-events-none" />

          <div className="w-full aspect-[4/3] bg-paper-deep overflow-hidden rounded-[2px] border border-black/5 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.photo.dataUrl}
              alt={item.photo.altText || item.caption || "Scrapbook photo"}
              className="w-full h-full object-cover pointer-events-none"
            />
          </div>

          <div className="px-1 text-center font-serif text-sm text-ink italic leading-snug">
            {item.caption || item.photo.name}
          </div>
        </div>
      )}

      {/* Item Type 2: Sticky / Handwritten Note Card */}
      {item.type === "note" && (
        <div
          className={`w-60 p-5 rounded-[3px] border shadow-subtle relative flex flex-col justify-between min-h-[140px] ${
            item.style === "sage"
              ? "bg-sage/70 border-sage-deep text-ink"
              : item.style === "butter"
              ? "bg-butter/70 border-butter-dark text-ink"
              : item.style === "terracotta"
              ? "bg-terracotta/20 border-terracotta/40 text-ink"
              : "bg-paper-subtle border-line text-ink"
          }`}
        >
          {/* Pushpin marker */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-terracotta">
            <Pin className="w-4 h-4 fill-terracotta" />
          </div>

          <p className="font-serif italic text-base sm:text-lg leading-relaxed whitespace-pre-wrap mt-2">
            {item.text}
          </p>

          <div className="mt-4 pt-2 border-t border-black/5 flex justify-end text-[10px] uppercase font-sans text-ink-muted/80 tracking-wider">
            Note
          </div>
        </div>
      )}

      {/* Item Type 3: Pinned Memory Card */}
      {item.type === "memory" && referencedMemory && (
        <div className="w-64 bg-white-warm border border-line rounded-[4px] p-4 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-ink-muted mb-2">
            <span className="flex items-center gap-1 font-sans text-[11px]">
              <Calendar className="w-3 h-3 text-olive" />
              <span>{formatShortDate(referencedMemory.date)}</span>
            </span>
            {referencedMemory.mood && <MoodBadge mood={referencedMemory.mood} size="sm" />}
          </div>

          <h4 className="font-serif text-lg text-ink font-normal leading-snug mb-2">
            {referencedMemory.title}
          </h4>

          {referencedMemory.photos?.[0] && (
            <div className="aspect-[16/10] bg-paper-deep rounded overflow-hidden mb-2 border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={referencedMemory.photos[0].dataUrl}
                alt={referencedMemory.title}
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          )}

          {referencedMemory.note && (
            <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
              {referencedMemory.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
