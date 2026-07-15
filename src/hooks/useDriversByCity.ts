"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Driver, DriverCar } from "@/types/driver";

function mapDriverRow(row: Record<string, unknown>): Driver {
  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    rating: Number(row.rating ?? 5),
    totalTrips: (row.total_tours_run as number) ?? 0,
    bio: (row.bio as string) ?? "",
    languages: (row.languages as string[]) ?? [],
    yearsExperience: (row.years_experience as number) ?? 1,
    specialties: (row.specialties as Driver["specialties"]) ?? [],
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

function mapCarRow(row: Record<string, unknown>): DriverCar {
  return {
    vehicleModel: (row.vehicle_model as string) ?? "",
    vehiclePlate: (row.vehicle_plate as string) ?? "",
    carBrand: (row.car_brand as string) ?? "",
    vehicleType: (row.vehicle_type as string) ?? "suv",
    vehicleCapacity: (row.vehicle_capacity as number) ?? 4,
    fuelType: (row.fuel_type as string) ?? "petrol",
    isAc: (row.is_ac as boolean) ?? true,
    luggageCapacityBags: (row.luggage_capacity_bags as number) ?? 2,
    isPetFriendly: (row.is_pet_friendly as boolean) ?? false,
    smokingAllowed: (row.smoking_allowed as boolean) ?? false,
    cabPhoto: (row.cab_photo as string) ?? "",
  };
}

export function useDriversByCity(city: string, state: string) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) { setDrivers([]); return; }
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let q = (supabase as any)
      .from("tours")
      .select("driver_id, tour_type")
      .eq("status", "published")
      .ilike("city", `%${city}%`);
    if (state) q = q.ilike("state", `%${state}%`);
    q.then(async ({ data: tourRows }: { data: { driver_id: string; tour_type: string }[] | null }) => {
      const rows = tourRows ?? [];
      const driverIds = [...new Set(rows.map((r) => r.driver_id))];
      if (driverIds.length === 0) { setDrivers([]); setLoading(false); return; }

      const tourTypesMap: Record<string, string[]> = {};
      rows.forEach((r) => {
        if (!tourTypesMap[r.driver_id]) tourTypesMap[r.driver_id] = [];
        if (r.tour_type && !tourTypesMap[r.driver_id].includes(r.tour_type)) {
          tourTypesMap[r.driver_id].push(r.tour_type);
        }
      });

      // Fetch drivers, their primary cars, live ratings, and completed trip counts in parallel
      const [{ data: driverRows }, { data: carRows }, { data: ratingRows }, { data: completedRows }] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any).from("drivers").select("*").in("id", driverIds),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any).from("driver_cars").select("*").in("driver_id", driverIds).eq("is_active", true),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any).from("bookings").select("driver_id, traveller_rating").in("driver_id", driverIds).not("traveller_rating", "is", null),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any).from("bookings").select("driver_id").in("driver_id", driverIds).eq("status", "completed"),
      ]);

      // Compute average rating per driver from actual booking ratings
      const ratingSum: Record<string, number> = {};
      const ratingCount: Record<string, number> = {};
      ((ratingRows ?? []) as { driver_id: string; traveller_rating: number }[]).forEach((r) => {
        ratingSum[r.driver_id] = (ratingSum[r.driver_id] ?? 0) + r.traveller_rating;
        ratingCount[r.driver_id] = (ratingCount[r.driver_id] ?? 0) + 1;
      });

      // Count completed trips per driver
      const tripsCount: Record<string, number> = {};
      ((completedRows ?? []) as { driver_id: string }[]).forEach((r) => {
        tripsCount[r.driver_id] = (tripsCount[r.driver_id] ?? 0) + 1;
      });

      // Map all active cars per driver
      const carsByDriver: Record<string, DriverCar[]> = {};
      ((carRows ?? []) as Record<string, unknown>[]).forEach((row) => {
        const driverId = row.driver_id as string;
        if (!carsByDriver[driverId]) carsByDriver[driverId] = [];
        carsByDriver[driverId].push(mapCarRow(row));
      });

      setDrivers(
        ((driverRows ?? []) as Record<string, unknown>[]).map((row) => {
          const driverCars = carsByDriver[row.id as string] ?? [];
          const mapped = mapDriverRow(row);
          const id = row.id as string;
          if (ratingCount[id]) {
            mapped.rating = Math.round((ratingSum[id] / ratingCount[id]) * 10) / 10;
          }
          if (tripsCount[id]) {
            mapped.totalTrips = tripsCount[id];
            mapped.totalToursRun = tripsCount[id];
          }
          return {
            ...mapped,
            tourTypes: tourTypesMap[id] ?? [],
            primaryCar: driverCars[0],
            cars: driverCars,
          };
        })
      );
      setLoading(false);
    });
  }, [city, state]);

  return { drivers, loading };
}
