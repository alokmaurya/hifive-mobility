"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Traveller } from "@/types/traveller";

export function useTraveller() {
  const { user } = useAuth();
  const [traveller, setTraveller] = useState<Traveller | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTraveller = useCallback(async () => {
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("travellers")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) {
      setTraveller({
        id: data.id,
        name: data.name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? user.email ?? "",
        createdAt: data.created_at,
        interests: Array.isArray(data.interests) ? data.interests : [],
        foodPreference: data.food_preference ?? "No Preference",
        dietaryNotes: data.dietary_notes ?? "",
        preferredLanguage: data.preferred_language ?? "",
        city: data.city ?? "",
        emergencyContact: data.emergency_contact ?? "",
        bio: data.bio ?? "",
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTraveller(); }, [fetchTraveller]);

  async function updateTraveller(updates: Partial<Omit<Traveller, "id" | "email" | "createdAt">>) {
    if (!user) throw new Error("Not authenticated");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.interests !== undefined) payload.interests = updates.interests;
    if (updates.foodPreference !== undefined) payload.food_preference = updates.foodPreference;
    if (updates.dietaryNotes !== undefined) payload.dietary_notes = updates.dietaryNotes;
    if (updates.preferredLanguage !== undefined) payload.preferred_language = updates.preferredLanguage;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.emergencyContact !== undefined) payload.emergency_contact = updates.emergencyContact;
    if (updates.bio !== undefined) payload.bio = updates.bio;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("travellers")
      .upsert({
        id: user.id,
        email: user.email,
        ...payload,
      });

    if (error) {
      console.error("Supabase travellers save error:", error);
      throw new Error(error.message || error.details || error.hint || "Failed to save profile to database");
    }
    await fetchTraveller();
  }

  return { traveller, loading, refresh: fetchTraveller, updateTraveller };
}
