"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { MemoryDetail } from "@/components/memory/MemoryDetail";
import { Dialog } from "@/components/ui/Dialog";
import { MemoryForm } from "@/components/memory/MemoryForm";
import { Button } from "@/components/ui/Button";

export default function MemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { memories } = useMemoryLane();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const memory = memories.find((m) => m.id === id);

  if (!memory) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <h2 className="font-serif text-3xl text-ink font-normal mb-3">Memory not found</h2>
        <p className="text-sm text-ink-muted mb-6">
          This moment may have been deleted or does not exist.
        </p>
        <Link href="/timeline">
          <Button variant="secondary" size="md">
            Return to Timeline
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <MemoryDetail
        memory={memory}
        onEdit={() => setIsEditOpen(true)}
        showBackLink={true}
      />

      {/* Edit Memory Modal */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Memory"
        description="Update your notes, photograph, or date."
        maxWidth="lg"
      >
        <MemoryForm
          initialMemory={memory}
          onSaveSuccess={() => {
            setIsEditOpen(false);
          }}
          onCancel={() => setIsEditOpen(false)}
        />
      </Dialog>
    </div>
  );
}
