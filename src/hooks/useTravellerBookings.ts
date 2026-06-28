"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { TravellerBooking } from "@/types/traveller";
import type { Tour } from "@/types/tour";

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
      .select("*, tours(name, city)")
      .eq("traveller_id", user.id)
      .order("created_at", { ascending: false });

    setBookings(
      (data ?? []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        tourId: r.tour_id as string,
        tourName: (r.tours as { name?: string; city?: string } | null)?.name ?? "",
        tourCity: (r.tours as { name?: string; city?: string } | null)?.city ?? "",
        tourDate: r.tour_date as string,
        guestCount: r.guest_count as number,
        totalAmount: Number(r.total_amount),
        currency: "₹",
        status: r.status as TravellerBooking["status"],
        specialRequests: (r.special_requests as string) ?? undefined,
        bookedAt: r.created_at as string,
      }))
    );
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function createBooking(tour: Tour, guestCount: number, tourDate: string, specialRequests?: string) {
    if (!user) throw new Error("Not authenticated");
    const totalAmount = guestCount * tour.pricePerPerson;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from("bookings").insert({
      tour_id: tour.id,
      driver_id: tour.driverId,
      traveller_id: user.id,
      guest_name: "",
      guest_count: guestCount,
      tour_date: tourDate,
      total_amount: totalAmount,
      special_requests: specialRequests || null,
      status: "pending",
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

  return { bookings, loading, refresh: fetchBookings, createBooking, cancelBooking };
}
