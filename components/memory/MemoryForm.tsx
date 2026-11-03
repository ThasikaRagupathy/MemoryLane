"use client";

import React, { useState, useRef } from "react";
import { Memory, MemoryPhoto, Mood } from "@/types/memory";
import { MOOD_LIST } from "@/lib/constants";
import { getTodayDateString } from "@/lib/date-utils";
import { processImageFile } from "@/lib/image-utils";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { Button } from "../ui/Button";
import {
  UploadCloud,
  X,
  Heart,
  Calendar,
  MapPin,
  Tag as TagIcon,
  FolderHeart,
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface MemoryFormProps {
  initialMemory?: Memory;
  onSaveSuccess: (memory: Memory) => void;
  onCancel: () => void;
}

export function MemoryForm({ initialMemory, onSaveSuccess, onCancel }: MemoryFormProps) {
  const { addMemory, updateMemory, collections, addToast } = useMemoryLane();

  // Form states
  const [title, setTitle] = useState(initialMemory?.title || "");
  const [date, setDate] = useState(initialMemory?.date || getTodayDateString());
  const [mood, setMood] = useState<Mood | undefined>(initialMemory?.mood);
  const [note, setNote] = useState(initialMemory?.note || "");
  const [place, setPlace] = useState(initialMemory?.place || "");
  const [favorite, setFavorite] = useState(Boolean(initialMemory?.favorite));
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    initialMemory?.collectionIds?.[0] || ""
  );

  // Photos
  const [photos, setPhotos] = useState<MemoryPhoto[]>(initialMemory?.photos || []);
  const [isProcessingPhotos, setIsProcessingPhotos] = useState(false);

  // Tags
  const [tags, setTags] = useState<string[]>(initialMemory?.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, "").toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingPhotos(true);
    const newPhotos: MemoryPhoto[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const processed = await processImageFile(file);
        newPhotos.push({
          id: processed.id,
          name: processed.name,
          mimeType: processed.mimeType,
          dataUrl: processed.dataUrl,
          width: processed.width,
          height: processed.height,
          altText: processed.altText,
        });
      } catch (err: unknown) {
        addToast({
          type: "error",
          message: "Could not add image",
          subtext: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setIsProcessingPhotos(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = "A title is required for this moment.";
    } else if (title.length > 100) {
      errs.title = "Title should be 100 characters or fewer.";
    }

    if (!date) {
      errs.date = "Please choose a date.";
    }

    if (note.length > 5000) {
      errs.note = "Note exceeds 5,000 characters.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const collectionIds = selectedCollectionId ? [selectedCollectionId] : [];

    try {
      if (initialMemory) {
        const updated = await updateMemory(initialMemory.id, {
          title: title.trim(),
          date,
          mood,
          note,
          place: place.trim() || undefined,
          tags,
          favorite,
          collectionIds,
          photos,
        });
        onSaveSuccess(updated);
      } else {
        const created = await addMemory({
          title: title.trim(),
          date,
          mood,
          note,
          place: place.trim() || undefined,
          tags,
          favorite,
          collectionIds,
          photos,
        });
        onSaveSuccess(created);
      }
    } catch (err: unknown) {
      console.error(err);
      addToast({
        type: "error",
        message: "Failed to save memory",
        subtext: err instanceof Error ? err.message : "Check browser storage",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const customCollections = collections.filter((c) => c.kind === "custom");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <label htmlFor="memory-title" className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1.5">
          Title <span className="text-terracotta">*</span>
        </label>
        <input
          id="memory-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          placeholder="The little café by the sea"
          maxLength={100}
          className={`w-full bg-white-warm border rounded-[6px] px-3.5 py-2.5 text-base text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-1 transition-colors ${
            errors.title ? "border-terracotta focus:ring-terracotta" : "border-line focus:border-olive focus:ring-olive"
          }`}
        />
        {errors.title && (
          <p className="flex items-center gap-1 text-xs text-terracotta mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errors.title}</span>
          </p>
        )}
      </div>

      {/* Date & Mood Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label htmlFor="memory-date" className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-olive" />
            <span>Date <span className="text-terracotta">*</span></span>
          </label>
          <input
            id="memory-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white-warm border border-line rounded-[6px] px-3 py-2 text-sm text-ink focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive"
          />
        </div>

        {/* Place */}
        <div>
          <label htmlFor="memory-place" className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-olive" />
            <span>Place (Optional)</span>
          </label>
          <input
            id="memory-place"
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="A place, a street, or just 'home'"
            maxLength={80}
            className="w-full bg-white-warm border border-line rounded-[6px] px-3 py-2 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive"
          />
        </div>
      </div>

      {/* Mood Selector */}
      <div>
        <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-2">
          Mood (How did it feel?)
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_LIST.map((m) => {
            const isSelected = mood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(isSelected ? undefined : (m.id as Mood))}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all inline-flex items-center gap-1.5 ${
                  isSelected
                    ? "font-semibold shadow-sm ring-1 ring-ink/10"
                    : "bg-white-warm text-ink-muted border-line hover:bg-paper-deep"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: m.bgLight,
                        borderColor: m.border,
                        color: m.text,
                      }
                    : {}
                }
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.dotColor }} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note Text */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="memory-note" className="block text-xs uppercase tracking-wider font-medium text-ink-muted">
            The Note
          </label>
          <span className="text-[11px] text-ink-muted">{note.length} / 5,000</span>
        </div>
        <textarea
          id="memory-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What do you want to remember about this moment? Words spoken, the weather, little details..."
          rows={5}
          maxLength={5000}
          className="w-full bg-white-warm border border-line rounded-[6px] p-3 text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive leading-relaxed font-sans"
        />
      </div>

      {/* Photo Upload & Previews */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted flex items-center gap-1">
            <UploadCloud className="w-3.5 h-3.5 text-olive" />
            <span>Photographs</span>
          </label>
          <span className="text-[11px] text-ink-muted">Automatically compressed for local storage</span>
        </div>

        {/* Existing photos preview */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
            {photos.map((p) => (
              <div key={p.id} className="relative group rounded-[4px] overflow-hidden border border-line bg-paper-deep aspect-square shadow-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.dataUrl} alt={p.altText || p.name} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(p.id)}
                  aria-label="Remove photo"
                  className="absolute top-1 right-1 p-1 bg-ink/75 text-paper hover:bg-terracotta rounded-full transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Trigger */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-line hover:border-olive/70 bg-paper/40 hover:bg-paper-deep/40 rounded-[6px] p-4 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1"
        >
          {isProcessingPhotos ? (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Loader2 className="w-4 h-4 animate-spin text-olive" />
              <span>Optimizing photo...</span>
            </div>
          ) : (
            <>
              <UploadCloud className="w-5 h-5 text-ink-muted mb-0.5" />
              <p className="text-xs font-medium text-ink">Click to add photos</p>
              <p className="text-[11px] text-ink-muted">PNG, JPG, WebP up to 12MB</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Tags and Custom Collection Assignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tags */}
        <div>
          <label htmlFor="tag-input" className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1.5 flex items-center gap-1">
            <TagIcon className="w-3.5 h-3.5 text-olive" />
            <span>Tags</span>
          </label>
          <div className="flex items-center gap-1.5 mb-2">
            <input
              id="tag-input"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="e.g. coffee, walk, quiet"
              className="flex-1 bg-white-warm border border-line rounded px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:border-olive"
            />
            <Button type="button" variant="secondary" size="sm" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 text-[11px] bg-paper-deep text-ink px-2 py-0.5 rounded border border-line"
                >
                  #{t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-terracotta">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Collection */}
        {customCollections.length > 0 && (
          <div>
            <label htmlFor="collection-select" className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1.5 flex items-center gap-1">
              <FolderHeart className="w-3.5 h-3.5 text-olive" />
              <span>Collection</span>
            </label>
            <select
              id="collection-select"
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className="w-full bg-white-warm border border-line rounded-[6px] px-3 py-2 text-xs text-ink focus:outline-none focus:border-olive"
            >
              <option value="">None (Personal)</option>
              {customCollections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Favorite toggle */}
      <div className="flex items-center justify-between pt-3 border-t border-line/60">
        <label className="flex items-center gap-2 text-xs text-ink cursor-pointer select-none">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
            className="rounded border-line text-olive focus:ring-olive w-4 h-4 cursor-pointer"
          />
          <Heart className={`w-3.5 h-3.5 ${favorite ? "fill-terracotta text-terracotta" : "text-ink-muted"}`} />
          <span>Mark as a favorite moment</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-line/60">
        <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Preserving...</span>
            </span>
          ) : initialMemory ? (
            "Save Changes"
          ) : (
            "Save Memory"
          )}
        </Button>
      </div>
    </form>
  );
}
