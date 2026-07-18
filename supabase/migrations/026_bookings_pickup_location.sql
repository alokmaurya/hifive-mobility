alter table bookings
  add column if not exists pickup_address text,
  add column if not exists pickup_lat     double precision,
  add column if not exists pickup_lng     double precision;
