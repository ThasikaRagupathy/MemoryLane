/**
 * Local date handling utilities for MemoryLane
 * All calendar comparisons strictly use local date components to avoid UTC timezone shifts.
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(dateString: string): Date {
  const [yearStr, monthStr, dayStr] = dateString.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);
  return new Date(year, month, day);
}

export function formatEditorialDate(dateString: string): string {
  if (!dateString) return "";
  const d = parseLocalDate(dateString);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return "";
  const d = parseLocalDate(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDayAndMonth(dateString: string): string {
  if (!dateString) return "";
  const d = parseLocalDate(dateString);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatMonthYear(dateString: string): string {
  if (!dateString) return "";
  const d = parseLocalDate(dateString);
  return d.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getYearsAgoText(pastDateString: string, referenceDateString?: string): string {
  const pastYear = parseInt(pastDateString.split("-")[0], 10);
  const refYear = referenceDateString
    ? parseInt(referenceDateString.split("-")[0], 10)
    : new Date().getFullYear();
  const diff = refYear - pastYear;
  if (diff <= 0) return "Earlier this year";
  if (diff === 1) return "One year ago today";
  return `${diff} years ago today`;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Checks if a memory date matches "On This Day" for a given target date.
 * Excludes same-year memories.
 * Accurately handles Feb 29 (only matches Feb 29 in leap years).
 */
export function matchesOnThisDay(
  memoryDateStr: string,
  targetDateStr: string = getTodayDateString()
): boolean {
  const [memYearStr, memMonthStr, memDayStr] = memoryDateStr.split("-");
  const [targetYearStr, targetMonthStr, targetDayStr] = targetDateStr.split("-");

  const memYear = parseInt(memYearStr, 10);
  const targetYear = parseInt(targetYearStr, 10);

  // Must be from a prior year
  if (memYear >= targetYear) {
    return false;
  }

  // Handle Feb 29
  if (memMonthStr === "02" && memDayStr === "29") {
    if (targetMonthStr === "02" && targetDayStr === "29") {
      return true;
    }
    // If target year is not a leap year, optionally Feb 29 could match Feb 28 if target is Feb 28
    return false;
  }

  return memMonthStr === targetMonthStr && memDayStr === targetDayStr;
}

/**
 * Returns greeting based on current local hour
 */
export function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
