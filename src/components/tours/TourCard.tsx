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
  const tourCode = tour.tourCode || buildTourCode(tour.city, tour.driverName ?? "", tour.category, tour.vehicleModel ?? "", seqNum);
  const fuelInfo = FUEL_LABELS[(tour.fuelType ?? "petrol").toLowerCase()] ?? FUEL_LABELS.petrol;
  const isFlexi = tour.category === "flexi";
  const gradientClass = CAT_GRADIENT[tour.category] ?? "from-slate-900 via-zinc-900 to-slate-900";

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
      {/* Car photo / placeholder */}
      <div className="relative h-36 overflow-hidden">
        {tour.cabPhoto ? (
          <img src={tour.cabPhoto} alt="cab" className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <span className="text-5xl opacity-60">{cat?.emoji ?? "🚗"}</span>
          </div>
        )}
        <span className={`absolute bottom-2 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${STATUS_STYLES[tour.status]}`}>
          {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
        </span>
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

        {/* Header row: Tour name left · Car details right */}
        <div className="flex items-start justify-between gap-3">
          {/* Left: City + Tour Type (big), Tour ID (small) */}
          <div className="min-w-0">
            <p className="text-white font-extrabold text-base leading-snug">
              {tour.city} <span className="text-zinc-400 font-semibold">{cat?.label}</span>
            </p>
            <p className="text-zinc-500 text-[11px] font-mono mt-0.5 tracking-wide">{tourCode}</p>
          </div>

          {/* Right: Car details */}
          <div className="shrink-0 text-right space-y-0.5">
            {tour.vehicleModel && (
              <p className="text-zinc-300 text-xs font-semibold">{tour.vehicleModel}</p>
            )}
            <p className={`text-xs font-semibold ${fuelInfo.color}`}>⛽ {fuelInfo.label}</p>
            {tour.vehicleCapacity ? (
              <p className="text-zinc-500 text-[11px]">{tour.vehicleCapacity} seater</p>
            ) : null}
            <div className="flex items-center justify-end gap-1 mt-1 flex-wrap">
              {tour.isAc && <span className="text-[10px] text-sky-400">❄️</span>}
              {tour.isPetFriendly && <span className="text-[10px] text-green-400">🐾</span>}
              {tour.smokingAllowed && <span className="text-[10px] text-orange-400">🚬</span>}
            </div>
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        {/* Pricing */}
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

        {/* Days grid */}
        {(tour.schedule.daysOfWeek ?? []).length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <div className="flex gap-1">
              {DAY_LABELS.map((day, idx) => {
                const active = (tour.schedule.daysOfWeek ?? []).includes(idx);
                return (
                  <span
                    key={day}
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
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
