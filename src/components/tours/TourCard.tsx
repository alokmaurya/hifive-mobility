"use client";

import Link from "next/link";
import { Clock, Users, Star, MapPin, MoreVertical } from "lucide-react";
import type { Tour } from "@/types/tour";
import { formatCurrency, formatTime, formatDuration, getOccupancyPercent, CATEGORY_META } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  onActionMenu?: (tour: Tour) => void;
  compact?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-400/10 text-green-400",
  draft:     "bg-yellow-400/10 text-yellow-400",
  paused:    "bg-zinc-700 text-zinc-400",
  past:      "bg-zinc-700 text-zinc-500",
};

export default function TourCard({ tour, onActionMenu, compact = false }: TourCardProps) {
  const cat = CATEGORY_META[tour.category];
  const occupancy = getOccupancyPercent(tour.currentBookings, tour.maxGuests);
  const spotsLeft = tour.maxGuests - tour.currentBookings;

  if (compact) {
    return (
      <Link href={`/tours/${tour.id}`} className="block shrink-0 w-52 bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-yellow-400/40 transition-colors">
        <div className="bg-zinc-800 h-24 flex items-center justify-center text-4xl">
          {cat?.emoji}
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-white leading-tight line-clamp-2 mb-1">{tour.name}</p>
          <p className="text-xs text-zinc-500">{formatTime(tour.schedule.startTime)} · {formatDuration(tour.estimatedDurationMinutes)}</p>
          <p className="text-sm font-bold text-yellow-400 mt-1">{formatCurrency(tour.pricePerPerson)}<span className="text-xs font-normal text-zinc-500">/person</span></p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <div className="flex items-stretch">
        <div className="w-20 bg-zinc-800 flex items-center justify-center text-3xl shrink-0">
          {cat?.emoji}
        </div>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight line-clamp-1">{tour.name}</p>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${STATUS_STYLES[tour.status]}`}>
                {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
              </span>
            </div>
            {onActionMenu && (
              <button
                onClick={(e) => { e.preventDefault(); onActionMenu(tour); }}
                className="p-1 rounded-lg hover:bg-zinc-800 shrink-0"
              >
                <MoreVertical className="w-4 h-4 text-zinc-500" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(tour.schedule.startTime)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {tour.stops.length} stops
            </span>
            {tour.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {tour.rating}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-bold text-yellow-400">
              {formatCurrency(tour.pricePerPerson)}
              <span className="text-xs font-normal text-zinc-500">/person</span>
            </p>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-zinc-500" />
              <span className="text-xs text-zinc-500">{spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}</span>
            </div>
          </div>

          {tour.status === "published" && (
            <div className="mt-2">
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${occupancy >= 90 ? "bg-red-400" : occupancy >= 60 ? "bg-yellow-400" : "bg-green-400"}`}
                  style={{ width: `${occupancy}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
