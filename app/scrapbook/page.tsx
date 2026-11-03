"use client";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrapbookCanvas } from "@/components/scrapbook/ScrapbookCanvas";

export default function ScrapbookPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        kicker="Scrapbook"
        title="Pieces of a day"
        description="A tactile canvas for photographs, handwritten notes, and moments arranged without a grid."
      />

      <ScrapbookCanvas />
    </div>
  );
}
