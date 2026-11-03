import { FilterState, Memory, MemoryCollection, Mood } from "@/types/memory";
import { MOODS } from "./constants";
import { parseLocalDate } from "./date-utils";

export function filterAndSortMemories(
  memories: Memory[],
  filters: FilterState,
  collections: MemoryCollection[]
): Memory[] {
  const query = filters.search.trim().toLowerCase();

  return memories
    .filter((mem) => {
      // Search matching
      if (query) {
        const titleMatch = mem.title.toLowerCase().includes(query);
        const noteMatch = mem.note.toLowerCase().includes(query);
        const placeMatch = mem.place ? mem.place.toLowerCase().includes(query) : false;
        const tagMatch = mem.tags.some((t) => t.toLowerCase().includes(query));
        const moodMatch = mem.mood ? MOODS[mem.mood]?.label.toLowerCase().includes(query) : false;

        // Check if any containing collection name matches
        const colMatch = collections
          .filter((c) => mem.collectionIds.includes(c.id) || (c.kind === "mood" && c.mood === mem.mood))
          .some((c) => c.name.toLowerCase().includes(query));

        if (!titleMatch && !noteMatch && !placeMatch && !tagMatch && !moodMatch && !colMatch) {
          return false;
        }
      }

      // Mood filter
      if (filters.mood && mem.mood !== filters.mood) {
        return false;
      }

      // Favorites filter
      if (filters.favoritesOnly && !mem.favorite) {
        return false;
      }

      // Tag filter
      if (filters.tag && !mem.tags.includes(filters.tag)) {
        return false;
      }

      // Collection filter
      if (filters.collectionId) {
        const targetCol = collections.find((c) => c.id === filters.collectionId);
        if (targetCol) {
          if (targetCol.kind === "mood") {
            if (mem.mood !== targetCol.mood) return false;
          } else {
            if (!mem.collectionIds.includes(targetCol.id)) return false;
          }
        }
      }

      // Year filter
      if (filters.year) {
        if (!mem.date.startsWith(filters.year)) {
          return false;
        }
      }

      // Month filter (format "YYYY-MM")
      if (filters.month) {
        if (!mem.date.startsWith(filters.month)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by date YYYY-MM-DD
      const cmp = a.date.localeCompare(b.date);
      return filters.sortOrder === "newest" ? -cmp : cmp;
    });
}

export interface MonthGroup {
  monthKey: string; // "2025-10"
  monthTitle: string; // "October 2025"
  year: string; // "2025"
  memories: Memory[];
}

export interface YearGroup {
  year: string;
  monthGroups: MonthGroup[];
  totalMemories: number;
}

export function groupMemoriesByYearAndMonth(memories: Memory[]): YearGroup[] {
  const yearMap = new Map<string, Map<string, Memory[]>>();

  for (const mem of memories) {
    const [year, month] = mem.date.split("-");
    const monthKey = `${year}-${month}`;

    if (!yearMap.has(year)) {
      yearMap.set(year, new Map());
    }
    const monthMap = yearMap.get(year)!;
    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }
    monthMap.get(monthKey)!.push(mem);
  }

  // Convert to sorted YearGroups
  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b.localeCompare(a));

  return sortedYears.map((year) => {
    const monthMap = yearMap.get(year)!;
    const sortedMonthKeys = Array.from(monthMap.keys()).sort((a, b) => b.localeCompare(a));

    const monthGroups: MonthGroup[] = sortedMonthKeys.map((mKey) => {
      const sampleDate = parseLocalDate(`${mKey}-01`);
      const monthTitle = sampleDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      return {
        monthKey: mKey,
        monthTitle,
        year,
        memories: monthMap.get(mKey)!,
      };
    });

    const totalMemories = monthGroups.reduce((acc, mg) => acc + mg.memories.length, 0);

    return {
      year,
      monthGroups,
      totalMemories,
    };
  });
}

/**
 * Collects all unique tags used across memories
 */
export function getAllUniqueTags(memories: Memory[]): { tag: string; count: number }[] {
  const map = new Map<string, number>();
  for (const mem of memories) {
    for (const tag of mem.tags) {
      const clean = tag.trim().toLowerCase();
      if (clean) {
        map.set(clean, (map.get(clean) || 0) + 1);
      }
    }
  }
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
