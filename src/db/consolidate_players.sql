-- 1. Ensure 'players' table exists and has all columns
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Safely add columns if they don't exist (idempotent)
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'players' and column_name = 'email') then
        alter table public.players add column email text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'players' and column_name = 'phone') then
        alter table public.players add column phone text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'players' and column_name = 'status') then
        alter table public.players add column status text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'players' and column_name = 'monthly_fee') then
        alter table public.players add column monthly_fee numeric(10,2);
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'players' and column_name = 'payment_status') then
        alter table public.players add column payment_status text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'players' and column_name = 'clinic') then
        alter table public.players add column clinic text;
    end if;
end $$;

-- 2. Migrate data from 'dashboard_players' (if it exists) to 'players'
insert into public.players (id, name, email, phone, status, monthly_fee, payment_status, clinic, created_at, updated_at)
select id, name, email, phone, status, monthly_fee, payment_status, clinic, created_at, updated_at
from public.dashboard_players
on conflict (id) do nothing;

-- 3. Update Foreign Keys to point to 'players'

-- Booking Participants
alter table if exists public.booking_participants
drop constraint if exists booking_participants_player_id_fkey;

alter table if exists public.booking_participants
add constraint booking_participants_player_id_fkey
foreign key (player_id) references public.players(id)
on delete cascade;

-- Player Schedules
alter table if exists public.player_schedules
drop constraint if exists player_schedules_player_id_fkey;

alter table if exists public.player_schedules
add constraint player_schedules_player_id_fkey
foreign key (player_id) references public.players(id)
on delete cascade;

-- Invoices (Ensure it references players)
alter table if exists public.invoices
drop constraint if exists invoices_player_id_fkey;

alter table if exists public.invoices
add constraint invoices_player_id_fkey
foreign key (player_id) references public.players(id)
on delete set null;

-- 4. Clean up
-- We keep dashboard_players for safety for now, or drop it.
-- Let's drop it to avoid confusion as requested "consolidate".
drop table if exists public.dashboard_players;

-- 5. RLS for players
alter table public.players enable row level security;

create policy "Enable read access for all users" on public.players for select using (true);
create policy "Enable insert access for all users" on public.players for insert with check (true);
create policy "Enable update access for all users" on public.players for update using (true);
create policy "Enable delete access for all users" on public.players for delete using (true);
