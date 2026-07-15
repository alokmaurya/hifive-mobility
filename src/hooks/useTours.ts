"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Tour } from "@/types/tour";
import type { TourDraft } from "@/types/tour";
import { buildTourCode } from "@/lib/utils";

type DriverProfile = { name: string; rating: number };
type CarRow = { id: string; vehicle_model: string; vehicle_capacity: number; fuel_type: string; cab_photo: string };

function mapTour(row: Record<string, unknown>, driver?: DriverProfile | null, car?: CarRow | null): Tour {
  const stops = (row.tour_stops as Record<string, unknown>[] | undefined) ?? [];
  return {
    id: row.id as string,
    driverId: row.driver_id as string,
    name: row.name as string,
    city: (row.city as string) ?? "",
    state: (row.state as string) ?? "",
    country: (row.country as string) ?? "India",
    category: row.category as Tour["category"],
    description: (row.description as string) ?? "",
    stops: stops
      .sort((a, b) => (a.stop_order as number) - (b.stop_order as number))
      .map((s) => ({
        id: s.id as string,
        name: s.name as string,
        durationMinutes: s.duration_minutes as number,
        order: s.stop_order as number,
      })),
    schedule: {
      startTime: (row.start_time as string) ?? "08:00",
      endTime: (row.end_time as string) ?? "16:00",
      daysOfWeek: (row.days_of_week as number[]) ?? [],
    },
    tourType: (row.tour_type as Tour["tourType"]) ?? "city_sightseeing",
    hourlyRate: Number(row.hourly_rate ?? 0),
    pricePerPerson: Number(row.full_cab_price ?? row.price_per_person ?? 0),
    fullCabPrice: Number(row.full_cab_price ?? row.price_per_person ?? 0),
    overtimeRatePerHour: Number(row.overtime_rate_per_hour ?? 0),
    currency: "₹",
    maxGuests: row.max_guests as number,
    currentBookings: row.current_bookings as number,
    status: row.status as Tour["status"],
    createdAt: row.created_at as string,
    estimatedDurationMinutes: row.estimated_duration_minutes as number,
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviewCount: row.review_count as number,
    isAc: (row.is_ac as boolean) ?? true,
    isPetFriendly: (row.is_pet_friendly as boolean) ?? false,
    smokingAllowed: (row.smoking_allowed as boolean) ?? false,
    offersHourly: (row.offers_hourly as boolean) ?? false,
    offersAirportDrop: (row.offers_airport_drop as boolean) ?? false,
    offersRailwayDrop: (row.offers_railway_drop as boolean) ?? false,
    offersBusDrop: (row.offers_bus_drop as boolean) ?? false,
    airportDropPrice: Number(row.airport_drop_price ?? 0),
    railwayDropPrice: Number(row.railway_drop_price ?? 0),
    busStationDropPrice: Number(row.bus_station_drop_price ?? 0),
    tourCode: (row.tour_code as string) || undefined,
    driverName: driver?.name ?? "",
    vehicleModel: car?.vehicle_model ?? "",
    vehicleCapacity: car?.vehicle_capacity ?? 0,
    fuelType: car?.fuel_type ?? "petrol",
    cabPhoto: car?.cab_photo ?? "",
  };
}

async function fetchDriverProfile(userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("drivers")
    .select("name, rating")
    .eq("id", userId)
    .single();
  return data as DriverProfile | null;
}

export function buildTourName(city: string, driverName: string, rating: number, vehicleModel: string, vehicleCapacity: number, fuelType: string): string {
  const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
  return `${city} | ${driverName} | ${Number(rating).toFixed(2)} | ${vehicleModel} | ${vehicleCapacity} | ${cap(fuelType)}`;
}

