-- Migration: Tour types (city/outer/flexi), driver availability & new fields
-- Run in Supabase SQL Editor

-- ── 1. DRIVERS: new fields ────────────────────────────────────────────────────
alter table public.drivers
  add column if not exists age                int,
  add column if not exists smoking_allowed    boolean default false,
  add column if not exists car_photo_url      text,
  add column if not exists is_available       boolean default true,
  add column if not exists hourly_rate        numeric(10,2) default 0;

-- ── 2. TOURS: end_time and tour_type ─────────────────────────────────────────
alter table public.tours
  add column if not exists end_time   text default '18:00',
  add column if not exists tour_type  text default 'city_sightseeing';

alter table public.tours
  drop constraint if exists tours_tour_type_check;
alter table public.tours
  add constraint tours_tour_type_check
    check (tour_type in ('city_sightseeing','outer_city_sightseeing','flexi'));

-- ── 3. BOOKINGS: tour_type, hours_requested, hourly_rate ─────────────────────
alter table public.bookings
  add column if not exists tour_type       text default 'city_sightseeing',
  add column if not exists hours_requested int,
  add column if not exists hourly_rate     numeric(10,2);

-- ── 4. RLS: allow travellers to read driver availability ─────────────────────
-- Drivers table is already readable by the driver themselves (own row).
-- Add a policy for all authenticated users to read driver basic info.
drop policy if exists "drivers: public read" on public.drivers;
create policy "drivers: public read" on public.drivers
  for select using (auth.role() = 'authenticated');
