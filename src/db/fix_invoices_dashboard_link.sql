-- 1. Update 'invoices' foreign key to point to 'dashboard_players'
-- First, drop the old constraint if it exists
alter table public.invoices
drop constraint if exists invoices_player_id_fkey;

-- Add connection to dashboard_players
alter table public.invoices
add constraint invoices_player_id_fkey
foreign key (player_id) references public.dashboard_players(id)
on delete set null;

-- 2. Populate invoices using 'dashboard_players' for lookups
-- We re-run the population logic but looking at dashboard_players this time.
-- Note: This assumes invoices table is empty or we are appending. 
-- To be safe, we can clear it or just insert missing ones. 
-- For this setup, let's truncate to ensure clean state with correct IDs.

truncate table public.invoices;

WITH player_map AS (
    SELECT id, name FROM public.dashboard_players
)
INSERT INTO public.invoices (serial_id, player_id, description, date, amount, status)
VALUES
    ('INV-001', (SELECT id FROM player_map WHERE name ILIKE '%Juan Pablo%' LIMIT 1), 'Membership - Oct', '2023-10-01', 450.00, 'Paid'),
    ('INV-002', (SELECT id FROM player_map WHERE name ILIKE '%Natalia%' LIMIT 1), 'Private Lesson', '2023-10-05', 60.00, 'Pending'),
    ('INV-003', (SELECT id FROM player_map WHERE name ILIKE '%Ana%' LIMIT 1), 'Membership - Oct', '2023-10-01', 450.00, 'Paid'),
    ('INV-004', (SELECT id FROM player_map WHERE name ILIKE '%Carlos%' LIMIT 1), 'Court Rental x3', '2023-09-28', 120.00, 'Overdue'),
    ('INV-005', (SELECT id FROM player_map WHERE name ILIKE '%Valeria%' LIMIT 1), 'Tennis Racket Stringing', '2023-10-10', 200.00, 'Pending'),
    ('INV-006', (SELECT id FROM player_map WHERE name ILIKE '%Paula%' LIMIT 1), 'Membership - Oct', '2023-10-01', 450.00, 'Paid'),
    ('INV-007', (SELECT id FROM player_map WHERE name ILIKE '%Patricio%' LIMIT 1), 'Guest Fee', '2023-10-02', 30.00, 'Paid'),
    ('INV-008', (SELECT id FROM player_map WHERE name ILIKE '%Renata%' LIMIT 1), 'Membership - Nov', '2023-11-01', 450.00, 'Pending'),
    ('INV-009', (SELECT id FROM player_map WHERE name ILIKE '%Emiliano%' LIMIT 1), 'Tournament Entry Fee', '2023-10-15', 150.00, 'Paid'),
    ('INV-010', (SELECT id FROM player_map WHERE name ILIKE '%Julieta%' LIMIT 1), 'Tournament Entry Fee', '2023-10-15', 150.00, 'Paid');

-- Note: I updated the names in the insert to match names present in 'init_dashboard.sql' (Juan Pablo, Natalia, etc.)
-- instead of the mock Rafael/Roger names which don't exist in dashboard_players.
