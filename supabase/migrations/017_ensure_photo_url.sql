-- Migration: Ensure photo_url exists on drivers table
-- Migration 016 dropped vehicle columns; this guarantees photo_url is present
-- regardless of the order migrations were applied.

alter table public.drivers
  add column if not exists photo_url text default '';
