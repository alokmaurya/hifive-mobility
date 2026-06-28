-- ============================================================
-- HiFive Tours — Supabase Schema
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/owptoktxkkfzxbecjfwf/sql
-- ============================================================

-- NOTE: In Supabase dashboard, go to Authentication → Settings and
-- disable "Enable email confirmations" for easy testing, OR set up
-- a custom SMTP so confirmation emails actually send.

-- ─────────────────────────────────────────────────────────────
-- 1. DRIVERS (extends auth.users)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.drivers (
  id                    uuid references auth.users(id) on delete cascade primary key,
  name                  text not null default '',
  phone                 text,
  bio                   text default '',
  rating                numeric(3,2) default 5.0,
  total_tours_run       int default 0,
  total_guests_hosted   int default 0,
  years_experience      int default 1,
  vehicle_model         text default '',
  vehicle_plate         text default '',
  vehicle_capacity      int default 4,
  vehicle_type          text default 'suv',
  languages             text[] default '{}',
  specialties           text[] default '{}',
  is_verified           boolean default false,
  created_at            timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 2. TOURS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.tours (
  id                          uuid primary key default gen_random_uuid(),
  driver_id                   uuid references public.drivers(id) on delete cascade not null,
  name                        text not null,
  category                    text not null,
  description                 text default '',
  status                      text default 'draft'
                                check (status in ('draft', 'published', 'paused', 'past')),
  price_per_person            numeric(10,2) not null default 0,
  max_guests                  int default 4,
  start_time                  text default '08:00',
  days_of_week                int[] default '{}',
  estimated_duration_minutes  int default 0,
  current_bookings            int default 0,
  rating                      numeric(3,2),
  review_count                int default 0,
  created_at                  timestamptz default now(),
  updated_at                  timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 3. TOUR STOPS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.tour_stops (
  id                uuid primary key default gen_random_uuid(),
  tour_id           uuid references public.tours(id) on delete cascade not null,
  name              text not null,
  duration_minutes  int not null default 30,
  stop_order        int not null default 1,
  created_at        timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 4. BOOKINGS
-- ─────────────────────────────────────────────────────────────
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  tour_id           uuid references public.tours(id) not null,
  driver_id         uuid references public.drivers(id) not null,
  guest_name        text not null,
  guest_phone       text,
  guest_count       int default 1,
  tour_date         date not null,
  status            text default 'pending'
                      check (status in ('pending', 'confirmed', 'cancelled')),
  total_amount      numeric(10,2) default 0,
  special_requests  text,
  created_at        timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────
alter table public.drivers    enable row level security;
alter table public.tours      enable row level security;
alter table public.tour_stops enable row level security;
alter table public.bookings   enable row level security;

-- Drivers: only own profile
create policy "drivers: own row" on public.drivers
  for all using (auth.uid() = id);

-- Tours: only own tours
create policy "tours: own rows" on public.tours
  for all using (auth.uid() = driver_id);

-- Tour stops: via parent tour ownership
create policy "tour_stops: via tour" on public.tour_stops
  for all using (
    exists (
      select 1 from public.tours
      where tours.id = tour_stops.tour_id
        and tours.driver_id = auth.uid()
    )
  );

-- Bookings: only own (driver) bookings
create policy "bookings: own rows" on public.bookings
  for all using (auth.uid() = driver_id);

-- ─────────────────────────────────────────────────────────────
-- 6. AUTO-CREATE DRIVER PROFILE ON SIGNUP
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.drivers (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
