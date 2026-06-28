-- Migration: Add vehicle details to drivers and city/state/country to tours
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/owptoktxkkfzxbecjfwf/sql

-- ── drivers: new vehicle fields ───────────────────────────────────────────────
alter table public.drivers
  add column if not exists car_brand             text default '',
  add column if not exists fuel_type             text default 'petrol',
  add column if not exists is_ac                 boolean default true,
  add column if not exists luggage_capacity_bags int default 2,
  add column if not exists is_pet_friendly       boolean default false;

-- Backfill + add check constraints (safe even if column already existed)
update public.drivers set fuel_type = 'petrol' where fuel_type is null;
alter table public.drivers
  drop constraint if exists drivers_fuel_type_check;
alter table public.drivers
  add constraint drivers_fuel_type_check
    check (fuel_type in ('petrol','diesel','cng'));

alter table public.drivers
  drop constraint if exists drivers_vehicle_type_check;
alter table public.drivers
  add constraint drivers_vehicle_type_check
    check (vehicle_type in ('hatchback','sedan','suv','van','tempo'));

-- ── tours: city / state / country ────────────────────────────────────────────
alter table public.tours
  add column if not exists city    text default '',
  add column if not exists state   text default '',
  add column if not exists country text default 'India';
