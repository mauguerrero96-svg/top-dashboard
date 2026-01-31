-- Table: coaches
create table if not exists public.coaches (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text,
  image_url text, -- Optional
  created_at timestamp with time zone default now()
);

-- Seed Coaches (only if table is empty or specific logic, but simple insert is fine for init)
-- We use a DO block to avoid duplicates if running multiple times, or just simple inserts if we don't care about IDs.
insert into public.coaches (name, specialty)
select 'Toni Nadal', 'Clay Strategy'
where not exists (select 1 from public.coaches where name = 'Toni Nadal');

insert into public.coaches (name, specialty)
select 'Patrick M.', 'Serve & Volley'
where not exists (select 1 from public.coaches where name = 'Patrick M.');

insert into public.coaches (name, specialty)
select 'Darren C.', 'Mental Game'
where not exists (select 1 from public.coaches where name = 'Darren C.');


-- Table: bookings
-- Stores court reservations
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  court_id text not null, -- 'c1', 'c2', etc.
  player_id uuid references public.dashboard_players(id) on delete set null,
  coach_id uuid references public.coaches(id) on delete set null, -- Reference to coaches table
  title text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  type text not null, -- 'Match', 'Training', 'Classes', 'Tournament'
  status text not null default 'Confirmed', -- 'Confirmed', 'Cancelled'
  price numeric default 0,
  created_at timestamp with time zone default now()
);

-- Indexes for querying by date range
create index if not exists idx_bookings_range on public.bookings(start_time, end_time);
create index if not exists idx_bookings_court on public.bookings(court_id);

-- RLS Policies
alter table public.bookings enable row level security;
alter table public.coaches enable row level security;

create policy "Enable read access for all users" on public.bookings for select using (true);
create policy "Enable insert access for all users" on public.bookings for insert with check (true);
create policy "Enable update access for all users" on public.bookings for update using (true);
create policy "Enable delete access for all users" on public.bookings for delete using (true);

create policy "Enable read access for all users" on public.coaches for select using (true);
-- Assuming coaches are static for now, or editable. Let's allow read only for public? Or all.
create policy "Enable all access for all users" on public.coaches for all using (true) with check (true);
