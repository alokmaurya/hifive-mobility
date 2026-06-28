"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, PauseCircle, Copy, Trash2 } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import TourCard from "@/components/tours/TourCard";
import BottomSheet from "@/components/ui/BottomSheet";
import EmptyState from "@/components/ui/EmptyState";
import { mockTours } from "@/lib/mockData";
import type { Tour } from "@/types/tour";

type Tab = "published" | "draft" | "past";

export default function MyTours() {
  const [tab, setTab] = useState<Tab>("published");
  const [selected, setSelected] = useState<Tour | null>(null);

  const tours = mockTours.filter((t) =>
    tab === "past" ? t.status === "past" : t.status === tab
  );

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "published", label: "Published", count: mockTours.filter((t) => t.status === "published").length },
    { key: "draft",     label: "Drafts",    count: mockTours.filter((t) => t.status === "draft").length },
    { key: "past",      label: "Past",      count: mockTours.filter((t) => t.status === "past").length },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <AppHeader title="My Tours" notificationCount={1} />

      {/* Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-14 z-20">
        <div className="max-w-md mx-auto flex px-4">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                tab === key
                  ? "border-yellow-400 text-yellow-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-yellow-400/10 text-yellow-400" : "bg-zinc-800 text-zinc-500"}`}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-3">
        {tours.length > 0 ? (
          tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} onActionMenu={setSelected} />
          ))
        ) : (
          <EmptyState
            emoji={tab === "draft" ? "✏️" : tab === "past" ? "📖" : "🗺️"}
            title={tab === "draft" ? "No drafts" : tab === "past" ? "No past tours" : "No active tours"}
            description={tab === "published" ? "Create and publish your first sightseeing tour" : undefined}
            action={
              tab === "published" ? (
                <Link href="/tours/new" className="inline-flex items-center gap-2 bg-yellow-400 text-black text-sm font-bold px-5 py-2.5 rounded-xl">
                  <Plus className="w-4 h-4" /> Create Tour
                </Link>
              ) : undefined
            }
          />
        )}
      </div>

      {/* FAB */}
      <Link
        href="/tours/new"
        className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-yellow-400 rounded-full shadow-xl shadow-yellow-400/30 flex items-center justify-center hover:bg-yellow-300 transition-colors"
      >
        <Plus className="w-6 h-6 text-black" />
      </Link>

      {/* Action sheet */}
      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        <div className="space-y-1">
          {[
            { icon: Pencil, label: "Edit Tour", color: "text-zinc-300" },
            { icon: PauseCircle, label: selected?.status === "paused" ? "Resume Tour" : "Pause Tour", color: "text-yellow-400" },
            { icon: Copy, label: "Duplicate Tour", color: "text-zinc-300" },
            { icon: Trash2, label: "Delete Tour", color: "text-red-400" },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              onClick={() => setSelected(null)}
              className="w-full flex items-center gap-3 px-1 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
            >
              <Icon className={`w-5 h-5 ${color}`} />
              <span className={`text-sm font-medium ${color}`}>{label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomNav />
    </div>
  );
}
