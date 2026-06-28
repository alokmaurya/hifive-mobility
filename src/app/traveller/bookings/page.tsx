"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Users, Clock, ChevronRight } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useTravellerBookings } from "@/hooks/useTravellerBookings";

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-yellow-400/10 text-yellow-400",
  confirmed: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
  completed: "bg-zinc-700 text-zinc-300",
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
      <div className="min-h-screen bg-zinc-950 pb-20">
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 pt-10 pb-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-xl font-bold text-white">My Bookings</h1>
            <p className="text-zinc-400 text-sm mt-0.5">Your tour reservations</p>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-4">
          {loading && (
            <div className="flex justify-center mt-12">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && bookings.length === 0 && (
            <div className="text-center mt-16">
              <CalendarDays className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400">No bookings yet</p>
              <p className="text-zinc-600 text-sm mt-1">Explore tours and make your first booking</p>
              <button
                onClick={() => router.push("/traveller")}
                className="mt-4 px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-300 transition-colors text-sm"
              >
                Explore Tours
              </button>
            </div>
          )}

          <div className="space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => router.push(`/traveller/tour?id=${b.tourId}`)}
                      className="text-white font-semibold text-sm leading-snug hover:text-yellow-400 transition-colors text-left flex items-center gap-1"
                    >
                      {b.tourName}
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                    </button>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-500 text-xs">{b.tourCity}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[b.status] ?? "bg-zinc-700 text-zinc-300"}`}>
                    {b.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-400 text-xs">{b.tourDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-400 text-xs">{b.guestCount} guest{b.guestCount > 1 ? "s" : ""}</span>
                  </div>
                  <div className="ml-auto text-yellow-400 font-bold text-sm">
                    {b.currency}{b.totalAmount.toLocaleString("en-IN")}
                  </div>
                </div>

                {b.specialRequests && (
                  <p className="text-zinc-600 text-xs mt-2 italic">"{b.specialRequests}"</p>
                )}

                {b.status === "pending" && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Cancel booking
                  </button>
                )}

                <p className="text-zinc-700 text-xs mt-2">
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
