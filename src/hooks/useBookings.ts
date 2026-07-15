"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking, BookingStatus } from "@/types/tour";

function generate4DigitOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function mapBooking(row: Record<string, unknown>, tourName?: string, tourCity?: string, tourCategory?: string, tourCode?: string): Booking {
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
    tourType: row.tour_type as string | undefined,
    hoursRequested: row.hours_requested as number | undefined,
    travellerEmail: traveller?.email,
    tourCity: tourCity ?? "",
    tourCategory: tourCategory ?? "",
    tourCode: tourCode ?? "",
    startOtp: (row.start_otp as string) || undefined,
    endOtp: (row.end_otp as string) || undefined,
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
      .select("*, tours(name, city, category, tour_code), travellers(name, phone, email), start_otp, end_otp")
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setBookings(
        (data ?? []).map((r) => {
          const row = r as Record<string, unknown>;
          const tourRow = row.tours as { name?: string; city?: string; category?: string; tour_code?: string } | null;
          return mapBooking(row, tourRow?.name, tourRow?.city, tourRow?.category, tourRow?.tour_code);
        })
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  async function updateBookingStatus(bookingId: string, status: BookingStatus) {
    // When confirming, generate and store a 4-digit Start OTP
    const updates: Record<string, unknown> = { status };
    if (status === "confirmed") {
      updates.start_otp = generate4DigitOtp();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("bookings") as any)
      .update(updates)
      .eq("id", bookingId);
    if (error) throw error;
    await fetchBookings();
  }

  // Driver enters the Start OTP received from traveller → trip begins
  async function startTrip(bookingId: string, enteredOtp: string): Promise<void> {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.startOtp !== enteredOtp.trim()) throw new Error("Incorrect OTP. Please try again.");
    const endOtp = generate4DigitOtp();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("bookings") as any)
      .update({ status: "ongoing", end_otp: endOtp })
      .eq("id", bookingId);
    if (error) throw error;
    await fetchBookings();
  }

  // Driver enters the End OTP received from traveller → trip ends
  async function endTrip(bookingId: string, enteredOtp: string): Promise<void> {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");
    if (booking.endOtp !== enteredOtp.trim()) throw new Error("Incorrect OTP. Please try again.");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("bookings") as any)
      .update({ status: "completed" })
      .eq("id", bookingId);
    if (error) throw error;
    await fetchBookings();
  }

  return { bookings, loading, error, refresh: fetchBookings, updateBookingStatus, startTrip, endTrip };
}
