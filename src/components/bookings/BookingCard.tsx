"use client";

import { useState } from "react";
import { Calendar, Users, Phone, Check, X, ChevronDown, ChevronUp, MessageSquare, Clock, Mail, MapPin, KeyRound, PlayCircle, CheckCircle, Star, Navigation } from "lucide-react";
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

const ACCENT: Record<string, string> = {
  pending:   "bg-yellow-400",
  confirmed: "bg-green-400",
  ongoing:   "bg-sky-400",
  completed: "bg-zinc-600",
  cancelled: "bg-red-500",
};

const STATUS_PILL: Record<string, string> = {
  pending:   "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  confirmed: "bg-green-400/15 text-green-400 border-green-400/30",
  ongoing:   "bg-sky-400/15 text-sky-400 border-sky-400/30",
  completed: "bg-zinc-700/60 text-zinc-400 border-zinc-700",
  cancelled: "bg-red-400/15 text-red-400 border-red-400/30",
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

// Trip timeline steps
const TIMELINE_STEPS = ["Booked", "Confirmed", "On Going", "Done"];
function timelineIndex(status: string) {
  return { pending: 0, confirmed: 1, ongoing: 2, completed: 3, cancelled: -1 }[status] ?? 0;
}

export default function BookingCard({ booking, onConfirm, onCancel, onStartTrip, onEndTrip }: BookingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);

  const tourMeta = booking.tourType ? (TOUR_TYPE_META[booking.tourType] ?? { emoji: "🗺️", label: booking.tourType }) : null;
  const isFlexi = booking.tourType === "flexi";
  const displayName = booking.guest.name || "Unknown Traveller";
  const stepIdx = timelineIndex(booking.status);
  const isCancelled = booking.status === "cancelled";
  const accentColor = ACCENT[booking.status] ?? "bg-zinc-600";

  return (
    <div className={`relative bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg`}>
      {/* Left accent stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} rounded-l-2xl`} />

      {/* Card header — always visible */}
      <div className="pl-4 pr-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 ${
            isCancelled ? "bg-zinc-800 border-zinc-700" : `${accentColor} border-transparent`
          }`}>
            <span className={`text-base font-extrabold ${isCancelled ? "text-zinc-500" : "text-black"}`}>
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-white leading-tight truncate">{displayName}</p>
                {tourMeta && (
                  <p className="text-xs text-zinc-500 mt-0.5">{tourMeta.emoji} {tourMeta.label}</p>
                )}
                {!tourMeta && booking.tourName && (
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{booking.tourName}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_PILL[booking.status] ?? ""}`}>
                  {STATUS_LABELS[booking.status] ?? booking.status}
                </span>
                <p className="text-base font-extrabold text-white">{formatCurrency(booking.totalAmount)}</p>
              </div>
            </div>

            {/* Date + guests row */}
            <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(booking.tourDate)}
              </span>
              {isFlexi && booking.flexiStartTime && booking.flexiEndTime ? (
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
              {booking.pickupAddress && (
                <span className="flex items-center gap-1 text-sky-400">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate max-w-[90px]">{booking.pickupAddress.split(",")[0]}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Trip timeline — hidden for cancelled */}
        {!isCancelled && (
          <div className="flex items-center gap-0 mt-3 mb-1">
            {TIMELINE_STEPS.map((label, i) => {
              const done    = i < stepIdx;
              const active  = i === stepIdx;
              const isLast  = i === TIMELINE_STEPS.length - 1;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                      done    ? `${accentColor} border-transparent` :
                      active  ? `bg-zinc-950 border-current ${accentColor.replace("bg-", "text-")}` :
                                "bg-zinc-800 border-zinc-700"
                    }`}>
                      {done && <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />}
                      {active && <div className={`w-1.5 h-1.5 rounded-full ${accentColor}`} />}
                    </div>
                    <span className={`text-[9px] font-semibold whitespace-nowrap ${
                      active ? "text-white" : done ? "text-zinc-400" : "text-zinc-700"
                    }`}>{label}</span>
                  </div>
                  {!isLast && (
                    <div className={`h-px flex-1 mx-1 mb-3 transition-all ${done ? accentColor.replace("bg-", "bg-") : "bg-zinc-800"}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pending: action buttons always visible */}
        {booking.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onCancel?.(booking.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
            >
              <X className="w-4 h-4 text-zinc-400" />
              <span className="text-sm font-bold text-zinc-300">Decline</span>
            </button>
            <button
              onClick={() => onConfirm?.(booking.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 transition-colors"
            >
              <Check className="w-4 h-4 text-black" />
              <span className="text-sm font-bold text-black">Confirm</span>
            </button>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 mt-2.5 text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest">
            {expanded ? "Less" : "Details"}
          </span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="border-t border-zinc-800 px-4 pb-4 pt-3 space-y-3">

          {/* Traveller contact */}
          <div className="bg-zinc-800/50 rounded-xl p-3 space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Traveller</p>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="text-white text-sm font-medium">{displayName}</span>
            </div>
            {booking.guest.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <a href={`tel:${booking.guest.phone}`} className="text-yellow-400 text-sm font-medium hover:underline">
                  {booking.guest.phone}
                </a>
              </div>
            )}
            {booking.travellerEmail && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <a href={`mailto:${booking.travellerEmail}`} className="text-yellow-400 text-sm font-medium hover:underline truncate">
                  {booking.travellerEmail}
                </a>
              </div>
            )}
          </div>

          {/* Booking details */}
          <div className="bg-zinc-800/50 rounded-xl p-3 space-y-2">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Trip Details</p>
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
          </div>

          {/* Pickup location */}
          {booking.pickupAddress && (
            <div className="bg-sky-950/40 border border-sky-800/40 rounded-xl p-3 space-y-1.5">
              <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">Pickup Location</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300 text-xs leading-relaxed">{booking.pickupAddress}</p>
              </div>
              {booking.pickupLat && booking.pickupLng && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${booking.pickupLat},${booking.pickupLng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sky-400 text-xs font-semibold hover:text-sky-300 mt-1"
                >
                  <Navigation className="w-3 h-3" />
                  Open in Google Maps →
                </a>
              )}
            </div>
          )}

          {/* Special requests */}
          {booking.guest.specialRequests && (
            <div className="flex items-start gap-2 bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-3 py-2.5">
              <MessageSquare className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-400">Special Request</p>
                <p className="text-xs text-zinc-400 mt-0.5">{booking.guest.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Start OTP (confirmed) */}
          {booking.status === "confirmed" && (
            <div className="bg-sky-950/60 border border-sky-800/60 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <KeyRound className="w-4 h-4 text-sky-400" />
                <p className="text-sky-300 text-xs font-bold uppercase tracking-wider">Enter Start OTP</p>
              </div>
              <p className="text-zinc-400 text-[11px] mb-3">Ask the traveller for their 4-digit Start OTP to begin the trip.</p>
              <div className="flex gap-2">
                <input
                  type="text" inputMode="numeric" maxLength={4} placeholder="_ _ _ _"
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
          )}

          {/* End OTP (ongoing) */}
          {booking.status === "ongoing" && (
            <div className="bg-green-950/60 border border-green-800/60 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <KeyRound className="w-4 h-4 text-green-400" />
                <p className="text-green-300 text-xs font-bold uppercase tracking-wider">Enter End OTP</p>
              </div>
              <p className="text-zinc-400 text-[11px] mb-3">Ask the traveller for their 4-digit End OTP to complete the trip.</p>
              <div className="flex gap-2">
                <input
                  type="text" inputMode="numeric" maxLength={4} placeholder="_ _ _ _"
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
          )}

          {/* Post-trip rating */}
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
        </div>
      )}
    </div>
  );
}
