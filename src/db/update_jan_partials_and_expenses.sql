-- update_jan_partials_and_expenses.sql

-- 1. Partial Payments for Players (Derived from "Notes" with specific quantities)
-- Mila Escalona: Fee 5999, Note 4000 -> Paid 4000
UPDATE dashboard_players 
SET total_paid = 4000, payment_status = 'Pendiente'
WHERE name ILIKE '%Mila Escalona%';

-- 2. Expenses (Egresos) from Spreadsheet
-- "Renta": 47,000 (Pagado)
-- "Aline": 20,000 (Pagado)
-- "Tlaca": 30,000 (Note: 15000) -> Paid 15,000
-- "Dani": 25,000 (Note: 12500) -> Paid 12,500
-- "Lalo": 17,000 (Note: 8500) -> Paid 8,500
-- "Mike": 30,000 (Pagado)
-- "Jesús": 6,000 (Pagado)
-- "Vale": 10,000 (No Note) -> Skipped/Not Paid?
-- "CRM": 6,000 (Pagado)
-- "Reparación de Canchas": 10,000 (Pagado)

INSERT INTO financial_transactions (date, amount, type, category, description, payment_method) VALUES
('2026-01-31', 47000, 'expense', 'Renta', 'Renta Instalaciones', 'Transferencia'),
('2026-01-31', 20000, 'expense', 'Nómina', 'Pago Aline', 'Transferencia'),
('2026-01-31', 15000, 'expense', 'Nómina', 'Pago Tlaca (Parcial)', 'Transferencia'),
('2026-01-31', 12500, 'expense', 'Nómina', 'Pago Dani (Parcial)', 'Transferencia'),
('2026-01-31', 8500, 'expense', 'Nómina', 'Pago Lalo (Parcial)', 'Transferencia'),
('2026-01-31', 30000, 'expense', 'Nómina', 'Pago Mike', 'Transferencia'),
('2026-01-31', 6000, 'expense', 'Nómina', 'Pago Jesús', 'Efectivo'),
('2026-01-31', 6000, 'expense', 'Software', 'Suscripción CRM', 'Tarjeta'),
('2026-01-31', 10000, 'expense', 'Mantenimiento', 'Reparación de Canchas', 'Transferencia');
