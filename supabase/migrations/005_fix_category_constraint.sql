-- Migration 005: Expand tours.category to include new tour types
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- Drop old category check constraint (name may vary — drop both variants)
alter table public.tours
  drop constraint if exists tours_category_check;

-- Also drop any constraint named with the old pattern
do $$
declare
  c text;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.tours'::regclass
      and contype = 'c'
      and conname ilike '%category%'
  loop
    execute format('alter table public.tours drop constraint if exists %I', c);
  end loop;
end $$;

-- Add new constraint that includes legacy categories AND the three new tour types
alter table public.tours
  add constraint tours_category_check check (
    category in (
      'city_sightseeing',
      'outer_city_sightseeing',
      'flexi',
      'heritage',
      'nature',
      'food',
      'adventure',
      'religious',
      'coastal',
      'city'
    )
  );

-- Also drop & recreate the tour_type constraint (migration 003 may not have run)
alter table public.tours
  add column if not exists tour_type text default 'city_sightseeing';

alter table public.tours
  drop constraint if exists tours_tour_type_check;

alter table public.tours
  add constraint tours_tour_type_check check (
    tour_type in ('city_sightseeing', 'outer_city_sightseeing', 'flexi')
  );

-- Add end_time and hourly_rate if missing (migration 003 may not have been applied)
alter table public.tours
  add column if not exists end_time    text default '18:00';

alter table public.tours
  add column if not exists hourly_rate numeric(10,2) default 0;
