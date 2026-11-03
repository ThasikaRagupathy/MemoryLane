import { Memory, MemoryCollection, MemoryLaneData, Mood, ScrapbookBoard, ScrapbookItem } from "@/types/memory";

const VALID_MOODS: Mood[] = [
  "joyful",
  "peaceful",
  "grateful",
  "nostalgic",
  "excited",
  "melancholy",
  "loved",
  "reflective",
];

export function isMood(val: unknown): val is Mood {
  return typeof val === "string" && VALID_MOODS.includes(val as Mood);
}

export function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function validateMemory(m: unknown): m is Memory {
  if (!isObject(m)) return false;
  if (typeof m.id !== "string" || !m.id) return false;
  if (typeof m.title !== "string" || !m.title.trim()) return false;
  if (typeof m.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(m.date)) return false;
  if (typeof m.createdAt !== "string") return false;
  if (typeof m.note !== "string") return false;
  if (m.mood !== undefined && !isMood(m.mood)) return false;
  if (!Array.isArray(m.photos)) return false;
  if (!Array.isArray(m.tags)) return false;
  if (typeof m.favorite !== "boolean") return false;
  if (!Array.isArray(m.collectionIds)) return false;
  return true;
}

export function validateCollection(c: unknown): c is MemoryCollection {
  if (!isObject(c)) return false;
  if (typeof c.id !== "string" || !c.id) return false;
  if (typeof c.name !== "string" || !c.name.trim()) return false;
  if (typeof c.slug !== "string") return false;
  if (!Array.isArray(c.memoryIds)) return false;
  if (c.kind !== "mood" && c.kind !== "custom") return false;
  if (c.mood !== undefined && !isMood(c.mood)) return false;
  return true;
}

export function validateScrapbookItem(item: unknown): item is ScrapbookItem {
  if (!isObject(item)) return false;
  if (typeof item.id !== "string" || !item.id) return false;
  if (typeof item.x !== "number" || typeof item.y !== "number") return false;
  if (typeof item.rotation !== "number" || typeof item.zIndex !== "number") return false;

  if (item.type === "photo") {
    if (!isObject(item.photo) || typeof item.photo.dataUrl !== "string") return false;
    if (typeof item.caption !== "string") return false;
    return true;
  }
  if (item.type === "note") {
    if (typeof item.text !== "string") return false;
    if (!["paper", "sage", "butter", "terracotta"].includes(item.style as string)) return false;
    return true;
  }
  if (item.type === "memory") {
    if (typeof item.memoryId !== "string" || !item.memoryId) return false;
    return true;
  }
  return false;
}

export function validateScrapbookBoard(b: unknown): b is ScrapbookBoard {
  if (!isObject(b)) return false;
  if (typeof b.id !== "string" || !b.id) return false;
  if (typeof b.title !== "string") return false;
  if (!Array.isArray(b.items)) return false;
  return b.items.every(validateScrapbookItem);
}

export interface ValidationResult {
  valid: boolean;
  data?: MemoryLaneData;
  errors: string[];
}

export function validateImportedData(raw: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(raw)) {
    return { valid: false, errors: ["Invalid JSON format: root must be an object."] };
  }

  if (raw.schemaVersion !== 1) {
    errors.push("Unsupported schema version. Expected version 1.");
  }

  if (!Array.isArray(raw.memories)) {
    errors.push("Missing or invalid 'memories' array.");
  } else {
    raw.memories.forEach((m, idx) => {
      if (!validateMemory(m)) {
        errors.push(`Memory at index ${idx} is missing required fields (title, date, or id).`);
      }
    });
  }

  if (!Array.isArray(raw.collections)) {
    errors.push("Missing or invalid 'collections' array.");
  } else {
    raw.collections.forEach((c, idx) => {
      if (!validateCollection(c)) {
        errors.push(`Collection at index ${idx} is invalid.`);
      }
    });
  }

  if (!Array.isArray(raw.scrapbookBoards)) {
    errors.push("Missing or invalid 'scrapbookBoards' array.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const validData: MemoryLaneData = {
    schemaVersion: 1,
    memories: (raw.memories as Memory[]).map((m) => ({
      ...m,
      title: m.title.trim(),
      tags: Array.isArray(m.tags) ? m.tags.map((t) => String(t).trim()).filter(Boolean) : [],
      collectionIds: Array.isArray(m.collectionIds) ? m.collectionIds : [],
      photos: Array.isArray(m.photos) ? m.photos : [],
      favorite: Boolean(m.favorite),
      note: m.note || "",
    })),
    collections: raw.collections as MemoryCollection[],
    scrapbookBoards: raw.scrapbookBoards as ScrapbookBoard[],
    preferences: {
      motion: raw.preferences && isObject(raw.preferences) && raw.preferences.motion === "reduced" ? "reduced" : "system",
      cardDensity: raw.preferences && isObject(raw.preferences) && raw.preferences.cardDensity === "compact" ? "compact" : "comfortable",
    },
  };

  return { valid: true, data: validData, errors: [] };
}
