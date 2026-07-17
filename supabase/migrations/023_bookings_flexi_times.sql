alter table bookings
  add column if not exists flexi_start_time text,
  add column if not exists flexi_end_time   text;
