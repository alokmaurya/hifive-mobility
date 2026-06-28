"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Tour } from "@/types/tour";
import type { TourDraft } from "@/types/tour";

function mapTour(row: Record<string, unknown>): Tour {
  const stops = (row.tour_stops as Record<string, unknown>[] | undefined) ?? [];
  return {
    id: row.id as string,
    driverId: row.driver_id as string,
    name: row.name as string,
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
      startTime: row.start_time as string,
      daysOfWeek: (row.days_of_week as number[]) ?? [],
    },
    pricePerPerson: Number(row.price_per_person),
    currency: "₹",
    maxGuests: row.max_guests as number,
    currentBookings: row.current_bookings as number,
    status: row.status as Tour["status"],
    createdAt: row.created_at as string,
    estimatedDurationMinutes: row.estimated_duration_minutes as number,
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviewCount: row.review_count as number,
  };
}

export function useTours() {
  const { user } = useAuth();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTours = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("tours")
      .select("*, tour_stops(*)")
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setTours((data ?? []).map((r) => mapTour(r as Record<string, unknown>)));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchTours(); }, [fetchTours]);

  async function createTour(draft: TourDraft, status: "draft" | "published" = "published") {
    if (!user) throw new Error("Not authenticated");
    const totalMinutes =
      draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0) +
      draft.stops.length * 15;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: tour, error: tErr } = await db
      .from("tours")
      .insert({
        driver_id: user.id,
        name: draft.name,
        category: draft.category as string,
        description: draft.description,
        status,
        price_per_person: Number(draft.pricePerPerson),
        max_guests: draft.maxGuests,
        start_time: draft.startTime,
        days_of_week: draft.daysOfWeek,
        estimated_duration_minutes: totalMinutes,
      })
      .select()
      .single();

    if (tErr || !tour) throw tErr ?? new Error("Failed to create tour");

    if (draft.stops.length > 0) {
      const { error: sErr } = await db.from("tour_stops").insert(
        draft.stops.map((stop: { name: string; durationMinutes: number }, i: number) => ({
          tour_id: tour.id,
          name: stop.name,
          duration_minutes: stop.durationMinutes,
          stop_order: i + 1,
        }))
      );
      if (sErr) throw sErr;
    }

    await fetchTours();
    return tour.id as string;
  }

  async function updateTourStatus(tourId: string, status: Tour["status"]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("tours").update({ status }).eq("id", tourId);
    if (error) throw error;
    await fetchTours();
  }

  async function updateTour(tourId: string, draft: TourDraft, status: "draft" | "published" = "published") {
    if (!user) throw new Error("Not authenticated");
    const totalMinutes =
      draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0) +
      draft.stops.length * 15;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { error: tErr } = await db.from("tours").update({
      name: draft.name,
      category: draft.category as string,
      description: draft.description,
      status,
      price_per_person: Number(draft.pricePerPerson),
      max_guests: draft.maxGuests,
      start_time: draft.startTime,
      days_of_week: draft.daysOfWeek,
      estimated_duration_minutes: totalMinutes,
    }).eq("id", tourId);
    if (tErr) throw tErr;

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
      if (sErr) throw sErr;
    }

    await fetchTours();
  }

  async function deleteTour(tourId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("tours").delete().eq("id", tourId);
    if (error) throw error;
    await fetchTours();
  }

  return { tours, loading, error, refresh: fetchTours, createTour, updateTour, updateTourStatus, deleteTour };
}
