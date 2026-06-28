"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";

const POPULAR = [
  { city: "Manali", state: "Himachal Pradesh" },
  { city: "Goa", state: "Goa" },
  { city: "Jaipur", state: "Rajasthan" },
  { city: "Ooty", state: "Tamil Nadu" },
  { city: "Coorg", state: "Karnataka" },
  { city: "Rishikesh", state: "Uttarakhand" },
];

export default function TravellerHomePage() {
  const router = useRouter();
  const [city, setCity]   = useState("");
  const [state, setState] = useState("");

  function search(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    const params = new URLSearchParams({ city: city.trim() });
    if (state.trim()) params.set("state", state.trim());
    router.push(`/traveller/explore?${params}`);
  }

  function pickPopular(c: string, s: string) {
    setCity(c);
    setState(s);
    const params = new URLSearchParams({ city: c, state: s });
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
            <p className="text-zinc-400 text-sm mt-2">Find local sightseeing tours by city</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 max-w-md mx-auto -mt-2">
          <form onSubmit={search} className="bg-zinc-900 rounded-3xl p-4 border border-zinc-800 space-y-3">
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">City *</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Manali, Goa, Jaipur"
                required
                className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1.5">State (optional)</label>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Himachal Pradesh"
                className="w-full px-4 py-3 rounded-2xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-yellow-400 text-black font-bold rounded-2xl hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Tours
            </button>
          </form>
        </div>

        {/* Popular destinations */}
        <div className="px-4 max-w-md mx-auto mt-8">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Popular Destinations</h2>
          <div className="grid grid-cols-2 gap-3">
            {POPULAR.map(({ city: c, state: s }) => (
              <button
                key={c}
                onClick={() => pickPopular(c, s)}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-left hover:border-yellow-400/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="text-white font-semibold text-sm">{c}</span>
                </div>
                <p className="text-zinc-500 text-xs mt-0.5 ml-5.5">{s}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
