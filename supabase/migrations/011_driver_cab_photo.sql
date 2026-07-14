-- Migration: Add cab_photo to drivers, extend fuel_type to include hybrid/ev
-- Run in Supabase SQL Editor

alter table public.drivers
  add column if not exists cab_photo text default '';

-- Extend fuel_type to allow hybrid and ev
alter table public.drivers
  drop constraint if exists drivers_fuel_type_check;

alter table public.drivers
  add constraint drivers_fuel_type_check
    check (fuel_type in ('petrol','diesel','cng','hybrid','ev'));
