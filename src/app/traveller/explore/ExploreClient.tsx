"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Star, Users, Briefcase, ChevronLeft, PawPrint, Cigarette, Car, CheckCircle, XCircle } from "lucide-react";
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
      className="w-full bg-white border border-sky-200 rounded-3xl p-4 text-left hover:border-sky-400 transition-colors shadow-sm"
    >
      {/* Header: name + availability */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-blue-700">{driver.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-blue-900 font-bold text-base">{driver.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              {driver.age && <span className="text-slate-400 text-xs">Age {driver.age}</span>}
              {driver.age && <span className="text-slate-300">•</span>}
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-sky-500 fill-sky-500" />
                <span className="text-sky-500 text-xs font-bold">{driver.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${
          driver.isAvailable
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-500"
        }`}>
          {driver.isAvailable ? "Available" : "Busy"}
        </span>
      </div>

      {/* Car photo placeholder + plate */}
      <div className="bg-sky-50 rounded-2xl h-28 flex items-center justify-center mb-3 relative overflow-hidden">
        {driver.carPhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={driver.carPhotoUrl} alt="Car" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Car className="w-10 h-10 text-sky-300" />
            <span className="text-slate-400 text-xs">{driver.carBrand || "Car"} {driver.vehicleModel}</span>
          </div>
        )}
        {driver.vehiclePlate && (
          <div className="absolute bottom-2 right-2 bg-blue-950/80 px-2.5 py-1 rounded-lg">
            <span className="text-white text-xs font-mono font-bold">{driver.vehiclePlate}</span>
          </div>
        )}
      </div>

      {/* Car details */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-sky-50 rounded-xl px-3 py-2 border border-sky-100">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide">Vehicle</p>
          <p className="text-blue-900 text-xs font-semibold mt-0.5">
            {driver.carBrand} {driver.vehicleModel}
          </p>
          <p className="text-slate-400 text-[10px]">{VEHICLE_LABEL[driver.vehicleType] ?? driver.vehicleType} · {FUEL_LABEL[driver.fuelType] ?? driver.fuelType}</p>
        </div>
        <div className="bg-sky-50 rounded-xl px-3 py-2 border border-sky-100">
          <p className="text-slate-400 text-[10px] uppercase tracking-wide">Capacity</p>
          <div className="flex items-center gap-1 mt-0.5">
            <Users className="w-3 h-3 text-slate-400" />
            <span className="text-blue-900 text-xs font-semibold">{driver.vehicleCapacity} seats</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span className="text-slate-400 text-[10px]">{driver.luggageCapacityBags} bags</span>
          </div>
        </div>
      </div>

      {/* Amenities row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {driver.isAc
            ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            : <XCircle className="w-3.5 h-3.5 text-slate-300" />}
          <span className={`text-xs ${driver.isAc ? "text-green-600" : "text-slate-400"}`}>AC</span>
        </div>
        <div className="flex items-center gap-1">
          <PawPrint className={`w-3.5 h-3.5 ${driver.isPetFriendly ? "text-blue-700" : "text-slate-300"}`} />
          <span className={`text-xs ${driver.isPetFriendly ? "text-blue-700" : "text-slate-400"}`}>
            {driver.isPetFriendly ? "Pet friendly" : "No pets"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Cigarette className={`w-3.5 h-3.5 ${driver.smokingAllowed ? "text-orange-400" : "text-slate-300"}`} />
          <span className={`text-xs ${driver.smokingAllowed ? "text-orange-500" : "text-slate-400"}`}>
            {driver.smokingAllowed ? "Smoking ok" : "No smoking"}
          </span>
        </div>
        <div className="ml-auto text-right">
          <span className="text-slate-400 text-[10px]">{driver.totalToursRun} trips</span>
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
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="bg-blue-950 px-4 pt-10 pb-4">
          <div className="max-w-md mx-auto">
            <button onClick={() => router.push("/traveller")} className="flex items-center gap-1 text-blue-300 hover:text-white text-sm mb-3">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <form onSubmit={handleSearch} className="flex gap-2">
              <select
                value={selState}
                onChange={(e) => setSelState(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-2xl border border-blue-800 bg-blue-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
              >
                <option value="">All States</option>
                {states.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={selCity}
                onChange={(e) => setSelCity(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-2xl border border-blue-800 bg-blue-900 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
              >
                <option value="">Select city</option>
                {(selState ? citiesForState(selState) : cities).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="submit" disabled={!selCity} className="px-4 py-2.5 bg-sky-500 text-white rounded-2xl hover:bg-sky-400 disabled:opacity-50 transition-colors">
                <MapPin className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-4">
          {city && (
            <p className="text-slate-500 text-sm mb-4">
              {loading ? "Searching…" : (
                <>{drivers.length} driver{drivers.length !== 1 ? "s" : ""} in <span className="text-blue-900 font-semibold">{city}{state ? `, ${state}` : ""}</span></>
              )}
            </p>
          )}

          {!city && !loading && (
            <p className="text-slate-400 text-sm text-center mt-8">Select a city above to find drivers</p>
          )}

          {loading && (
            <div className="flex justify-center mt-12">
              <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && drivers.length === 0 && city && (
            <div className="text-center mt-12">
              <MapPin className="w-10 h-10 text-sky-200 mx-auto mb-3" />
              <p className="text-slate-500">No drivers with tours in {city}.</p>
              <p className="text-slate-400 text-sm mt-1">Try a different city or check back later.</p>
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
