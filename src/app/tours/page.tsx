"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, PauseCircle, Copy, Trash2 } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import TourCard from "@/components/tours/TourCard";
import BottomSheet from "@/components/ui/BottomSheet";
import EmptyState from "@/components/ui/EmptyState";
import RequireAuth from "@/components/ui/RequireAuth";
import { useTours } from "@/hooks/useTours";
import type { Tour } from "@/types/tour";

type Tab = "published" | "draft" | "past";

function MyToursContent() {
  const router = useRouter();
  const { tours, loading, updateTourStatus, deleteTour } = useTours();
  const [tab, setTab] = useState<Tab>("published");
  const [selected, setSelected] = useState<Tour | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filtered = tours.filter((t) =>
    tab === "past" ? t.status === "past" : t.status === tab
  );

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "published", label: "Published", count: tours.filter((t) => t.status === "published").length },
    { key: "draft",     label: "Drafts",    count: tours.filter((t) => t.status === "draft").length },
    { key: "past",      label: "Past",      count: tours.filter((t) => t.status === "past").length },
  ];

  async function handleAction(action: string) {
    if (!selected) return;
    if (action === "edit") {
      setSelected(null);
      router.push(`/tours/edit?id=${selected.id}`);
      return;
    }
    setActionLoading(true);
    try {
      if (action === "pause")   await updateTourStatus(selected.id, "paused");
      if (action === "resume")  await updateTourStatus(selected.id, "published");
      if (action === "delete")  await deleteTour(selected.id);
    } catch {}
    setActionLoading(false);
    setSelected(null);
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <AppHeader title="My Tours" />

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
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-zinc-900 rounded-2xl border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((tour) => (
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
            { icon: Pencil,      label: "Edit Tour",    action: "edit",   color: "text-zinc-300" },
            { icon: PauseCircle, label: selected?.status === "paused" ? "Resume Tour" : "Pause Tour", action: selected?.status === "paused" ? "resume" : "pause", color: "text-yellow-400" },
            { icon: Copy,        label: "Duplicate",    action: "dup",    color: "text-zinc-300" },
            { icon: Trash2,      label: "Delete Tour",  action: "delete", color: "text-red-400" },
          ].map(({ icon: Icon, label, action, color }) => (
            <button
              key={label}
              disabled={actionLoading}
              onClick={() => handleAction(action)}
              className="w-full flex items-center gap-3 px-1 py-3 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50"
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

export default function MyTours() {
  return (
    <RequireAuth>
      <MyToursContent />
    </RequireAuth>
  );
}
