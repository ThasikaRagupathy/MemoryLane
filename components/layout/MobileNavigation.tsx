"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Clock,
  Images,
  CalendarDays,
  FolderHeart,
  Settings,
  Plus,
  BookMarked,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MobileNavigationProps {
  onOpenAddMemory: () => void;
}

const MOBILE_NAV_ITEMS = [
  { href: "/", label: "Home", icon: Compass },
  { href: "/timeline", label: "Timeline", icon: Clock },
  { href: "/scrapbook", label: "Scrapbook", icon: Images },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/collections", label: "Collections", icon: FolderHeart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNavigation({ onOpenAddMemory }: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="md:hidden sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[4px] bg-olive flex items-center justify-center text-paper">
            <BookMarked className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif text-lg font-normal text-ink">MemoryLane</span>
        </Link>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={onOpenAddMemory}
        >
          Add
        </Button>
      </header>

      {/* Bottom Mobile Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white-warm/95 backdrop-blur border-t border-line px-2 py-1.5 flex items-center justify-around safe-bottom"
        aria-label="Mobile Navigation"
      >
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] min-h-[44px] rounded-[6px] transition-colors ${
                isActive ? "text-olive font-medium" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
