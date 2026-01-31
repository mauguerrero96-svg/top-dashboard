-- Tabla para horarios específicos de cada jugador
-- Un jugador puede tener múltiples registros (ej. Lunes 16:00, Miércoles 16:00)

create table if not exists public.player_schedules (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.dashboard_players(id) on delete cascade,
  day_of_week text not null, -- 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  start_time time not null,
  end_time time not null,
  created_at timestamp with time zone default now()
);

-- Índices para búsqueda rápida
create index if not exists idx_player_schedules_player_id on public.player_schedules(player_id);
create index if not exists idx_player_schedules_day on public.player_schedules(day_of_week);

-- Comentarios explicativos
comment on column public.player_schedules.day_of_week is 'Día de la semana: Mon, Tue, Wed, Thu, Fri, Sat, Sun';
