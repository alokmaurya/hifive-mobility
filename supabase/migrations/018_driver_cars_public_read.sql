-- Migration: Allow travellers (any authenticated user) to read driver_cars
-- The existing policy only allows drivers to manage their own cars.
-- Travellers need SELECT access to display car details on the explore page.

create policy "Public read driver cars"
  on public.driver_cars for select
  using (true);
