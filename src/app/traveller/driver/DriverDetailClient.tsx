"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ChevronLeft, Star, Users, Briefcase, PawPrint, Cigarette, Car,
  CheckCircle, XCircle, MapPin, Clock, Calendar, MessageSquare,
  ChevronDown, ChevronUp,
} from "lucide-react";
import RequireTravellerAuth from "@/components/ui/RequireTravellerAuth";
import TravellerBottomNav from "@/components/traveller/TravellerBottomNav";
import { useTravellerBookings } from "@/hooks/useTravellerBookings";
import type { Driver, FuelType, VehicleType } from "@/types/driver";
import type { Tour } from "@/types/tour";
import type { TourType } from "@/types/traveller";
import { formatTime } from "@/lib/utils";

const FUEL_LABEL: Record<string, string> = { petrol: "Petrol", diesel: "Diesel", cng: "CNG" };

type TourOption = { type: TourType; emoji: string; label: string; desc: string };
const TOUR_OPTIONS: TourOption[] = [
  { type: "city_sightseeing",       emoji: "🏙️", label: "City Sightseeing",       desc: "Full-day tour within the city (8 hrs)" },
  { type: "outer_city_sightseeing", emoji: "🛣️", label: "Outer City Sightseeing", desc: "Day trip outside the city (8 hrs)" },
  { type: "flexi",                  emoji: "⏱️", label: "Flexi Sightseeing",       desc: "Hourly cab — you choose the hours" },
];

