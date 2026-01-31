-- overwrite_jan_2026_data.sql

-- 1. Reset/Clear Existing Payment Info (January Clean Slate)
-- We reset fee and total_paid to 0 for everyone first to avoid stale data.
UPDATE dashboard_players
SET monthly_fee = 0, total_paid = 0, payment_status = 'Pendiente', status = 'Inactivo';

-- 2. Clean up Financial Transactions for January (to avoid duplicates)
DELETE FROM financial_transactions 
WHERE date >= '2026-01-01' AND date <= '2026-01-31';

DELETE FROM player_payments
WHERE date >= '2026-01-01' AND date <= '2026-01-31';

-- 3. Update Players (Logic: Monto = Fee, Nota = Paid Logic)
-- Helper function logic (applied manually below):
-- If Note = 'Pagado' -> total_paid = monthly_fee, status = 'Pagado'
-- If Note = 'Beca' -> monthly_fee = 0, status = 'Beca'
-- If Note = NUMBER -> total_paid = NUMBER
-- If Note = Blank/'NA' -> total_paid = 0

-- --- Alto Rendimiento ---
-- Becas / NA
UPDATE dashboard_players SET status = 'Beca', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Juan Pablo Barriga%';
UPDATE dashboard_players SET status = 'No Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Carlos Guzmán%';
UPDATE dashboard_players SET status = 'No Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Marianna Olvera%';
UPDATE dashboard_players SET status = 'No Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Juan Pablo Feregrino%';
UPDATE dashboard_players SET status = 'No Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Julieta Alvarado%';

-- Paid Players (Alto Rendimiento)
UPDATE dashboard_players SET monthly_fee = 1350, total_paid = 1350, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Natalia Urbina%';
UPDATE dashboard_players SET monthly_fee = 3000, total_paid = 3000, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%André Tavera Rueda%';
UPDATE dashboard_players SET monthly_fee = 3239.50, total_paid = 3239.50, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Ana Sofia Guzmán%';
UPDATE dashboard_players SET monthly_fee = 3239.50, total_paid = 3239.50, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Valeria Guzmán%';
UPDATE dashboard_players SET monthly_fee = 3600, total_paid = 3600, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Valeria María Santiago%';
UPDATE dashboard_players SET monthly_fee = 4050, total_paid = 4050, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Juan Pablo Rodriguez%';
UPDATE dashboard_players SET monthly_fee = 4200, total_paid = 4200, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Paula Dominguez%';
UPDATE dashboard_players SET monthly_fee = 4310, total_paid = 4310, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Julieta Serrano%';
UPDATE dashboard_players SET monthly_fee = 4310, total_paid = 4310, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Renata Serrano%';
UPDATE dashboard_players SET monthly_fee = 4319, total_paid = 4319, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Vasti Pérez%';
UPDATE dashboard_players SET monthly_fee = 4319, total_paid = 4319, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Elias Pérez%';
UPDATE dashboard_players SET monthly_fee = 4319, total_paid = 4319, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Natalia Salinas%';
UPDATE dashboard_players SET monthly_fee = 4319, total_paid = 4319, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Camila Salinas%';
UPDATE dashboard_players SET monthly_fee = 5000, total_paid = 5000, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Patricio Brena%';
UPDATE dashboard_players SET monthly_fee = 5000, total_paid = 5000, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Marco Damián%';
UPDATE dashboard_players SET monthly_fee = 5399, total_paid = 5399, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Jorge Araiza%';
UPDATE dashboard_players SET monthly_fee = 5399, total_paid = 5399, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Luis Victoria%';
UPDATE dashboard_players SET monthly_fee = 5999, total_paid = 5999, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Emiliano Flores%';
UPDATE dashboard_players SET monthly_fee = 6999, total_paid = 6999, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Uziel Vázquez Vega%';
UPDATE dashboard_players SET monthly_fee = 6999, total_paid = 6999, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Sebastián Olmedo%';
UPDATE dashboard_players SET monthly_fee = 6999, total_paid = 6999, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Eugenia Miranda Moreno%';
UPDATE dashboard_players SET monthly_fee = 4500, total_paid = 4500, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Otto Cabrera%';
UPDATE dashboard_players SET monthly_fee = 5399, total_paid = 5399, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Renata González%';
UPDATE dashboard_players SET monthly_fee = 6999, total_paid = 6999, payment_status = 'Pagado', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Eugenio Gómez Reyes%';

-- Partial / Pending (Alto Rendimiento)
UPDATE dashboard_players SET monthly_fee = 5999, total_paid = 4000, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Mila Escalona%';
UPDATE dashboard_players SET monthly_fee = 2500, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Nicolás Fuentes%';
UPDATE dashboard_players SET monthly_fee = 4999, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Emilio De La Torre%';
UPDATE dashboard_players SET monthly_fee = 5000, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Rafael López Valencia%';
UPDATE dashboard_players SET monthly_fee = 4050, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Emilio Laporte%';
UPDATE dashboard_players SET monthly_fee = 5400, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Sebastián Fuentes%';
UPDATE dashboard_players SET monthly_fee = 6000, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Ian Kleiman%';
UPDATE dashboard_players SET monthly_fee = 6000, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Emilia López Guereña%';
UPDATE dashboard_players SET monthly_fee = 8000, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Alto Rendimiento' WHERE name ILIKE '%Ricardo Benítez Fraga%';


