-- Migration: Add tour_code to tours table
-- This stores the human-readable tour identifier, e.g. MABA-X1-DEZIRE-01
-- Run in Supabase SQL Editor

alter table public.tours
  add column if not exists tour_code text default '';

-- Add a unique index (per driver) to prevent accidental duplicates
create unique index if not exists tours_tour_code_unique
  on public.tours (driver_id, tour_code)
  where tour_code <> '';
