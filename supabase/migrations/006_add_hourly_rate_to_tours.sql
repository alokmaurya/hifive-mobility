-- Migration 006: Add hourly_rate column to tours table
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

alter table public.tours
  add column if not exists hourly_rate numeric(10,2) default 0;
