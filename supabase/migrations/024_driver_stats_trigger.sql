-- Keeps drivers.rating and drivers.total_tours_run in sync automatically.
-- Runs as SECURITY DEFINER so it sees all bookings regardless of RLS policies,
-- ensuring every traveller reads the same values from the drivers table.

create or replace function sync_driver_stats()
returns trigger as $$
declare
  v_avg_rating  numeric;
  v_trip_count  integer;
begin
  select round(avg(traveller_rating)::numeric, 1)
  into   v_avg_rating
  from   bookings
  where  driver_id = NEW.driver_id
    and  traveller_rating is not null;

  select count(*)
  into   v_trip_count
  from   bookings
  where  driver_id = NEW.driver_id
    and  status    = 'completed';

  update drivers
  set
    rating          = coalesce(v_avg_rating, rating),
    total_tours_run = v_trip_count
  where id = NEW.driver_id;

  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sync_driver_stats on bookings;
create trigger trg_sync_driver_stats
  after insert or update of status, traveller_rating
  on bookings
  for each row
  execute function sync_driver_stats();
