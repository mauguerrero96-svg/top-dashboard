-- 1. Create table for payment history
create table if not exists public.player_payments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.dashboard_players(id) on delete cascade,
  amount numeric(10,2) not null,
  date timestamp with time zone default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- 2. Add total_paid to dashboard_players if not exists
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'dashboard_players' and column_name = 'total_paid') then
        alter table public.dashboard_players add column total_paid numeric(10,2) default 0;
    end if;
end $$;

-- 3. Initialize total_paid for existing players
-- If status is 'Pagado', assume total_paid = monthly_fee
update public.dashboard_players
set total_paid = monthly_fee
where payment_status = 'Pagado' and (total_paid is null or total_paid = 0);

-- If status is 'Pendiente', assume total_paid = 0 (default)

-- 4. RLS
alter table public.player_payments enable row level security;

create policy "Enable read access for all users" on public.player_payments for select using (true);
create policy "Enable insert access for all users" on public.player_payments for insert with check (true);
create policy "Enable update access for all users" on public.player_payments for update using (true);
create policy "Enable delete access for all users" on public.player_payments for delete using (true);
