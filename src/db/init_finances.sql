-- Table: financial_transactions
create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null default current_date,
  amount numeric(10,2) not null,
  type text not null check (type in ('income', 'expense')),
  category text not null, -- e.g., 'Clases', 'Torneos', 'Mantenimiento', 'Salarios'
  description text,
  payment_method text, -- 'Efectivo', 'Transferencia', 'Tárjeta'
  booking_id uuid references public.bookings(id) on delete set null, -- Optional link to a booking
  created_at timestamp with time zone default now()
);

-- RLS Policies
alter table public.financial_transactions enable row level security;

create policy "Enable read access for all users" on public.financial_transactions for select using (true);
create policy "Enable insert access for all users" on public.financial_transactions for insert with check (true);
create policy "Enable update access for all users" on public.financial_transactions for update using (true);
create policy "Enable delete access for all users" on public.financial_transactions for delete using (true);
