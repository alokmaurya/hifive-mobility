"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MapPin, Star, Users, Briefcase, ChevronLeft, ChevronRight, PawPrint,
  Cigarette, Car, CheckCircle, XCircle, Search, SlidersHorizontal, X, BadgeCheck,
} from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useDriversByCity } from "@/hooks/useDriversByCity";
import { useCityStateOptions } from "@/hooks/useCityStateOptions";
import type { Driver } from "@/types/driver";

const FUEL_LABEL: Record<string, string> = { petrol: "Petrol", diesel: "Diesel", cng: "CNG" };
const VEHICLE_LABEL: Record<string, string> = { hatchback: "Hatchback", sedan: "Sedan", suv: "SUV", van: "Van", tempo: "Tempo" };

const TOUR_TYPE_OPTIONS = [
  { value: "city_sightseeing",       label: "City Sightseeing",  emoji: "🏙️" },
  { value: "outer_city_sightseeing", label: "Outer City",        emoji: "🛣️" },
  { value: "flexi",                  label: "Flexi",             emoji: "⏱️" },
];

interface Filters {
  seats: "" | "4" | "6";
  minRating: number;
  pets: "" | "yes" | "no";
  smoking: "" | "yes" | "no";
  tourTypes: string[];
}

const DEFAULT_FILTERS: Filters = { seats: "", minRating: 0, pets: "", smoking: "", tourTypes: [] };

function activeFilterCount(f: Filters) {
  let n = 0;
  if (f.seats) n++;
  if (f.minRating > 0) n++;
  if (f.pets) n++;
  if (f.smoking) n++;
  if (f.tourTypes.length) n++;
  return n;
}

function applyFilters(drivers: Driver[], f: Filters): Driver[] {
  return drivers.filter((d) => {
    const car = d.primaryCar;
    if (f.seats === "4" && (car?.vehicleCapacity ?? 0) > 4) return false;
    if (f.seats === "6" && (car?.vehicleCapacity ?? 0) < 5) return false;
    if (f.minRating > 0 && d.rating < f.minRating) return false;
    if (f.pets === "yes" && !car?.isPetFriendly) return false;
    if (f.pets === "no" && car?.isPetFriendly) return false;
    if (f.smoking === "yes" && !car?.smokingAllowed) return false;
    if (f.smoking === "no" && car?.smokingAllowed) return false;
    if (f.tourTypes.length > 0) {
      const dt = d.tourTypes ?? [];
      if (!f.tourTypes.some((t) => dt.includes(t))) return false;
    }
    return true;
  });
}

