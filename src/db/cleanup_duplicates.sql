-- DEDUPLICATION SCRIPT
-- 1. Identify valid duplicates (Same Name)
-- 2. Move related data to the 'Master' record (Oldest creation date or most complete)
-- 3. Delete duplicates

BEGIN;

-- Create a temp table to map duplicates to a single master_id
CREATE TEMPORARY TABLE player_merge_map AS
SELECT 
    p.id as duplicate_id,
    m.id as master_id
FROM public.dashboard_players p
JOIN (
    SELECT 
        min(id::text)::uuid as id, -- Cast UUID to text for min function
        name 
    FROM public.dashboard_players 
    GROUP BY name 
    HAVING count(*) > 1
) m ON p.name = m.name AND p.id != m.id;

-- 2. Reassign Invoices
UPDATE public.invoices
SET player_id = map.master_id
FROM player_merge_map map
WHERE invoices.player_id = map.duplicate_id;

-- 3. Reassign Payments
UPDATE public.player_payments
SET player_id = map.master_id
FROM player_merge_map map
WHERE player_payments.player_id = map.duplicate_id;

-- 4. Reassign Financial Transactions
UPDATE public.financial_transactions
SET player_id = map.master_id
FROM player_merge_map map
WHERE financial_transactions.player_id = map.duplicate_id;

-- 5. Reassign Schedules (if any)
UPDATE public.player_schedules
SET player_id = map.master_id
FROM player_merge_map map
WHERE player_schedules.player_id = map.duplicate_id;

-- 6. Remove Duplicates from Dashboard Players
DELETE FROM public.dashboard_players
WHERE id IN (SELECT duplicate_id FROM player_merge_map);

-- 7. Recalculate Totals for Masters (Optional but safer)
-- We might need to handle double-invoices if both duplicate players had generated invoices for the same month.
-- Let's clean up duplicate invoices (Same Player, Same Date/Amount)
DELETE FROM public.invoices a
USING public.invoices b
WHERE a.id > b.id
AND a.player_id = b.player_id
AND a.date = b.date
AND a.amount = b.amount
AND a.description = b.description;

DROP TABLE player_merge_map;

COMMIT;
