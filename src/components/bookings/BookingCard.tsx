"use client";

import { useState } from "react";
import { Calendar, Users, Phone, Check, X, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import type { Booking } from "@/types/tour";
import { formatCurrency, formatDate } from "@/lib/utils";

interface BookingCardProps {
  booking: Booking;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-400/10 text-yellow-400",
  confirmed: "bg-green-400/10 text-green-400",
  cancelled: "bg-red-400/10 text-red-400",
};

export default function BookingCard({ booking, onConfirm, onCancel }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-white">{booking.guest.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{booking.tourName}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <p className="text-sm font-bold text-white">{formatCurrency(booking.totalAmount)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(booking.tourDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {booking.guest.guestCount} {booking.guest.guestCount === 1 ? "guest" : "guests"}
          </span>
          {expanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-3">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Phone className="w-4 h-4 text-zinc-500" />
            <a href={`tel:${booking.guest.phone}`} className="text-yellow-400 font-medium">{booking.guest.phone}</a>
          </div>

          {booking.guest.specialRequests && (
            <div className="flex items-start gap-2 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-3 py-2.5">
              <MessageSquare className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-yellow-400">Special Request</p>
                <p className="text-xs text-zinc-400 mt-0.5">{booking.guest.specialRequests}</p>
              </div>
            </div>
          )}

          {booking.status === "pending" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onCancel?.(booking.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-semibold text-zinc-300">Decline</span>
              </button>
              <button
                onClick={() => onConfirm?.(booking.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 transition-colors"
              >
                <Check className="w-4 h-4 text-black" />
                <span className="text-sm font-semibold text-black">Confirm</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
