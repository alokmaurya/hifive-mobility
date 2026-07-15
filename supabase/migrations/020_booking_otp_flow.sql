-- Migration: OTP-based trip start/end flow
-- Drivers need to update status and OTP fields on their own bookings.

do $$
begin
  -- Allow drivers to read their own bookings
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookings'
      and policyname = 'bookings: driver read own'
  ) then
    execute $policy$
      create policy "bookings: driver read own"
        on public.bookings for select
        using (auth.uid() = driver_id)
    $policy$;
  end if;

  -- Allow drivers to update status and OTP fields on their own bookings
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookings'
      and policyname = 'bookings: driver update own'
  ) then
    execute $policy$
      create policy "bookings: driver update own"
        on public.bookings for update
        using (auth.uid() = driver_id)
        with check (auth.uid() = driver_id)
    $policy$;
  end if;
end;
$$;
