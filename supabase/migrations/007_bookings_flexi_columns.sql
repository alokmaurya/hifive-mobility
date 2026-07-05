-- Migration 007: Ensure flexi booking columns exist on bookings table
-- (Migration 003 may not have been applied in all environments)

alter table public.bookings
  add column if not exists tour_type      text,
  add column if not exists hours_requested int,
  add column if not exists hourly_rate    numeric(10,2);
