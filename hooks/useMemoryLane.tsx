"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import {
  Memory,
  MemoryCollection,
  MemoryLaneData,
  ScrapbookBoard,
  UserPreferences,
} from "@/types/memory";
import {
  clearMemoryLaneStorage,
  exportMemoryLaneBackup,
  loadMemoryLaneData,
  resetMemoryLaneToDefaults,
  saveMemoryLaneData,
} from "@/lib/storage";
import { getDefaultMemoryLaneData } from "@/lib/sample-data";

export interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  message: string;
  subtext?: string;
}

interface MemoryLaneContextType {
  data: MemoryLaneData;
  memories: Memory[];
  collections: MemoryCollection[];
  scrapbookBoards: ScrapbookBoard[];
  preferences: UserPreferences;
  isLoaded: boolean;
  toasts: ToastMessage[];
  addToast: (msg: { type: ToastMessage["type"]; message: string; subtext?: string }) => void;
  removeToast: (id: string) => void;
  addMemory: (mem: Omit<Memory, "id" | "createdAt" | "updatedAt">) => Promise<Memory>;
  updateMemory: (id: string, updates: Partial<Memory>) => Promise<Memory>;
  deleteMemory: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => void;
  createCollection: (name: string, description?: string) => MemoryCollection;
  updateCollection: (id: string, updates: Partial<MemoryCollection>) => void;
  deleteCollection: (id: string) => void;
  addMemoryToCollection: (memoryId: string, collectionId: string) => void;
  removeMemoryFromCollection: (memoryId: string, collectionId: string) => void;
  saveScrapbookBoard: (board: ScrapbookBoard) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  exportData: () => void;
  importData: (
    imported: MemoryLaneData,
    mode: "merge" | "replace"
  ) => { success: boolean; count: number; error?: string };
  resetToDefaults: () => void;
  clearAll: () => void;
}

const MemoryLaneContext = createContext<MemoryLaneContextType | null>(null);

