"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Driver, FuelType, VehicleType } from "@/types/driver";

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
    languages: (row.languages as string[]) ?? [],
    yearsExperience: (row.years_experience as number) ?? 1,
    specialties: (row.specialties as Driver["specialties"]) ?? [],
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

      // Build a map of driver_id -> set of tour types
      const tourTypesMap: Record<string, string[]> = {};
      rows.forEach((r) => {
        if (!tourTypesMap[r.driver_id]) tourTypesMap[r.driver_id] = [];
        if (r.tour_type && !tourTypesMap[r.driver_id].includes(r.tour_type)) {
          tourTypesMap[r.driver_id].push(r.tour_type);
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: driverRows } = await (supabase as any)
        .from("drivers")
        .select("*")
        .in("id", driverIds);
      setDrivers(
        ((driverRows ?? []) as Record<string, unknown>[]).map((row) => ({
          ...mapDriver(row),
          tourTypes: tourTypesMap[row.id as string] ?? [],
        }))
      );
      setLoading(false);
    });
  }, [city, state]);

  return { drivers, loading };
}
