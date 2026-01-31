-- Script para generar horarios de prueba masivos
-- Asigna horarios aleatorios a los jugadores existentes

-- Limpiar horarios anteriores (opcional, para no duplicar)
truncate table public.player_schedules;

-- Insertar horarios para jugadores de ALTO RENDIMIENTO (Lunes a Viernes 16:00 - 19:00)
insert into public.player_schedules (player_id, day_of_week, start_time, end_time)
select 
  id, 
  day, 
  '16:00', 
  '19:00'
from dashboard_players
cross join (values ('Mon'), ('Tue'), ('Wed'), ('Thu'), ('Fri')) as t(day)
where clinic = 'Alto Rendimiento'
-- Tomar solo los primeros 5 para no saturar si hay muchos
limit 25; 

-- Insertar horarios para CLÍNICA A (Lunes y Miércoles 17:00 - 18:00)
insert into public.player_schedules (player_id, day_of_week, start_time, end_time)
select 
  id, 
  day, 
  '17:00', 
  '18:00'
from dashboard_players
cross join (values ('Mon'), ('Wed')) as t(day)
where clinic = 'Clinica A';

-- Insertar horarios para CLÍNICA B (Martes y Jueves 16:00 - 17:00)
insert into public.player_schedules (player_id, day_of_week, start_time, end_time)
select 
  id, 
  day, 
  '16:00', 
  '17:00'
from dashboard_players
cross join (values ('Tue'), ('Thu')) as t(day)
where clinic = 'Clinica B';

-- Insertar algunos horarios de fin de semana para prueba
insert into public.player_schedules (player_id, day_of_week, start_time, end_time)
select 
  id, 
  'Sat', 
  '09:00', 
  '11:00'
from dashboard_players
where status = 'Activo'
order by random()
limit 5;
