"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Users, Clock, Star, ChevronLeft, Calendar, MessageSquare } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useTravellerBookings } from "@/hooks/useTravellerBookings";
import type { Tour } from "@/types/tour";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TourDetailClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const id           = searchParams.get("id") ?? "";

  const [tour, setTour]       = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookSuccess, setBookSuccess] = useState(false);

  const [guestCount, setGuestCount]           = useState(1);
  const [tourDate, setTourDate]               = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const { createTourBooking } = useTravellerBookings();

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("tours")
      .select("*, tour_stops(*)")
      .eq("id", id)
      .single()
      .then(({ data }: { data: Record<string, unknown> | null }) => {
        if (data) {
          setTour({
            id: data.id as string,
            driverId: data.driver_id as string,
            name: data.name as string,
            city: data.city as string,
            state: (data.state as string) ?? "",
            country: (data.country as string) ?? "India",
            category: data.category as Tour["category"],
            description: data.description as string,
            stops: [],
            schedule: { startTime: data.start_time as string, daysOfWeek: (data.days_of_week as number[]) ?? [] },
            pricePerPerson: Number(data.price_per_person),
            maxGuests: data.max_guests as number,
            status: data.status as Tour["status"],
            rating: Number(data.rating ?? 0),
            reviewCount: Number(data.total_reviews ?? 0),
            createdAt: data.created_at as string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any);
        }
        setLoading(false);
      });
  }, [id]);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!tour) return;
    setBooking(true);
    setBookError(null);
    try {
      await createTourBooking(
        tour.id, tour.driverId,
        (tour.tourType as "city_sightseeing" | "outer_city_sightseeing" | "flexi") ?? "city_sightseeing",
        guestCount, tourDate,
        guestCount * tour.pricePerPerson,
        specialRequests || undefined,
      );
      setBookSuccess(true);
    } catch (err: unknown) {
      setBookError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setBooking(false);
    }
  }

  const totalAmount = tour ? guestCount * tour.pricePerPerson : 0;

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <p className="text-zinc-400">Tour not found.</p>
    </div>
  );

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-zinc-950 pb-28">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 pt-10 pb-4">
          <div className="max-w-md mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-3">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-4 space-y-4">
          {/* Tour info card */}
          <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide capitalize">{tour.category}</span>
                <h1 className="text-white font-bold text-lg leading-snug mt-1">{tour.name}</h1>
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-zinc-400 text-sm">{tour.city}{tour.state ? `, ${tour.state}` : ""}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-xl">₹{tour.pricePerPerson.toLocaleString("en-IN")}</div>
                <div className="text-zinc-500 text-xs">per person</div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800">
              {(tour.rating ?? 0) > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-semibold">{(tour.rating ?? 0).toFixed(1)}</span>
                  {(tour.reviewCount ?? 0) > 0 && <span className="text-zinc-500 text-xs">({tour.reviewCount})</span>}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-400 text-sm">Max {tour.maxGuests}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-400 text-sm">{tour.schedule?.startTime}</span>
              </div>
            </div>

            {(tour.schedule?.daysOfWeek?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(tour.schedule?.daysOfWeek ?? []).slice().sort().map((d) => (
                  <span key={d} className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300">{DAY_LABELS[d]}</span>
                ))}
              </div>
            )}

            {tour.description && (
              <p className="text-zinc-400 text-sm mt-4 leading-relaxed">{tour.description}</p>
            )}
          </div>

          {/* Booking form */}
          {bookSuccess ? (
            <div className="bg-zinc-900 rounded-3xl p-5 border border-green-500/30 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-white font-bold text-lg">Booking Requested!</h2>
              <p className="text-zinc-400 text-sm mt-1">Your booking is pending confirmation from the driver.</p>
              <button
                onClick={() => router.push("/traveller/bookings")}
                className="mt-4 px-6 py-2.5 bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-300 transition-colors text-sm"
              >
                View My Bookings
              </button>
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-3xl p-5 border border-zinc-800">
              <h2 className="text-white font-bold text-base mb-4">Book This Tour</h2>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                    <Calendar className="w-3 h-3 inline mr-1" />Tour Date *
                  </label>
                  <input
                    type="date"
                    value={tourDate}
                    onChange={(e) => setTourDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                    <Users className="w-3 h-3 inline mr-1" />Guests *
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                      className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 text-white hover:border-yellow-400 transition-colors flex items-center justify-center text-lg"
                    >−</button>
                    <span className="text-white font-bold text-lg w-8 text-center">{guestCount}</span>
                    <button
                      type="button"
                      onClick={() => setGuestCount(Math.min(tour.maxGuests, guestCount + 1))}
                      className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 text-white hover:border-yellow-400 transition-colors flex items-center justify-center text-lg"
                    >+</button>
                    <span className="text-zinc-500 text-xs ml-1">max {tour.maxGuests}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">
                    <MessageSquare className="w-3 h-3 inline mr-1" />Special Requests
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={2}
                    placeholder="Any special requirements?"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm resize-none"
                  />
                </div>

                <div className="bg-zinc-800 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <span className="text-zinc-400 text-sm">{guestCount} × ₹{tour.pricePerPerson.toLocaleString("en-IN")}</span>
                  <span className="text-yellow-400 font-bold text-lg">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>

                {bookError && <p className="text-sm text-red-400 text-center">{bookError}</p>}

                <button
                  type="submit"
                  disabled={booking}
                  className="w-full py-3.5 bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-300 disabled:opacity-50 transition-colors"
                >
                  {booking ? "Requesting…" : "Request Booking"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
