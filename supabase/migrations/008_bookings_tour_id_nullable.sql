-- Migration 008: Make tour_id nullable to support flexi bookings (no fixed tour)
alter table public.bookings
  alter column tour_id drop not null;
