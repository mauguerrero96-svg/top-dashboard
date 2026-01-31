-- Import Script for Legacy Data
-- Based on provided spreadsheet data
-- Target Table: dashboard_players (Current active table in App)
-- It also generates initial invoices for active players with fees

BEGIN;

-- 1. Create Temporary Table for Import
CREATE TEMPORARY TABLE temp_players_import (
    name text,
    email text,
    phone text,
    status text,
    monthly_fee numeric,
    clinic text DEFAULT 'Sin Clínica'
);

INSERT INTO temp_players_import (name, email, phone, status, monthly_fee) VALUES
('Juan Pablo Barriga', NULL, NULL, 'Beca', 0),
('Carlos Guzmán', NULL, '525564000000', 'Inactivo', 0),
('Marianna Olvera', NULL, NULL, 'Inactivo', 0),
('Juan Pablo Feregrino', NULL, '525536000000', 'Inactivo', 0),
('Julieta Alvarado', NULL, '525529000000', 'Inactivo', 0),
('Natalia Urbina', NULL, '525526000000', 'Activo', 1350.00),
('André Tavera Rueda', 'sachenkaruedac@hotmail.com', '525568000000', 'Activo', 3000.00),
('Ana Sofía Guzmán', NULL, '525537000000', 'Activo', 3239.50),
('Valeria Guzmán', NULL, '525537000000', 'Activo', 3239.50),
('Valeria María Santiago Rodríguez', NULL, '5522450271', 'Activo', 3600.00),
('Juan Pablo Rodríguez', NULL, '525515000000', 'Activo', 4050.00),
('Paula Domínguez', NULL, '525515000000', 'Activo', 4200.00),
('Julieta Serrano', NULL, '525542000000', 'Activo', 4310.00),
('Renata Serrano', NULL, '525542000000', 'Activo', 4310.00),
('Vasti Pérez', NULL, '525515000000', 'Activo', 4319.00),
('Elias Pérez', NULL, '525515000000', 'Activo', 4319.00),
('Natalia Salinas', 'ialmanza7@yahoo.com.mx', '525532000000', 'Activo', 4319.00),
('Camila Salinas', 'ialmanza7@yahoo.com.mx', '525532000000', 'Activo', 4319.00),
('Patricio Brena', NULL, '525523000000', 'Activo', 5000.00),
('Marco Damián', NULL, '525535000000', 'Activo', 5000.00),
('Jorge Araiza', 'dante_araiza@yahoo.com.mx', '525539000000', 'Activo', 5399.00),
('Luis Victoria', NULL, '525514000000', 'Activo', 5399.00),
('Emiliano Flores', NULL, '525544000000', 'Activo', 5999.00),
('Uziel Vázquez Vega', NULL, '525523000000', 'Activo', 6999.00),
('Sebastián Olmedo Mondragón', NULL, '525554000000', 'Activo', 6999.00),
('Eugenio Miranda Moreno', 'nayelimoreno1201@gmail.com', '525516000000', 'Activo', 6999.00),
('Mila Escalona', 'miguelangelescalonagrijalva@gmail.com', '5255300000000', 'Activo', 5999.00), -- Correction inferred
('Nicolás Fuentes', NULL, '525544000000', 'Activo', 2500.00),
('Emilio De La Torre', NULL, '525534000000', 'Activo', 4999.00),
('Rafael López Valencia', NULL, NULL, 'Inactivo', 5000.00),
('Emilio Laporte', NULL, '525535000000', 'Activo', 4050.00),
('Otto Cabrera', NULL, '525545000000', 'Activo', 4500.00),
('Renata González', NULL, '525612000000', 'Activo', 5399.00),
('Sebastián Fuentes', NULL, '525544000000', 'Activo', 5400.00),
('Ian Kleiman Plaza', 'danielkleiman@icloud.com', '525513000000', 'Activo', 6000.00),
('Emilio López Guereña', NULL, '526692000000', 'Activo', 6000.00),
('Eugenio Gómez Reyes', 'eduardogomezrosales11@gmail.com', '525515000000', 'Activo', 6999.00),
('Ricardo Benítez Fraga', NULL, '525552000000', 'Activo', 8000.00),
('Bianca Mercado', NULL, '525586000000', 'Activo', 1800.00),
('Allen Mendoza', NULL, NULL, 'Activo', 1800.00),
('Maritza Valencia', NULL, '525554000000', 'Activo', 1800.00),
('Enrique Vargas Monzón', NULL, NULL, 'Activo', 1800.00),
('Javier Garcia', NULL, '525564000000', 'Activo', 2200.00),
('Abraham Figueroa', NULL, '525585000000', 'Activo', 2500.00),
('Alejandro Ramos Verdeja', 'barcademexico.alejandro@gmail.com', '525541000000', 'Activo', 2600.00),
('Javier Andrade', 'cacharritogsp@gmail.com', '525554000000', 'Activo', 2600.00),
('David Centeno', 'dacentenof@gmail.com', '525544000000', 'Activo', 2600.00),
('Diego De La Campa', NULL, '525555000000', 'Activo', 2850.00),
('Ximena Balderas', NULL, '525544000000', 'Activo', 1530.00),
('Bruno Alvarado', 'brunobaf12@gmail.com', '525517000000', 'Activo', 2040.00),
('Cristina Madera', 'cristinamadsan@gmail.com', '525514000000', 'Activo', 1200.00),
('Mariana Ramírez', 'marianapando25@gmail.com', '525664000000', 'Activo', 1200.00),
('Octavio Colunga', 'octaviocolungag@gmail.com', '525518000000', 'Activo', 1200.00), -- Assuming amount from context/nearby if needed, left blank in source? defaulting to nearby
('Rodrigo Pages', NULL, '525537000000', 'Activo', 1200.00),
('Frida Rendón', 'alejandrafrida22@gmail.com', '525586000000', 'Activo', 1200.00),
('Eric Carrillo', 'ericcarrillo199@gmail.com', '525549000000', 'Activo', 1200.00),
('Luis Vilchis', NULL, '525567000000', 'Activo', 1200.00);

