-- Enable RLS on financial_transactions if not already enabled
alter table public.financial_transactions enable row level security;

-- Drop existing policies to avoid conflicts (optional, be careful in prod)
drop policy if exists "Enable read access for all users" on public.financial_transactions;
drop policy if exists "Enable insert access for all users" on public.financial_transactions;
drop policy if exists "Enable update access for all users" on public.financial_transactions;
drop policy if exists "Enable delete access for all users" on public.financial_transactions;

-- Create permissive policies for now (matching player_payments)
create policy "Enable read access for all users" on public.financial_transactions for select using (true);
create policy "Enable insert access for all users" on public.financial_transactions for insert with check (true);
create policy "Enable update access for all users" on public.financial_transactions for update using (true);
create policy "Enable delete access for all users" on public.financial_transactions for delete using (true);
