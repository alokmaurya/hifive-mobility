"use client";

import { useState } from "react";
import { TrendingUp, ChevronRight } from "lucide-react";
import type { EarningsSummary } from "@/types/driver";

interface EarningsCardProps {
  earnings: EarningsSummary;
}

type Period = "today" | "week" | "month";

export default function EarningsCard({ earnings }: EarningsCardProps) {
  const [period, setPeriod] = useState<Period>("today");

  const periodLabel: Record<Period, string> = {
    today: "Today",
    week: "This Week",
    month: "This Month",
  };

  const value = earnings[period];

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 opacity-80" />
          <span className="text-sm font-medium opacity-90">Earnings</span>
        </div>
        <button className="flex items-center gap-1 text-xs opacity-80 hover:opacity-100 transition-opacity">
          Details <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-4xl font-bold">
          {earnings.currency}
          {value.toLocaleString()}
        </p>
        <p className="text-sm opacity-70 mt-1">{periodLabel[period]}</p>
      </div>

      <div className="flex bg-white/20 rounded-xl p-1 gap-1">
        {(["today", "week", "month"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              period === p
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-white/80 hover:text-white"
            }`}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
