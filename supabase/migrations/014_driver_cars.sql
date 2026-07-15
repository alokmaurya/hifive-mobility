-- Migration: Driver can own multiple cars
-- Creates driver_cars table and links tours to a specific car

create table if not exists public.driver_cars (
  id                  uuid primary key default gen_random_uuid(),
  driver_id           uuid references public.drivers(id) on delete cascade not null,
  car_brand           text not null default '',
  vehicle_model       text not null default '',
  vehicle_plate       text not null default '',
  vehicle_type        text not null default 'suv',
  vehicle_capacity    int  not null default 4,
  fuel_type           text not null default 'petrol',
  is_ac               boolean not null default true,
  is_pet_friendly     boolean not null default false,
  smoking_allowed     boolean not null default false,
  luggage_capacity_bags int not null default 2,
  cab_photo           text default '',
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

alter table public.driver_cars enable row level security;

create policy "Drivers manage own cars"
  on public.driver_cars for all
  using (auth.uid() = driver_id)
  with check (auth.uid() = driver_id);

-- Link tours to a specific car (nullable for backward compat)
alter table public.tours
  add column if not exists car_id uuid references public.driver_cars(id) on delete set null;
