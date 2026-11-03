"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Clock,
  Sparkles,
  CalendarDays,
  FolderHeart,
  Settings,
  Plus,
  BookMarked,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
  onOpenAddMemory: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/scrapbook", label: "Scrapbook", icon: Sparkles },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/collections", label: "Collections", icon: FolderHeart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ onOpenAddMemory }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-line bg-paper-subtle/80 min-h-screen sticky top-0 h-screen overflow-y-auto px-4 py-6 justify-between select-none"
      aria-label="Main navigation"
    >
      <div className="flex flex-col gap-6">
        {/* Brand */}
        <div className="px-2">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-olive flex items-center justify-center text-paper shadow-sm">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-xl font-normal tracking-tight text-ink group-hover:text-olive transition-colors">
                MemoryLane
              </span>
              <p className="text-[10px] text-ink-muted tracking-wider uppercase">Living Journal</p>
            </div>
          </Link>
        </div>

        {/* Primary CTA */}
        <div className="px-1">
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center shadow-card font-medium"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenAddMemory}
          >
            Add a memory
          </Button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1 px-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-[6px] text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-paper-deep text-ink border border-line/70 font-semibold shadow-subtle"
                    : "text-ink-muted hover:text-ink hover:bg-paper-deep/50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-olive" : "text-ink-muted"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info / Profile mark */}
      <div className="flex flex-col gap-3 px-2 pt-4 border-t border-line/60">
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="w-7 h-7 rounded-full bg-paper-deep border border-line flex items-center justify-center font-serif text-xs font-semibold text-ink-muted">
            ML
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ink truncate">Personal Journal</p>
            <div className="flex items-center gap-1 text-[10px] text-olive">
              <ShieldCheck className="w-3 h-3" />
              <span>Browser local only</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
