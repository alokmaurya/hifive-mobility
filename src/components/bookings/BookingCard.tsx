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
  pending:   "bg-amber-100 text-amber-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-500",
};

export default function BookingCard({ booking, onConfirm, onCancel }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-stone-900">{booking.guest.name}</p>
            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{booking.tourName}</p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <p className="text-sm font-bold text-stone-800">{formatCurrency(booking.totalAmount)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
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
        <div className="px-4 pb-4 border-t border-stone-50 pt-3 space-y-3">
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <Phone className="w-4 h-4 text-stone-400" />
            <a href={`tel:${booking.guest.phone}`} className="text-teal-600 font-medium">{booking.guest.phone}</a>
          </div>

          {booking.guest.specialRequests && (
            <div className="flex items-start gap-2 bg-amber-50 rounded-xl px-3 py-2.5">
              <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-700">Special Request</p>
                <p className="text-xs text-amber-600 mt-0.5">{booking.guest.specialRequests}</p>
              </div>
            </div>
          )}

          {booking.status === "pending" && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onCancel?.(booking.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4 text-stone-500" />
                <span className="text-sm font-semibold text-stone-600">Decline</span>
              </button>
              <button
                onClick={() => onConfirm?.(booking.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 transition-colors"
              >
                <Check className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">Confirm</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
