-- Migration: Add travellers table, traveller_id to bookings, updated trigger & RLS
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/owptoktxkkfzxbecjfwf/sql

-- ── 1. TRAVELLERS TABLE ───────────────────────────────────────────────────────
create table if not exists public.travellers (
  id         uuid references auth.users(id) on delete cascade primary key,
  name       text not null default '',
  phone      text,
  email      text,
  created_at timestamptz default now()
);

alter table public.travellers enable row level security;

create policy "travellers: own row" on public.travellers
  for all using (auth.uid() = id);

-- ── 2. ADD traveller_id TO BOOKINGS ──────────────────────────────────────────
alter table public.bookings
  add column if not exists traveller_id uuid references public.travellers(id);

-- ── 3. UPDATE BOOKINGS RLS ───────────────────────────────────────────────────
-- Travellers can read their own bookings
create policy "bookings: traveller read own" on public.bookings
  for select using (auth.uid() = traveller_id);

-- Travellers can insert bookings (with their traveller_id)
create policy "bookings: traveller insert" on public.bookings
  for insert with check (auth.uid() = traveller_id);

-- Travellers can cancel (update status) their own pending bookings
create policy "bookings: traveller update own" on public.bookings
  for update using (auth.uid() = traveller_id);

-- ── 4. PUBLISHED TOURS READABLE BY ALL AUTHENTICATED USERS ───────────────────
-- The existing "tours: own rows" policy covers drivers.
-- This adds a separate SELECT policy so travellers can see published tours.
create policy "tours: read published" on public.tours
  for select using (status = 'published');

-- ── 5. TOUR STOPS READABLE FOR PUBLISHED TOURS ───────────────────────────────
create policy "tour_stops: read via published tour" on public.tour_stops
  for select using (
    exists (
      select 1 from public.tours
      where tours.id = tour_stops.tour_id
        and tours.status = 'published'
    )
  );

-- ── 6. UPDATE TRIGGER TO SUPPORT user_type ───────────────────────────────────
-- Traveller signup passes options.data.user_type = 'traveller'
-- Driver signup omits user_type (defaults to 'driver')
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data->>'user_type', 'driver') = 'traveller' then
    insert into public.travellers (id, name, email)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', ''),
      new.email
    );
  else
    insert into public.drivers (id, name)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'name', '')
    );
  end if;
  return new;
end;
$$;
