"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { MOODS } from "@/lib/constants";
import { PageHeader } from "@/components/layout/PageHeader";
import { MemoryGrid } from "@/components/memory/MemoryGrid";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { MemoryForm } from "@/components/memory/MemoryForm";
import { ArrowLeft, Edit3, Trash2, Plus, Sparkles } from "lucide-react";

export default function CollectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { collections, memories, updateCollection, deleteCollection } = useMemoryLane();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const collection = collections.find((c) => c.slug === slug || c.id === slug);

  if (!collection) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="font-serif text-3xl text-ink font-normal mb-3">Collection not found</h2>
        <p className="text-sm text-ink-muted mb-6">
          This collection may have been removed or does not exist.
        </p>
        <Link href="/collections">
          <Button variant="secondary" size="md">
            Return to collections
          </Button>
        </Link>
      </div>
    );
  }

  // Get memories for this collection
  const collectionMemories =
    collection.kind === "mood"
      ? memories.filter((m) => m.mood === collection.mood)
      : memories.filter((m) => collection.memoryIds.includes(m.id));

  const moodMeta = collection.mood ? MOODS[collection.mood] : null;

  const handleOpenEdit = () => {
    setEditName(collection.name);
    setEditDesc(collection.description || "");
    setIsEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    updateCollection(collection.id, {
      name: editName.trim(),
      description: editDesc.trim(),
    });
    setIsEditOpen(false);
  };

  const handleDeleteCollection = () => {
    deleteCollection(collection.id);
    router.push("/collections");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <div className="mb-4">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All collections</span>
        </Link>
      </div>

      <PageHeader
        kicker={collection.kind === "mood" ? "Mood Archive" : "Custom Collection"}
        title={collection.name}
        description={collection.description || `${collectionMemories.length} moments preserved`}
        action={
          <div className="flex items-center gap-2">
            {collection.kind === "custom" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={handleOpenEdit}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="w-3.5 h-3.5 text-terracotta" />}
                  onClick={() => setIsDeleteOpen(true)}
                >
                  Delete
                </Button>
              </>
            )}
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddMemoryOpen(true)}
            >
              Add memory
            </Button>
          </div>
        }
      >
        {moodMeta && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
            style={{
              backgroundColor: moodMeta.bgLight,
              borderColor: moodMeta.border,
              color: moodMeta.text,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: moodMeta.dotColor }} />
            <span>Emotional tone: {moodMeta.label}</span>
          </div>
        )}
      </PageHeader>

      {/* Memory Grid */}
      <MemoryGrid
        memories={collectionMemories}
        emptyTitle="No moments in this collection"
        emptyDescription="Add memories to this collection to curate them together."
        onOpenAddMemory={() => setIsAddMemoryOpen(true)}
      />

      {/* Edit Collection Modal */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Collection"
        maxWidth="sm"
      >
        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1">
              Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-white-warm border border-line rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-olive"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1">
              Description
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={3}
              className="w-full bg-white-warm border border-line rounded p-2.5 text-sm text-ink focus:outline-none focus:border-olive"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line/60">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Collection Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCollection}
        title="Delete collection?"
        message={`"${collection.name}" will be removed. None of the memories inside will be deleted.`}
        confirmLabel="Delete Collection"
      />

      {/* Add Memory Modal */}
      <Dialog
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        title="Record a Moment"
        description={`This moment will be added to ${collection.name}.`}
        maxWidth="lg"
      >
        <MemoryForm
          initialMemory={
            collection.kind === "mood"
              ? ({ mood: collection.mood } as any)
              : ({ collectionIds: [collection.id] } as any)
          }
          onSaveSuccess={() => {
            setIsAddMemoryOpen(false);
          }}
          onCancel={() => setIsAddMemoryOpen(false)}
        />
      </Dialog>
    </div>
  );
}
