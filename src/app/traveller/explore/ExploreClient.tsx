"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MapPin, Users, Clock, Star, ChevronLeft, Search } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import type { Tour } from "@/types/tour";

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const city  = searchParams.get("city") ?? "";
  const state = searchParams.get("state") ?? "";

  const [tours, setTours]     = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput]   = useState(city);
  const [stateInput, setStateInput] = useState(state);

  useEffect(() => {
    if (!city) { setLoading(false); return; }
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q = (supabase as any)
      .from("tours")
      .select("*, tour_stops(*)")
      .eq("status", "published")
      .ilike("city", `%${city}%`);
    if (state) q = q.ilike("state", `%${state}%`);
    q.order("created_at", { ascending: false }).then(({ data }: { data: Record<string, unknown>[] | null }) => {
      setTours(
        (data ?? []).map((r) => ({
          id: r.id as string,
          driverId: r.driver_id as string,
          name: r.name as string,
          city: r.city as string,
          state: (r.state as string) ?? "",
          country: (r.country as string) ?? "India",
          category: r.category as Tour["category"],
          description: r.description as string,
          stops: [],
          schedule: { startTime: r.start_time as string, daysOfWeek: (r.days_of_week as number[]) ?? [] },
          pricePerPerson: Number(r.price_per_person),
          maxGuests: r.max_guests as number,
          status: r.status as Tour["status"],
          rating: Number(r.rating ?? 0),
          reviewCount: Number(r.total_reviews ?? 0),
          createdAt: r.created_at as string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any))
      );
      setLoading(false);
    });
  }, [city, state]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!cityInput.trim()) return;
    const params = new URLSearchParams({ city: cityInput.trim() });
    if (stateInput.trim()) params.set("state", stateInput.trim());
    router.push(`/traveller/explore?${params}`);
  }

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-zinc-950 pb-20">
        {/* Header */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-4 pt-10 pb-4">
          <div className="max-w-md mx-auto">
            <button onClick={() => router.push("/traveller")} className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm mb-3">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <input
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="City"
                  className="flex-1 px-3 py-2.5 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
                />
                <input
                  value={stateInput}
                  onChange={(e) => setStateInput(e.target.value)}
                  placeholder="State"
                  className="flex-1 px-3 py-2.5 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
                />
              </div>
              <button type="submit" className="px-4 py-2.5 bg-yellow-400 text-black rounded-2xl hover:bg-yellow-300 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-4">
          {city && (
            <p className="text-zinc-400 text-sm mb-4">
              {loading ? "Searching…" : `${tours.length} tour${tours.length !== 1 ? "s" : ""} in `}
              {!loading && <span className="text-white font-semibold">{city}{state ? `, ${state}` : ""}</span>}
            </p>
          )}

          {!city && !loading && (
            <p className="text-zinc-500 text-sm text-center mt-8">Enter a city above to find tours</p>
          )}

          {loading && (
            <div className="flex justify-center mt-12">
              <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && tours.length === 0 && city && (
            <div className="text-center mt-12">
              <MapPin className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-zinc-400">No published tours found in {city}.</p>
              <p className="text-zinc-600 text-sm mt-1">Try a different city or check back later.</p>
            </div>
          )}

          <div className="space-y-4">
            {tours.map((tour) => (
              <button
                key={tour.id}
                onClick={() => router.push(`/traveller/tour?id=${tour.id}`)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-4 text-left hover:border-yellow-400/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm leading-snug">{tour.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <MapPin className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                      <span className="text-zinc-400 text-xs">{tour.city}{tour.state ? `, ${tour.state}` : ""}</span>
                    </div>
                    {tour.description && (
                      <p className="text-zinc-500 text-xs mt-2 line-clamp-2">{tour.description}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-yellow-400 font-bold text-base">₹{tour.pricePerPerson.toLocaleString("en-IN")}</div>
                    <div className="text-zinc-500 text-xs">per person</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800">
                  {(tour.rating ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-xs font-semibold">{(tour.rating ?? 0).toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-zinc-500" />
                    <span className="text-zinc-400 text-xs">Up to {tour.maxGuests}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-500" />
                    <span className="text-zinc-400 text-xs">{tour.schedule?.startTime}</span>
                  </div>
                  <span className="ml-auto text-yellow-400/70 text-xs font-semibold capitalize">{tour.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
