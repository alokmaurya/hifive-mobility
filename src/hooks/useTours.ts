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

async function fetchDriverProfile(userId: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any)
    .from("drivers")
    .select("name, rating, vehicle_model, vehicle_capacity, fuel_type")
    .eq("id", userId)
    .single();
  return data as { name: string; rating: number; vehicle_model: string; vehicle_capacity: number; fuel_type: string } | null;
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
    const driver = await fetchDriverProfile(user.id);
    const name = buildTourName(
      draft.city,
      driver?.name ?? "",
      driver?.rating ?? 5,
      driver?.vehicle_model ?? "",
      driver?.vehicle_capacity ?? 0,
      driver?.fuel_type ?? "petrol",
    );
    const totalMinutes =
      draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0) +
      draft.stops.length * 15;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: tour, error: tErr } = await db
      .from("tours")
      .insert({
        driver_id: user.id,
        name,
        city: draft.city,
        state: draft.state,
        country: draft.country || "India",
        category: draft.category as string,
        description: draft.description,
        status,
        price_per_person: Number(draft.pricePerPerson),
        max_guests: draft.maxGuests,
        start_time: draft.startTime,
        end_time: draft.endTime || "18:00",
        days_of_week: draft.daysOfWeek,
        estimated_duration_minutes: totalMinutes,
        tour_type: draft.category || "city_sightseeing",
        hourly_rate: Number(draft.hourlyRate) || 0,
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
    const driver = await fetchDriverProfile(user.id);
    const name = buildTourName(
      draft.city,
      driver?.name ?? "",
      driver?.rating ?? 5,
      driver?.vehicle_model ?? "",
      driver?.vehicle_capacity ?? 0,
      driver?.fuel_type ?? "petrol",
    );
    const totalMinutes =
      draft.stops.reduce((s, stop) => s + stop.durationMinutes, 0) +
      draft.stops.length * 15;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { error: tErr } = await db.from("tours").update({
      name,
      city: draft.city,
      state: draft.state,
      country: draft.country || "India",
      category: draft.category as string,
      description: draft.description,
      status,
      price_per_person: Number(draft.pricePerPerson),
      max_guests: draft.maxGuests,
      start_time: draft.startTime,
      end_time: draft.endTime || "18:00",
      days_of_week: draft.daysOfWeek,
      estimated_duration_minutes: totalMinutes,
      tour_type: draft.category || "city_sightseeing",
      hourly_rate: Number(draft.hourlyRate) || 0,
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