function mapDriver(row: Record<string, unknown>): Driver {
  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    rating: Number(row.rating ?? 5),
    totalTrips: (row.total_tours_run as number) ?? 0,
    vehicleModel: (row.vehicle_model as string) ?? "",
    vehiclePlate: (row.vehicle_plate as string) ?? "",
    carBrand: (row.car_brand as string) ?? "",
    vehicleType: (row.vehicle_type as VehicleType) ?? "suv",
    vehicleCapacity: (row.vehicle_capacity as number) ?? 4,
    fuelType: (row.fuel_type as FuelType) ?? "petrol",
    isAc: (row.is_ac as boolean) ?? true,
    luggageCapacityBags: (row.luggage_capacity_bags as number) ?? 2,
    isPetFriendly: (row.is_pet_friendly as boolean) ?? false,
    bio: (row.bio as string) ?? "",
    languages: [],
    yearsExperience: (row.years_experience as number) ?? 1,
    specialties: [],
    totalToursRun: (row.total_tours_run as number) ?? 0,
    totalGuestsHosted: (row.total_guests_hosted as number) ?? 0,
    licenseNumber: "",
    isVerified: (row.is_verified as boolean) ?? false,
    age: (row.age as number) ?? undefined,
    smokingAllowed: (row.smoking_allowed as boolean) ?? false,
    carPhotoUrl: (row.car_photo_url as string) ?? undefined,
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
  const [tours, setTours]     = useState<Tour[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);

  const [selectedOption, setSelectedOption] = useState<TourType | null>(null);
  const [expanded, setExpanded]             = useState<TourType | null>(null);

  const [tourDate, setTourDate]               = useState("");
  const [guestCount, setGuestCount]           = useState(1);
  const [hoursRequested, setHoursRequested]   = useState(4);
  const [specialRequests, setSpecialRequests] = useState("");
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
        .select("*, tour_stops(*)")
        .eq("driver_id", driverId)
        .eq("status", "published")
        .ilike("city", `%${city}%`),
    ]).then(([driverRes, toursRes]) => {
      if (driverRes.data) setDriver(mapDriver(driverRes.data as Record<string, unknown>));
      setTours(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ((toursRes.data ?? []) as Record<string, unknown>[]).map((r) => ({
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
          pricePerPerson: Number(r.price_per_person ?? 0),
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
  }, [driverId, city]);

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
        await createFlexiBooking(driver.id, hoursRequested, driver.hourlyRate, tourDate, specialRequests || undefined);
      } else {
        const tour = getTourForType(selectedOption);
        if (!tour) throw new Error("No tour found for this type");
        const total = guestCount * tour.pricePerPerson;
        await createTourBooking(tour.id, driver.id, selectedOption, guestCount, tourDate, total, specialRequests || undefined);
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingPage) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!driver) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-slate-400">Driver not found.</p>
    </div>
  );

  const flexiRate = driver.hourlyRate;
  const flexiTotal = hoursRequested * flexiRate;

  return (
    <RequireTravellerAuth>
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <div className="bg-blue-950 px-4 pt-10 pb-4">
          <div className="max-w-md mx-auto">
            <button onClick={() => router.back()} className="flex items-center gap-1 text-blue-300 hover:text-white text-sm mb-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-1 text-blue-300 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{city}{state ? `, ${state}` : ""}</span>
            </div>
          </div>
        </div>

        <div className="px-4 max-w-md mx-auto mt-4 space-y-4">
          {/* Driver card */}
          <div className="bg-white rounded-3xl p-4 border border-sky-200 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-blue-700">{driver.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h1 className="text-blue-900 font-bold text-lg">{driver.name}</h1>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    driver.isAvailable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
                  }`}>
                    {driver.isAvailable ? "Available" : "Busy"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {driver.age && <span className="text-slate-400 text-xs">Age {driver.age}</span>}
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-sky-500 fill-sky-500" />
                    <span className="text-sky-500 text-xs font-bold">{driver.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-slate-400 text-xs">{driver.totalToursRun} trips</span>
                </div>
              </div>
            </div>

            {/* Car photo */}
            <div className="bg-sky-50 rounded-2xl h-36 flex items-center justify-center mb-3 relative overflow-hidden">
              {driver.carPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={driver.carPhotoUrl} alt="Car" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <Car className="w-12 h-12 text-sky-300" />
                  <span className="text-slate-400 text-sm font-semibold">{driver.carBrand} {driver.vehicleModel}</span>
                </div>
              )}
              {driver.vehiclePlate && (
                <div className="absolute bottom-2 right-2 bg-blue-950/80 px-3 py-1 rounded-lg border border-blue-800">
                  <span className="text-white text-sm font-mono font-bold tracking-wider">{driver.vehiclePlate}</span>
                </div>
              )}
            </div>

            {/* Vehicle details */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-sky-50 rounded-xl px-2 py-2 text-center border border-sky-100">
                <p className="text-slate-400 text-[9px] uppercase tracking-wide">Type</p>
                <p className="text-blue-900 text-xs font-semibold mt-0.5 capitalize">{driver.vehicleType}</p>
              </div>
              <div className="bg-sky-50 rounded-xl px-2 py-2 text-center border border-sky-100">
                <p className="text-slate-400 text-[9px] uppercase tracking-wide">Fuel</p>
                <p className="text-blue-900 text-xs font-semibold mt-0.5">{FUEL_LABEL[driver.fuelType] ?? driver.fuelType}</p>
              </div>
              <div className="bg-sky-50 rounded-xl px-2 py-2 text-center border border-sky-100">
                <p className="text-slate-400 text-[9px] uppercase tracking-wide">Seats</p>
                <p className="text-blue-900 text-xs font-semibold mt-0.5">{driver.vehicleCapacity}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-sky-100">
              <div className="flex items-center gap-1">
                {driver.isAc ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <XCircle className="w-3.5 h-3.5 text-slate-300" />}
                <span className={`text-xs ${driver.isAc ? "text-green-600" : "text-slate-400"}`}>AC</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 text-xs">{driver.luggageCapacityBags} bags</span>
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
            </div>
          </div>

          {/* Tour type options */}
          {!submitted && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Choose Tour Type</h2>
              {TOUR_OPTIONS.map((opt) => {
                const tour = getTourForType(opt.type);
                const isSelected = selectedOption === opt.type;
                const isExpanded = expanded === opt.type;
                const available = opt.type === "flexi" ? (flexiRate > 0) : !!tour;

                return (
                  <div key={opt.type} className={`bg-white rounded-3xl border-2 transition-all overflow-hidden shadow-sm ${
                    isSelected ? "border-sky-500" : "border-sky-200"
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
                        <p className="font-semibold text-sm text-blue-900">{opt.label}</p>
                        <p className="text-slate-400 text-xs">{opt.desc}</p>
                        {!available && <p className="text-red-400 text-xs mt-0.5">Not offered by this driver</p>}
                        {available && opt.type !== "flexi" && tour && (
                          <p className="text-slate-500 text-xs mt-0.5">
                            ₹{tour.pricePerPerson.toLocaleString("en-IN")}/person · {formatTime(tour.schedule.startTime)} – {formatTime(tour.schedule.endTime)}
                          </p>
                        )}
                        {available && opt.type === "flexi" && (
                          <p className="text-slate-500 text-xs mt-0.5">₹{flexiRate}/hr</p>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {isExpanded && available && (
                      <div className="px-4 pb-4 border-t border-sky-100">
                        {opt.type !== "flexi" && tour && tour.stops.length > 0 && (
                          <div className="mt-3 mb-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Itinerary</p>
                            <div className="space-y-2">
                              {tour.stops.map((stop, i) => (
                                <div key={stop.id} className="flex items-start gap-2">
                                  <div className="w-5 h-5 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-sky-600 text-[9px] font-bold">{i + 1}</span>
                                  </div>
                                  <div>
                                    <p className="text-blue-900 text-sm">{stop.name}</p>
                                    <p className="text-slate-400 text-xs">{stop.durationMinutes} min</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-sky-100">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-sky-400" />
                                <span className="text-slate-500 text-xs">
                                  {formatTime(tour.schedule.startTime)} – {formatTime(tour.schedule.endTime)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-sky-400" />
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
                            <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                              <Calendar className="w-3 h-3" /> Date *
                            </label>
                            <input
                              type="date"
                              value={tourDate}
                              onChange={(e) => setTourDate(e.target.value)}
                              required
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full px-4 py-3 rounded-2xl border border-sky-200 bg-sky-50 text-blue-900 focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
                            />
                          </div>

                          {opt.type !== "flexi" && tour && (
                            <div>
                              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                                <Users className="w-3 h-3" /> Guests
                              </label>
                              <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                  className="w-9 h-9 rounded-full border border-sky-200 bg-sky-50 text-blue-900 flex items-center justify-center text-lg hover:border-sky-400">−</button>
                                <span className="text-blue-900 font-bold w-6 text-center">{guestCount}</span>
                                <button type="button" onClick={() => setGuestCount(Math.min(tour.maxGuests, guestCount + 1))}
                                  className="w-9 h-9 rounded-full border border-sky-200 bg-sky-50 text-blue-900 flex items-center justify-center text-lg hover:border-sky-400">+</button>
                                <span className="text-slate-400 text-xs">max {tour.maxGuests}</span>
                              </div>
                            </div>
                          )}

                          {opt.type === "flexi" && (
                            <div>
                              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                                <Clock className="w-3 h-3" /> Hours Required
                              </label>
                              <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setHoursRequested(Math.max(1, hoursRequested - 1))}
                                  className="w-9 h-9 rounded-full border border-sky-200 bg-sky-50 text-blue-900 flex items-center justify-center text-lg hover:border-sky-400">−</button>
                                <span className="text-blue-900 font-bold w-8 text-center">{hoursRequested}h</span>
                                <button type="button" onClick={() => setHoursRequested(Math.min(12, hoursRequested + 1))}
                                  className="w-9 h-9 rounded-full border border-sky-200 bg-sky-50 text-blue-900 flex items-center justify-center text-lg hover:border-sky-400">+</button>
                              </div>
                              <div className="mt-2 bg-sky-50 rounded-xl px-3 py-2 flex items-center justify-between border border-sky-100">
                                <span className="text-slate-500 text-xs">{hoursRequested} hrs × ₹{flexiRate}/hr</span>
                                <span className="text-sky-600 font-bold">₹{flexiTotal.toLocaleString("en-IN")}</span>
                              </div>
                            </div>
                          )}

                          {opt.type !== "flexi" && tour && (
                            <div className="bg-sky-50 rounded-xl px-3 py-2 flex items-center justify-between border border-sky-100">
                              <span className="text-slate-500 text-xs">{guestCount} × ₹{tour.pricePerPerson.toLocaleString("en-IN")}</span>
                              <span className="text-sky-600 font-bold">₹{(guestCount * tour.pricePerPerson).toLocaleString("en-IN")}</span>
                            </div>
                          )}

                          <div>
                            <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                              <MessageSquare className="w-3 h-3" /> Special Requests
                            </label>
                            <textarea
                              value={specialRequests}
                              onChange={(e) => setSpecialRequests(e.target.value)}
                              rows={2}
                              placeholder="Any special requirements?"
                              className="w-full px-4 py-3 rounded-2xl border border-sky-200 bg-sky-50 text-blue-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 text-sm resize-none"
                            />
                          </div>

                          {submitError && <p className="text-red-500 text-xs">{submitError}</p>}

                          <button
                            type="submit"
                            disabled={submitting || !tourDate}
                            className="w-full py-3.5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 disabled:opacity-50 transition-colors"
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
          )}

          {/* Success state */}
          {submitted && (
            <div className="bg-white rounded-3xl p-6 border border-sky-200 shadow-sm text-center">
              <div className="text-5xl mb-3">🙏</div>
              <h2 className="text-blue-900 font-bold text-lg">Request Sent!</h2>
              <p className="text-slate-500 text-sm mt-2">
                Waiting for <span className="text-blue-900 font-semibold">{driver.name}</span> to accept your request.
              </p>
              <p className="text-slate-400 text-xs mt-1">You will be notified once the driver confirms.</p>
              <button
                onClick={() => router.push("/traveller/bookings")}
                className="mt-4 px-6 py-2.5 bg-sky-500 text-white font-bold rounded-2xl hover:bg-sky-400 transition-colors text-sm"
              >
                View My Bookings
              </button>
            </div>
          )}
        </div>
      </div>
      <TravellerBottomNav />
    </RequireTravellerAuth>
  );
}
