export type Mood =
  | "joyful"
  | "peaceful"
  | "grateful"
  | "nostalgic"
  | "excited"
  | "melancholy"
  | "loved"
  | "reflective";

export interface MemoryPhoto {
  id: string;
  name: string;
  mimeType: string;
  dataUrl: string;
  width?: number;
  height?: number;
  altText: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD, local calendar date
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  note: string;
  mood?: Mood;
  photos: MemoryPhoto[];
  place?: string;
  tags: string[];
  favorite: boolean;
  collectionIds: string[];
}

export interface MemoryCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverMemoryId?: string;
  memoryIds: string[];
  kind: "mood" | "custom";
  mood?: Mood;
  createdAt: string;
  updatedAt: string;
}

export type ScrapbookItemStyle = "paper" | "sage" | "butter" | "terracotta";

export type ScrapbookItem =
  | {
      id: string;
      type: "photo";
      photo: MemoryPhoto;
      x: number;
      y: number;
      rotation: number;
      zIndex: number;
      caption: string;
    }
  | {
      id: string;
      type: "note";
      x: number;
      y: number;
      rotation: number;
      zIndex: number;
      text: string;
      style: ScrapbookItemStyle;
    }
  | {
      id: string;
      type: "memory";
      memoryId: string;
      x: number;
      y: number;
      rotation: number;
      zIndex: number;
    };

export interface ScrapbookBoard {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  items: ScrapbookItem[];
}

export interface UserPreferences {
  motion: "system" | "reduced";
  cardDensity: "comfortable" | "compact";
}

export interface MemoryLaneData {
  schemaVersion: 1;
  memories: Memory[];
  collections: MemoryCollection[];
  scrapbookBoards: ScrapbookBoard[];
  preferences: UserPreferences;
}

export interface FilterState {
  search: string;
  mood?: Mood;
  collectionId?: string;
  favoritesOnly: boolean;
  tag?: string;
  year?: string;
  month?: string;
  sortOrder: "newest" | "oldest";
}
