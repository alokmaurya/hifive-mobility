"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Users, Clock, ChevronRight } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useTravellerBookings } from "@/hooks/useTravellerBookings";
import type { TourType } from "@/types/traveller";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-sky-100 text-sky-600",
  confirmed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-500",
  completed: "bg-slate-100 text-slate-500",
};

const TOUR_TYPE_LABELS: Record<TourType, string> = {
  city_sightseeing:       "🏙️ City Tour",
  outer_city_sightseeing: "🛣️ Outer City Tour",
  flexi:                  "⏱️ Flexi",
};

export default function TravellerBookingsPage() {
  const router = useRouter();
  const { bookings, loading, cancelBooking } = useTravellerBookings();

  async function handleCancel(id: string) {
    if (!confirm("Cancel this booking?")) return;
    try { await cancelBooking(id); } catch { /* ignore */ }
  }

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-white pb-20">
        <div className="bg-blue-950 px-4 pt-10 pb-5">
          <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold text-white">My Bookings</h1>
            <p className="text-blue-300 text-sm mt-0.5">Your tour reservations</p>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-4">
          {loading && (
            <div className="flex justify-center mt-12">
              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="text-center mt-16">
              <CalendarDays className="w-12 h-12 text-sky-200 mx-auto mb-3" />
              <p className="text-slate-500">No bookings yet</p>
              <p className="text-slate-400 text-sm mt-1">Explore drivers and make your first booking</p>
              <button
                onClick={() => router.push("/traveller")}
                className="mt-4 px-6 py-2.5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-colors text-sm"
              >
                Find Drivers
              </button>
            </div>
          )}

          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-white border border-sky-200 rounded-3xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-blue-900 font-semibold text-sm">{b.driverName}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <p className="text-xs text-sky-500 mt-0.5">{TOUR_TYPE_LABELS[b.tourType] ?? b.tourType}</p>
                    {b.tourCity && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400 text-xs">{b.tourCity}</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${STATUS_STYLES[b.status] ?? "bg-slate-100 text-slate-500"}`}>
                    {b.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sky-100">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 text-xs">{b.tourDate}</span>
                  </div>
                  {b.tourType === "flexi" && b.hoursRequested ? (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 text-xs">{b.hoursRequested} hrs</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-slate-500 text-xs">{b.guestCount} guest{b.guestCount > 1 ? "s" : ""}</span>
                    </div>
                  )}
                  <div className="ml-auto text-sky-600 font-bold text-sm">
                    {b.currency}{b.totalAmount.toLocaleString("en-IN")}
                  </div>
                </div>

                {b.specialRequests && (
                  <p className="text-slate-400 text-xs mt-2 italic">"{b.specialRequests}"</p>
                )}

                {b.status === "pending" && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sky-400 text-xs">Waiting for driver to accept…</p>
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="text-xs text-red-500 hover:text-red-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                <p className="text-slate-300 text-xs mt-2">
                  <Clock className="w-2.5 h-2.5 inline mr-1" />
                  Booked {new Date(b.bookedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