export function MemoryLaneProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<MemoryLaneData>(getDefaultMemoryLaneData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ type, message, subtext }: { type: ToastMessage["type"]; message: string; subtext?: string }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, message, subtext }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Hydration-safe client initialization
  useEffect(() => {
    const loaded = loadMemoryLaneData();
    setData(loaded);
    setIsLoaded(true);
  }, []);

  // Centralized persist helper
  const persist = useCallback(
    (nextData: MemoryLaneData, toastOnSuccess?: string) => {
      setData(nextData);
      const res = saveMemoryLaneData(nextData);
      if (!res.success) {
        addToast({
          type: "error",
          message: res.error || "Could not save to browser storage.",
          subtext: res.isQuotaExceeded ? "Local storage is full. Export a backup or remove large photos." : undefined,
        });
      } else if (toastOnSuccess) {
        addToast({
          type: "success",
          message: toastOnSuccess,
          subtext: "Saved privately in your browser",
        });
      }
    },
    [addToast]
  );

  const addMemory = useCallback(
    async (memInput: Omit<Memory, "id" | "createdAt" | "updatedAt">): Promise<Memory> => {
      const now = new Date().toISOString();
      const newMemory: Memory = {
        ...memInput,
        id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        createdAt: now,
        updatedAt: now,
        title: memInput.title.trim(),
        tags: memInput.tags.map((t) => t.trim().toLowerCase()).filter(Boolean),
        collectionIds: memInput.collectionIds || [],
      };

      // Update collections reference
      const nextCollections = data.collections.map((col) => {
        let shouldInclude = false;
        if (col.kind === "mood" && newMemory.mood && col.mood === newMemory.mood) {
          shouldInclude = true;
        } else if (col.kind === "custom" && newMemory.collectionIds.includes(col.id)) {
          shouldInclude = true;
        }

        if (shouldInclude && !col.memoryIds.includes(newMemory.id)) {
          return {
            ...col,
            memoryIds: [newMemory.id, ...col.memoryIds],
            coverMemoryId: col.coverMemoryId || newMemory.id,
            updatedAt: now,
          };
        }
        return col;
      });

      const nextData: MemoryLaneData = {
        ...data,
        memories: [newMemory, ...data.memories],
        collections: nextCollections,
      };

      persist(nextData, "Moment preserved");
      return newMemory;
    },
    [data, persist]
  );

  const updateMemory = useCallback(
    async (id: string, updates: Partial<Memory>): Promise<Memory> => {
      const now = new Date().toISOString();
      let updatedMemory: Memory | null = null;

      const nextMemories = data.memories.map((m) => {
        if (m.id === id) {
          updatedMemory = {
            ...m,
            ...updates,
            title: updates.title !== undefined ? updates.title.trim() : m.title,
            tags: updates.tags !== undefined ? updates.tags.map((t) => t.trim().toLowerCase()).filter(Boolean) : m.tags,
            updatedAt: now,
          };
          return updatedMemory;
        }
        return m;
      });

      if (!updatedMemory) {
        throw new Error("Memory not found");
      }

      // Sync collections membership
      const target = updatedMemory as Memory;
      const nextCollections = data.collections.map((col) => {
        let shouldInclude = false;
        if (col.kind === "mood" && target.mood && col.mood === target.mood) {
          shouldInclude = true;
        } else if (col.kind === "custom" && target.collectionIds.includes(col.id)) {
          shouldInclude = true;
        }

        const currentlyHas = col.memoryIds.includes(id);

        if (shouldInclude && !currentlyHas) {
          return { ...col, memoryIds: [id, ...col.memoryIds], updatedAt: now };
        }
        if (!shouldInclude && currentlyHas) {
          return {
            ...col,
            memoryIds: col.memoryIds.filter((mId) => mId !== id),
            coverMemoryId: col.coverMemoryId === id ? undefined : col.coverMemoryId,
            updatedAt: now,
          };
        }
        return col;
      });

      const nextData: MemoryLaneData = {
        ...data,
        memories: nextMemories,
        collections: nextCollections,
      };

      persist(nextData, "Memory updated");
      return target;
    },
    [data, persist]
  );

  const deleteMemory = useCallback(
    async (id: string): Promise<void> => {
      const nextMemories = data.memories.filter((m) => m.id !== id);

      // Clean dangling references in collections
      const nextCollections = data.collections.map((col) => ({
        ...col,
        memoryIds: col.memoryIds.filter((mId) => mId !== id),
        coverMemoryId: col.coverMemoryId === id ? undefined : col.coverMemoryId,
      }));

      // Clean dangling references in scrapbook boards
      const nextBoards = data.scrapbookBoards.map((b) => ({
        ...b,
        items: b.items.filter((item) => !(item.type === "memory" && item.memoryId === id)),
      }));

      const nextData: MemoryLaneData = {
        ...data,
        memories: nextMemories,
        collections: nextCollections,
        scrapbookBoards: nextBoards,
      };

      persist(nextData, "Memory deleted");
    },
    [data, persist]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      const mem = data.memories.find((m) => m.id === id);
      if (!mem) return;
      const nextFav = !mem.favorite;

      const nextMemories = data.memories.map((m) => (m.id === id ? { ...m, favorite: nextFav } : m));
      const nextData: MemoryLaneData = { ...data, memories: nextMemories };
      persist(nextData, nextFav ? "Marked as favorite" : "Removed from favorites");
    },
    [data, persist]
  );

  const createCollection = useCallback(
    (name: string, description?: string): MemoryCollection => {
      const now = new Date().toISOString();
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const newCol: MemoryCollection = {
        id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        slug: slug || `col-${Date.now()}`,
        description: description?.trim() || "",
        kind: "custom",
        memoryIds: [],
        createdAt: now,
        updatedAt: now,
      };

      const nextData: MemoryLaneData = {
        ...data,
        collections: [...data.collections, newCol],
      };

      persist(nextData, `Created collection "${name}"`);
      return newCol;
    },
    [data, persist]
  );

  const updateCollection = useCallback(
    (id: string, updates: Partial<MemoryCollection>) => {
      const now = new Date().toISOString();
      const nextCollections = data.collections.map((col) => {
        if (col.id === id) {
          return {
            ...col,
            ...updates,
            name: updates.name ? updates.name.trim() : col.name,
            updatedAt: now,
          };
        }
        return col;
      });

      const nextData: MemoryLaneData = { ...data, collections: nextCollections };
      persist(nextData, "Collection updated");
    },
    [data, persist]
  );

  const deleteCollection = useCallback(
    (id: string) => {
      const target = data.collections.find((c) => c.id === id);
      if (!target || target.kind === "mood") {
        return; // default mood collections cannot be deleted
      }

      // Remove collection from collections list
      const nextCollections = data.collections.filter((c) => c.id !== id);

      // Remove this collectionId from any memories that reference it
      const nextMemories = data.memories.map((m) => {
        if (m.collectionIds.includes(id)) {
          return {
            ...m,
            collectionIds: m.collectionIds.filter((cId) => cId !== id),
          };
        }
        return m;
      });

      const nextData: MemoryLaneData = {
        ...data,
        collections: nextCollections,
        memories: nextMemories,
      };

      persist(nextData, `Collection "${target.name}" removed`);
    },
    [data, persist]
  );

  const addMemoryToCollection = useCallback(
    (memoryId: string, collectionId: string) => {
      const now = new Date().toISOString();
      const nextMemories = data.memories.map((m) => {
        if (m.id === memoryId && !m.collectionIds.includes(collectionId)) {
          return { ...m, collectionIds: [...m.collectionIds, collectionId], updatedAt: now };
        }
        return m;
      });

      const nextCollections = data.collections.map((c) => {
        if (c.id === collectionId && !c.memoryIds.includes(memoryId)) {
          return { ...c, memoryIds: [memoryId, ...c.memoryIds], updatedAt: now };
        }
        return c;
      });

      persist({ ...data, memories: nextMemories, collections: nextCollections }, "Added to collection");
    },
    [data, persist]
  );

  const removeMemoryFromCollection = useCallback(
    (memoryId: string, collectionId: string) => {
      const now = new Date().toISOString();
      const nextMemories = data.memories.map((m) => {
        if (m.id === memoryId) {
          return { ...m, collectionIds: m.collectionIds.filter((cid) => cid !== collectionId), updatedAt: now };
        }
        return m;
      });

      const nextCollections = data.collections.map((c) => {
        if (c.id === collectionId) {
          return { ...c, memoryIds: c.memoryIds.filter((mid) => mid !== memoryId), updatedAt: now };
        }
        return c;
      });

      persist({ ...data, memories: nextMemories, collections: nextCollections }, "Removed from collection");
    },
    [data, persist]
  );

  const saveScrapbookBoard = useCallback(
    (board: ScrapbookBoard) => {
      const now = new Date().toISOString();
      const existing = data.scrapbookBoards.some((b) => b.id === board.id);
      let nextBoards: ScrapbookBoard[];

      if (existing) {
        nextBoards = data.scrapbookBoards.map((b) => (b.id === board.id ? { ...board, updatedAt: now } : b));
      } else {
        nextBoards = [...data.scrapbookBoards, { ...board, createdAt: now, updatedAt: now }];
      }

      const nextData = { ...data, scrapbookBoards: nextBoards };
      persist(nextData);
    },
    [data, persist]
  );

  const updatePreferences = useCallback(
    (prefs: Partial<UserPreferences>) => {
      const nextPrefs = { ...data.preferences, ...prefs };
      const nextData = { ...data, preferences: nextPrefs };
      persist(nextData, "Preferences updated");
    },
    [data, persist]
  );

  const exportData = useCallback(() => {
    exportMemoryLaneBackup(data);
    addToast({
      type: "info",
      message: "Export ready",
      subtext: `Exported ${data.memories.length} memories and scrapbook boards`,
    });
  }, [data, addToast]);

  const importData = useCallback(
    (imported: MemoryLaneData, mode: "merge" | "replace") => {
      if (mode === "replace") {
        persist(imported, `Imported ${imported.memories.length} memories (Replaced)`);
        return { success: true, count: imported.memories.length };
      }

      // Merge mode: deduplicate by id
      const existingIds = new Set(data.memories.map((m) => m.id));
      const newMems = imported.memories.filter((m) => !existingIds.has(m.id));
      const mergedMemories = [...newMems, ...data.memories];

      const existingColIds = new Set(data.collections.map((c) => c.id));
      const newCols = imported.collections.filter((c) => !existingColIds.has(c.id));
      const mergedCols = [...data.collections, ...newCols];

      const mergedBoards = [...data.scrapbookBoards];
      for (const b of imported.scrapbookBoards) {
        const idx = mergedBoards.findIndex((eb) => eb.id === b.id);
        if (idx >= 0) {
          mergedBoards[idx] = b;
        } else {
          mergedBoards.push(b);
        }
      }

      const mergedData: MemoryLaneData = {
        schemaVersion: 1,
        memories: mergedMemories,
        collections: mergedCols,
        scrapbookBoards: mergedBoards,
        preferences: data.preferences,
      };

      persist(mergedData, `Merged ${newMems.length} new memories`);
      return { success: true, count: newMems.length };
    },
    [data, persist]
  );

  const resetToDefaults = useCallback(() => {
    const initial = resetMemoryLaneToDefaults();
    setData(initial);
    addToast({
      type: "info",
      message: "Reset to demo memories",
      subtext: "Sample journal moments and collections reloaded",
    });
  }, [addToast]);

  const clearAll = useCallback(() => {
    clearMemoryLaneStorage();
    const emptyData: MemoryLaneData = {
      schemaVersion: 1,
      memories: [],
      collections: data.collections.filter((c) => c.kind === "mood").map((c) => ({ ...c, memoryIds: [] })),
      scrapbookBoards: [
        {
          id: "board-empty",
          title: "My Scrapbook",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          items: [],
        },
      ],
      preferences: data.preferences,
    };
    persist(emptyData, "All local journal entries cleared");
  }, [data, persist]);

  const value = useMemo<MemoryLaneContextType>(
    () => ({
      data,
      memories: data.memories,
      collections: data.collections,
      scrapbookBoards: data.scrapbookBoards,
      preferences: data.preferences,
      isLoaded,
      toasts,
      addToast,
      removeToast,
      addMemory,
      updateMemory,
      deleteMemory,
      toggleFavorite,
      createCollection,
      updateCollection,
      deleteCollection,
      addMemoryToCollection,
      removeMemoryFromCollection,
      saveScrapbookBoard,
      updatePreferences,
      exportData,
      importData,
      resetToDefaults,
      clearAll,
    }),
    [
      data,
      isLoaded,
      toasts,
      addToast,
      removeToast,
      addMemory,
      updateMemory,
      deleteMemory,
      toggleFavorite,
      createCollection,
      updateCollection,
      deleteCollection,
      addMemoryToCollection,
      removeMemoryFromCollection,
      saveScrapbookBoard,
      updatePreferences,
      exportData,
      importData,
      resetToDefaults,
      clearAll,
    ]
  );

  return <MemoryLaneContext.Provider value={value}>{children}</MemoryLaneContext.Provider>;
}

export function useMemoryLane(): MemoryLaneContextType {
  const ctx = useContext(MemoryLaneContext);
  if (!ctx) {
    throw new Error("useMemoryLane must be used within a MemoryLaneProvider");
  }
  return ctx;
}
