-- Migration: OTP-based trip start/end flow
-- Drivers need to update status and OTP fields on their own bookings.

-- Allow drivers to read their own bookings
create policy if not exists "bookings: driver read own"
  on public.bookings for select
  using (auth.uid() = driver_id);

-- Allow drivers to update status and OTP fields on their own bookings
create policy if not exists "bookings: driver update own"
  on public.bookings for update
  using (auth.uid() = driver_id)
  with check (auth.uid() = driver_id);