-- --- Clínica Lalo ---
-- Paid
UPDATE dashboard_players SET monthly_fee = 1800, total_paid = 1800, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Bianca Mercado%';
UPDATE dashboard_players SET monthly_fee = 1800, total_paid = 1800, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Allen Mendoza%';
UPDATE dashboard_players SET monthly_fee = 1800, total_paid = 1800, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Maritza Valencia%';
UPDATE dashboard_players SET monthly_fee = 1800, total_paid = 1800, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Enrique Vargas%';
UPDATE dashboard_players SET monthly_fee = 2200, total_paid = 2200, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Javier García%';
UPDATE dashboard_players SET monthly_fee = 2500, total_paid = 2500, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Abraham Figueroa%';
UPDATE dashboard_players SET monthly_fee = 2600, total_paid = 2600, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Alejandro Ramos%';
UPDATE dashboard_players SET monthly_fee = 2600, total_paid = 2600, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Javier Andrade%';
UPDATE dashboard_players SET monthly_fee = 2600, total_paid = 2600, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%David Centeno%';
UPDATE dashboard_players SET monthly_fee = 2850, total_paid = 2850, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Diego De La Campa%';
UPDATE dashboard_players SET monthly_fee = 1530, total_paid = 1530, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Ximena Balderas%';
UPDATE dashboard_players SET monthly_fee = 2040, total_paid = 2040, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica A' WHERE name ILIKE '%Bruno Alvarado%';

-- Inactive / No Fee
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica A' WHERE name ILIKE '%Dario Rosales%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica A' WHERE name ILIKE '%Johana%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica A' WHERE name ILIKE '%Ana Araiza%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica A' WHERE name ILIKE '%Danahe Lazcano%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica A' WHERE name ILIKE '%Xavier Gómez%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica A' WHERE name ILIKE '%Audrey Navarrete%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica A' WHERE name ILIKE '%Alejandro Navarro%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica A' WHERE name ILIKE '%Aline Esposa Abraham%';

-- --- Clínica Dani ---
-- Paid
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 1200, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Cristina Madera%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 1200, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Mariana Ramirez%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 1200, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Rodrigo Pages%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 1200, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Frida Rendón%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 1200, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Eric Carrillo%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 1200, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Luis Vilchis%';
UPDATE dashboard_players SET monthly_fee = 2400, total_paid = 2400, payment_status = 'Pagado', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Karlo Alejandro%';

-- Inactive / No Fee
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica B' WHERE name ILIKE '%Paola Topete%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica B' WHERE name ILIKE '%Arturo Gómez%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica B' WHERE name ILIKE '%Carlos Lee%';
UPDATE dashboard_players SET status = 'Inactivo', clinic = 'Clinica B' WHERE name ILIKE '%Teresa Talavera%';

-- Pending (Clínica Dani)
UPDATE dashboard_players SET monthly_fee = 300, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Gina Melo%';
UPDATE dashboard_players SET monthly_fee = 300, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Juan Carlos Gómez%';
UPDATE dashboard_players SET monthly_fee = 350, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Claudia Yzitia%';
UPDATE dashboard_players SET monthly_fee = 375, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Elia Herrera%';
UPDATE dashboard_players SET monthly_fee = 600, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Carolina Noguez%';
UPDATE dashboard_players SET monthly_fee = 1000, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Estefania Martinez%';
UPDATE dashboard_players SET monthly_fee = 1000, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Anali Nuñez%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Karina Martinez%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Alejandro Jimenez%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Juan Pablo Kuri%';
UPDATE dashboard_players SET monthly_fee = 1200, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Sofía Lepine%';
UPDATE dashboard_players SET monthly_fee = 1380, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Carmen Hernández%';
UPDATE dashboard_players SET monthly_fee = 1380, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Luis Alfonso Castillo%';
UPDATE dashboard_players SET monthly_fee = 1800, total_paid = 0, payment_status = 'Pendiente', status = 'Activo', clinic = 'Clinica B' WHERE name ILIKE '%Marisol Martínez%';

-- 4. Sync Player Payments (Create ledger entries from player status)
INSERT INTO player_payments (player_id, amount, date, notes)
SELECT id, total_paid, '2026-01-31', 'Mensualidad Enero'
FROM dashboard_players
WHERE total_paid > 0 AND total_paid IS NOT NULL;

-- 5. Re-Insert Expenses (Egresos)
INSERT INTO financial_transactions (date, amount, type, category, description, payment_method) VALUES
('2026-01-31', 47000, 'expense', 'Renta', 'Renta Instalaciones', 'Transferencia'),
('2026-01-31', 20000, 'expense', 'Nómina', 'Pago Aline', 'Transferencia'),
('2026-01-31', 15000, 'expense', 'Nómina', 'Pago Tlaca (Parcial)', 'Transferencia'),
('2026-01-31', 12500, 'expense', 'Nómina', 'Pago Dani (Parcial)', 'Transferencia'),
('2026-01-31', 8500, 'expense', 'Nómina', 'Pago Lalo (Parcial)', 'Transferencia'),
('2026-01-31', 30000, 'expense', 'Nómina', 'Pago Mike', 'Transferencia'),
('2026-01-31', 6000, 'expense', 'Nómina', 'Pago Jesús', 'Efectivo'),
('2026-01-31', 10000, 'expense', 'Mantenimiento', 'Vale?', 'Desconocido'), 
('2026-01-31', 6000, 'expense', 'Software', 'Suscripción CRM', 'Tarjeta'),
('2026-01-31', 10000, 'expense', 'Mantenimiento', 'Reparación de Canchas', 'Transferencia');
