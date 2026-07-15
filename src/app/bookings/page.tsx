"use client";

import { useState } from "react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import BookingCard from "@/components/bookings/BookingCard";
import EmptyState from "@/components/ui/EmptyState";
import RequireAuth from "@/components/ui/RequireAuth";
import { useBookings } from "@/hooks/useBookings";

type Tab = "pending" | "confirmed" | "ongoing" | "completed" | "cancelled";

function BookingsContent() {
  const { bookings, loading, updateBookingStatus, startTrip, endTrip } = useBookings();
  const [tab, setTab] = useState<Tab>("pending");

  const filtered = bookings.filter((b) => b.status === tab);
  const pendingCount  = bookings.filter((b) => b.status === "pending").length;
  const ongoingCount  = bookings.filter((b) => b.status === "ongoing").length;

  const tabs: { key: Tab; label: string }[] = [
    { key: "pending",   label: `Pending${pendingCount > 0 ? ` (${pendingCount})` : ""}` },
    { key: "confirmed", label: "Confirmed" },
    { key: "ongoing",   label: `On Going${ongoingCount > 0 ? ` (${ongoingCount})` : ""}` },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <AppHeader title="Bookings" notificationCount={pendingCount + ongoingCount} />

      {/* Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-14 z-20">
        <div className="max-w-md mx-auto flex px-4">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === key
                  ? "border-yellow-400 text-yellow-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-zinc-900 rounded-2xl border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onConfirm={(id) => updateBookingStatus(id, "confirmed")}
              onCancel={(id) => updateBookingStatus(id, "cancelled")}
              onStartTrip={(id, otp) => startTrip(id, otp)}
              onEndTrip={(id, otp) => endTrip(id, otp)}
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

export default function BookingsPage() {
  return (
    <RequireAuth>
      <BookingsContent />
    </RequireAuth>
  );
}