function DriverCard({ driver, city, state }: { driver: Driver; city: string; state: string }) {
  const router = useRouter();
  const cars = driver.cars ?? (driver.primaryCar ? [driver.primaryCar] : []);
  const [slideIndex, setSlideIndex] = useState(0);
  const car = cars[slideIndex] ?? cars[0];

  const prevSlide = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndex((i) => (i - 1 + cars.length) % cars.length);
  }, [cars.length]);

  const nextSlide = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setSlideIndex((i) => (i + 1) % cars.length);
  }, [cars.length]);

  return (
    <button
      onClick={() => router.push(`/traveller/driver?id=${driver.id}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`)}
      className="w-full bg-white rounded-3xl text-left shadow-sm border border-slate-100 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-200"
    >
      {/* Car photo carousel */}
      <div className="h-40 bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center relative overflow-hidden">
        {car?.cabPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={car.cabPhoto} alt="Car" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Car className="w-10 h-10 text-slate-300" />
            <span className="text-slate-400 text-xs font-medium">Car picture not available</span>
          </div>
        )}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
          driver.isAvailable ? "bg-green-500 text-white" : "bg-red-400 text-white"
        }`}>
          {driver.isAvailable ? "Available" : "Busy"}
        </div>
        {/* Carousel controls — only when multiple cars */}
        {cars.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
              {cars.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setSlideIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === slideIndex ? "bg-white w-3" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
        {/* Car name overlay */}
        {car && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 flex items-end justify-between">
            <span className="text-white text-xs font-bold">{car.carBrand} {car.vehicleModel}</span>
            {car.vehiclePlate && (
              <span className="text-white/80 text-[10px] font-mono">{car.vehiclePlate}</span>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Driver photo */}
          <div className="w-12 h-12 rounded-2xl flex-shrink-0 overflow-hidden border-2 border-indigo-100">
            {driver.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={driver.photoUrl} alt={driver.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-sky-100 flex items-center justify-center">
                <span className="text-lg font-extrabold text-indigo-700">{driver.name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 min-w-0">
              <p className="text-slate-900 font-bold text-base truncate">{driver.name}</p>
              {driver.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {driver.age && <span className="text-slate-400 text-xs">Age {driver.age}</span>}
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-amber-500 text-xs font-bold">{driver.rating.toFixed(1)}</span>
              </div>
              <span className="text-slate-300 text-xs">{driver.totalToursRun} trips</span>
            </div>
          </div>
          {car && (
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{VEHICLE_LABEL[car.vehicleType] ?? car.vehicleType}</p>
              <p className="text-slate-600 text-xs font-semibold">{car.vehicleCapacity} seats</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {car && <>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
            {FUEL_LABEL[car.fuelType] ?? car.fuelType}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
            <Briefcase className="w-2.5 h-2.5" />{car.luggageCapacityBags} bags
          </span>
          {car.isAc ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-green-50 text-green-600 border border-green-100">
              <CheckCircle className="w-2.5 h-2.5" />AC
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-400 border border-slate-200">
              <XCircle className="w-2.5 h-2.5" />No AC
            </span>
          )}
          {car.isPetFriendly ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              <PawPrint className="w-2.5 h-2.5" />Pets OK
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-400 border border-slate-200">
              <XCircle className="w-2.5 h-2.5" />No Pets
            </span>
          )}
          {car.smokingAllowed ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-500 border border-orange-100">
              <Cigarette className="w-2.5 h-2.5" />Smoking OK
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-400 border border-slate-200">
              <XCircle className="w-2.5 h-2.5" />No Smoking
            </span>
          )}
          </>}
          {(driver.tourTypes ?? []).map((tt) => {
            const opt = TOUR_TYPE_OPTIONS.find((o) => o.value === tt);
            return opt ? (
              <span key={tt} className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600">
                {opt.emoji} {opt.label}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </button>
  );
}

function FilterSheet({ filters, onChange, onClose }: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<Filters>(filters);

  function toggle(field: "tourTypes", val: string) {
    setLocal((prev) => {
      const has = prev.tourTypes.includes(val);
      return { ...prev, tourTypes: has ? prev.tourTypes.filter((t) => t !== val) : [...prev.tourTypes, val] };
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <p className="font-extrabold text-slate-900 text-base">Filters</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-6">

          {/* Seating capacity */}
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Seating Capacity
            </p>
            <div className="flex gap-2">
              {[{ val: "" as const, label: "Any" }, { val: "4" as const, label: "4 Seater" }, { val: "6" as const, label: "6+ Seater" }].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setLocal((p) => ({ ...p, seats: val }))}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-colors ${
                    local.seats === val
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum rating */}
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" /> Minimum Rating
            </p>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setLocal((p) => ({ ...p, minRating: r }))}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-colors ${
                    local.minRating === r
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Pets */}
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <PawPrint className="w-3.5 h-3.5" /> Pets Allowed
            </p>
            <div className="flex gap-2">
              {[{ val: "" as const, label: "Any" }, { val: "yes" as const, label: "Allowed" }, { val: "no" as const, label: "Not allowed" }].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setLocal((p) => ({ ...p, pets: val }))}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-colors ${
                    local.pets === val
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Smoking */}
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <Cigarette className="w-3.5 h-3.5" /> Smoking
            </p>
            <div className="flex gap-2">
              {[{ val: "" as const, label: "Any" }, { val: "yes" as const, label: "Allowed" }, { val: "no" as const, label: "Not allowed" }].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => setLocal((p) => ({ ...p, smoking: val }))}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold border transition-colors ${
                    local.smoking === val
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tour type */}
          <div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-2.5">Tour Types Offered</p>
            <div className="flex gap-2 flex-wrap">
              {TOUR_TYPE_OPTIONS.map(({ value, label, emoji }) => {
                const active = local.tourTypes.includes(value);
                return (
                  <button
                    key={value}
                    onClick={() => toggle("tourTypes", value)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-colors flex items-center gap-1.5 ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <span>{emoji}</span> {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-5 pb-6 pt-2 flex gap-3 sticky bottom-0 bg-white border-t border-slate-100">
          <button
            onClick={() => setLocal(DEFAULT_FILTERS)}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={() => { onChange(local); onClose(); }}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold text-sm shadow-md shadow-indigo-100 hover:opacity-90 transition-opacity"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
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
  const [filters, setFilters]   = useState<Filters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

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

  const filtered = applyFilters(drivers, filters);
  const filterCount = activeFilterCount(filters);

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-10 pb-5">
          <div className="max-w-2xl mx-auto">
            <button onClick={() => router.push("/traveller")} className="flex items-center gap-1 text-blue-300 hover:text-white text-sm mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <form onSubmit={handleSearch} className="flex gap-2">
              <select
                value={selState}
                onChange={(e) => setSelState(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-2xl border border-white/10 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm backdrop-blur-sm"
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

        <div className="px-4 max-w-2xl mx-auto mt-4">
          {city && !loading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-700 font-semibold">
                <span className="text-indigo-600">{filtered.length}</span>
                {filtered.length !== drivers.length && <span className="text-slate-400 text-sm"> of {drivers.length}</span>}
                {" "}driver{filtered.length !== 1 ? "s" : ""} in {city}{state ? `, ${state}` : ""}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-slate-400 text-xs">
                  <MapPin className="w-3 h-3" />
                  <span>{city}</span>
                </div>
                <button
                  onClick={() => setShowFilters(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    filterCount > 0
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {filterCount > 0 && (
                    <span className="bg-white text-indigo-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-extrabold">
                      {filterCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Active filter chips */}
          {filterCount > 0 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {filters.seats && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                  {filters.seats === "4" ? "4 seater" : "6+ seater"}
                  <button onClick={() => setFilters((p) => ({ ...p, seats: "" }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.minRating > 0 && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                  ⭐ {filters.minRating}+
                  <button onClick={() => setFilters((p) => ({ ...p, minRating: 0 }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.pets && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                  🐾 Pets {filters.pets === "yes" ? "OK" : "No"}
                  <button onClick={() => setFilters((p) => ({ ...p, pets: "" }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.smoking && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                  🚬 Smoking {filters.smoking === "yes" ? "OK" : "No"}
                  <button onClick={() => setFilters((p) => ({ ...p, smoking: "" }))}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filters.tourTypes.map((tt) => {
                const opt = TOUR_TYPE_OPTIONS.find((o) => o.value === tt);
                return opt ? (
                  <span key={tt} className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                    {opt.emoji} {opt.label}
                    <button onClick={() => setFilters((p) => ({ ...p, tourTypes: p.tourTypes.filter((t) => t !== tt) }))}><X className="w-3 h-3" /></button>
                  </span>
                ) : null;
              })}
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Clear all
              </button>
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
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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

          {!loading && drivers.length > 0 && filtered.length === 0 && (
            <div className="text-center mt-10">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <SlidersHorizontal className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-slate-600 font-medium">No drivers match your filters</p>
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="mt-3 text-indigo-600 text-sm font-semibold hover:underline">
                Clear filters
              </button>
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((driver) => (
              <DriverCard key={driver.id} driver={driver} city={city} state={state} />
            ))}
          </div>
        </div>
      </div>

      {showFilters && (
        <FilterSheet
          filters={filters}
          onChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