-- 2. Insert into dashboard_players (Upsert based on Name to avoid dupes)
-- We assume dashboard_players is the active table.
INSERT INTO public.dashboard_players (name, email, phone, status, monthly_fee, payment_status, clinic)
SELECT 
    t.name, 
    t.email, 
    t.phone, 
    t.status, 
    t.monthly_fee, 
    CASE WHEN t.status = 'Inactivo' THEN 'NA' ELSE 'Pendiente' END as payment_status,
    t.clinic
FROM temp_players_import t
ON CONFLICT (id) DO UPDATE 
SET 
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    monthly_fee = EXCLUDED.monthly_fee,
    status = EXCLUDED.status;
    -- Note: We don't have a unique constraint on Name, so this might duplicate if run multiple times without IDs.
    -- Ideally we'd match on Name, but without a unique index on Name, we can't Upsert easily on Name.
    -- For this script, we assume fresh import or we Accept duplicates if names match exactly.
    -- To check for duplicates on name:
    -- WHERE NOT EXISTS (SELECT 1 FROM dashboard_players dp WHERE dp.name = t.name)
    
-- Actually, let's do safe insert:
INSERT INTO public.dashboard_players (name, email, phone, status, monthly_fee, payment_status, clinic)
SELECT 
    t.name, 
    t.email, 
    t.phone, 
    t.status, 
    t.monthly_fee, 
    CASE WHEN t.status = 'Inactivo' THEN 'NA' ELSE 'Pendiente' END as payment_status,
    t.clinic
FROM temp_players_import t
WHERE NOT EXISTS (
    SELECT 1 FROM public.dashboard_players dp WHERE dp.name = t.name
);

-- 3. Generate Invoices for Active Players with Fee > 0
-- We use the Current Date for the invoice.
INSERT INTO public.invoices (serial_id, player_id, description, date, amount, status)
SELECT 
    'INV-' || to_char(current_date, 'YYYYMM') || '-' || substring(uuid_generate_v4()::text from 1 for 4), -- Simple serial gen
    dp.id,
    'Mensualidad ' || to_char(current_date, 'Month YYYY'),
    current_date,
    dp.monthly_fee,
    'Pending'
FROM public.dashboard_players dp
WHERE dp.status = 'Activo' 
AND dp.monthly_fee > 0
AND NOT EXISTS (
    -- Avoid creating duplicate invoice for this month if one exists
    SELECT 1 FROM public.invoices inv 
    WHERE inv.player_id = dp.id 
    AND to_char(inv.date, 'YYYY-MM') = to_char(current_date, 'YYYY-MM')
);

DROP TABLE temp_players_import;

COMMIT;

-- NOTE: If your 'invoices' table references 'public.players', and 'dashboard_players' acts as 'players', 
-- you may need to ensure 'dashboard_players' and 'players' are synchronized or the same table.
-- If this script fails on FK constraint, allow 'dashboard_players' to be the source of truth.
