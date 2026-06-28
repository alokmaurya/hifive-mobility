"use client";

import { useState } from "react";
import { Banknote, Map, Users } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import RequireAuth from "@/components/ui/RequireAuth";
import { useBookings } from "@/hooks/useBookings";
import { formatCurrency, formatDate } from "@/lib/utils";

type Period = "month" | "all";

function EarningsContent() {
  const { bookings, loading } = useBookings();
  const [period, setPeriod] = useState<Period>("month");

  const now = new Date();
  const relevant = bookings.filter((b) => {
    if (b.status !== "confirmed") return false;
    if (period === "month") {
      const d = new Date(b.tourDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Group by tour
  const byTour = relevant.reduce<Record<string, { name: string; count: number; guests: number; gross: number }>>((acc, b) => {
    if (!acc[b.tourId]) acc[b.tourId] = { name: b.tourName, count: 0, guests: 0, gross: 0 };
    acc[b.tourId].count += 1;
    acc[b.tourId].guests += b.guest.guestCount;
    acc[b.tourId].gross += b.totalAmount;
    return acc;
  }, {});

  const tourEarnings = Object.entries(byTour).map(([id, v]) => ({
    tourId: id,
    tourName: v.name,
    toursRun: v.count,
    totalGuests: v.guests,
    grossRevenue: v.gross,
    platformFee: Math.round(v.gross * 0.1),
    netRevenue: Math.round(v.gross * 0.9),
  }));

  const totalGross  = tourEarnings.reduce((s, e) => s + e.grossRevenue, 0);
  const totalNet    = tourEarnings.reduce((s, e) => s + e.netRevenue, 0);
  const totalFee    = tourEarnings.reduce((s, e) => s + e.platformFee, 0);
  const totalGuests = tourEarnings.reduce((s, e) => s + e.totalGuests, 0);

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <AppHeader title="Earnings" />

      {/* Hero */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 pt-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="flex bg-zinc-800 rounded-xl p-1 mb-5 w-fit">
            {(["month", "all"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  period === p ? "bg-yellow-400 text-black" : "text-zinc-400"
                }`}
              >
                {p === "month" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="h-24 animate-pulse bg-zinc-800 rounded-2xl" />
          ) : (
            <>
              <p className="text-zinc-400 text-sm">Net earnings</p>
              <p className="text-4xl font-bold text-yellow-400 mt-1">{formatCurrency(totalNet)}</p>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { label: "Gross",       value: formatCurrency(totalGross) },
                  { label: "Platform Fee", value: formatCurrency(totalFee) },
                  { label: "Guests",      value: String(totalGuests) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-zinc-800 rounded-xl p-2.5 text-center">
                    <p className="text-zinc-500 text-[10px] mb-0.5">{label}</p>
                    <p className="text-white text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4">
        {/* Payout placeholder card */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-bold text-white">Payout</span>
            </div>
            <button className="text-xs font-semibold text-black bg-yellow-400 px-3 py-1 rounded-full hover:bg-yellow-300 transition-colors">
              Withdraw
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Available balance</span>
              <span className="font-bold text-white">{formatCurrency(totalNet)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Bank account</span>
              <span className="text-zinc-400">Not linked yet</span>
            </div>
          </div>
        </div>

        {/* Per-tour breakdown */}
        {tourEarnings.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-zinc-400 mb-2">By Tour</h2>
            <div className="space-y-2">
              {tourEarnings.map((e) => (
                <div key={e.tourId} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white line-clamp-1">{e.tourName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                        <span className="flex items-center gap-1"><Map className="w-3 h-3" />{e.toursRun} bookings</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{e.totalGuests} guests</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-bold text-yellow-400">{formatCurrency(e.netRevenue)}</p>
                      <p className="text-xs text-zinc-500">net</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-between text-xs text-zinc-500">
                    <span>Gross: {formatCurrency(e.grossRevenue)}</span>
                    <span>Fee: {formatCurrency(e.platformFee)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && tourEarnings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-5xl mb-4">💰</div>
            <p className="text-base font-semibold text-white mb-1">No earnings yet</p>
            <p className="text-sm text-zinc-500">Confirmed bookings will appear here</p>
          </div>
        )}

        {!loading && tourEarnings.length > 0 && (
          <p className="text-xs text-zinc-600 text-center pb-2">
            Last updated: {formatDate(new Date().toISOString())}
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

export default function EarningsPage() {
  return (
    <RequireAuth>
      <EarningsContent />
    </RequireAuth>
  );
}
