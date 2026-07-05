"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Star, Users, Briefcase, ChevronLeft, PawPrint, Cigarette, Car, CheckCircle, XCircle, Search } from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useDriversByCity } from "@/hooks/useDriversByCity";
import { useCityStateOptions } from "@/hooks/useCityStateOptions";
import type { Driver } from "@/types/driver";

const FUEL_LABEL: Record<string, string> = { petrol: "Petrol", diesel: "Diesel", cng: "CNG" };
const VEHICLE_LABEL: Record<string, string> = { hatchback: "Hatchback", sedan: "Sedan", suv: "SUV", van: "Van", tempo: "Tempo" };

function DriverCard({ driver, city, state }: { driver: Driver; city: string; state: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/traveller/driver?id=${driver.id}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`)}
      className="w-full bg-white rounded-3xl text-left shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-200"
    >
      {/* Car photo */}
      <div className="h-36 bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center relative overflow-hidden">
        {driver.carPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={driver.carPhotoUrl} alt="Car" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <Car className="w-12 h-12 text-slate-300" />
            <span className="text-slate-400 text-xs font-medium">{driver.carBrand || ""} {driver.vehicleModel}</span>
          </div>
        )}

        {/* Availability badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
          driver.isAvailable ? "bg-green-500 text-white" : "bg-red-400 text-white"
        }`}>
          {driver.isAvailable ? "Available" : "Busy"}
        </div>

        {/* Plate */}
        {driver.vehiclePlate && (
          <div className="absolute bottom-2 left-2 bg-slate-900/75 backdrop-blur-sm px-2.5 py-0.5 rounded-lg">
            <span className="text-white text-xs font-mono font-bold tracking-wider">{driver.vehiclePlate}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Driver header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-100 to-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-100">
            <span className="text-lg font-extrabold text-indigo-700">{driver.name.charAt(0).toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-900 font-bold text-base truncate">{driver.name}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {driver.age && <span className="text-slate-400 text-xs">Age {driver.age}</span>}
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-amber-500 text-xs font-bold">{driver.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-300 text-xs">{driver.totalToursRun} trips</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{VEHICLE_LABEL[driver.vehicleType] ?? driver.vehicleType}</p>
            <p className="text-slate-600 text-xs font-semibold">{driver.vehicleCapacity} seats</p>
          </div>
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
            {FUEL_LABEL[driver.fuelType] ?? driver.fuelType}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
            <Briefcase className="w-2.5 h-2.5" />{driver.luggageCapacityBags} bags
          </span>
          {driver.isAc && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-600">
              <CheckCircle className="w-2.5 h-2.5" />AC
            </span>
          )}
          {!driver.isAc && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-400">
              <XCircle className="w-2.5 h-2.5" />No AC
            </span>
          )}
          {driver.isPetFriendly && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
              <PawPrint className="w-2.5 h-2.5" />Pets OK
            </span>
          )}
          {driver.smokingAllowed && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-500">
              <Cigarette className="w-2.5 h-2.5" />Smoking
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function ExploreClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const city  = searchParams.get("city") ?? "";
  const state = searchParams.get("state") ?? "";

  const { drivers, loading } = useDriversByCity(city, state);
  const { states, citiesForState } = useCityStateOptions();
  const [selState, setSelState] = useState(state);
  const [selCity, setSelCity]   = useState(city);
  const [cities, setCities]     = useState<string[]>([]);

  useEffect(() => {
    setCities(citiesForState(selState));
    if (selState !== state) setSelCity("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selState]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!selCity) return;
    const params = new URLSearchParams({ city: selCity });
    if (selState) params.set("state", selState);
    router.push(`/traveller/explore?${params}`);
  }

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-10 pb-5">
          <div className="max-w-md mx-auto">
            <button onClick={() => router.push("/traveller")} className="flex items-center gap-1 text-blue-300 hover:text-white text-sm mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <form onSubmit={handleSearch} className="flex gap-2">
              <select
                value={selState}
                onChange={(e) => setSelState(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-2xl border border-white/10 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm backdrop-blur-sm"
              >
                <option value="" className="text-slate-800">All States</option>
                {states.map((s) => <option key={s} value={s} className="text-slate-800">{s}</option>)}
              </select>
              <select
                value={selCity}
                onChange={(e) => setSelCity(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-2xl border border-white/10 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm backdrop-blur-sm"
              >
                <option value="" className="text-slate-800">Select city</option>
                {(selState ? citiesForState(selState) : cities).map((c) => <option key={c} value={c} className="text-slate-800">{c}</option>)}
              </select>
              <button type="submit" disabled={!selCity} className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-2xl disabled:opacity-50 transition-opacity shadow-lg">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-4">
          {city && !loading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-700 font-semibold">
                <span className="text-indigo-600">{drivers.length}</span> driver{drivers.length !== 1 ? "s" : ""} in {city}{state ? `, ${state}` : ""}
              </p>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <MapPin className="w-3 h-3" />
                <span>{city}</span>
              </div>
            </div>
          )}

          {!city && !loading && (
            <div className="text-center mt-16">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-7 h-7 text-indigo-300" />
              </div>
              <p className="text-slate-600 font-medium">Select a city to find drivers</p>
              <p className="text-slate-400 text-sm mt-1">Use the search bar above</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center mt-16 gap-3">
              <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Finding drivers…</p>
            </div>
          )}

          {!loading && drivers.length === 0 && city && (
            <div className="text-center mt-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-600 font-medium">No drivers in {city}</p>
              <p className="text-slate-400 text-sm mt-1">Try a different city or check back later</p>
            </div>
          )}

          <div className="space-y-4">
            {drivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} city={city} state={state} />
            ))}
          </div>
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
