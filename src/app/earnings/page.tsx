"use client";

import { useState } from "react";
import { Banknote, TrendingUp, Users, Map, ArrowDownCircle } from "lucide-react";
import AppHeader from "@/components/ui/AppHeader";
import BottomNav from "@/components/ui/BottomNav";
import { mockEarnings, mockPayout } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";

type Period = "month" | "all";

export default function EarningsPage() {
  const [period, setPeriod] = useState<Period>("month");

  const totalGross = mockEarnings.reduce((s, e) => s + e.grossRevenue, 0);
  const totalNet   = mockEarnings.reduce((s, e) => s + e.netRevenue, 0);
  const totalFee   = mockEarnings.reduce((s, e) => s + e.platformFee, 0);
  const totalGuests = mockEarnings.reduce((s, e) => s + e.totalGuests, 0);

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <AppHeader title="Earnings" />

      {/* Hero card */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 px-4 pt-4 pb-8">
        <div className="max-w-md mx-auto">
          <div className="flex bg-white/20 rounded-xl p-1 mb-5 w-fit">
            {(["month", "all"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  period === p ? "bg-white text-teal-700" : "text-white/80"
                }`}
              >
                {p === "month" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>

          <p className="text-teal-200 text-sm">Net earnings</p>
          <p className="text-4xl font-bold text-white mt-1">{formatCurrency(totalNet)}</p>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: "Gross", value: formatCurrency(totalGross) },
              { label: "Platform Fee", value: formatCurrency(totalFee) },
              { label: "Guests", value: String(totalGuests) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/20 rounded-xl p-2.5 text-center">
                <p className="text-teal-200 text-[10px] mb-0.5">{label}</p>
                <p className="text-white text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 space-y-4">
        {/* Payout card */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-teal-500" />
              <span className="text-sm font-bold text-stone-800">Payout</span>
            </div>
            <button className="text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
              Withdraw
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Available</span>
              <span className="font-bold text-stone-900">{formatCurrency(mockPayout.pendingPayout)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Last payout</span>
              <span className="text-stone-600">{formatCurrency(mockPayout.lastPayoutAmount)} · {formatDate(mockPayout.lastPayoutDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Bank account</span>
              <span className="text-stone-600">•••• {mockPayout.bankLast4}</span>
            </div>
          </div>
        </div>

        {/* Per-tour breakdown */}
        <div>
          <h2 className="text-sm font-bold text-stone-700 mb-2">By Tour</h2>
          <div className="space-y-2">
            {mockEarnings.map((e) => (
              <div key={e.tourId} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900 line-clamp-1">{e.tourName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                      <span className="flex items-center gap-1"><Map className="w-3 h-3" />{e.toursRun} tours run</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{e.totalGuests} guests</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-stone-900">{formatCurrency(e.netRevenue)}</p>
                    <p className="text-xs text-stone-400">net</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-stone-50 flex justify-between text-xs text-stone-400">
                  <span>Gross: {formatCurrency(e.grossRevenue)}</span>
                  <span>Fee: {formatCurrency(e.platformFee)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
