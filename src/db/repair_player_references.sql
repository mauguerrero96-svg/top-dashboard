-- REPAIR SCRIPT for player_schedules Foreign Key
-- Since we kept 'dashboard_players' as the main table, we must ensure player_schedules references it, not 'players'.

-- 1. Drop incorrect constraint (pointing to 'players')
alter table if exists public.player_schedules
drop constraint if exists player_schedules_player_id_fkey;

-- 2. Add correct constraint (pointing to 'dashboard_players')
alter table if exists public.player_schedules
add constraint player_schedules_player_id_fkey
foreign key (player_id) references public.dashboard_players(id)
on delete cascade;

-- 3. Also fix booking_participants if needed (just in case it was also migrated)
alter table if exists public.booking_participants
drop constraint if exists booking_participants_player_id_fkey;

alter table if exists public.booking_participants
add constraint booking_participants_player_id_fkey
foreign key (player_id) references public.dashboard_players(id)
on delete cascade;
