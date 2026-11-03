"use client";

import React, { useState, useEffect } from "react";
import { MemoryPhoto } from "@/types/memory";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

interface PhotoGalleryProps {
  photos: MemoryPhoto[];
  className?: string;
  onPhotoClick?: (index: number) => void;
}

export function PhotoGallery({ photos, className = "", onPhotoClick }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isReducedMotion = useReducedMotionPreference();

  if (!photos || photos.length === 0) return null;

  const handleOpenLightbox = (index: number) => {
    if (onPhotoClick) {
      onPhotoClick(index);
    } else {
      setLightboxIndex(index);
    }
  };

  return (
    <>
      <div className={`grid gap-3 ${photos.length === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"} ${className}`}>
        {photos.map((photo, idx) => (
          <PhotoThumbnail
            key={photo.id || idx}
            photo={photo}
            onClick={() => handleOpenLightbox(idx)}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-[100] bg-ink/90 backdrop-blur-sm flex items-center justify-center p-4 select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Photo Lightbox"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              aria-label="Close photo"
              className="absolute top-4 right-4 z-10 p-2 text-paper hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons if multiple photos */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1))
                  }
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-paper hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() =>
                    setLightboxIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0))
                  }
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-paper hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Main photo in lightbox */}
            <motion.div
              key={lightboxIndex}
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photos[lightboxIndex].dataUrl}
                alt={photos[lightboxIndex].altText || "Photograph"}
                className="max-h-[75vh] max-w-full object-contain rounded shadow-2xl border border-white/10"
              />
              <p className="text-paper/80 text-xs sm:text-sm mt-3 font-sans text-center">
                {photos[lightboxIndex].altText || photos[lightboxIndex].name}
                {photos.length > 1 && ` (${lightboxIndex + 1} of ${photos.length})`}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function PhotoThumbnail({ photo, onClick }: { photo: MemoryPhoto; onClick: () => void }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative cursor-pointer overflow-hidden rounded-[4px] border-2 border-white bg-paper-deep shadow-photo aspect-[4/3] focus:outline-none focus-visible:ring-2 focus-visible:ring-olive transition-transform hover:-translate-y-0.5"
    >
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-ink-muted bg-paper-deep p-4 text-center">
          <ImageIcon className="w-6 h-6 mb-1 text-ink-muted/60" />
          <span className="text-[11px] truncate max-w-full">{photo.name || "Photo"}</span>
        </div>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={photo.dataUrl}
          alt={photo.altText || photo.name || "Memory photograph"}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-ink/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}
