-- IMPORT REAL COSTS (EXPENSES)
-- Inserts payroll and operational costs into financial_transactions

INSERT INTO public.financial_transactions (date, amount, type, category, description, payment_method)
VALUES
    -- Nómina (Salaries)
    (CURRENT_DATE, 20000.00, 'expense', 'Nómina', 'Salario - Aline', 'Transferencia'),
    (CURRENT_DATE, 30000.00, 'expense', 'Nómina', 'Salario - Tlaca', 'Transferencia'),
    (CURRENT_DATE, 25000.00, 'expense', 'Nómina', 'Salario - Dani', 'Transferencia'),
    (CURRENT_DATE, 17000.00, 'expense', 'Nómina', 'Salario - Lalo', 'Transferencia'),
    (CURRENT_DATE, 30000.00, 'expense', 'Nómina', 'Salario - Mike', 'Transferencia'),
    (CURRENT_DATE, 6000.00, 'expense', 'Nómina', 'Salario - Jesús', 'Efectivo'),
    (CURRENT_DATE, 10000.00, 'expense', 'Nómina', 'Salario - Vale', 'Transferencia'),

    -- Software & Servicios
    (CURRENT_DATE, 6000.00, 'expense', 'Software', 'Suscripción CRM', 'Tarjeta'),

    -- Mantenimiento
    (CURRENT_DATE, 10000.00, 'expense', 'Mantenimiento', 'Reparación de Canchas', 'Transferencia');
