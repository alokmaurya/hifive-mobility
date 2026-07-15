"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Users, Clock, ArrowRight, Ticket, Car, Wind, KeyRound } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useTravellerBookings } from "@/hooks/useTravellerBookings";
import type { TourType } from "@/types/traveller";

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending:   { bg: "bg-amber-50",   text: "text-amber-600",  dot: "bg-amber-400",  label: "Pending" },
  confirmed: { bg: "bg-green-50",   text: "text-green-600",  dot: "bg-green-500",  label: "Confirmed" },
  cancelled: { bg: "bg-red-50",     text: "text-red-500",    dot: "bg-red-400",    label: "Cancelled" },
  completed: { bg: "bg-slate-100",  text: "text-slate-500",  dot: "bg-slate-400",  label: "Completed" },
};

const TOUR_TYPE_META: Record<TourType, { emoji: string; label: string }> = {
  city_sightseeing:       { emoji: "🏙️", label: "City Tour" },
  outer_city_sightseeing: { emoji: "🛣️", label: "Outer City Tour" },
  flexi:                  { emoji: "⏱️", label: "Flexi" },
};

export default function TravellerBookingsPage() {
  const router = useRouter();
  const { bookings, loading, cancelBooking } = useTravellerBookings();

  async function handleCancel(id: string) {
    if (!confirm("Cancel this booking?")) return;
    try { await cancelBooking(id); } catch { /* ignore */ }
  }

  const active   = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
  const past     = bookings.filter((b) => b.status === "cancelled" || b.status === "completed");

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-12 pb-6">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-extrabold text-white">My Bookings</h1>
            <p className="text-blue-300 text-sm mt-0.5">Track your tour requests</p>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-4">
          {loading && (
            <div className="flex flex-col items-center justify-center mt-16 gap-3">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading bookings…</p>
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="text-center mt-20">
              <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-9 h-9 text-indigo-300" />
              </div>
              <p className="text-slate-700 font-bold text-lg">No bookings yet</p>
              <p className="text-slate-400 text-sm mt-1 mb-6">Find a driver and book your first tour</p>
              <button
                onClick={() => router.push("/traveller")}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold rounded-2xl shadow-md shadow-indigo-100 text-sm"
              >
                Explore Drivers
              </button>
            </div>
          )}

          {!loading && active.length > 0 && (
            <div className="space-y-3 mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming</p>
              {active.map((b) => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
            </div>
          )}

          {!loading && past.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Past</p>
              {past.map((b) => <BookingCard key={b.id} booking={b} onCancel={handleCancel} />)}
            </div>
          )}
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}

function BookingCard({ booking: b, onCancel }: {
  booking: ReturnType<typeof useTravellerBookings>["bookings"][number];
  onCancel: (id: string) => void;
}) {
  const st  = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.completed;
  const meta = TOUR_TYPE_META[b.tourType] ?? { emoji: "🗺️", label: b.tourType };

  const hasCarInfo = b.carBrand || b.vehicleModel;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Top bar — driver identity */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          {/* Driver avatar */}
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-100">
            {b.driverPhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.driverPhotoUrl} alt={b.driverName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-extrabold text-indigo-500">{b.driverName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="text-slate-900 font-bold text-sm leading-tight">{b.driverName}</p>
            <p className="text-slate-400 text-xs">{meta.label}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${st.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
          <span className={`text-xs font-bold ${st.text}`}>{st.label}</span>
        </div>
      </div>

      {/* Car section */}
      {hasCarInfo && (
        <div className="mx-4 mb-3 rounded-2xl overflow-hidden border border-slate-100">
          {/* Car photo */}
          <div className="bg-slate-50 h-32 flex items-center justify-center relative">
            {b.cabPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.cabPhoto} alt="Car" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <Car className="w-10 h-10 text-slate-300" />
                <span className="text-slate-400 text-xs font-medium">Car picture not available</span>
              </div>
            )}
            {/* Car name overlay — bottom left */}
            {hasCarInfo && (
              <div className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                <span className="text-white text-xs font-bold">{[b.carBrand, b.vehicleModel].filter(Boolean).join(" ")}</span>
              </div>
            )}
            {/* Vehicle plate overlay — bottom right, styled like a number plate */}
            {b.vehiclePlate && (
              <div className="absolute bottom-2 right-2 bg-amber-400 px-2.5 py-1 rounded-lg border-2 border-amber-500 shadow">
                <span className="text-slate-900 text-xs font-extrabold font-mono tracking-widest">{b.vehiclePlate}</span>
              </div>
            )}
          </div>
          {/* Car chips */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white flex-wrap">
            {b.vehicleCapacity !== undefined && (
              <div className="flex items-center gap-1 bg-slate-50 rounded-lg px-2 py-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span className="text-slate-600 text-[10px] font-semibold">{b.vehicleCapacity} seats</span>
              </div>
            )}
            {b.isAc !== undefined && (
              <div className={`flex items-center gap-1 rounded-lg px-2 py-1 ${b.isAc ? "bg-sky-50" : "bg-slate-50"}`}>
                <Wind className={`w-3 h-3 ${b.isAc ? "text-sky-500" : "text-slate-300"}`} />
                <span className={`text-[10px] font-semibold ${b.isAc ? "text-sky-600" : "text-slate-400"}`}>AC</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Details row */}
      <div className="flex items-center gap-4 px-4 pb-3 flex-wrap">
        {b.tourCity && (
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-500 text-xs">{b.tourCity}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-500 text-xs">{b.tourDate}</span>
        </div>
        {b.tourType === "flexi" && b.hoursRequested ? (
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-500 text-xs">{b.hoursRequested} hrs</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-500 text-xs">{b.guestCount} guest{b.guestCount > 1 ? "s" : ""}</span>
          </div>
        )}
        {/* Tour start/end time */}
        {(b.tourStartTime || b.tourEndTime) && (
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-500 text-xs">
              {b.tourStartTime ?? "—"} – {b.tourEndTime ?? "—"}
            </span>
          </div>
        )}
      </div>

      {/* OTP section */}
      <div className="mx-4 mb-3 grid grid-cols-2 gap-2">
        {/* Start OTP */}
        <div className="bg-indigo-50 rounded-2xl px-3 py-2.5 border border-indigo-100">
          <div className="flex items-center gap-1 mb-1">
            <KeyRound className="w-3 h-3 text-indigo-400" />
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Start OTP</p>
          </div>
          {b.startOtp ? (
            <p className="text-indigo-700 font-extrabold text-lg tracking-widest">{b.startOtp}</p>
          ) : (
            <p className="text-indigo-300 text-xs font-medium">Will be shared on confirmation</p>
          )}
        </div>
        {/* End OTP */}
        <div className="bg-slate-50 rounded-2xl px-3 py-2.5 border border-slate-100">
          <div className="flex items-center gap-1 mb-1">
            <KeyRound className="w-3 h-3 text-slate-400" />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">End OTP</p>
          </div>
          {b.endOtp ? (
            <p className="text-slate-700 font-extrabold text-lg tracking-widest">{b.endOtp}</p>
          ) : (
            <p className="text-slate-400 text-xs font-medium">Shared at tour start</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-50">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Total</p>
          <p className="text-indigo-600 font-extrabold text-lg leading-tight">{b.currency}{b.totalAmount.toLocaleString("en-IN")}</p>
        </div>
        {b.status === "pending" && (
          <div className="flex items-center gap-3">
            <p className="text-slate-400 text-xs">Awaiting confirmation</p>
            <button
              onClick={() => onCancel(b.id)}
              className="text-xs text-red-400 hover:text-red-500 font-semibold transition-colors border border-red-200 px-2.5 py-1 rounded-xl"
            >
              Cancel
            </button>
          </div>
        )}
        {b.status === "confirmed" && (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-xl">
            <span className="text-green-600 text-xs font-bold">Confirmed</span>
            <ArrowRight className="w-3 h-3 text-green-500" />
          </div>
        )}
      </div>

      {b.specialRequests && (
        <div className="px-4 pb-3">
          <p className="text-slate-400 text-xs italic bg-slate-50 rounded-xl px-3 py-2">"{b.specialRequests}"</p>
        </div>
      )}
    </div>
  );
}
