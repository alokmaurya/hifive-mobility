"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
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
    photoUrl: (row.photo_url as string) || undefined,
    cabPhoto: (row.cab_photo as string) || undefined,
    carPhotoUrl: (row.cab_photo as string) || undefined,
    isAvailable: (row.is_available as boolean) ?? true,
    hourlyRate: Number(row.hourly_rate ?? 0),
    phone: (row.phone as string) ?? undefined,
  };
}

const BUCKET = "driver-photos";

async function uploadToStorage(userId: string, path: string, file: File): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storage = (supabase as any).storage.from(BUCKET);
  const { error } = await storage.upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message ?? "Upload failed");
  const { data } = storage.getPublicUrl(path);
  return (data?.publicUrl as string) ?? "";
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<"photo" | "cab" | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("drivers")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) setProfile(mapDriver(data as Record<string, unknown>));
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  async function updateProfile(updates: Partial<Driver>) {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("drivers") as any)
      .update({
        name: updates.name,
        bio: updates.bio,
        vehicle_model: updates.vehicleModel,
        vehicle_plate: updates.vehiclePlate,
        car_brand: updates.carBrand,
        vehicle_capacity: updates.vehicleCapacity,
        vehicle_type: updates.vehicleType,
        fuel_type: updates.fuelType,
        is_ac: updates.isAc,
        luggage_capacity_bags: updates.luggageCapacityBags,
        is_pet_friendly: updates.isPetFriendly,
        years_experience: updates.yearsExperience,
        languages: updates.languages,
        specialties: updates.specialties,
        age: updates.age,
        smoking_allowed: updates.smokingAllowed,
        cab_photo: updates.cabPhoto ?? updates.carPhotoUrl,
        photo_url: updates.photoUrl,
        is_available: updates.isAvailable,
        hourly_rate: updates.hourlyRate,
        phone: updates.phone,
      })
      .eq("id", user.id);
    if (error) throw error;
    await fetchProfile();
  }

  async function uploadDriverPhoto(file: File) {
    if (!user) throw new Error("Not authenticated");
    setUploading("photo");
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/profile.${ext}`;
      const url = await uploadToStorage(user.id, path, file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("drivers") as any).update({ photo_url: url }).eq("id", user.id);
      await fetchProfile();
    } finally {
      setUploading(null);
    }
  }

  async function uploadCabPhoto(file: File) {
    if (!user) throw new Error("Not authenticated");
    setUploading("cab");
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/cab.${ext}`;
      const url = await uploadToStorage(user.id, path, file);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("drivers") as any).update({ cab_photo: url }).eq("id", user.id);
      await fetchProfile();
    } finally {
      setUploading(null);
    }
  }

  return { profile, loading, uploading, refresh: fetchProfile, updateProfile, uploadDriverPhoto, uploadCabPhoto };
}
