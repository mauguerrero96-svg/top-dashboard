-- Combined Fix Script
-- Run this in Supabase SQL Editor to ensure all necessary tables exist.

-- 1. Table: attendance_checkins
create table if not exists public.attendance_checkins (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.dashboard_players(id) on delete cascade not null,
  check_in_time timestamp with time zone default now(),
  created_by uuid references auth.users(id),
  notes text,
  created_at timestamp with time zone default now()
);

-- RLS for attendance_checkins
alter table public.attendance_checkins enable row level security;
drop policy if exists "Enable read access for all users" on public.attendance_checkins;
create policy "Enable read access for all users" on public.attendance_checkins for select using (true);

drop policy if exists "Enable insert access for all users" on public.attendance_checkins;
create policy "Enable insert access for all users" on public.attendance_checkins for insert with check (true);

drop policy if exists "Enable update access for all users" on public.attendance_checkins;
create policy "Enable update access for all users" on public.attendance_checkins for update using (true);

drop policy if exists "Enable delete access for all users" on public.attendance_checkins;
create policy "Enable delete access for all users" on public.attendance_checkins for delete using (true);

-- Indexes for attendance_checkins
create index if not exists idx_attendance_player on public.attendance_checkins(player_id);
create index if not exists idx_attendance_date on public.attendance_checkins(check_in_time);


-- 2. Table: financial_transactions
create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  amount numeric(10,2) not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  description text,
  payment_method text,
  booking_id uuid references public.bookings(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- RLS for financial_transactions
alter table public.financial_transactions enable row level security;
drop policy if exists "Enable read access for all users" on public.financial_transactions;
create policy "Enable read access for all users" on public.financial_transactions for select using (true);

drop policy if exists "Enable insert access for all users" on public.financial_transactions;
create policy "Enable insert access for all users" on public.financial_transactions for insert with check (true);

drop policy if exists "Enable update access for all users" on public.financial_transactions;
create policy "Enable update access for all users" on public.financial_transactions for update using (true);

drop policy if exists "Enable delete access for all users" on public.financial_transactions;
create policy "Enable delete access for all users" on public.financial_transactions for delete using (true);
