-- 1. ESTRUCTURA
drop table if exists public.dashboard_players;

create table if not exists public.dashboard_players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  status text,
  monthly_fee numeric(10,2),
  payment_status text,
  clinic text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. INSERT LIMPIO
insert into public.dashboard_players
(name, email, phone, status, monthly_fee, payment_status, clinic)
values
-- ===== ALTO RENDIMIENTO =====
('Juan Pablo Barriga', null, null, 'Beca', 0, 'NA', 'Alto Rendimiento'),
('Carlos Guzmán', null, null, 'No Activo', null, 'NA', 'Alto Rendimiento'),
('Marianna Olvera', null, null, 'No Activo', null, 'NA', 'Alto Rendimiento'),
('Juan Pablo Feregrino', null, null, 'No Activo', null, 'NA', 'Alto Rendimiento'),
('Julieta Alvarado', null, null, 'No Activo', null, 'NA', 'Alto Rendimiento'),

('Natalia Urbina', null, null, 'Activo', 1350.00, 'Pagado', 'Alto Rendimiento'),
('André Tavera Rueda', null, null, 'Activo', 3000.00, 'Pagado', 'Alto Rendimiento'),
('Ana Sofía Guzmán', null, null, 'Activo', 3239.50, 'Pagado', 'Alto Rendimiento'),
('Valeria Guzmán', null, null, 'Activo', 3239.50, 'Pagado', 'Alto Rendimiento'),
('Valeria María Santiago Rodríguez', null, null, 'Activo', 3600.00, 'Pagado', 'Alto Rendimiento'),
('Juan Pablo Rodríguez', null, null, 'Activo', 4050.00, 'Pagado', 'Alto Rendimiento'),
('Paula Domínguez', null, null, 'Activo', 4200.00, 'Pagado', 'Alto Rendimiento'),
('Julieta Serrano', null, null, 'Activo', 4310.00, 'Pagado', 'Alto Rendimiento'),
('Renata Serrano', null, null, 'Activo', 4310.00, 'Pagado', 'Alto Rendimiento'),
('Vasti Pérez', null, null, 'Activo', 4319.00, 'Pagado', 'Alto Rendimiento'),
('Elías Pérez', null, null, 'Activo', 4319.00, 'Pagado', 'Alto Rendimiento'),
('Natalia Salinas', null, null, 'Activo', 4319.00, 'Pagado', 'Alto Rendimiento'),
('Camila Salinas', null, null, 'Activo', 4319.00, 'Pagado', 'Alto Rendimiento'),
('Patricio Brena', null, null, 'Activo', 5000.00, 'Pagado', 'Alto Rendimiento'),
('Marco Damián', null, null, 'Activo', 5000.00, 'Pagado', 'Alto Rendimiento'),
('Jorge Araiza', null, null, 'Activo', 5399.00, 'Pagado', 'Alto Rendimiento'),
('Luis Victoria', null, null, 'Activo', 5399.00, 'Pagado', 'Alto Rendimiento'),
('Emiliano Flores', null, null, 'Activo', 5999.00, 'Pagado', 'Alto Rendimiento'),
('Uziel Vázquez Vega', null, null, 'Activo', 6999.00, 'Pagado', 'Alto Rendimiento'),
('Sebastián Olmedo Mondragón', null, null, 'Activo', 6999.00, 'Pagado', 'Alto Rendimiento'),
('Eugenio Miranda Moreno', null, null, 'Activo', 6999.00, 'Pagado', 'Alto Rendimiento'),

