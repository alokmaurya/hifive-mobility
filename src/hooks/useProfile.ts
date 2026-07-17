"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Driver, Gender } from "@/types/driver";

function mapDriver(row: Record<string, unknown>): Driver {
  return {
    id: row.id as string,
    name: (row.name as string) ?? "",
    rating: Number(row.rating ?? 5),
    totalTrips: (row.total_tours_run as number) ?? 0,
    age: (row.age as number) ?? undefined,
    gender: ((row.gender as string) ?? "") as Gender,
    phone: (row.phone as string) ?? undefined,
    aadharNumber: (row.aadhar_number as string) ?? "",
    aadharFrontUrl: (row.aadhar_front_url as string) ?? "",
    aadharBackUrl: (row.aadhar_back_url as string) ?? "",
    bio: (row.bio as string) ?? "",
    languages: (row.languages as string[]) ?? [],
    yearsExperience: (row.years_experience as number) ?? 1,
    specialties: (row.specialties as Driver["specialties"]) ?? [],
    totalToursRun: (row.total_tours_run as number) ?? 0,
    totalGuestsHosted: (row.total_guests_hosted as number) ?? 0,
    licenseNumber: "",
    isVerified: Boolean(row.aadhar_number && row.aadhar_front_url && row.aadhar_back_url),
    photoUrl: (row.photo_url as string) || undefined,
    isAvailable: (row.is_available as boolean) ?? true,
    hourlyRate: Number(row.hourly_rate ?? 0),
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
  const [uploading, setUploading] = useState<"photo" | "aadhar_front" | "aadhar_back" | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const [{ data }, { data: ratingRows }, { data: completedRows }] = await Promise.all([
      supabase.from("drivers").select("*").eq("id", user.id).single(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("bookings").select("traveller_rating").eq("driver_id", user.id).not("traveller_rating", "is", null),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any).from("bookings").select("id").eq("driver_id", user.id).eq("status", "completed"),
    ]);
    if (data) {
      const driver = mapDriver(data as Record<string, unknown>);
      if (ratingRows && ratingRows.length > 0) {
        const avg = ratingRows.reduce((sum: number, r: { traveller_rating: number }) => sum + r.traveller_rating, 0) / ratingRows.length;
        driver.rating = Math.round(avg * 10) / 10;
      }
      const trips = completedRows?.length ?? 0;
      driver.totalTrips = trips;
      driver.totalToursRun = trips;
      setProfile(driver);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  async function updateProfile(updates: Partial<Driver>) {
    if (!user) throw new Error("Not authenticated");
    const newAadharNumber = updates.aadharNumber ?? profile?.aadharNumber ?? "";
    const newIsVerified = Boolean(
      newAadharNumber &&
      (profile?.aadharFrontUrl ?? "") &&
      (profile?.aadharBackUrl ?? "")
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("drivers") as any)
      .update({
        name: updates.name,
        bio: updates.bio,
        age: updates.age,
        gender: updates.gender,
        phone: updates.phone,
        aadhar_number: updates.aadharNumber,
        years_experience: updates.yearsExperience,
        languages: updates.languages,
        specialties: updates.specialties,
        is_available: updates.isAvailable,
        hourly_rate: updates.hourlyRate,
        photo_url: updates.photoUrl,
        is_verified: newIsVerified,
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
      const baseUrl = await uploadToStorage(user.id, path, file);
      const url = `${baseUrl}?t=${Date.now()}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbErr } = await (supabase.from("drivers") as any).update({ photo_url: url }).eq("id", user.id);
      if (dbErr) throw new Error(dbErr.message ?? "Failed to save photo to profile");
      setProfile((prev) => prev ? { ...prev, photoUrl: url } : prev);
    } finally {
      setUploading(null);
    }
  }

  async function uploadAadharPhoto(side: "front" | "back", file: File) {
    if (!user) throw new Error("Not authenticated");
    const key = side === "front" ? "aadhar_front" : "aadhar_back";
    setUploading(key as "aadhar_front" | "aadhar_back");
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/aadhar-${side}.${ext}`;
      const baseUrl = await uploadToStorage(user.id, path, file);
      const url = `${baseUrl}?t=${Date.now()}`;
      const dbCol = side === "front" ? "aadhar_front_url" : "aadhar_back_url";
      const stateKey = side === "front" ? "aadharFrontUrl" : "aadharBackUrl";
      const newFrontUrl = side === "front" ? url : (profile?.aadharFrontUrl ?? "");
      const newBackUrl  = side === "back"  ? url : (profile?.aadharBackUrl  ?? "");
      const newIsVerified = Boolean((profile?.aadharNumber ?? "") && newFrontUrl && newBackUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: dbErr } = await (supabase.from("drivers") as any)
        .update({ [dbCol]: url, is_verified: newIsVerified })
        .eq("id", user.id);
      if (dbErr) throw new Error(dbErr.message ?? "Failed to save aadhar photo to profile");
      setProfile((prev) => prev ? { ...prev, [stateKey]: url, isVerified: newIsVerified } : prev);
    } finally {
      setUploading(null);
    }
  }

  return { profile, loading, uploading, refresh: fetchProfile, updateProfile, uploadDriverPhoto, uploadAadharPhoto };
}
