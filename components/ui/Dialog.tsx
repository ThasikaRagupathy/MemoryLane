"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
  className = "",
}: DialogProps) {
  const isReducedMotion = useReducedMotionPreference();
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const maxWidthClass = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-5xl",
    full: "max-w-[95vw] h-[90vh]",
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "dialog-title" : undefined}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isReducedMotion ? 0.05 : 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={dialogRef}
            initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: isReducedMotion ? 0.05 : 0.22, ease: "easeOut" }}
            className={`relative w-full ${maxWidthClass} bg-white-warm border border-line rounded-lg shadow-float overflow-hidden flex flex-col max-h-[92vh] ${className}`}
          >
            {/* Header */}
            {(title || description) && (
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-line/60 bg-paper/40 shrink-0">
                <div>
                  {title && (
                    <h2
                      id="dialog-title"
                      className="font-serif text-2xl text-ink font-normal tracking-tight"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-1.5 text-ink-muted hover:text-ink hover:bg-paper-deep rounded-[4px] transition-colors -mr-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content body */}
            <div className="overflow-y-auto p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
