"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemoryLane } from "@/hooks/useMemoryLane";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function ToastContainer() {
  const { toasts, removeToast } = useMemoryLane();
  const isReducedMotion = useReducedMotionPreference();

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const icon = {
            success: <CheckCircle2 className="w-4 h-4 text-olive shrink-0" />,
            warning: <AlertTriangle className="w-4 h-4 text-[#C2803D] shrink-0" />,
            error: <AlertCircle className="w-4 h-4 text-terracotta shrink-0" />,
            info: <Info className="w-4 h-4 text-ink-muted shrink-0" />,
          }[toast.type];

          return (
            <motion.div
              key={toast.id}
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto bg-white-warm border border-line rounded-[6px] shadow-card px-4 py-3 flex items-start gap-3"
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">{toast.message}</p>
                {toast.subtext && (
                  <p className="text-xs text-ink-muted mt-0.5 leading-snug">{toast.subtext}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss toast"
                className="text-ink-muted hover:text-ink -mr-1 p-1 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
