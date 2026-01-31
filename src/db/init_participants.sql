-- Table: booking_participants
-- Join table for many-to-many relationship between bookings and players (for classes/group trainings)
create table if not exists public.booking_participants (
  booking_id uuid references public.bookings(id) on delete cascade,
  player_id uuid references public.dashboard_players(id) on delete cascade,
  primary key (booking_id, player_id)
);

-- RLS Policies
alter table public.booking_participants enable row level security;

create policy "Enable read access for all users" on public.booking_participants for select using (true);
create policy "Enable insert access for all users" on public.booking_participants for insert with check (true);
create policy "Enable delete access for all users" on public.booking_participants for delete using (true);
