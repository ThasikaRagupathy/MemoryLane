"use client";

import { useEffect, useState } from "react";
import { useMemoryLane } from "./useMemoryLane";

export function useReducedMotionPreference(): boolean {
  const { preferences, isLoaded } = useMemoryLane();
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setSystemReduced(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  if (!isLoaded) return false;
  if (preferences.motion === "reduced") return true;
  return systemReduced;
}
