-- 1. Generate Missing Invoices for Current Month (if any Active player is missing one)
-- Assuming 'Current Month' is determined by the system date.
DO $$
DECLARE
    p RECORD;
    current_month_start DATE := date_trunc('month', CURRENT_DATE);
    dueDate DATE := date_trunc('month', CURRENT_DATE) + interval '5 days'; -- Due on the 5th
BEGIN
    FOR p IN SELECT * FROM public.dashboard_players WHERE status = 'Activo' LOOP
        -- Check if invoice exists for this month
        IF NOT EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE player_id = p.id 
            AND date_trunc('month', date) = current_month_start
        ) THEN
            -- Insert Invoice
            INSERT INTO public.invoices (
                serial_id, 
                player_id, 
                amount, 
                status, 
                date, 
                due_date, 
                description
            ) VALUES (
                'INV-' || to_char(CURRENT_DATE, 'YYYYMM') || '-' || substring(p.id::text from 1 for 4),
                p.id,
                p.monthly_fee,
                'Pending',
                CURRENT_DATE,
                dueDate,
                'Mensualidad ' || to_char(CURRENT_DATE, 'Month YYYY')
            );
        END IF;
    END LOOP;
END $$;

-- 2. Synchronize Player Payment Status based on Invoices
-- If ANY pending/overdue invoice exists -> Status = 'Pendiente'
-- Else -> Status = 'Pagado'

UPDATE public.dashboard_players p
SET payment_status = CASE 
    WHEN EXISTS (
        SELECT 1 FROM public.invoices i 
        WHERE i.player_id = p.id 
        AND i.status IN ('Pending', 'Overdue')
    ) THEN 'Pendiente'
    ELSE 'Pagado'
END;
