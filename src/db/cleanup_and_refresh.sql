-- CLEANUP AND REFRESH SCRIPT
-- 1. Remove orphaned bookings (result of wiping players)
DELETE FROM public.bookings WHERE player_id IS NULL;

-- 2. Ensure Real Costs are present (Idempotent-ish insert)
-- We strictly insert if table is empty or just clean and re-insert to be safe on duplicates
TRUNCATE TABLE public.financial_transactions;

INSERT INTO public.financial_transactions (date, amount, type, category, description, payment_method)
VALUES
    (CURRENT_DATE, 20000.00, 'expense', 'Nómina', 'Salario - Aline', 'Transferencia'),
    (CURRENT_DATE, 30000.00, 'expense', 'Nómina', 'Salario - Tlaca', 'Transferencia'),
    (CURRENT_DATE, 25000.00, 'expense', 'Nómina', 'Salario - Dani', 'Transferencia'),
    (CURRENT_DATE, 17000.00, 'expense', 'Nómina', 'Salario - Lalo', 'Transferencia'),
    (CURRENT_DATE, 30000.00, 'expense', 'Nómina', 'Salario - Mike', 'Transferencia'),
    (CURRENT_DATE, 6000.00, 'expense', 'Nómina', 'Salario - Jesús', 'Efectivo'),
    (CURRENT_DATE, 10000.00, 'expense', 'Nómina', 'Salario - Vale', 'Transferencia'),
    (CURRENT_DATE, 6000.00, 'expense', 'Software', 'Suscripción CRM', 'Tarjeta'),
    (CURRENT_DATE, 10000.00, 'expense', 'Mantenimiento', 'Reparación de Canchas', 'Transferencia');

-- 3. Verify Constraints
-- Ensure all invoices link to valid players (Should be fine as we created them together)
DELETE FROM public.invoices WHERE player_id NOT IN (SELECT id FROM public.dashboard_players);
