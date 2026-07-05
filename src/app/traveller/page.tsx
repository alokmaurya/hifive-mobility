"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, ChevronDown, Compass, Zap, Mountain } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useCityStateOptions } from "@/hooks/useCityStateOptions";

const HIGHLIGHTS = [
  { icon: "🏙️", label: "City Tours" },
  { icon: "🌄", label: "Scenic Drives" },
  { icon: "⏱️", label: "Flexi Hours" },
  { icon: "🛕", label: "Heritage" },
];

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
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Hero */}
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-14 pb-20 overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />

          <div className="relative max-w-md mx-auto">
            {/* Brand */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-sky-300 font-bold text-sm tracking-widest uppercase">HiFive Tours</span>
            </div>

            <h1 className="text-4xl font-extrabold text-white leading-tight">
              Your next<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-300">
                adventure
              </span>{" "}
              awaits
            </h1>
            <p className="text-blue-300 text-sm mt-3 leading-relaxed">
              Book local sightseeing drivers.<br />Explore India your way.
            </p>

            {/* Stats row */}
            {!loading && states.length > 0 && (
              <div className="flex items-center gap-4 mt-5">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span className="text-sky-300 text-xs font-medium">{states.length} states</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-blue-700" />
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-indigo-300 text-xs font-medium">Instant booking</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-blue-700" />
                <div className="flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-blue-300 text-xs font-medium">Local experts</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search card — overlaps hero */}
        <div className="px-4 max-w-md mx-auto -mt-8 relative z-10">
          <form onSubmit={search} className="bg-white rounded-3xl p-5 shadow-xl border border-slate-100 space-y-4">
            <p className="text-slate-800 font-bold text-base">Find drivers in your city</p>

            <div>
              <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">State</label>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                  className="w-full appearance-none px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm pr-10"
                >
                  <option value="">Select state…</option>
                  {loading && <option disabled>Loading…</option>}
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block mb-1.5">City</label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                  disabled={!selectedState || cities.length === 0}
                  className="w-full appearance-none px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm pr-10 disabled:opacity-50"
                >
                  <option value="">{!selectedState ? "Select state first" : "Select city…"}</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedCity}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold rounded-2xl hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
            >
              <Search className="w-4 h-4" />
              Find Drivers
            </button>
          </form>
        </div>

        {/* Category pills */}
        <div className="px-4 max-w-md mx-auto mt-6">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Tour types</p>
          <div className="grid grid-cols-4 gap-3">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label} className="bg-white rounded-2xl py-3 px-2 flex flex-col items-center gap-1.5 border border-slate-100 shadow-sm">
                <span className="text-2xl">{h.icon}</span>
                <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight">{h.label}</span>
              </div>
            ))}
          </div>
        </div>

        {!loading && states.length === 0 && (
          <div className="px-4 max-w-md mx-auto mt-10 text-center">
            <MapPin className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No tours available yet. Check back soon!</p>
          </div>
        )}
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
