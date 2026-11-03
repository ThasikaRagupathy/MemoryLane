"use client";

import React from "react";
import Link from "next/link";
import { MemoryCollection } from "@/types/memory";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { MOODS } from "@/lib/constants";
import { FolderHeart, Image as ImageIcon } from "lucide-react";

export interface CollectionCardProps {
  collection: MemoryCollection;
  className?: string;
}

export function CollectionCard({ collection, className = "" }: CollectionCardProps) {
  const { memories } = useMemoryLane();

  // Find memories in this collection
  const collectionMemories =
    collection.kind === "mood"
      ? memories.filter((m) => m.mood === collection.mood)
      : memories.filter((m) => collection.memoryIds.includes(m.id));

  // Find cover photo
  const coverMemory =
    (collection.coverMemoryId && memories.find((m) => m.id === collection.coverMemoryId)) ||
    collectionMemories.find((m) => m.photos && m.photos.length > 0);

  const coverPhoto = coverMemory?.photos?.[0];

  const moodMeta = collection.mood ? MOODS[collection.mood] : null;

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={`group block bg-white-warm border border-line rounded-[6px] shadow-subtle hover:shadow-card hover:border-line-dark transition-all duration-200 overflow-hidden flex flex-col justify-between p-4 sm:p-5 ${className}`}
    >
      <div>
        {/* Cover Photo / Thumbnail */}
        <div className="relative mb-3.5 aspect-[16/10] rounded-[4px] border-2 border-white bg-paper-deep shadow-photo overflow-hidden">
          {coverPhoto ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={coverPhoto.dataUrl}
              alt={coverPhoto.altText || collection.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center text-ink-muted/60 p-4 text-center"
              style={moodMeta ? { backgroundColor: moodMeta.bgLight } : {}}
            >
              {moodMeta ? (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-serif text-sm font-semibold"
                  style={{ backgroundColor: moodMeta.border, color: moodMeta.text }}
                >
                  {collection.name[0]}
                </div>
              ) : (
                <ImageIcon className="w-8 h-8 stroke-[1.2]" />
              )}
            </div>
          )}

          {/* Kind badge */}
          <div className="absolute top-2 left-2">
            {collection.kind === "mood" && moodMeta ? (
              <span
                className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-md"
                style={{
                  backgroundColor: moodMeta.bgLight,
                  borderColor: moodMeta.border,
                  color: moodMeta.text,
                }}
              >
                Mood
              </span>
            ) : (
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-paper/90 text-ink-muted border border-line shadow-sm backdrop-blur-md">
                Custom
              </span>
            )}
          </div>
        </div>

        {/* Title and memory count */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-serif text-xl text-ink font-normal group-hover:text-olive transition-colors leading-snug">
            {collection.name}
          </h3>
          <span className="text-xs font-medium text-ink-muted shrink-0 mt-0.5">
            {collectionMemories.length} {collectionMemories.length === 1 ? "moment" : "moments"}
          </span>
        </div>

        {/* Description */}
        {collection.description && (
          <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 leading-relaxed">
            {collection.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-line/50 flex items-center gap-1.5 text-xs text-olive font-medium">
        <FolderHeart className="w-3.5 h-3.5" />
        <span>Open collection</span>
      </div>
    </Link>
  );
}
