-- Migration 009: Allow drivers to read traveller details for their own bookings
create policy "travellers: driver read via booking" on public.travellers
  for select using (
    exists (
      select 1 from public.bookings
      where bookings.traveller_id = travellers.id
        and bookings.driver_id = auth.uid()
    )
  );
