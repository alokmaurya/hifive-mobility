-- Support tickets table using plain text columns (no custom enum types)
-- to avoid "type already exists" errors on re-run.

create table if not exists support_tickets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  user_role    text not null check (user_role in ('driver', 'traveller')),
  category     text not null default 'other'
               check (category in ('booking_issue','payment','driver_behaviour','app_bug','account','other')),
  subject      text not null,
  description  text not null,
  status       text not null default 'open'
               check (status in ('open','in_progress','resolved','closed')),
  admin_reply  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Index for fetching a user's own tickets quickly
create index if not exists support_tickets_user_id_idx on support_tickets(user_id);

-- RLS: each user sees and writes only their own tickets
alter table support_tickets enable row level security;

drop policy if exists "users_own_tickets_select" on support_tickets;
create policy "users_own_tickets_select" on support_tickets
  for select using (auth.uid() = user_id);

drop policy if exists "users_own_tickets_insert" on support_tickets;
create policy "users_own_tickets_insert" on support_tickets
  for insert with check (auth.uid() = user_id);

-- Auto-bump updated_at on every update
create or replace function touch_support_ticket()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_support_ticket on support_tickets;
create trigger trg_touch_support_ticket
  before update on support_tickets
  for each row execute function touch_support_ticket();
