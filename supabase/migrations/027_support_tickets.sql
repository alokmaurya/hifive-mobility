create type if not exists support_ticket_status as enum ('open', 'in_progress', 'resolved', 'closed');
create type if not exists support_ticket_category as enum (
  'booking_issue', 'payment', 'driver_behaviour', 'app_bug', 'account', 'other'
);
create type if not exists support_user_role as enum ('driver', 'traveller');

create table if not exists support_tickets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null,
  user_role    support_user_role not null,
  category     support_ticket_category not null default 'other',
  subject      text not null,
  description  text not null,
  status       support_ticket_status not null default 'open',
  admin_reply  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- RLS: users can only read/write their own tickets
alter table support_tickets enable row level security;

create policy "users_own_tickets_select" on support_tickets
  for select using (auth.uid() = user_id);

create policy "users_own_tickets_insert" on support_tickets
  for insert with check (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function touch_support_ticket()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_touch_support_ticket
  before update on support_tickets
  for each row execute function touch_support_ticket();
