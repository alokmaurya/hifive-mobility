-- Extend sync_driver_stats to also keep total_guests_hosted current.
-- Uses SECURITY DEFINER so the trigger can aggregate across all rows
-- regardless of the calling user's RLS context.

create or replace function sync_driver_stats()
returns trigger as $$
declare
  v_avg_rating     numeric;
  v_trip_count     integer;
  v_guests_hosted  integer;
begin
  select round(avg(traveller_rating)::numeric, 1)
  into   v_avg_rating
  from   bookings
  where  driver_id = NEW.driver_id
    and  traveller_rating is not null;

  select count(*), coalesce(sum(guest_count), 0)
  into   v_trip_count, v_guests_hosted
  from   bookings
  where  driver_id = NEW.driver_id
    and  status    = 'completed';

  update drivers
  set
    rating              = coalesce(v_avg_rating, rating),
    total_tours_run     = v_trip_count,
    total_guests_hosted = v_guests_hosted
  where id = NEW.driver_id;

  return NEW;
end;
$$ language plpgsql security definer;

-- Recreate the trigger to pick up the new function body
drop trigger if exists trg_sync_driver_stats on bookings;
create trigger trg_sync_driver_stats
  after insert or update of status, traveller_rating, guest_count
  on bookings
  for each row
  execute function sync_driver_stats();
