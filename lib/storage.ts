import { MemoryLaneData } from "@/types/memory";
import { STORAGE_KEY } from "./constants";
import { getDefaultMemoryLaneData } from "./sample-data";
import { validateImportedData } from "./schema";

export interface StorageSaveResult {
  success: boolean;
  error?: string;
  isQuotaExceeded?: boolean;
}

export function loadMemoryLaneData(): MemoryLaneData {
  if (typeof window === "undefined" || !window.localStorage) {
    return getDefaultMemoryLaneData();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: seed default data
      const initial = getDefaultMemoryLaneData();
      saveMemoryLaneData(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    const validation = validateImportedData(parsed);
    if (validation.valid && validation.data) {
      return validation.data;
    } else {
      console.warn("MemoryLane: Corrupted local data detected, falling back to defaults.", validation.errors);
      return getDefaultMemoryLaneData();
    }
  } catch (err) {
    console.error("MemoryLane: Error loading from localStorage:", err);
    return getDefaultMemoryLaneData();
  }
}

export function saveMemoryLaneData(data: MemoryLaneData): StorageSaveResult {
  if (typeof window === "undefined" || !window.localStorage) {
    return { success: false, error: "Storage is not accessible in this environment." };
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, serialized);
    return { success: true };
  } catch (err: unknown) {
    console.error("MemoryLane: Failed to save to localStorage:", err);

    let isQuota = false;
    let message = "Failed to save memory data.";

    if (err instanceof DOMException) {
      if (
        err.name === "QuotaExceededError" ||
        err.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        err.code === 22 ||
        err.code === 1014
      ) {
        isQuota = true;
        message = "Browser storage quota reached. Please remove large photos or export your memories.";
      }
    }

    return {
      success: false,
      error: message,
      isQuotaExceeded: isQuota,
    };
  }
}

export function exportMemoryLaneBackup(data: MemoryLaneData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split("T")[0];

  const a = document.createElement("a");
  a.href = url;
  a.download = `memorylane-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function clearMemoryLaneStorage(): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function resetMemoryLaneToDefaults(): MemoryLaneData {
  const initial = getDefaultMemoryLaneData();
  saveMemoryLaneData(initial);
  return initial;
}
