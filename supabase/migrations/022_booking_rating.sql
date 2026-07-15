-- Migration: Traveller rating for completed bookings
alter table public.bookings
  add column if not exists traveller_rating  int  default null
    check (traveller_rating is null or (traveller_rating >= 1 and traveller_rating <= 5)),
  add column if not exists rating_comment    text default null;

-- Travellers can update their own rating on completed bookings
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookings'
      and policyname = 'bookings: traveller rate own'
  ) then
    execute $policy$
      create policy "bookings: traveller rate own"
        on public.bookings for update
        using (auth.uid() = traveller_id)
        with check (auth.uid() = traveller_id)
    $policy$;
  end if;
end;
$$;
