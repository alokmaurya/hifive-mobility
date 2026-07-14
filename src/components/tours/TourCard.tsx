"use client";

import { MoreVertical, Calendar } from "lucide-react";
import type { Tour } from "@/types/tour";
import { formatCurrency, DAY_LABELS, CATEGORY_META, buildTourCode } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  seqNum?: number;
  onActionMenu?: (tour: Tour) => void;
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-400/15 text-emerald-400 border border-emerald-400/25",
  draft:     "bg-yellow-400/15 text-yellow-400 border border-yellow-400/25",
  paused:    "bg-zinc-700/50 text-zinc-400 border border-zinc-600/40",
  past:      "bg-zinc-800/50 text-zinc-500 border border-zinc-700/40",
};

const FUEL_LABELS: Record<string, { label: string; color: string }> = {
  petrol:  { label: "Petrol",  color: "text-orange-400" },
  diesel:  { label: "Diesel",  color: "text-yellow-400" },
  cng:     { label: "CNG",     color: "text-green-400" },
  hybrid:  { label: "Hybrid",  color: "text-teal-400" },
  ev:      { label: "Electric",color: "text-sky-400" },
};

const CAT_GRADIENT: Record<string, string> = {
  city_sightseeing:       "from-indigo-900 via-blue-900 to-slate-900",
  outer_city_sightseeing: "from-emerald-900 via-teal-900 to-slate-900",
  flexi:                  "from-violet-900 via-purple-900 to-slate-900",
};

export default function TourCard({ tour, seqNum = 1, onActionMenu }: TourCardProps) {
  const cat = CATEGORY_META[tour.category];
  const tourCode = buildTourCode(tour.city, tour.driverName ?? "", tour.category, tour.vehicleModel ?? "", seqNum);
  const fuelInfo = FUEL_LABELS[(tour.fuelType ?? "petrol").toLowerCase()] ?? FUEL_LABELS.petrol;
  const isFlexi = tour.category === "flexi";
  const gradientClass = CAT_GRADIENT[tour.category] ?? "from-slate-900 via-zinc-900 to-slate-900";

  const activeDays = (tour.schedule.daysOfWeek ?? [])
    .sort((a, b) => a - b)
    .map((d) => DAY_LABELS[d]);

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
      {/* Car photo / placeholder */}
      <div className="relative h-36 overflow-hidden">
        {tour.cabPhoto ? (
          <img
            src={tour.cabPhoto}
            alt="cab"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <span className="text-5xl opacity-60">{cat?.emoji ?? "🚗"}</span>
          </div>
        )}

        {/* Status badge bottom-left */}
        <span className={`absolute bottom-2 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${STATUS_STYLES[tour.status]}`}>
          {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
        </span>

        {/* Tour type chip top-left */}
        <span className="absolute top-2 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
          {cat?.emoji} {cat?.label}
        </span>

        {/* Action menu top-right */}
        {onActionMenu && (
          <button
            onClick={(e) => { e.preventDefault(); onActionMenu(tour); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="px-4 pt-3 pb-4 space-y-3">
        {/* Tour ID + fuel type */}
        <div>
          <p className="text-white font-extrabold text-base tracking-tight leading-tight">
            {tourCode}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-semibold ${fuelInfo.color}`}>
              ⛽ {fuelInfo.label}
            </span>
            {tour.vehicleCapacity ? (
              <span className="text-xs text-zinc-500">· {tour.vehicleCapacity} seater</span>
            ) : null}
            {tour.isAc && <span className="text-xs text-sky-400">· ❄️ AC</span>}
            {tour.isPetFriendly && <span className="text-xs text-green-400">· 🐾 Pets</span>}
            {tour.smokingAllowed && <span className="text-xs text-orange-400">· 🚬 Smoking</span>}
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        {/* Pricing */}
        <div className="space-y-1.5">
          {isFlexi ? (
            <div className="flex flex-wrap gap-2">
              {tour.offersHourly && tour.hourlyRate ? (
                <span className="text-xs bg-violet-900/40 border border-violet-700/40 text-violet-300 px-2.5 py-1 rounded-full font-semibold">
                  ⏱ {formatCurrency(tour.hourlyRate)}/hr
                </span>
              ) : null}
              {tour.offersAirportDrop && tour.airportDropPrice ? (
                <span className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full font-semibold">
                  ✈️ {formatCurrency(tour.airportDropPrice)}
                </span>
              ) : null}
              {tour.offersRailwayDrop && tour.railwayDropPrice ? (
                <span className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full font-semibold">
                  🚂 {formatCurrency(tour.railwayDropPrice)}
                </span>
              ) : null}
              {tour.offersBusDrop && tour.busStationDropPrice ? (
                <span className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full font-semibold">
                  🚌 {formatCurrency(tour.busStationDropPrice)}
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-yellow-400 font-extrabold text-xl">
                  {formatCurrency(tour.fullCabPrice ?? tour.pricePerPerson)}
                </span>
                <span className="text-zinc-500 text-xs ml-1">full cab</span>
              </div>
              {(tour.overtimeRatePerHour ?? 0) > 0 && (
                <span className="text-zinc-400 text-xs">
                  +{formatCurrency(tour.overtimeRatePerHour ?? 0)}/hr overtime
                </span>
              )}
            </div>
          )}
        </div>

        {/* Days */}
        {activeDays.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <div className="flex gap-1 flex-wrap">
              {DAY_LABELS.map((day, idx) => {
                const active = (tour.schedule.daysOfWeek ?? []).includes(idx);
                return (
                  <span
                    key={day}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md transition-colors ${
                      active
                        ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                        : "bg-zinc-800 text-zinc-600"
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Schedule row (non-flexi) */}
        {!isFlexi && tour.schedule.startTime && (
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>🕗 {tour.schedule.startTime} – {tour.schedule.endTime}</span>
            {tour.stops.length > 0 && (
              <span className="text-zinc-600">· {tour.stops.length} stop{tour.stops.length > 1 ? "s" : ""}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
