"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { estimateLocalStorageUsage } from "@/lib/image-utils";
import { validateImportedData } from "@/lib/schema";
import { MemoryLaneData } from "@/types/memory";
import {
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldCheck,
  HardDrive,
  Eye,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SettingsPage() {
  const {
    preferences,
    updatePreferences,
    exportData,
    importData,
    resetToDefaults,
    clearAll,
    memories,
    collections,
    scrapbookBoards,
    addToast,
  } = useMemoryLane();

  // Storage usage stats
  const [storageStats, setStorageStats] = useState({
    usedBytes: 0,
    usedFormatted: "0 KB",
    itemCount: 0,
  });

  useEffect(() => {
    setStorageStats(estimateLocalStorageUsage());
  }, [memories, collections, scrapbookBoards]);

  // Import states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importedPreview, setImportedPreview] = useState<MemoryLaneData | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Confirm dialogs
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const rawJson = JSON.parse(event.target?.result as string);
        const result = validateImportedData(rawJson);
        if (result.valid && result.data) {
          setImportedPreview(result.data);
          setImportErrors([]);
          setIsImportModalOpen(true);
        } else {
          setImportedPreview(null);
          setImportErrors(result.errors);
          setIsImportModalOpen(true);
        }
      } catch (err: unknown) {
        setImportedPreview(null);
        setImportErrors(["The selected file is not a valid JSON file."]);
        setIsImportModalOpen(true);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExecuteImport = (mode: "merge" | "replace") => {
    if (!importedPreview) return;
    importData(importedPreview, mode);
    setIsImportModalOpen(false);
    setImportedPreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <PageHeader
        kicker="Preferences"
        title="Settings & Storage"
        description="Configure your reading experience, export your journal, or manage browser storage."
      />

      {/* Privacy Guarantee Notice */}
      <section className="bg-white-warm border border-line rounded-[8px] p-6 shadow-subtle flex flex-col sm:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-olive/15 text-olive flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-serif text-xl text-ink font-normal">Private by Design</h3>
          <p className="text-sm text-ink-muted leading-relaxed">
            Your memories stay in this browser in this prototype. They are never uploaded to an account or tracked by third parties. Clearing your browser cache or site data may erase them, so export a backup if you wish to keep a permanent archive.
          </p>
        </div>
      </section>

      {/* Reading & Motion Preferences */}
      <section className="bg-white-warm border border-line rounded-[8px] p-6 shadow-subtle flex flex-col gap-6">
        <div className="flex items-center gap-2 pb-3 border-b border-line/60">
          <Sliders className="w-4 h-4 text-olive" />
          <h3 className="font-serif text-xl text-ink font-normal">Display Preferences</h3>
        </div>

        {/* Card Density */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-medium text-ink">Timeline Card Density</h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Choose between generous spacing or a more compact multi-column view.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-paper-deep/50 p-1 rounded-[6px] border border-line shrink-0">
            <button
              onClick={() => updatePreferences({ cardDensity: "comfortable" })}
              className={`text-xs px-3 py-1.5 rounded-[4px] transition-colors ${
                preferences.cardDensity === "comfortable"
                  ? "bg-white-warm text-ink font-medium shadow-subtle"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Comfortable
            </button>
            <button
              onClick={() => updatePreferences({ cardDensity: "compact" })}
              className={`text-xs px-3 py-1.5 rounded-[4px] transition-colors ${
                preferences.cardDensity === "compact"
                  ? "bg-white-warm text-ink font-medium shadow-subtle"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Compact
            </button>
          </div>
        </div>

        {/* Motion Preference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-line/60">
          <div>
            <h4 className="text-sm font-medium text-ink">Motion & Animations</h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Control gentle transitions and page entrances.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-paper-deep/50 p-1 rounded-[6px] border border-line shrink-0">
            <button
              onClick={() => updatePreferences({ motion: "system" })}
              className={`text-xs px-3 py-1.5 rounded-[4px] transition-colors ${
                preferences.motion === "system"
                  ? "bg-white-warm text-ink font-medium shadow-subtle"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              System Default
            </button>
            <button
              onClick={() => updatePreferences({ motion: "reduced" })}
              className={`text-xs px-3 py-1.5 rounded-[4px] transition-colors ${
                preferences.motion === "reduced"
                  ? "bg-white-warm text-ink font-medium shadow-subtle"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Reduced Motion
            </button>
          </div>
        </div>
      </section>

      {/* Backup and Restore */}
      <section className="bg-white-warm border border-line rounded-[8px] p-6 shadow-subtle flex flex-col gap-6">
        <div className="flex items-center gap-2 pb-3 border-b border-line/60">
          <HardDrive className="w-4 h-4 text-olive" />
          <h3 className="font-serif text-xl text-ink font-normal">Data & Backups</h3>
        </div>

        {/* Storage stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[6px] bg-paper-subtle border border-line">
          <div>
            <span className="text-[11px] text-ink-muted uppercase tracking-wider block">Memories</span>
            <span className="font-serif text-2xl text-ink font-medium">{memories.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-ink-muted uppercase tracking-wider block">Collections</span>
            <span className="font-serif text-2xl text-ink font-medium">{collections.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-ink-muted uppercase tracking-wider block">Scrapbooks</span>
            <span className="font-serif text-2xl text-ink font-medium">{scrapbookBoards.length}</span>
          </div>
          <div>
            <span className="text-[11px] text-ink-muted uppercase tracking-wider block">Storage Used</span>
            <span className="font-serif text-2xl text-ink font-medium">{storageStats.usedFormatted}</span>
          </div>
        </div>

        {/* Export / Import actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-sm font-medium text-ink">Export Archive</h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Download a complete JSON snapshot of all your memories, collections, and boards.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={exportData}
          >
            Export JSON
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-line/60">
          <div>
            <h4 className="text-sm font-medium text-ink">Import Archive</h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Restore memories from a previously exported MemoryLane JSON file.
            </p>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Import JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Demo Data Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-line/60">
          <div>
            <h4 className="text-sm font-medium text-ink">Demo Sample Moments</h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Reload the curated fictional sample memories and scrapbook boards for demo evaluation.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setIsResetConfirmOpen(true)}
          >
            Reload Demo Data
          </Button>
        </div>

        {/* Clear All */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-line/60">
          <div>
            <h4 className="text-sm font-medium text-terracotta">Clear All Local Data</h4>
            <p className="text-xs text-ink-muted mt-0.5">
              Permanently delete all stored memories and scrapbook boards from this browser.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsClearConfirmOpen(true)}
          >
            Clear All
          </Button>
        </div>
      </section>

      {/* Import Preview Modal */}
      <Dialog
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Archive"
        maxWidth="md"
      >
        {importErrors.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="p-3 bg-terracotta/10 border border-terracotta/30 rounded text-xs text-terracotta flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Could not validate backup file:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {importErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setIsImportModalOpen(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        ) : importedPreview ? (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-ink-muted">
              Backup file validated successfully. Found:
            </p>

            <div className="grid grid-cols-3 gap-3 p-3 bg-paper-subtle border border-line rounded text-center">
              <div>
                <span className="text-[11px] text-ink-muted uppercase block">Memories</span>
                <span className="font-serif text-xl text-ink font-medium">
                  {importedPreview.memories.length}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-ink-muted uppercase block">Collections</span>
                <span className="font-serif text-xl text-ink font-medium">
                  {importedPreview.collections.length}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-ink-muted uppercase block">Boards</span>
                <span className="font-serif text-xl text-ink font-medium">
                  {importedPreview.scrapbookBoards.length}
                </span>
              </div>
            </div>

            <div className="p-3 bg-paper-deep/60 rounded text-xs text-ink-muted leading-relaxed">
              <strong>Merge:</strong> Keeps your existing entries and adds new memories from the file.<br />
              <strong>Replace:</strong> Completely overwrites your local journal with the imported backup.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line/60">
              <Button variant="ghost" size="sm" onClick={() => setIsImportModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExecuteImport("merge")}
              >
                Merge with Existing
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExecuteImport("replace")}
              >
                Replace All
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>

      {/* Confirm Reload Demo Data */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetToDefaults}
        title="Reload demo moments?"
        message="This will reload the initial sample memories, mood archives, and scrapbook board."
        confirmLabel="Reload Demo"
        variant="primary"
      />

      {/* Confirm Clear All */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={clearAll}
        title="Erase all local journal memories?"
        message="This cannot be undone. All memories, photographs, and scrapbook items stored in this browser will be cleared."
        confirmLabel="Erase Everything"
        variant="danger"
      />
    </div>
  );
}
