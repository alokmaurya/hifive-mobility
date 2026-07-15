"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { TravellerBooking, TourType } from "@/types/traveller";

export function useTravellerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<TravellerBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("bookings")
      .select("*, drivers(name, photo_url), tours(city, start_time, end_time, driver_cars(car_brand, vehicle_model, vehicle_plate, vehicle_capacity, is_ac, cab_photo))")
      .eq("traveller_id", user.id)
      .order("created_at", { ascending: false });

    // Collect driver IDs where car data is missing from the tour join
    const rows = (data ?? []) as Record<string, unknown>[];
    const missingCarDriverIds = [...new Set(
      rows
        .filter((r) => {
          const tourRow = r.tours as { driver_cars?: unknown } | null;
          return !tourRow?.driver_cars;
        })
        .map((r) => r.driver_id as string)
    )];

    let fallbackCarsByDriver: Record<string, Record<string, unknown>> = {};
    if (missingCarDriverIds.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: fallbackCars } = await (supabase as any)
        .from("driver_cars")
        .select("driver_id, car_brand, vehicle_model, vehicle_plate, vehicle_capacity, is_ac, cab_photo")
        .in("driver_id", missingCarDriverIds)
        .eq("is_active", true);
      ((fallbackCars ?? []) as Record<string, unknown>[]).forEach((c) => {
        const did = c.driver_id as string;
        if (!fallbackCarsByDriver[did]) fallbackCarsByDriver[did] = c;
      });
    }

    setBookings(
      rows.map((r: Record<string, unknown>) => {
        const driverRow = r.drivers as { name?: string; photo_url?: string } | null;
        const tourRow   = r.tours as { city?: string; start_time?: string; end_time?: string; driver_cars?: Record<string, unknown> | null } | null;
        const carRow    = tourRow?.driver_cars ?? fallbackCarsByDriver[r.driver_id as string] ?? null;
        return {
          id: r.id as string,
          tourId: r.tour_id as string | undefined,
          driverId: r.driver_id as string,
          driverName: driverRow?.name ?? "",
          driverPhotoUrl: driverRow?.photo_url || undefined,
          tourCity: tourRow?.city ?? (r.city as string) ?? "",
          tourDate: r.tour_date as string,
          tourType: (r.tour_type as TourType) ?? "city_sightseeing",
          guestCount: (r.guest_count as number) ?? 1,
          hoursRequested: r.hours_requested as number | undefined,
          totalAmount: Number(r.total_amount),
          currency: "₹",
          status: r.status as TravellerBooking["status"],
          specialRequests: (r.special_requests as string) ?? undefined,
          bookedAt: r.created_at as string,
          carBrand: carRow ? (carRow.car_brand as string) ?? "" : undefined,
          vehicleModel: carRow ? (carRow.vehicle_model as string) ?? "" : undefined,
          vehiclePlate: carRow ? (carRow.vehicle_plate as string) || undefined : undefined,
          vehicleCapacity: carRow ? (carRow.vehicle_capacity as number) ?? undefined : undefined,
          isAc: carRow ? (carRow.is_ac as boolean) ?? undefined : undefined,
          cabPhoto: carRow ? (carRow.cab_photo as string) || undefined : undefined,
          tourStartTime: tourRow?.start_time || undefined,
          tourEndTime: tourRow?.end_time || undefined,
          startOtp: (r.start_otp as string) || undefined,
          endOtp: (r.end_otp as string) || undefined,
          travellerRating: (r.traveller_rating as number) ?? undefined,
          ratingComment: (r.rating_comment as string) || undefined,
        };
      })
    );
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function createTourBooking(
    tourId: string,
    driverId: string,
    tourType: TourType,
    guestCount: number,
    tourDate: string,
    totalAmount: number,
    specialRequests?: string,
  ) {
    if (!user) throw new Error("Not authenticated");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("bookings").insert({
      tour_id: tourId,
      driver_id: driverId,
      traveller_id: user.id,
      guest_name: "",
      guest_count: guestCount,
      tour_date: tourDate,
      total_amount: totalAmount,
      special_requests: specialRequests || null,
      status: "pending",
      tour_type: tourType,
    });
    if (error) throw error;
    await fetchBookings();
  }

  async function createFlexiBooking(
    driverId: string,
    hoursRequested: number,
    hourlyRate: number,
    tourDate: string,
    specialRequests?: string,
  ) {
    if (!user) throw new Error("Not authenticated");
    const totalAmount = hoursRequested * hourlyRate;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("bookings").insert({
      driver_id: driverId,
      traveller_id: user.id,
      guest_name: "",
      guest_count: 1,
      tour_date: tourDate,
      total_amount: totalAmount,
      special_requests: specialRequests || null,
      status: "pending",
      tour_type: "flexi",
      hours_requested: hoursRequested,
      hourly_rate: hourlyRate,
    });
    if (error) throw error;
    await fetchBookings();
  }

  async function cancelBooking(bookingId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);
    if (error) throw error;
    await fetchBookings();
  }

  async function submitRating(bookingId: string, driverId: string, rating: number, comment?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from("bookings")
      .update({ traveller_rating: rating, rating_comment: comment ?? null })
      .eq("id", bookingId);
    if (error) throw error;

    // Recompute driver's average rating from all rated bookings and update drivers table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: ratedRows } = await (supabase as any)
      .from("bookings")
      .select("traveller_rating")
      .eq("driver_id", driverId)
      .not("traveller_rating", "is", null);
    if (ratedRows && ratedRows.length > 0) {
      const avg = ratedRows.reduce((sum: number, r: { traveller_rating: number }) => sum + r.traveller_rating, 0) / ratedRows.length;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from("drivers")
        .update({ rating: Math.round(avg * 10) / 10 })
        .eq("id", driverId);
    }

    await fetchBookings();
  }

  return { bookings, loading, refresh: fetchBookings, createTourBooking, createFlexiBooking, cancelBooking, submitRating };
}
