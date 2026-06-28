"use client";

import { useState } from "react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import BookingCard from "@/components/bookings/BookingCard";
import EmptyState from "@/components/ui/EmptyState";
import { mockBookings } from "@/lib/mockData";
import type { Booking, BookingStatus } from "@/types/tour";

type Tab = "pending" | "confirmed" | "cancelled";

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>("pending");
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const filtered = bookings.filter((b) => b.status === tab);

  const handleConfirm = (id: string) =>
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "confirmed" as BookingStatus } : b));

  const handleCancel = (id: string) =>
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b));

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const tabs: { key: Tab; label: string }[] = [
    { key: "pending",   label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
    { key: "confirmed", label: "Confirmed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <AppHeader title="Bookings" notificationCount={pendingCount} />

      {/* Tabs */}
      <div className="bg-white border-b border-stone-100 sticky top-14 z-20">
        <div className="max-w-md mx-auto flex px-4">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === key
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-3">
        {filtered.length > 0 ? (
          filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          ))
        ) : (
          <EmptyState
            emoji={tab === "pending" ? "⏳" : tab === "confirmed" ? "✅" : "❌"}
            title={`No ${tab} bookings`}
            description={tab === "pending" ? "New booking requests will appear here" : undefined}
          />
        )}
      </div>

      <BottomNav />
    </div>
  );
}
