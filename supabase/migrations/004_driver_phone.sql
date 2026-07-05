-- Migration 004: Add phone field to drivers
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

alter table public.drivers
  add column if not exists phone text default null;
