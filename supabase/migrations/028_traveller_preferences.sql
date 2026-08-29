-- Migration 028: Add preferences, food habits, interests, and travel profile fields to travellers table
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/owptoktxkkfzxbecjfwf/sql

alter table public.travellers
  add column if not exists interests text[] default '{}',
  add column if not exists food_preference text default 'No Preference',
  add column if not exists dietary_notes text default '',
  add column if not exists preferred_language text default '',
  add column if not exists city text default '',
  add column if not exists emergency_contact text default '',
  add column if not exists bio text default '';
