"use client";

import React from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";
import { AlertCircle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              variant === "danger" ? "bg-terracotta/15 text-terracotta" : "bg-olive/15 text-olive"
            }`}
          >
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-ink font-normal">{title}</h3>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-line/60 mt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