('Mila Escalona', null, null, 'Activo', 5999.00, 'Pendiente', 'Alto Rendimiento'),
('Nicolás Fuentes', null, null, 'Activo', 2500.00, 'Pendiente', 'Alto Rendimiento'),
('Emilio De La Torre', null, null, 'Activo', 4999.00, 'Pendiente', 'Alto Rendimiento'),
('Rafael López Valencia', null, null, 'Activo', 5000.00, 'Pendiente', 'Alto Rendimiento'),
('Sebastián Fuentes', null, null, 'Activo', 5400.00, 'Pendiente', 'Alto Rendimiento'),
('Ian Kleiman Plaza', null, null, 'Activo', 6000.00, 'Pendiente', 'Alto Rendimiento'),
('Emilio López Guereña', null, null, 'Activo', 6000.00, 'Pendiente', 'Alto Rendimiento'),
('Ricardo Benítez Fraga', null, null, 'Activo', 8000.00, 'Pendiente', 'Alto Rendimiento'),

-- ===== CLÍNICA A =====
('Bianca Mercado', null, null, 'Activo', 1800.00, 'Pagado', 'Clinica A'),
('Allen Mendoza', null, null, 'Activo', 1800.00, 'Pagado', 'Clinica A'),
('Maritza Valencia', null, null, 'Activo', 1800.00, 'Pagado', 'Clinica A'),
('Enrique Vargas Monzón', null, null, 'Activo', 1800.00, 'Pagado', 'Clinica A'),
('Javier García', null, null, 'Activo', 2200.00, 'Pagado', 'Clinica A'),
('Abraham Figueroa', null, null, 'Activo', 2500.00, 'Pagado', 'Clinica A'),
('Alejandro Ramos Verdeja', null, null, 'Activo', 2600.00, 'Pagado', 'Clinica A'),
('Javier Andrade', null, null, 'Activo', 2600.00, 'Pagado', 'Clinica A'),
('David Centeno', null, null, 'Activo', 2600.00, 'Pagado', 'Clinica A'),
('Diego De La Campa', null, null, 'Activo', 2850.00, 'Pagado', 'Clinica A'),
('Ximena Balderas', null, null, 'Activo', 1530.00, 'Pagado', 'Clinica A'),
('Bruno Alvarado', null, null, 'Activo', 2040.00, 'Pagado', 'Clinica A'),

-- ===== CLÍNICA B =====
('Cristina Madera', null, null, 'Activo', 1200.00, 'Pagado', 'Clinica B'),
('Mariana Ramírez', null, null, 'Activo', 1200.00, 'Pagado', 'Clinica B'),
('Rodrigo Pages', null, null, 'Activo', 1200.00, 'Pagado', 'Clinica B'),
('Frida Rendón', null, null, 'Activo', 1200.00, 'Pagado', 'Clinica B'),
('Eric Carrillo', null, null, 'Activo', 1200.00, 'Pagado', 'Clinica B'),
('Luis Vilchis', null, null, 'Activo', 1200.00, 'Pagado', 'Clinica B'),

('Gina Melo', null, null, 'Activo', 300.00, 'Pagado', 'Clinica B'),
('Juan Carlos Gómez', null, null, 'Activo', 300.00, 'Pagado', 'Clinica B'),
('Claudia Yzitia', null, null, 'Activo', 350.00, 'Pagado', 'Clinica B'),
('Elia Herrera', null, null, 'Activo', 375.00, 'Pagado', 'Clinica B'),
('Estefanía Martínez', null, null, 'Activo', 1000.00, 'Pagado', 'Clinica B'),
('Karina Martínez', null, null, 'Activo', 1200.00, 'Pagado', 'Clinica B'),
('Alejandro Jimenez', null, null, 'Activo', 1200.00, 'Pagado', 'Clinica B'),
('Marisol Martínez', null, null, 'Activo', 1800.00, 'Pagado', 'Clinica B'),
('Karlo Alejandro López Mayen', null, null, 'Activo', 2400.00, 'Pagado', 'Clinica B');

-- 3. VALIDACIÓN RÁPIDA
/*
select clinic,
count(*) as jugadores,
sum(monthly_fee) as ingreso
from dashboard_players
where status = 'Activo'
group by clinic;
*/
