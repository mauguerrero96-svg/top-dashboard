-- Table: invoices
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  serial_id text not null, -- e.g. INV-001
  player_id uuid references public.players(id) on delete set null,
  description text not null, -- 'Concepto'
  date date not null default current_date,
  amount numeric(10,2) not null,
  status text not null check (status in ('Paid', 'Pending', 'Overdue')),
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.invoices enable row level security;

create policy "Enable read access for all users" on public.invoices for select using (true);
create policy "Enable insert access for all users" on public.invoices for insert with check (true);
create policy "Enable update access for all users" on public.invoices for update using (true);
create policy "Enable delete access for all users" on public.invoices for delete using (true);
