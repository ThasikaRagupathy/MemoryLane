"use client";

import React, { useState } from "react";
import { MemoryCollection } from "@/types/memory";
import { CollectionCard } from "./CollectionCard";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { Plus, FolderPlus } from "lucide-react";
import { useMemoryLane } from "@/hooks/useMemoryLane";

export function CollectionGrid({
  collections,
  showCreateButton = true,
}: {
  collections: MemoryCollection[];
  showCreateButton?: boolean;
}) {
  const { createCollection } = useMemoryLane();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a collection name.");
      return;
    }
    createCollection(name.trim(), description.trim());
    setName("");
    setDescription("");
    setError("");
    setIsCreateOpen(false);
  };

  const moodCollections = collections.filter((c) => c.kind === "mood");
  const customCollections = collections.filter((c) => c.kind === "custom");

  return (
    <div className="flex flex-col gap-12">
      {/* Custom collections section */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-2xl text-ink font-normal">Personal Collections</h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
              Curated themes, people, and chapters of your life.
            </p>
          </div>
          {showCreateButton && (
            <Button
              variant="outline"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsCreateOpen(true)}
            >
              New Collection
            </Button>
          )}
        </div>

        {customCollections.length === 0 ? (
          <div className="border border-dashed border-line bg-paper/40 rounded-lg p-6 text-center text-ink-muted text-sm">
            No custom collections yet. Create your first theme like &quot;Quiet Sundays&quot; or &quot;Little Adventures&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {customCollections.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        )}
      </div>

      {/* Mood collections section */}
      <div>
        <div className="mb-6">
          <h2 className="font-serif text-2xl text-ink font-normal">Mood Archives</h2>
          <p className="text-xs sm:text-sm text-ink-muted mt-0.5">
            Automatic collections organized by how each moment felt.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {moodCollections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </div>

      {/* Create Custom Collection Modal */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="New Collection"
        description="Organize memories under a shared theme or chapter."
        maxWidth="sm"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1">
              Collection Name <span className="text-terracotta">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Quiet Sundays, First Times, Roadtrips"
              maxLength={60}
              className="w-full bg-white-warm border border-line rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-olive"
            />
            {error && <p className="text-xs text-terracotta mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A few words about what belongs here..."
              rows={3}
              maxLength={200}
              className="w-full bg-white-warm border border-line rounded p-2.5 text-sm text-ink focus:outline-none focus:border-olive"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-line/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<FolderPlus className="w-4 h-4" />}
            >
              Create Collection
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
