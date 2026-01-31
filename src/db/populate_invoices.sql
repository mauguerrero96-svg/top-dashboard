-- Insert invoices from user image
-- Mapping player names to actual players in DB would require looking them up.
-- For this script, we will assume players exist or insert placeholders if needed?
-- Better approach: We'll use a DO block or just insert assuming known names from previous mock data, 
-- or we can just insert with hardcoded UUIDs if we knew them, but we don't.
-- Let's try to look up players by name or create them if they don't exist is too complex for simple SQL script without procedural code.
-- Simplified approach: We will use a CTE to look up player IDs by name (fuzzy match or exact).

WITH player_map AS (
    SELECT id, name FROM public.players
)
INSERT INTO public.invoices (serial_id, player_id, description, date, amount, status)
VALUES
    ('INV-001', (SELECT id FROM player_map WHERE name ILIKE '%Rafael%' LIMIT 1), 'Membership - Oct', '2023-10-01', 450.00, 'Paid'),
    ('INV-002', (SELECT id FROM player_map WHERE name ILIKE '%Roger%' LIMIT 1), 'Private Lesson', '2023-10-05', 60.00, 'Pending'),
    ('INV-003', (SELECT id FROM player_map WHERE name ILIKE '%Novak%' LIMIT 1), 'Membership - Oct', '2023-10-01', 450.00, 'Paid'),
    ('INV-004', (SELECT id FROM player_map WHERE name ILIKE '%Carlos%' LIMIT 1), 'Court Rental x3', '2023-09-28', 120.00, 'Overdue'),
    ('INV-005', (SELECT id FROM player_map WHERE name ILIKE '%Rafael%' LIMIT 1), 'Tennis Racket Stringing', '2023-10-10', 200.00, 'Pending'),
    ('INV-006', (SELECT id FROM player_map WHERE name ILIKE '%Serena%' LIMIT 1), 'Membership - Oct', '2023-10-01', 450.00, 'Paid'),
    ('INV-007', (SELECT id FROM player_map WHERE name ILIKE '%Roger%' LIMIT 1), 'Guest Fee', '2023-10-02', 30.00, 'Paid'),
    ('INV-008', (SELECT id FROM player_map WHERE name ILIKE '%Novak%' LIMIT 1), 'Membership - Nov', '2023-11-01', 450.00, 'Pending'),
    ('INV-009', (SELECT id FROM player_map WHERE name ILIKE '%Carlos%' LIMIT 1), 'Tournament Entry Fee', '2023-10-15', 150.00, 'Paid'),
    ('INV-010', (SELECT id FROM player_map WHERE name ILIKE '%Serena%' LIMIT 1), 'Tournament Entry Fee', '2023-10-15', 150.00, 'Paid');
