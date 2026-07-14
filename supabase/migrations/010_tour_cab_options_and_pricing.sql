-- Migration 010: Add tour-level pricing and cab options
-- Replaces per-person model with full-cab pricing

alter table public.tours
  add column if not exists full_cab_price          numeric(10,2) default 0,
  add column if not exists overtime_rate_per_hour  numeric(10,2) default 0,
  add column if not exists is_ac                   boolean default true,
  add column if not exists is_pet_friendly         boolean default false,
  add column if not exists smoking_allowed         boolean default false,
  add column if not exists airport_drop_price      numeric(10,2) default 0,
  add column if not exists railway_drop_price      numeric(10,2) default 0,
  add column if not exists bus_station_drop_price  numeric(10,2) default 0,
  add column if not exists offers_airport_drop     boolean default false,
  add column if not exists offers_railway_drop     boolean default false,
  add column if not exists offers_bus_drop         boolean default false,
  add column if not exists offers_hourly           boolean default true;

-- Backfill full_cab_price from price_per_person for existing tours
update public.tours set full_cab_price = price_per_person where full_cab_price = 0 and price_per_person > 0;
