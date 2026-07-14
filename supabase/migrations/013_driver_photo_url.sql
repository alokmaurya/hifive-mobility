-- Migration: Add driver profile photo URL
-- Also ensures cab_photo exists (from 011) and creates storage bucket policy

alter table public.drivers
  add column if not exists photo_url text default '';

-- Ensure cab_photo exists (idempotent with 011)
alter table public.drivers
  add column if not exists cab_photo text default '';

-- ── Storage bucket setup (run manually in Supabase Dashboard → Storage) ───────
-- 1. Create a public bucket named: driver-photos
-- 2. Add the following RLS policy on the bucket:
--
--   Policy name: "Drivers manage own photos"
--   Allowed operations: SELECT, INSERT, UPDATE, DELETE
--   Using expression:  (auth.uid()::text = (storage.foldername(name))[1])
--
-- Or run in SQL Editor:
--
-- insert into storage.buckets (id, name, public)
--   values ('driver-photos', 'driver-photos', true)
--   on conflict do nothing;
--
-- create policy "Drivers manage own photos"
--   on storage.objects for all
--   using ( bucket_id = 'driver-photos' AND auth.uid()::text = (storage.foldername(name))[1] )
--   with check ( bucket_id = 'driver-photos' AND auth.uid()::text = (storage.foldername(name))[1] );
