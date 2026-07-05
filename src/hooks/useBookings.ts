"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking, BookingStatus } from "@/types/tour";

function mapBooking(row: Record<string, unknown>, tourName?: string): Booking {
  const traveller = row.travellers as { name?: string; phone?: string; email?: string } | null;
  const guestName = (traveller?.name?.trim() || (row.guest_name as string) || "").trim() || "Unknown Traveller";
  const guestPhone = traveller?.phone ?? (row.guest_phone as string) ?? "";
  return {
    id: row.id as string,
    tourId: row.tour_id as string,
    tourName: tourName ?? (row.tour_name as string) ?? "",
    tourDate: row.tour_date as string,
    guest: {
      id: row.id as string,
      name: guestName,
      phone: guestPhone,
      guestCount: (row.guest_count as number) ?? 1,
      specialRequests: (row.special_requests as string) ?? undefined,
    },
    status: row.status as BookingStatus,
    totalAmount: Number(row.total_amount),
    currency: "₹",
    bookedAt: row.created_at as string,
    // Extra fields for driver view
    tourType: row.tour_type as string | undefined,
    hoursRequested: row.hours_requested as number | undefined,
    travellerEmail: traveller?.email,
  };
}

export function useBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*, tours(name), travellers(name, phone, email)")
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setBookings(
        (data ?? []).map((r) => {
          const row = r as Record<string, unknown>;
          const tourName = (row.tours as { name?: string } | null)?.name ?? "";
          return mapBooking(row, tourName);
        })
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateBookingStatus(bookingId: string, status: BookingStatus) {
    const booking = bookings.find((b) => b.id === bookingId);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("bookings") as any)
      .update({ status })
      .eq("id", bookingId);
    if (error) throw error;

    // Keep current_bookings in sync on the tour
    if (booking) {
      // current_bookings sync is handled by a Postgres trigger; skip client-side RPC
    }

    await fetchBookings();
  }

  return { bookings, loading, error, refresh: fetchBookings, updateBookingStatus };
}
