"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, ChevronDown } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useCityStateOptions } from "@/hooks/useCityStateOptions";

export default function TravellerHomePage() {
  const router = useRouter();
  const { states, citiesForState, loading } = useCityStateOptions();
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity]   = useState("");
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    setCities(citiesForState(selectedState));
    setSelectedCity("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCity) return;
    const params = new URLSearchParams({ city: selectedCity });
    if (selectedState) params.set("state", selectedState);
    router.push(`/traveller/explore?${params}`);
  }

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-zinc-950 pb-20">
        {/* Hero */}
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 px-4 pt-12 pb-8">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="text-yellow-400 font-bold text-sm tracking-wide">HiFive Tours</span>
            </div>
            <h1 className="text-3xl font-bold text-white mt-3 leading-tight">
              Where do you want<br />to explore?
            </h1>
            <p className="text-zinc-400 text-sm mt-2">Find sightseeing drivers by city</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 max-w-md mx-auto -mt-2">
          <form onSubmit={search} className="bg-zinc-900 rounded-3xl p-4 border border-zinc-800 space-y-3">
            {/* State dropdown */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">State *</label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                  className="w-full appearance-none px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm pr-10"
                >
                  <option value="">Select state…</option>
                  {loading && <option disabled>Loading…</option>}
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            {/* City dropdown */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">City *</label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                  disabled={!selectedState || cities.length === 0}
                  className="w-full appearance-none px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm pr-10 disabled:opacity-50"
                >
                  <option value="">{!selectedState ? "Select state first" : "Select city…"}</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedCity}
              className="w-full py-3.5 bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-300 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Find Drivers
            </button>
          </form>
        </div>

        {/* Hint */}
        {!loading && states.length === 0 && (
          <div className="px-4 max-w-md mx-auto mt-8 text-center">
            <p className="text-zinc-600 text-sm">No published tours yet. Check back soon!</p>
          </div>
        )}

        {!loading && states.length > 0 && (
          <div className="px-4 max-w-md mx-auto mt-6">
            <p className="text-zinc-600 text-xs text-center">
              Drivers available in {states.length} state{states.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
