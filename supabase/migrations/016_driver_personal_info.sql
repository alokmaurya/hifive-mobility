-- Migration: Separate driver personal info from vehicle info
-- All vehicle details now live in driver_cars table (see 014_driver_cars.sql)
-- Drivers table now holds only personal/identity information

-- Add personal info columns
alter table public.drivers
  add column if not exists gender text not null default '',
  add column if not exists aadhar_number text not null default '',
  add column if not exists aadhar_front_url text not null default '',
  add column if not exists aadhar_back_url text not null default '';

-- Drop vehicle columns that are now in driver_cars
alter table public.drivers
  drop column if exists vehicle_model,
  drop column if exists vehicle_plate,
  drop column if exists car_brand,
  drop column if exists vehicle_type,
  drop column if exists vehicle_capacity,
  drop column if exists fuel_type,
  drop column if exists is_ac,
  drop column if exists luggage_capacity_bags,
  drop column if exists is_pet_friendly,
  drop column if exists smoking_allowed,
  drop column if exists cab_photo;
