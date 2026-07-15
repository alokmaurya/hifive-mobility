"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { DriverCar, DriverCarDraft } from "@/types/car";

function mapCar(row: Record<string, unknown>): DriverCar {
  return {
    id: row.id as string,
    driverId: row.driver_id as string,
    carBrand: (row.car_brand as string) ?? "",
    vehicleModel: (row.vehicle_model as string) ?? "",
    vehiclePlate: (row.vehicle_plate as string) ?? "",
    vehicleType: (row.vehicle_type as DriverCar["vehicleType"]) ?? "suv",
    vehicleCapacity: (row.vehicle_capacity as number) ?? 4,
    fuelType: (row.fuel_type as DriverCar["fuelType"]) ?? "petrol",
    isAc: (row.is_ac as boolean) ?? true,
    isPetFriendly: (row.is_pet_friendly as boolean) ?? false,
    smokingAllowed: (row.smoking_allowed as boolean) ?? false,
    luggageCapacityBags: (row.luggage_capacity_bags as number) ?? 2,
    cabPhoto: (row.cab_photo as string) || undefined,
    isActive: (row.is_active as boolean) ?? true,
    createdAt: (row.created_at as string) ?? "",
  };
}

const BUCKET = "driver-photos";

export function useCars() {
  const { user } = useAuth();
  const [cars, setCars] = useState<DriverCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingCarId, setUploadingCarId] = useState<string | null>(null);

  const fetchCars = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("driver_cars")
      .select("*")
      .eq("driver_id", user.id)
      .order("created_at", { ascending: true });
    setCars((data ?? []).map((r: Record<string, unknown>) => mapCar(r)));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  async function addCar(draft: DriverCarDraft): Promise<DriverCar> {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from("driver_cars")
      .insert({
        driver_id: user.id,
        car_brand: draft.carBrand,
        vehicle_model: draft.vehicleModel,
        vehicle_plate: draft.vehiclePlate,
        vehicle_type: draft.vehicleType,
        vehicle_capacity: draft.vehicleCapacity,
        fuel_type: draft.fuelType,
        is_ac: draft.isAc,
        is_pet_friendly: draft.isPetFriendly,
        smoking_allowed: draft.smokingAllowed,
        luggage_capacity_bags: draft.luggageCapacityBags,
        cab_photo: draft.cabPhoto ?? "",
        is_active: draft.isActive,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    await fetchCars();
    return mapCar(data as Record<string, unknown>);
  }

  async function updateCar(carId: string, draft: Partial<DriverCarDraft>) {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("driver_cars")
      .update({
        car_brand: draft.carBrand,
        vehicle_model: draft.vehicleModel,
        vehicle_plate: draft.vehiclePlate,
        vehicle_type: draft.vehicleType,
        vehicle_capacity: draft.vehicleCapacity,
        fuel_type: draft.fuelType,
        is_ac: draft.isAc,
        is_pet_friendly: draft.isPetFriendly,
        smoking_allowed: draft.smokingAllowed,
        luggage_capacity_bags: draft.luggageCapacityBags,
        cab_photo: draft.cabPhoto,
        is_active: draft.isActive,
      })
      .eq("id", carId)
      .eq("driver_id", user.id);
    if (error) throw new Error(error.message);
    await fetchCars();
  }

  async function deleteCar(carId: string) {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("driver_cars")
      .delete()
      .eq("id", carId)
      .eq("driver_id", user.id);
    if (error) throw new Error(error.message);
    await fetchCars();
  }

  async function uploadCarPhoto(carId: string, file: File) {
    if (!user) throw new Error("Not authenticated");
    setUploadingCarId(carId);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/car-${carId}.${ext}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storage = (supabase as any).storage.from(BUCKET);
      const { error } = await storage.upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw new Error(error.message ?? "Upload failed");
      const { data } = storage.getPublicUrl(path);
      const url = (data?.publicUrl as string) ?? "";
      await updateCar(carId, { cabPhoto: url });
      return url;
    } finally {
      setUploadingCarId(null);
    }
  }

  return { cars, loading, uploadingCarId, refresh: fetchCars, addCar, updateCar, deleteCar, uploadCarPhoto };
}
