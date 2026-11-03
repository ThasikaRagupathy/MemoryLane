"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNavigation } from "./MobileNavigation";
import { ToastContainer } from "../ui/Toast";
import { Dialog } from "../ui/Dialog";
import { MemoryForm } from "../memory/MemoryForm";
import { useMemoryLane } from "@/hooks/useMemoryLane";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const { isLoaded } = useMemoryLane();

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col md:flex-row antialiased selection:bg-butter selection:text-ink">
      {/* Desktop Sidebar */}
      <Sidebar onOpenAddMemory={() => setIsAddMemoryOpen(true)} />

      {/* Mobile Top and Bottom bars */}
      <MobileNavigation onOpenAddMemory={() => setIsAddMemoryOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-20 md:pb-12 px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Global Add Memory Modal */}
      <Dialog
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        title="Record a Moment"
        description="Preserve what you don't want time to blur."
        maxWidth="lg"
      >
        <MemoryForm
          onSaveSuccess={() => {
            setIsAddMemoryOpen(false);
          }}
          onCancel={() => setIsAddMemoryOpen(false)}
        />
      </Dialog>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
}
