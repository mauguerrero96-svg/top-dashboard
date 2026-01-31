-- Table: attendance_checkins
-- Logs when a player attends a training session
create table if not exists public.attendance_checkins (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.dashboard_players(id) on delete cascade not null,
  check_in_time timestamp with time zone default now(),
  created_by uuid references auth.users(id), -- Optional: who checked them in
  notes text, -- e.g. "Late arrival", "Forgot uniform"
  created_at timestamp with time zone default now()
);

-- RLS
alter table public.attendance_checkins enable row level security;

create policy "Enable read access for all users" on public.attendance_checkins for select using (true);
create policy "Enable insert access for all users" on public.attendance_checkins for insert with check (true);
create policy "Enable update access for all users" on public.attendance_checkins for update using (true);
create policy "Enable delete access for all users" on public.attendance_checkins for delete using (true);

-- Index for fast history lookup
create index if not exists idx_attendance_player on public.attendance_checkins(player_id);
create index if not exists idx_attendance_date on public.attendance_checkins(check_in_time);
