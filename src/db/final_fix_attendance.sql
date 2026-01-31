-- Definitive Fix for Attendance Checkins
-- Run this in Supabase SQL Editor.

-- 1. Clean Slate for Attendance Table
drop table if exists public.attendance_checkins cascade;

-- 2. Create Table referenced to 'dashboard_players' (which we confirmed exists)
create table public.attendance_checkins (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.dashboard_players(id) on delete cascade not null,
  check_in_time timestamp with time zone default now(),
  created_by uuid references auth.users(id),
  notes text,
  created_at timestamp with time zone default now()
);

-- 3. Reset RLS (Row Level Security)
alter table public.attendance_checkins enable row level security;
drop policy if exists "Enable read access for all users" on public.attendance_checkins;
-- Allow ALL access (Read, Write) to ensure the API can use it
create policy "Allow All Access" on public.attendance_checkins for all using (true) with check (true);

-- 4. Create Indexes
create index idx_attendance_player on public.attendance_checkins(player_id);
create index idx_attendance_date on public.attendance_checkins(check_in_time);

-- 5. Verification Data (Insert 1 dummy check-in for the first active player found)
do $$
declare
  v_player_id uuid;
begin
  select id into v_player_id from public.dashboard_players limit 1;
  
  if v_player_id is not null then
    insert into public.attendance_checkins (player_id, notes, check_in_time)
    values (v_player_id, 'Test Check-in System', now());
  end if;
end $$;
