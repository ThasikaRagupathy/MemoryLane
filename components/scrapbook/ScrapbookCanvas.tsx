"use client";

import React, { useState, useRef, useEffect } from "react";
import { ScrapbookBoard, ScrapbookItem as IScrapbookItem, ScrapbookItemStyle } from "@/types/memory";
import { ScrapbookItem } from "./ScrapbookItem";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { processImageFile } from "@/lib/image-utils";
import {
  Plus,
  StickyNote,
  Image as ImageIcon,
  Pin,
  RotateCcw,
  Move,
  UploadCloud,
  Check,
} from "lucide-react";

export function ScrapbookCanvas() {
  const { scrapbookBoards, saveScrapbookBoard, memories, addToast } = useMemoryLane();
  const board = scrapbookBoards[0] || {
    id: "board-default",
    title: "My Keepsake Board",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [],
  };

  const [items, setItems] = useState<IScrapbookItem[]>(board.items || []);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Sync when board changes externally
  useEffect(() => {
    if (board && board.items) {
      setItems(board.items);
    }
  }, [board.id, board.updatedAt]);

  // Dragging state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Modals for adding cards
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteStyle, setNoteStyle] = useState<ScrapbookItemStyle>("paper");

  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [photoCaption, setPhotoCaption] = useState("");

  const [isPinMemoryOpen, setIsPinMemoryOpen] = useState(false);
  const [selectedMemoryId, setSelectedMemoryId] = useState("");

  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Persist items to board
  const persistBoardItems = (updatedItems: IScrapbookItem[]) => {
    setItems(updatedItems);
    saveScrapbookBoard({
      ...board,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  // Drag handlers
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    const item = items.find((i) => i.id === id);
    if (!item || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      offsetX: e.clientX - canvasRect.left - item.x,
      offsetY: e.clientY - canvasRect.top - item.y,
    };

    setDraggingId(id);
    setSelectedItemId(id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingId || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const nextX = Math.max(
      10,
      Math.min(canvasRect.width - 240, e.clientX - canvasRect.left - dragOffsetRef.current.offsetX)
    );
    const nextY = Math.max(
      10,
      Math.min(canvasRect.height - 200, e.clientY - canvasRect.top - dragOffsetRef.current.offsetY)
    );

    setItems((prev) =>
      prev.map((item) => (item.id === draggingId ? { ...item, x: nextX, y: nextY } : item))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingId) {
      persistBoardItems(items);
      setDraggingId(null);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Keyboard accessibility: Move selected item with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItemId) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const delta = e.shiftKey ? 30 : 12;
        setItems((prev) => {
          const next = prev.map((item) => {
            if (item.id !== selectedItemId) return item;
            let nx = item.x;
            let ny = item.y;
            if (e.key === "ArrowUp") ny = Math.max(10, ny - delta);
            if (e.key === "ArrowDown") ny = ny + delta;
            if (e.key === "ArrowLeft") nx = Math.max(10, nx - delta);
            if (e.key === "ArrowRight") nx = nx + delta;
            return { ...item, x: nx, y: ny };
          });
          persistBoardItems(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId, items]);

  const bringForward = (id: string) => {
    const maxZ = Math.max(0, ...items.map((i) => i.zIndex));
    const next = items.map((i) => (i.id === id ? { ...i, zIndex: maxZ + 1 } : i));
    persistBoardItems(next);
  };

  const sendBackward = (id: string) => {
    const minZ = Math.min(1, ...items.map((i) => i.zIndex));
    const next = items.map((i) => (i.id === id ? { ...i, zIndex: Math.max(1, minZ - 1) } : i));
    persistBoardItems(next);
  };

  const deleteItem = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    persistBoardItems(next);
    if (selectedItemId === id) setSelectedItemId(null);
  };

  const updateItem = (id: string, updates: Partial<IScrapbookItem>) => {
    const next = items.map((i) => (i.id === id ? ({ ...i, ...updates } as IScrapbookItem) : i));
    persistBoardItems(next);
  };

  // Add Note Submit
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newItem: IScrapbookItem = {
      id: `sb-note-${Date.now()}`,
      type: "note",
      text: noteText.trim(),
      style: noteStyle,
      x: 100 + (items.length % 5) * 40,
      y: 80 + (items.length % 4) * 35,
      rotation: Math.floor(Math.random() * 6) - 3,
      zIndex: items.length + 1,
    };

    persistBoardItems([...items, newItem]);
    setNoteText("");
    setIsAddNoteOpen(false);
  };

  // Add Photo Submit
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const processed = await processImageFile(file);
      const newItem: IScrapbookItem = {
        id: `sb-photo-${Date.now()}`,
        type: "photo",
        photo: {
          id: processed.id,
          name: processed.name,
          mimeType: processed.mimeType,
          dataUrl: processed.dataUrl,
          altText: processed.altText,
        },
        caption: photoCaption.trim() || processed.name,
        x: 80 + (items.length % 5) * 40,
        y: 60 + (items.length % 4) * 35,
        rotation: Math.floor(Math.random() * 6) - 3,
        zIndex: items.length + 1,
      };

      persistBoardItems([...items, newItem]);
      setPhotoCaption("");
      setIsAddPhotoOpen(false);
    } catch (err: unknown) {
      addToast({
        type: "error",
        message: "Failed to add photo",
        subtext: err instanceof Error ? err.message : "Error reading file",
      });
    }
  };

  // Pin Memory Submit
  const handlePinMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemoryId) return;

    const newItem: IScrapbookItem = {
      id: `sb-mem-${Date.now()}`,
      type: "memory",
      memoryId: selectedMemoryId,
      x: 120 + (items.length % 5) * 30,
      y: 90 + (items.length % 4) * 30,
      rotation: Math.floor(Math.random() * 4) - 2,
      zIndex: items.length + 1,
    };

    persistBoardItems([...items, newItem]);
    setSelectedMemoryId("");
    setIsPinMemoryOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Board Toolbar */}
      <div className="bg-white-warm border border-line rounded-[8px] p-4 flex flex-wrap items-center justify-between gap-4 shadow-subtle select-none">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink font-normal">{board.title}</h2>
          <p className="text-xs text-ink-muted">
            Drag to arrange freely. Use arrow keys to nudge.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={<StickyNote className="w-4 h-4 text-olive" />}
            onClick={() => setIsAddNoteOpen(true)}
          >
            Add Note
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<ImageIcon className="w-4 h-4 text-olive" />}
            onClick={() => setIsAddPhotoOpen(true)}
          >
            Add Photo
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Pin className="w-4 h-4 text-olive" />}
            onClick={() => setIsPinMemoryOpen(true)}
          >
            Pin Memory
          </Button>

          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => setIsClearConfirmOpen(true)}
            className="text-xs"
          >
            Clear Board
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => setSelectedItemId(null)}
        className="relative w-full min-h-[680px] bg-[#F7F3EA] border border-line rounded-[8px] shadow-inner overflow-hidden touch-none"
        style={{
          backgroundImage: `radial-gradient(#D6CEC2 0.75px, transparent 0.75px)`,
          backgroundSize: "24px 24px",
        }}
      >
        {items.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-ink-muted pointer-events-none select-none">
            <Move className="w-10 h-10 text-ink-muted/40 mb-3 stroke-[1.2]" />
            <h3 className="font-serif text-2xl text-ink font-normal mb-1">An Open Canvas</h3>
            <p className="text-sm max-w-sm">
              Pin photos, write sticky reflections, or feature favorite memories here.
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                position: "absolute",
                left: `${item.x}px`,
                top: `${item.y}px`,
              }}
              onPointerDown={(e) => handlePointerDown(item.id, e)}
            >
              <ScrapbookItem
                item={item}
                isSelected={selectedItemId === item.id}
                isDragging={draggingId === item.id}
                onSelect={() => setSelectedItemId(item.id)}
                onUpdate={(updates) => updateItem(item.id, updates)}
                onDelete={() => deleteItem(item.id)}
                onBringForward={() => bringForward(item.id)}
                onSendBackward={() => sendBackward(item.id)}
              />
            </div>
          ))
        )}
      </div>

      {/* Add Note Modal */}
      <Dialog
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        title="Add a Handwritten Note"
        maxWidth="sm"
      >
        <form onSubmit={handleAddNote} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1">
              Note Text
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="A line of poetry, a thought, or a quiet reminder..."
              rows={4}
              maxLength={240}
              className="w-full bg-white-warm border border-line rounded p-3 text-sm text-ink focus:outline-none focus:border-olive font-serif leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1.5">
              Paper Tone
            </label>
            <div className="flex gap-2">
              {(["paper", "sage", "butter", "terracotta"] as ScrapbookItemStyle[]).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setNoteStyle(style)}
                  className={`px-3 py-1.5 text-xs rounded border capitalize transition-all ${
                    noteStyle === style ? "ring-2 ring-olive font-medium" : "border-line"
                  } ${
                    style === "sage"
                      ? "bg-sage"
                      : style === "butter"
                      ? "bg-butter"
                      : style === "terracotta"
                      ? "bg-terracotta/30"
                      : "bg-paper-deep"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line/60">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddNoteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Place on Board
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Add Photo Modal */}
      <Dialog
        isOpen={isAddPhotoOpen}
        onClose={() => setIsAddPhotoOpen(false)}
        title="Pin a Photograph"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1">
              Caption (Optional)
            </label>
            <input
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="e.g. October afternoon, Sea breeze"
              className="w-full bg-white-warm border border-line rounded px-3 py-2 text-sm text-ink focus:outline-none focus:border-olive"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-medium text-ink-muted mb-1">
              Select Image
            </label>
            <label className="border border-dashed border-line hover:border-olive bg-paper/40 rounded p-6 flex flex-col items-center justify-center cursor-pointer transition-colors">
              <UploadCloud className="w-6 h-6 text-ink-muted mb-1" />
              <span className="text-xs font-medium text-ink">Choose photo file</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </Dialog>

      {/* Pin Memory Modal */}
      <Dialog
        isOpen={isPinMemoryOpen}
        onClose={() => setIsPinMemoryOpen(false)}
        title="Pin an Existing Memory"
        description="Choose a moment to place as a keepsake card on this board."
        maxWidth="md"
      >
        <form onSubmit={handlePinMemory} className="flex flex-col gap-4">
          <div className="max-h-72 overflow-y-auto divide-y divide-line/60 border border-line rounded">
            {memories.map((mem) => {
              const isSelected = selectedMemoryId === mem.id;
              return (
                <div
                  key={mem.id}
                  onClick={() => setSelectedMemoryId(mem.id)}
                  className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? "bg-olive-light/70" : "hover:bg-paper-deep/50"
                  }`}
                >
                  <div>
                    <h4 className="font-serif text-base text-ink font-normal">{mem.title}</h4>
                    <p className="text-xs text-ink-muted">{mem.date}</p>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-olive" />}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-line/60">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsPinMemoryOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!selectedMemoryId}>
              Pin to Board
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Clear board confirm */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={() => persistBoardItems([])}
        title="Clear this board?"
        message="All pinned items will be removed from this scrapbook canvas. Your original memories remain safe in your timeline."
        confirmLabel="Clear Board"
      />
    </div>
  );
}
