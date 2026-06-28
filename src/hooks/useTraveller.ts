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
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTraveller(); }, [fetchTraveller]);

  async function updateTraveller(updates: Partial<Pick<Traveller, "name" | "phone">>) {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("travellers")
      .update({ name: updates.name, phone: updates.phone })
      .eq("id", user.id);
    if (error) throw error;
    await fetchTraveller();
  }

  return { traveller, loading, refresh: fetchTraveller, updateTraveller };
}
