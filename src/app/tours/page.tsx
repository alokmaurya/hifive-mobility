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
    <div className="min-h-screen bg-stone-50 pb-24">
      <AppHeader title="My Tours" notificationCount={1} />

      {/* Tabs */}
      <div className="bg-white border-b border-stone-100 sticky top-14 z-20">
        <div className="max-w-md mx-auto flex px-4">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                tab === key
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-brand-100 text-brand-600" : "bg-stone-100 text-stone-400"}`}>
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
                <Link href="/tours/new" className="inline-flex items-center gap-2 bg-brand-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl">
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
        className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-brand-500 rounded-full shadow-xl shadow-brand-300 flex items-center justify-center hover:bg-brand-600 transition-colors"
      >
        <Plus className="w-6 h-6 text-white" />
      </Link>

      {/* Action sheet */}
      <BottomSheet open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        <div className="space-y-1">
          {[
            { icon: Pencil, label: "Edit Tour", color: "text-stone-700" },
            { icon: PauseCircle, label: selected?.status === "paused" ? "Resume Tour" : "Pause Tour", color: "text-amber-600" },
            { icon: Copy, label: "Duplicate Tour", color: "text-teal-600" },
            { icon: Trash2, label: "Delete Tour", color: "text-red-500" },
          ].map(({ icon: Icon, label, color }) => (
            <button
              key={label}
              onClick={() => setSelected(null)}
              className="w-full flex items-center gap-3 px-1 py-3 rounded-xl hover:bg-stone-50 transition-colors"
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
