"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Memory } from "@/types/memory";
import { MoodBadge } from "./MoodBadge";
import { PhotoGallery } from "./PhotoGallery";
import { formatEditorialDate } from "@/lib/date-utils";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import {
  Calendar,
  MapPin,
  Heart,
  Edit3,
  Trash2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FolderHeart,
  Tag,
} from "lucide-react";

export interface MemoryDetailProps {
  memory: Memory;
  onEdit?: (memory: Memory) => void;
  onClose?: () => void;
  showBackLink?: boolean;
}

export function MemoryDetail({
  memory,
  onEdit,
  onClose,
  showBackLink = true,
}: MemoryDetailProps) {
  const router = useRouter();
  const { memories, deleteMemory, toggleFavorite, collections } = useMemoryLane();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Find adjacent memories for Prev/Next navigation
  const currentIndex = memories.findIndex((m) => m.id === memory.id);
  const prevMemory = currentIndex > 0 ? memories[currentIndex - 1] : null;
  const nextMemory =
    currentIndex >= 0 && currentIndex < memories.length - 1 ? memories[currentIndex + 1] : null;

  // Containing collections
  const containingCollections = collections.filter((c) =>
    memory.collectionIds.includes(c.id)
  );

  const handleDelete = async () => {
    await deleteMemory(memory.id);
    if (onClose) {
      onClose();
    } else {
      router.push("/timeline");
    }
  };

  return (
    <article className="max-w-3xl mx-auto py-2">
      {/* Top navigation row */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-line/60">
        <div>
          {showBackLink && (
            <button
              onClick={() => (onClose ? onClose() : router.back())}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-2">
          {prevMemory && (
            <Link
              href={`/memories/${prevMemory.id}`}
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-deep rounded transition-colors"
              title={`Previous: ${prevMemory.title}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          {nextMemory && (
            <Link
              href={`/memories/${nextMemory.id}`}
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-deep rounded transition-colors"
              title={`Next: ${nextMemory.title}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      {/* Date, Mood, and Actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <time
            dateTime={memory.date}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-ink-muted"
          >
            <Calendar className="w-4 h-4 text-olive" />
            <span>{formatEditorialDate(memory.date)}</span>
          </time>

          {memory.mood && <MoodBadge mood={memory.mood} size="md" />}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleFavorite(memory.id)}
            aria-label={memory.favorite ? "Unmark favorite" : "Mark favorite"}
            className={`p-2 rounded-full transition-colors ${
              memory.favorite
                ? "text-terracotta bg-terracotta/10"
                : "text-ink-muted hover:text-ink hover:bg-paper-deep"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${memory.favorite ? "fill-terracotta text-terracotta" : ""}`}
            />
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(memory)}
              aria-label="Edit memory"
              className="p-2 text-ink-muted hover:text-ink hover:bg-paper-deep rounded-full transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsConfirmDeleteOpen(true)}
            aria-label="Delete memory"
            className="p-2 text-ink-muted hover:text-terracotta hover:bg-paper-deep rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-serif text-3xl sm:text-5xl text-ink font-normal tracking-tight leading-tight mb-4">
        {memory.title}
      </h1>

      {/* Place */}
      {memory.place && (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-ink-muted mb-6">
          <MapPin className="w-4 h-4 text-olive" />
          <span>{memory.place}</span>
        </div>
      )}

      {/* Photo Gallery */}
      {memory.photos && memory.photos.length > 0 && (
        <div className="mb-8">
          <PhotoGallery photos={memory.photos} />
        </div>
      )}

      {/* Note body */}
      {memory.note && (
        <div className="mb-8 prose prose-stone max-w-none">
          <p className="text-base sm:text-lg text-ink font-serif leading-relaxed whitespace-pre-wrap">
            {memory.note}
          </p>
        </div>
      )}

      {/* Tags and Collections footer */}
      <div className="pt-6 border-t border-line/60 flex flex-col gap-3">
        {containingCollections.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-ink-muted flex-wrap">
            <FolderHeart className="w-3.5 h-3.5 text-olive shrink-0" />
            <span>In collections:</span>
            {containingCollections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="bg-paper-deep hover:bg-paper-deep/80 text-ink px-2.5 py-0.5 rounded border border-line transition-colors"
              >
                {col.name}
              </Link>
            ))}
          </div>
        )}

        {memory.tags && memory.tags.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-ink-muted flex-wrap">
            <Tag className="w-3.5 h-3.5 text-olive shrink-0" />
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="bg-paper-deep text-ink-muted px-2 py-0.5 rounded border border-line text-[11px]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this moment?"
        message={`"${memory.title}" will be permanently removed from your journal and collections.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </article>
  );
}
