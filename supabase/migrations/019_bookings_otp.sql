-- Migration: Add start/end OTP columns to bookings
-- OTPs are generated when a booking is confirmed and shared with the traveller.

alter table public.bookings
  add column if not exists start_otp text default null,
  add column if not exists end_otp   text default null;
