
-- Ensures that the 'dashboard_players' table has all the columns required by the application.
-- Run this in your Supabase SQL Editor to fix missing column errors.

do $$
begin
    -- 1. Contact Info
    if not exists (select 1 from information_schema.columns where table_name = 'dashboard_players' and column_name = 'email') then
        alter table public.dashboard_players add column email text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'dashboard_players' and column_name = 'phone') then
        alter table public.dashboard_players add column phone text;
    end if;

    -- 2. Status & Fees
    if not exists (select 1 from information_schema.columns where table_name = 'dashboard_players' and column_name = 'status') then
        alter table public.dashboard_players add column status text default 'Activo';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'dashboard_players' and column_name = 'monthly_fee') then
        alter table public.dashboard_players add column monthly_fee numeric default 0;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'dashboard_players' and column_name = 'payment_status') then
        alter table public.dashboard_players add column payment_status text default 'Pendiente';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'dashboard_players' and column_name = 'total_paid') then
        alter table public.dashboard_players add column total_paid numeric default 0;
    end if;

    -- 3. Classification
    if not exists (select 1 from information_schema.columns where table_name = 'dashboard_players' and column_name = 'clinic') then
        alter table public.dashboard_players add column clinic text default 'Alto Rendimiento';
    end if;

end $$;
