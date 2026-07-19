"use client";

import { useState } from "react";
import { Calendar, Users, Phone, Check, X, ChevronDown, ChevronUp, MessageSquare, Clock, Mail, MapPin, KeyRound, PlayCircle, CheckCircle, Star } from "lucide-react";
import type { Booking } from "@/types/tour";
import { formatCurrency, formatDate } from "@/lib/utils";

function fmt12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

interface BookingCardProps {
  booking: Booking;
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  onStartTrip?: (id: string, otp: string) => Promise<void>;
  onEndTrip?: (id: string, otp: string) => Promise<void>;
}

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-400/10 text-yellow-400",
  confirmed: "bg-green-400/10 text-green-400",
  ongoing:   "bg-sky-400/10 text-sky-400",
  completed: "bg-zinc-700/60 text-zinc-400",
  cancelled: "bg-red-400/10 text-red-400",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  ongoing:   "On Going",
  completed: "Completed",
  cancelled: "Cancelled",
};

const TOUR_TYPE_META: Record<string, { emoji: string; label: string }> = {
  city_sightseeing:       { emoji: "🏙️", label: "City Sightseeing" },
  outer_city_sightseeing: { emoji: "🛣️", label: "Outer City Tour" },
  flexi:                  { emoji: "⏱️", label: "Flexi" },
};

export default function BookingCard({ booking, onConfirm, onCancel, onStartTrip, onEndTrip }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  const tourMeta = booking.tourType ? (TOUR_TYPE_META[booking.tourType] ?? { emoji: "🗺️", label: booking.tourType }) : null;
  const isFlexi = booking.tourType === "flexi";
  const displayName = booking.guest.name || "Unknown Traveller";

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <button
        className="w-full text-left p-4"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
              <span className="text-base font-bold text-yellow-400">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">{displayName}</p>
              {tourMeta && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  {tourMeta.emoji} {tourMeta.label}
                </p>
              )}
              {!tourMeta && booking.tourName && (
                <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{booking.tourName}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[booking.status] ?? ""}`}>
              {STATUS_LABELS[booking.status] ?? booking.status}
            </span>
            <p className="text-sm font-bold text-white">{formatCurrency(booking.totalAmount)}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2.5 text-xs text-zinc-500 pl-13">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(booking.tourDate)}
          </span>
          {isFlexi && (booking.flexiStartTime && booking.flexiEndTime) ? (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fmt12h(booking.flexiStartTime)} – {fmt12h(booking.flexiEndTime)}
            </span>
          ) : isFlexi && booking.hoursRequested ? (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {booking.hoursRequested} hrs
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {booking.guest.guestCount} {booking.guest.guestCount === 1 ? "guest" : "guests"}
            </span>
          )}
          {expanded ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-3 space-y-3">
          {/* Traveller contact info */}
          <div className="bg-zinc-800/60 rounded-xl p-3 space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Traveller Details</p>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-white font-medium">{displayName}</span>
            </div>
            {booking.guest.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <a href={`tel:${booking.guest.phone}`} className="text-yellow-400 font-medium text-sm hover:underline">
                  {booking.guest.phone}
                </a>
              </div>
            )}
            {booking.travellerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <a href={`mailto:${booking.travellerEmail}`} className="text-yellow-400 font-medium text-sm hover:underline truncate">
                  {booking.travellerEmail}
                </a>
              </div>
            )}
          </div>

          {/* Booking details */}
          <div className="bg-zinc-800/60 rounded-xl p-3 space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Booking Details</p>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>{formatDate(booking.tourDate)}</span>
            </div>
            {isFlexi && booking.flexiStartTime && booking.flexiEndTime ? (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{fmt12h(booking.flexiStartTime)} – {fmt12h(booking.flexiEndTime)} ({booking.hoursRequested} hrs)</span>
              </div>
            ) : isFlexi && booking.hoursRequested ? (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{booking.hoursRequested} hours requested</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{booking.guest.guestCount} {booking.guest.guestCount === 1 ? "guest" : "guests"}</span>
              </div>
            )}
            {tourMeta && (
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>{tourMeta.emoji} {tourMeta.label}</span>
              </div>
            )}
            {booking.pickupAddress && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-yellow-200">{booking.pickupAddress}</span>
                  {booking.pickupLat && booking.pickupLng && (
                    <a
                      href={`https://www.google.com/maps?q=${booking.pickupLat},${booking.pickupLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-400 hover:text-sky-300 underline underline-offset-2"
                    >
                      Open in Google Maps →
                    </a>
                  )}
                </div>
              </div>
            )}
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

          {/* Start OTP entry — traveller shares 4-digit OTP with driver */}
          {booking.status === "confirmed" && (
            <div className="pt-1 space-y-2">
              <div className="bg-sky-950/60 border border-sky-800/60 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="w-4 h-4 text-sky-400" />
                  <p className="text-sky-300 text-xs font-bold uppercase tracking-wider">Enter Start OTP from Traveller</p>
                </div>
                <p className="text-zinc-400 text-[11px] mb-3">Ask the traveller for their 4-digit Start OTP to begin the trip.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="_ _ _ _"
                    value={otpInput}
                    onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "")); setOtpError(null); }}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-sky-500"
                  />
                  <button
                    disabled={otpInput.length !== 4 || otpLoading}
                    onClick={async () => {
                      if (!onStartTrip) return;
                      setOtpLoading(true); setOtpError(null);
                      try { await onStartTrip(booking.id, otpInput); setOtpInput(""); }
                      catch (err: unknown) { setOtpError((err as { message?: string })?.message ?? "Invalid OTP"); }
                      finally { setOtpLoading(false); }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlayCircle className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">{otpLoading ? "…" : "Start"}</span>
                  </button>
                </div>
                {otpError && <p className="text-red-400 text-xs mt-2">{otpError}</p>}
              </div>
            </div>
          )}

          {/* Traveller rating — shown to driver on completed bookings */}
          {booking.status === "completed" && booking.travellerRating && (
            <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">Traveller Rating</p>
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= booking.travellerRating! ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                ))}
                <span className="text-amber-400 font-bold text-sm ml-1">{booking.travellerRating}/5</span>
              </div>
              {booking.ratingComment && (
                <p className="text-zinc-400 text-xs italic mt-1">"{booking.ratingComment}"</p>
              )}
            </div>
          )}

          {/* End OTP entry — traveller shares End OTP with driver to close trip */}
          {booking.status === "ongoing" && (
            <div className="pt-1 space-y-2">
              <div className="bg-green-950/60 border border-green-800/60 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="w-4 h-4 text-green-400" />
                  <p className="text-green-300 text-xs font-bold uppercase tracking-wider">Enter End OTP from Traveller</p>
                </div>
                <p className="text-zinc-400 text-[11px] mb-3">Ask the traveller for their 4-digit End OTP to complete the trip.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="_ _ _ _"
                    value={otpInput}
                    onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "")); setOtpError(null); }}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-green-500"
                  />
                  <button
                    disabled={otpInput.length !== 4 || otpLoading}
                    onClick={async () => {
                      if (!onEndTrip) return;
                      setOtpLoading(true); setOtpError(null);
                      try { await onEndTrip(booking.id, otpInput); setOtpInput(""); }
                      catch (err: unknown) { setOtpError((err as { message?: string })?.message ?? "Invalid OTP"); }
                      finally { setOtpLoading(false); }
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-sm font-bold text-white">{otpLoading ? "…" : "End"}</span>
                  </button>
                </div>
                {otpError && <p className="text-red-400 text-xs mt-2">{otpError}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
