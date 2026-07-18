"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ChevronLeft, Star, Users, Briefcase, PawPrint, Cigarette, Car,
  CheckCircle, XCircle, MapPin, Clock, Calendar, MessageSquare,
  ChevronDown, ChevronUp, BadgeCheck,
} from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useTravellerBookings } from "@/hooks/useTravellerBookings";
import type { Driver } from "@/types/driver";
import type { Tour } from "@/types/tour";
import type { TourType } from "@/types/traveller";
import type { PickupLocation } from "@/components/traveller/PickupLocationMap";
import { formatTime } from "@/lib/utils";

const PickupLocationMap = dynamic(() => import("@/components/traveller/PickupLocationMap"), { ssr: false });

const FUEL_LABEL: Record<string, string> = { petrol: "Petrol", diesel: "Diesel", cng: "CNG" };

type TourOption = { type: TourType; emoji: string; label: string; desc: string };
const TOUR_OPTIONS: TourOption[] = [
  { type: "city_sightseeing",       emoji: "🏙️", label: "City Sightseeing",       desc: "Full-day tour within the city (8 hrs)" },
  { type: "outer_city_sightseeing", emoji: "🛣️", label: "Outer City Sightseeing", desc: "Day trip outside the city (8 hrs)" },
  { type: "flexi",                  emoji: "⏱️", label: "Flexi Sightseeing",       desc: "Hourly cab — you choose the hours" },
];

type CarInfo = { vehicleModel: string; vehiclePlate: string; carBrand: string; vehicleType: string; vehicleCapacity: number; fuelType: string; isAc: boolean; luggageCapacityBags: number; isPetFriendly: boolean; smokingAllowed: boolean; cabPhoto: string };

function mapDriver(row: Record<string, unknown>): Driver {
  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    rating: Number(row.rating ?? 5),
    totalTrips: (row.total_tours_run as number) ?? 0,
    bio: (row.bio as string) ?? "",
    languages: [],
    yearsExperience: (row.years_experience as number) ?? 1,
    specialties: [],
    totalToursRun: (row.total_tours_run as number) ?? 0,
    totalGuestsHosted: (row.total_guests_hosted as number) ?? 0,
    licenseNumber: "",
    isVerified: (row.is_verified as boolean) ?? false,
    age: (row.age as number) ?? undefined,
    gender: ((row.gender as string) ?? "") as Driver["gender"],
    aadharNumber: "",
    aadharFrontUrl: "",
    aadharBackUrl: "",
    photoUrl: (row.photo_url as string) || undefined,
    isAvailable: (row.is_available as boolean) ?? true,
    hourlyRate: Number(row.hourly_rate ?? 0),
  };
}