export function useTours() {
  const { user } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    const [{ data, error }, driver] = await Promise.all([
      supabase
        .from("tours")
        .select("*, tour_stops(*), driver_cars(id, vehicle_model, vehicle_capacity, fuel_type, cab_photo)")
        .eq("driver_id", user.id)
        .order("created_at", { ascending: true }),
      fetchDriverProfile(user.id),
    ]);
    if (error) {
      setError(error.message);
    } else {
      setTours((data ?? []).map((r) => {
        const row = r as Record<string, unknown>;
        const car = row.driver_cars as CarRow | null;
        return mapTour(row, driver, car);
      }));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  async function createTour(draft: TourDraft, status: "draft" | "published" = "published") {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const [driver, { count: existingCount }] = await Promise.all([
      fetchDriverProfile(user.id),
      db.from("tours")
        .select("id", { count: "exact", head: true })
        .eq("driver_id", user.id)
        .eq("category", draft.category as string),
    ]);
    // Fetch selected car details if a car was chosen
    let car: CarRow | null = null;
    if (draft.carId) {
      const { data: carData } = await db.from("driver_cars")
        .select("id, vehicle_model, vehicle_capacity, fuel_type, cab_photo")
        .eq("id", draft.carId).single();
      car = carData as CarRow | null;
    }
    const vehicleModel = car?.vehicle_model ?? "";
    const vehicleCapacity = car?.vehicle_capacity ?? 0;
    const fuelType = car?.fuel_type ?? "petrol";
    const seqNum = (existingCount ?? 0) + 1;
    const tourCode = buildTourCode(draft.city, driver?.name ?? "", draft.category as string, vehicleModel, seqNum);
    const name = buildTourName(
      draft.city,
      driver?.name ?? "",
      driver?.rating ?? 5,
      vehicleModel,
      vehicleCapacity,
      fuelType,
    );
    const totalMinutes =
      draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0) +
      draft.stops.length * 15;

    const { data: tour, error: tErr } = await db
      .from("tours")
      .insert({
        driver_id: user.id,
        name,
        tour_code: tourCode,
        city: draft.city,
        state: draft.state,
        country: draft.country || "India",
        category: draft.category as string,
        description: `${draft.category === "flexi" ? "Flexi" : draft.category === "outer_city_sightseeing" ? "Outer City" : "City"} tour in ${draft.city}`,
        status,
        price_per_person: Number(draft.fullCabPrice) || 0,
        full_cab_price: Number(draft.fullCabPrice) || 0,
        overtime_rate_per_hour: Number(draft.overtimeRatePerHour) || 0,
        max_guests: 6,
        start_time: draft.startTime,
        end_time: draft.endTime || "18:00",
        days_of_week: draft.daysOfWeek,
        estimated_duration_minutes: totalMinutes,
        tour_type: draft.category || "city_sightseeing",
        hourly_rate: Number(draft.hourlyRate) || 0,
        is_ac: draft.isAc,
        is_pet_friendly: draft.isPetFriendly,
        smoking_allowed: draft.smokingAllowed,
        car_id: draft.carId ?? null,
        airport_drop_price: Number(draft.airportDropPrice) || 0,
        railway_drop_price: Number(draft.railwayDropPrice) || 0,
        bus_station_drop_price: Number(draft.busStationDropPrice) || 0,
        offers_airport_drop: draft.offersAirportDrop,
        offers_railway_drop: draft.offersRailwayDrop,
        offers_bus_drop: draft.offersBusDrop,
        offers_hourly: draft.offersHourly,
      })
      .select()
      .single();

    if (tErr || !tour) throw new Error(tErr?.message ?? tErr?.details ?? "Failed to create tour");

    if (draft.stops.length > 0) {
      const { error: sErr } = await db.from("tour_stops").insert(
        draft.stops.map((stop: { name: string; durationMinutes: number }, i: number) => ({
          tour_id: tour.id,
          name: stop.name,
          duration_minutes: stop.durationMinutes,
          stop_order: i + 1,
        }))
      );
      if (sErr) throw new Error(sErr.message ?? sErr.details ?? "Failed to save stops");
    }

    await fetchTours();
    return tour.id as string;
  }

  async function updateTour(tourId: string, draft: TourDraft, status: "draft" | "published" = "published") {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const [driver, { data: existing }] = await Promise.all([
      fetchDriverProfile(user.id),
      db.from("tours").select("tour_code, car_id").eq("id", tourId).single(),
    ]);
    // Fetch selected car details if a car was chosen
    const chosenCarId = draft.carId ?? (existing?.car_id as string | undefined);
    let car: CarRow | null = null;
    if (chosenCarId) {
      const { data: carData } = await db.from("driver_cars")
        .select("id, vehicle_model, vehicle_capacity, fuel_type, cab_photo")
        .eq("id", chosenCarId).single();
      car = carData as CarRow | null;
    }
    const vehicleModel = car?.vehicle_model ?? "";
    const vehicleCapacity = car?.vehicle_capacity ?? 0;
    const fuelType = car?.fuel_type ?? "petrol";
    // Preserve existing tour_code; only generate one if missing (legacy row)
    let tourCode = (existing?.tour_code as string) || "";
    if (!tourCode) {
      const { count: existingCount } = await db.from("tours")
        .select("id", { count: "exact", head: true })
        .eq("driver_id", user.id)
        .eq("category", draft.category as string)
        .neq("id", tourId);
      tourCode = buildTourCode(draft.city, driver?.name ?? "", draft.category as string, vehicleModel, (existingCount ?? 0) + 1);
    }
    const name = buildTourName(
      draft.city,
      driver?.name ?? "",
      driver?.rating ?? 5,
      vehicleModel,
      vehicleCapacity,
      fuelType,
    );
    const totalMinutes =
      draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0) +
      draft.stops.length * 15;

    const { error: tErr } = await db.from("tours").update({
      name,
      tour_code: tourCode,
      city: draft.city,
      state: draft.state,
      country: draft.country || "India",
      category: draft.category as string,
      description: `${draft.category === "flexi" ? "Flexi" : draft.category === "outer_city_sightseeing" ? "Outer City" : "City"} tour in ${draft.city}`,
      status,
      price_per_person: Number(draft.fullCabPrice) || 0,
      full_cab_price: Number(draft.fullCabPrice) || 0,
      overtime_rate_per_hour: Number(draft.overtimeRatePerHour) || 0,
      max_guests: 6,
      start_time: draft.startTime,
      end_time: draft.endTime || "18:00",
      days_of_week: draft.daysOfWeek,
      estimated_duration_minutes: totalMinutes,
      tour_type: draft.category || "city_sightseeing",
      hourly_rate: Number(draft.hourlyRate) || 0,
      is_ac: draft.isAc,
      is_pet_friendly: draft.isPetFriendly,
      smoking_allowed: draft.smokingAllowed,
      car_id: chosenCarId ?? null,
      airport_drop_price: Number(draft.airportDropPrice) || 0,
      railway_drop_price: Number(draft.railwayDropPrice) || 0,
      bus_station_drop_price: Number(draft.busStationDropPrice) || 0,
      offers_airport_drop: draft.offersAirportDrop,
      offers_railway_drop: draft.offersRailwayDrop,
      offers_bus_drop: draft.offersBusDrop,
      offers_hourly: draft.offersHourly,
    }).eq("id", tourId);
    if (tErr) throw new Error(tErr.message ?? tErr.details ?? "Failed to update tour");

    await db.from("tour_stops").delete().eq("tour_id", tourId);
    if (draft.stops.length > 0) {
      const { error: sErr } = await db.from("tour_stops").insert(
        draft.stops.map((stop: { name: string; durationMinutes: number }, i: number) => ({
          tour_id: tourId,
          name: stop.name,
          duration_minutes: stop.durationMinutes,
          stop_order: i + 1,
        }))
      );
      if (sErr) throw new Error(sErr.message ?? sErr.details ?? "Failed to update stops");
    }

    await fetchTours();
  }

  async function updateTourStatus(tourId: string, status: Tour["status"]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("tours").update({ status }).eq("id", tourId);
    if (error) throw error;
    await fetchTours();
  }

  async function deleteTour(tourId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("tours").delete().eq("id", tourId);
    if (error) throw error;
    await fetchTours();
  }

  async function duplicateTour(tourId: string) {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: src, error: srcErr } = await db
      .from("tours")
      .select("*, tour_stops(*)")
      .eq("id", tourId)
      .single();
    if (srcErr || !src) throw srcErr ?? new Error("Tour not found");

    const { data: newTour, error: tErr } = await db.from("tours").insert({
      driver_id: user.id,
      name: `${src.name} (Copy)`,
      city: src.city,
      state: src.state,
      country: src.country,
      category: src.category,
      description: src.description,
      status: "draft",
      price_per_person: src.price_per_person,
      max_guests: src.max_guests,
      start_time: src.start_time,
      end_time: src.end_time,
      days_of_week: src.days_of_week,
      estimated_duration_minutes: src.estimated_duration_minutes,
      tour_type: src.tour_type,
      hourly_rate: src.hourly_rate,
    }).select().single();
    if (tErr || !newTour) throw tErr ?? new Error("Failed to duplicate tour");

    const stops = (src.tour_stops ?? []) as Record<string, unknown>[];
    if (stops.length > 0) {
      await db.from("tour_stops").insert(
        stops.map((s) => ({
          tour_id: newTour.id,
          name: s.name,
          duration_minutes: s.duration_minutes,
          stop_order: s.stop_order,
        }))
      );
    }
    await fetchTours();
    return newTour.id as string;
  }

  return { tours, loading, error, refresh: fetchTours, createTour, updateTour, updateTourStatus, deleteTour, duplicateTour };
}
