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
  published: "bg-green-100 text-green-700",
  draft:     "bg-amber-100 text-amber-700",
  paused:    "bg-stone-100 text-stone-500",
  past:      "bg-stone-100 text-stone-400",
};

export default function TourCard({ tour, onActionMenu, compact = false }: TourCardProps) {
  const cat = CATEGORY_META[tour.category];
  const occupancy = getOccupancyPercent(tour.currentBookings, tour.maxGuests);
  const spotsLeft = tour.maxGuests - tour.currentBookings;

  if (compact) {
    return (
      <Link href={`/tours/${tour.id}`} className="block shrink-0 w-52 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="bg-gradient-to-br from-brand-100 to-teal-100 h-24 flex items-center justify-center text-4xl">
          {cat?.emoji}
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-stone-900 leading-tight line-clamp-2 mb-1">{tour.name}</p>
          <p className="text-xs text-stone-400">{formatTime(tour.schedule.startTime)} · {formatDuration(tour.estimatedDurationMinutes)}</p>
          <p className="text-sm font-bold text-brand-500 mt-1">{formatCurrency(tour.pricePerPerson)}<span className="text-xs font-normal text-stone-400">/person</span></p>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="flex items-stretch">
        <div className="w-20 bg-gradient-to-br from-brand-100 to-teal-100 flex items-center justify-center text-3xl shrink-0">
          {cat?.emoji}
        </div>
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold text-stone-900 leading-tight line-clamp-1">{tour.name}</p>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${STATUS_STYLES[tour.status]}`}>
                {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
              </span>
            </div>
            {onActionMenu && (
              <button
                onClick={(e) => { e.preventDefault(); onActionMenu(tour); }}
                className="p-1 rounded-lg hover:bg-stone-100 shrink-0"
              >
                <MoreVertical className="w-4 h-4 text-stone-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs text-stone-500">
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
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {tour.rating}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-bold text-brand-500">
              {formatCurrency(tour.pricePerPerson)}
              <span className="text-xs font-normal text-stone-400">/person</span>
            </p>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-stone-400" />
              <span className="text-xs text-stone-500">{spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}</span>
            </div>
          </div>

          {tour.status === "published" && (
            <div className="mt-2">
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${occupancy >= 90 ? "bg-red-400" : occupancy >= 60 ? "bg-amber-400" : "bg-teal-500"}`}
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
