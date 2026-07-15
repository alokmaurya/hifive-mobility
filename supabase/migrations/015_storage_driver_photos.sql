-- Migration: Create driver-photos storage bucket with RLS
-- Run this in Supabase SQL Editor

-- Create the public storage bucket (idempotent)
insert into storage.buckets (id, name, public)
  values ('driver-photos', 'driver-photos', true)
  on conflict (id) do update set public = true;

-- Drop existing policies if any (idempotent)
drop policy if exists "Drivers manage own photos" on storage.objects;
drop policy if exists "Public read driver photos" on storage.objects;

-- Allow drivers to upload/update/delete their own photos (files under their user-id folder)
create policy "Drivers manage own photos"
  on storage.objects for all
  using (
    bucket_id = 'driver-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'driver-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow anyone to read (public bucket, but explicit SELECT policy is safer)
create policy "Public read driver photos"
  on storage.objects for select
  using (bucket_id = 'driver-photos');
