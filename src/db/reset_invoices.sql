-- COMPLETE RESET SCRIPT FOR INVOICES
-- Run this to fix "relation does not exist" and "foreign key" errors.

-- 1. Drop existing table
drop table if exists public.invoices cascade;

-- 2. Create table with correct Foreign Key to 'dashboard_players'
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  serial_id text not null, -- e.g. INV-001
  player_id uuid references public.dashboard_players(id) on delete set null,
  description text not null, -- 'Concepto'
  date date not null default current_date,
  amount numeric(10,2) not null,
  status text not null check (status in ('Paid', 'Pending', 'Overdue')),
  created_at timestamp with time zone default now()
);

-- 3. Enable RLS
alter table public.invoices enable row level security;

create policy "Enable read access for all users" on public.invoices for select using (true);
create policy "Enable insert access for all users" on public.invoices for insert with check (true);
create policy "Enable update access for all users" on public.invoices for update using (true);
create policy "Enable delete access for all users" on public.invoices for delete using (true);

-- 4. Populate with Data (Matching names in dashboard_players)
-- We rely on names existing in dashboard_players. If they don't match, those invoices will be skipped or have null player_id.
-- Standardizing on known names from init_dashboard.sql

WITH player_map AS (
    SELECT id, name FROM public.dashboard_players
)
INSERT INTO public.invoices (serial_id, player_id, description, date, amount, status)
VALUES
    ('INV-001', (SELECT id FROM player_map WHERE name ILIKE '%Juan Pablo%' LIMIT 1), 'Membership - Current', CURRENT_DATE, 450.00, 'Paid'),
    ('INV-002', (SELECT id FROM player_map WHERE name ILIKE '%Natalia%' LIMIT 1), 'Private Lesson', CURRENT_DATE - INTERVAL '2 days', 60.00, 'Pending'),
    ('INV-003', (SELECT id FROM player_map WHERE name ILIKE '%Ana%' LIMIT 1), 'Membership - Current', CURRENT_DATE - INTERVAL '5 days', 450.00, 'Paid'),
    ('INV-004', (SELECT id FROM player_map WHERE name ILIKE '%Carlos%' LIMIT 1), 'Court Rental x3', CURRENT_DATE - INTERVAL '10 days', 120.00, 'Overdue'),
    ('INV-005', (SELECT id FROM player_map WHERE name ILIKE '%Valeria%' LIMIT 1), 'Tennis Racket Stringing', CURRENT_DATE, 200.00, 'Pending'),
    ('INV-006', (SELECT id FROM player_map WHERE name ILIKE '%Paula%' LIMIT 1), 'Membership - Current', CURRENT_DATE - INTERVAL '1 day', 450.00, 'Paid'),
    ('INV-007', (SELECT id FROM player_map WHERE name ILIKE '%Patricio%' LIMIT 1), 'Guest Fee', CURRENT_DATE - INTERVAL '3 days', 30.00, 'Paid'),
    ('INV-008', (SELECT id FROM player_map WHERE name ILIKE '%Renata%' LIMIT 1), 'Membership - Next Month', CURRENT_DATE + INTERVAL '1 day', 450.00, 'Pending'),
    ('INV-009', (SELECT id FROM player_map WHERE name ILIKE '%Emiliano%' LIMIT 1), 'Tournament Entry Fee', CURRENT_DATE - INTERVAL '7 days', 150.00, 'Paid'),
    ('INV-010', (SELECT id FROM player_map WHERE name ILIKE '%Julieta%' LIMIT 1), 'Tournament Entry Fee', CURRENT_DATE - INTERVAL '7 days', 150.00, 'Paid');
