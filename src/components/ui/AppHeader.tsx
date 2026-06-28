"use client";

import { Bell, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  rightSlot?: React.ReactNode;
  notificationCount?: number;
  transparent?: boolean;
}

export default function AppHeader({
  title,
  showBack = false,
  backHref = "/dashboard",
  rightSlot,
  notificationCount = 0,
  transparent = false,
}: AppHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-30 px-4 h-14 flex items-center justify-between ${
        transparent ? "bg-transparent" : "bg-white border-b border-stone-100"
      }`}
    >
      <div className="flex items-center gap-2">
        {showBack ? (
          <Link
            href={backHref}
            className="p-2 -ml-2 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-stone-700" />
          </Link>
        ) : null}
        {title ? (
          <h1 className="text-base font-bold text-stone-900">{title}</h1>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="text-xl">🧭</span>
            <span className="text-base font-bold text-stone-900">HiFive</span>
            <span className="text-base font-bold text-brand-500">Tours</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightSlot}
        <button className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors">
          <Bell className="w-5 h-5 text-stone-600" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
}