export default function DriverDetailClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const driverId = searchParams.get("id") ?? "";
  const city     = searchParams.get("city") ?? "";
  const state    = searchParams.get("state") ?? "";

  const [driver, setDriver]   = useState<Driver | null>(null);
  const [car, setCar]         = useState<CarInfo | null>(null);
  const [carByTourType, setCarByTourType] = useState<Record<string, CarInfo>>({});
  const [tours, setTours]     = useState<Tour[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [cityCenter, setCityCenter] = useState<{ lat: number; lng: number } | undefined>();

  const [selectedOption, setSelectedOption] = useState<TourType>("city_sightseeing");
  const [expanded, setExpanded]             = useState<TourType | null>(null);

  const [tourDate, setTourDate]               = useState("");
  const [guestCount, setGuestCount]           = useState(1);
  const [flexiStartTime, setFlexiStartTime]   = useState("");
  const [flexiEndTime, setFlexiEndTime]       = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [pickupLocation, setPickupLocation]   = useState<PickupLocation | null>(null);
  const [submitting, setSubmitting]           = useState(false);
  const [submitError, setSubmitError]         = useState<string | null>(null);
  const [submitted, setSubmitted]             = useState(false);

  const { createTourBooking, createFlexiBooking } = useTravellerBookings();

  useEffect(() => {
    if (!driverId) { setLoadingPage(false); return; }
    Promise.all([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("drivers").select("*").eq("id", driverId).single(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("tours")
        .select("*, tour_stops(*), driver_cars(id, vehicle_model, vehicle_plate, car_brand, vehicle_type, vehicle_capacity, fuel_type, is_ac, luggage_capacity_bags, is_pet_friendly, smoking_allowed, cab_photo)")
        .eq("driver_id", driverId)
        .eq("status", "published")
        .ilike("city", `%${city}%`),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("driver_cars").select("*").eq("driver_id", driverId).eq("is_active", true).limit(1).single(),
    ]).then(([driverRes, toursRes, carRes]) => {
      function mapCar(c: Record<string, unknown>): CarInfo {
        return { vehicleModel: (c.vehicle_model as string) ?? "", vehiclePlate: (c.vehicle_plate as string) ?? "", carBrand: (c.car_brand as string) ?? "", vehicleType: (c.vehicle_type as string) ?? "suv", vehicleCapacity: (c.vehicle_capacity as number) ?? 4, fuelType: (c.fuel_type as string) ?? "petrol", isAc: (c.is_ac as boolean) ?? true, luggageCapacityBags: (c.luggage_capacity_bags as number) ?? 2, isPetFriendly: (c.is_pet_friendly as boolean) ?? false, smokingAllowed: (c.smoking_allowed as boolean) ?? false, cabPhoto: (c.cab_photo as string) ?? "" };
      }
      // rating and total_tours_run are kept in sync by DB trigger — read directly from drivers table
      if (driverRes.data) {
        setDriver(mapDriver(driverRes.data as Record<string, unknown>));
      }
      if (carRes.data) setCar(mapCar(carRes.data as Record<string, unknown>));
      const tourRows = ((toursRes.data ?? []) as Record<string, unknown>[]);
      // Build map: tour_type → car for that tour
      const carMap: Record<string, CarInfo> = {};
      tourRows.forEach((r) => {
        const tourType = (r.tour_type as string) ?? (r.category as string);
        const linkedCar = r.driver_cars as Record<string, unknown> | null;
        if (tourType && linkedCar) carMap[tourType] = mapCar(linkedCar);
      });
      setCarByTourType(carMap);
      setTours(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tourRows.map((r) => ({
          id: r.id as string,
          driverId: r.driver_id as string,
          name: r.name as string,
          city: r.city as string,
          state: (r.state as string) ?? "",
          country: (r.country as string) ?? "India",
          category: r.category as Tour["category"],
          description: (r.description as string) ?? "",
          stops: ((r.tour_stops as Record<string, unknown>[]) ?? [])
            .sort((a, b) => (a.stop_order as number) - (b.stop_order as number))
            .map((s) => ({
              id: s.id as string,
              name: s.name as string,
              durationMinutes: (s.duration_minutes as number) ?? 60,
              order: s.stop_order as number,
            })),
          schedule: {
            startTime: (r.start_time as string) ?? "08:00",
            endTime: (r.end_time as string) ?? "18:00",
            daysOfWeek: (r.days_of_week as number[]) ?? [],
          },
          pricePerPerson: Number(r.full_cab_price ?? r.price_per_person ?? 0),
          currency: "₹",
          maxGuests: (r.max_guests as number) ?? 8,
          currentBookings: 0,
          status: r.status as Tour["status"],
          createdAt: r.created_at as string,
          estimatedDurationMinutes: (r.estimated_duration_minutes as number) ?? 480,
          tourType: (r.tour_type as Tour["tourType"]) ?? "city_sightseeing",
          hourlyRate: Number(r.hourly_rate ?? 0),
        } as Tour))
      );
      setLoadingPage(false);
    });

    // Geocode city name to set initial map center
    if (city) {
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${city}${state ? `, ${state}` : ""},India`)}&format=json&limit=1`, { headers: { "Accept-Language": "en" } })
        .then((r) => r.json())
        .then((data) => {
          if (data?.[0]) setCityCenter({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        })
        .catch(() => {});
    }
  }, [driverId, city, state]);

  function getTourForType(type: TourType): Tour | undefined {
    return tours.find((t) => t.tourType === type || t.category === type);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!driver || !selectedOption) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (selectedOption === "flexi") {
        if (!flexiStartTime || !flexiEndTime || flexiHours <= 0) throw new Error("Please select valid start and end times");
        await createFlexiBooking(
          driver.id, flexiHours, flexiRate, tourDate,
          specialRequests || undefined,
          flexiStartTime, flexiEndTime,
          pickupLocation?.address, pickupLocation?.lat, pickupLocation?.lng,
        );
        await createFlexiBooking(driver.id, flexiHours, flexiRate, tourDate, specialRequests || undefined, flexiStartTime, flexiEndTime);
      } else {
        const tour = getTourForType(selectedOption);
        if (!tour) throw new Error("No tour found for this type");
        const total = tour.pricePerPerson; // full cab price — not multiplied by guest count
        await createTourBooking(
          tour.id, driver.id, selectedOption, guestCount, tourDate, total,
          specialRequests || undefined,
          pickupLocation?.address, pickupLocation?.lat, pickupLocation?.lng,
        );
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError((err as { message?: string })?.message ?? "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingPage) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!driver) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-400">Driver not found.</p>
    </div>
  );

  const flexiTour = getTourForType("flexi");
  const flexiRate = flexiTour?.hourlyRate || driver.hourlyRate;

  function calcFlexiHours(start: string, end: string): number {
    if (!start || !end) return 0;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins <= 0) return 0;
    return Math.ceil(mins / 60); // round up to next whole hour
  }

  const flexiHours = calcFlexiHours(flexiStartTime, flexiEndTime);
  const flexiTotal = flexiHours * flexiRate;

  // Car for the selected tour type; fall back to first active car
  const activeCar: CarInfo | null = carByTourType[selectedOption] ?? car;

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 px-4 pt-10 pb-4">
          <div className="max-w-5xl mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-blue-300 hover:text-sky-200 text-sm mb-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-1 text-blue-300 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{city}{state ? `, ${state}` : ""}</span>
            </div>
          </div>
        </div>

        <div className="px-4 max-w-5xl mx-auto mt-5">
          <div className="flex flex-col lg:flex-row gap-5 items-start">

            {/* ── LEFT: Driver profile + cab details ── */}
            <div className="w-full lg:w-5/12 space-y-4">

              {/* Driver identity card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                {/* Avatar + name/age/status */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl flex-shrink-0 overflow-hidden border border-indigo-100">
                    {driver.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={driver.photoUrl} alt={driver.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-sky-100 flex items-center justify-center">
                        <span className="text-2xl font-extrabold text-indigo-600">{driver.name.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-slate-900 font-extrabold text-lg leading-tight">{driver.name}</h1>
                      {driver.isVerified && <BadgeCheck className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        driver.isAvailable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                      }`}>
                        {driver.isAvailable ? "Available" : "Busy"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {driver.age && (
                        <span className="text-slate-500 text-xs font-medium">Age {driver.age}</span>
                      )}
                      {driver.yearsExperience > 0 && (
                        <span className="text-slate-400 text-xs">{driver.yearsExperience} yrs exp</span>
                      )}
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-slate-700 text-xs font-bold">{driver.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-slate-400 text-xs">{driver.totalToursRun} trips</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {driver.bio && (
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 border-t border-slate-50 pt-3">{driver.bio}</p>
                )}

                {/* Aadhar-verified badge */}
                {driver.isVerified && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-blue-600 text-xs font-semibold">Identity Verified</span>
                  </div>
                )}
              </div>

              {/* Cab details card — updates when tour type is selected */}
              <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Cab Details</p>
                  {selectedOption && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500 border border-indigo-100">
                      {TOUR_OPTIONS.find((o) => o.type === selectedOption)?.label ?? selectedOption}
                    </span>
                  )}
                </div>

                {activeCar ? (
                  <>
                    {/* Car photo */}
                    <div className="bg-slate-50 rounded-2xl h-40 flex items-center justify-center mb-4 relative overflow-hidden border border-slate-100">
                      {activeCar.cabPhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={activeCar.cabPhoto} alt="Car" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Car className="w-14 h-14 text-slate-300" />
                          <span className="text-slate-400 text-sm font-semibold">{activeCar.carBrand} {activeCar.vehicleModel}</span>
                        </div>
                      )}
                      {activeCar.vehiclePlate && (
                        <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-slate-700">
                          <span className="text-white text-sm font-mono font-bold tracking-wider">{activeCar.vehiclePlate}</span>
                        </div>
                      )}
                    </div>

                    {/* Specs grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-slate-50 rounded-xl px-2 py-2.5 text-center border border-slate-100">
                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Type</p>
                        <p className="text-slate-800 text-xs font-bold mt-0.5 capitalize">{activeCar.vehicleType}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl px-2 py-2.5 text-center border border-slate-100">
                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Fuel</p>
                        <p className="text-slate-800 text-xs font-bold mt-0.5">{FUEL_LABEL[activeCar.fuelType] ?? activeCar.fuelType}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl px-2 py-2.5 text-center border border-slate-100">
                        <p className="text-slate-400 text-[9px] uppercase tracking-wide">Seats</p>
                        <p className="text-slate-800 text-xs font-bold mt-0.5">{activeCar.vehicleCapacity}</p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex items-center gap-4 flex-wrap pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        {activeCar.isAc ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-slate-300" />}
                        <span className={`text-xs font-medium ${activeCar.isAc ? "text-green-600" : "text-slate-400"}`}>AC</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-500 text-xs">{activeCar.luggageCapacityBags} bags</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PawPrint className={`w-3.5 h-3.5 ${activeCar.isPetFriendly ? "text-indigo-500" : "text-slate-300"}`} />
                        <span className={`text-xs ${activeCar.isPetFriendly ? "text-indigo-600 font-medium" : "text-slate-400"}`}>
                          {activeCar.isPetFriendly ? "Pet friendly" : "No pets"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Cigarette className={`w-3.5 h-3.5 ${activeCar.smokingAllowed ? "text-orange-400" : "text-slate-300"}`} />
                        <span className={`text-xs ${activeCar.smokingAllowed ? "text-orange-500 font-medium" : "text-slate-400"}`}>
                          {activeCar.smokingAllowed ? "Smoking ok" : "No smoking"}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Car className="w-12 h-12 text-slate-200" />
                    <p className="text-slate-400 text-sm">No cab details available</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Pickup Location + Choose Tour Type ── */}
            <div className="w-full lg:flex-1">
              {!submitted ? (
                <div className="space-y-3">

                  {/* Pickup Location */}
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
                    <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3" /> Pickup Location
                    </p>
                    <PickupLocationMap
                      value={pickupLocation}
                      onChange={setPickupLocation}
                      cityCenter={cityCenter}
                      cityName={city || undefined}
                    />
                  </div>

                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-1">Choose Tour Type</p>
                  {TOUR_OPTIONS.map((opt) => {
                    const tour = getTourForType(opt.type);
                    const isSelected = selectedOption === opt.type;
                    const isExpanded = expanded === opt.type;
                    const available = opt.type === "flexi" ? (!!flexiTour || flexiRate > 0) : !!tour;

                    return (
                      <div key={opt.type} className={`bg-white rounded-3xl border-2 transition-all overflow-hidden shadow-sm ${
                        isSelected ? "border-indigo-500 shadow-indigo-100" : "border-slate-100"
                      }`}>
                        <button
                          onClick={() => {
                            setSelectedOption(opt.type);
                            setExpanded(isExpanded ? null : opt.type);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-4 text-left"
                        >
                          <span className="text-2xl">{opt.emoji}</span>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-slate-900">{opt.label}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{opt.desc}</p>
                            {!available && <p className="text-red-400 text-xs mt-0.5">Not offered by this driver</p>}
                            {available && opt.type !== "flexi" && tour && (
                              <p className="text-indigo-500 text-xs font-semibold mt-0.5">
                                ₹{tour.pricePerPerson.toLocaleString("en-IN")} full cab · {formatTime(tour.schedule.startTime)} – {formatTime(tour.schedule.endTime)}
                              </p>
                            )}
                            {available && opt.type === "flexi" && (
                              <p className="text-indigo-500 text-xs font-semibold mt-0.5">₹{flexiRate}/hr</p>
                            )}
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </button>

                        {isExpanded && available && (
                          <div className="px-4 pb-4 border-t border-slate-100">
                            {opt.type !== "flexi" && tour && tour.stops.length > 0 && (
                              <div className="mt-3 mb-4">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Itinerary</p>
                                <div className="space-y-2">
                                  {tour.stops.map((stop, i) => (
                                    <div key={stop.id} className="flex items-start gap-2">
                                      <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-indigo-500 text-[9px] font-bold">{i + 1}</span>
                                      </div>
                                      <div>
                                        <p className="text-slate-800 text-sm">{stop.name}</p>
                                        <p className="text-slate-400 text-xs">{stop.durationMinutes} min</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-slate-500 text-xs">
                                      {formatTime(tour.schedule.startTime)} – {formatTime(tour.schedule.endTime)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                                    <span className="text-slate-500 text-xs">Max {tour.maxGuests}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {opt.type !== "flexi" && tour && tour.stops.length === 0 && (
                              <p className="text-slate-400 text-xs mt-3 mb-2">No itinerary listed — contact driver for details.</p>
                            )}

                            {/* Booking form */}
                            <form onSubmit={handleSubmit} className="space-y-3 mt-3">
                              <div>
                                <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                  <Calendar className="w-3 h-3" /> Date *
                                </label>
                                <input
                                  type="date"
                                  value={tourDate}
                                  onChange={(e) => setTourDate(e.target.value)}
                                  required
                                  min={new Date().toISOString().split("T")[0]}
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
                                />
                              </div>

                              {opt.type !== "flexi" && tour && (
                                <div>
                                  <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                    <Users className="w-3 h-3" /> Guests
                                  </label>
                                  <div className="flex items-center gap-3">
                                    <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                      className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-800 flex items-center justify-center text-lg hover:border-indigo-400 transition-colors">−</button>
                                    <span className="text-slate-900 font-bold w-6 text-center">{guestCount}</span>
                                    <button type="button" onClick={() => setGuestCount(Math.min(tour.maxGuests, guestCount + 1))}
                                      className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-800 flex items-center justify-center text-lg hover:border-indigo-400 transition-colors">+</button>
                                    <span className="text-slate-400 text-xs">max {tour.maxGuests}</span>
                                  </div>
                                </div>
                              )}

                              {opt.type === "flexi" && (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                        <Clock className="w-3 h-3" /> Start Time
                                      </label>
                                      <input
                                        type="time"
                                        value={flexiStartTime}
                                        onChange={(e) => setFlexiStartTime(e.target.value)}
                                        required={selectedOption === "flexi"}
                                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                        <Clock className="w-3 h-3" /> End Time
                                      </label>
                                      <input
                                        type="time"
                                        value={flexiEndTime}
                                        onChange={(e) => setFlexiEndTime(e.target.value)}
                                        required={selectedOption === "flexi"}
                                        className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm"
                                      />
                                    </div>
                                  </div>
                                  {flexiHours > 0 ? (
                                    <div className="bg-indigo-50 rounded-xl px-3 py-2 flex items-center justify-between border border-indigo-100">
                                      <span className="text-slate-500 text-xs">{flexiHours} hrs × ₹{flexiRate}/hr</span>
                                      <span className="text-indigo-600 font-bold">₹{flexiTotal.toLocaleString("en-IN")}</span>
                                    </div>
                                  ) : flexiStartTime && flexiEndTime ? (
                                    <p className="text-red-500 text-xs">End time must be after start time</p>
                                  ) : null}
                                </div>
                              )}

                              {opt.type !== "flexi" && tour && (
                                <div className="bg-indigo-50 rounded-xl px-3 py-2 flex items-center justify-between border border-indigo-100">
                                  <span className="text-slate-500 text-xs">Full Cab Price</span>
                                  <span className="text-indigo-600 font-bold">₹{tour.pricePerPerson.toLocaleString("en-IN")}</span>
                                </div>
                              )}

                              <div>
                                <label className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                  <MessageSquare className="w-3 h-3" /> Special Requests
                                </label>
                                <textarea
                                  value={specialRequests}
                                  onChange={(e) => setSpecialRequests(e.target.value)}
                                  rows={2}
                                  placeholder="Any special requirements?"
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 text-sm resize-none"
                                />
                              </div>

                              {submitError && <p className="text-red-500 text-xs">{submitError}</p>}

                              <button
                                type="submit"
                                disabled={submitting || !tourDate}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold rounded-2xl hover:opacity-90 disabled:opacity-50 transition-opacity shadow-md shadow-indigo-100"
                              >
                                {submitting ? "Sending request…" : "Send Booking Request"}
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center">
                  <div className="text-5xl mb-3">🙏</div>
                  <h2 className="text-slate-900 font-extrabold text-xl">Request Sent!</h2>
                  <p className="text-slate-500 text-sm mt-2">
                    Waiting for <span className="text-indigo-600 font-semibold">{driver.name}</span> to accept your request.
                  </p>
                  <p className="text-slate-400 text-xs mt-1">You will be notified once the driver confirms.</p>
                  <button
                    onClick={() => router.push("/traveller/bookings")}
                    className="mt-5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity text-sm shadow-md shadow-indigo-100"
                  >
                    View My Bookings
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
