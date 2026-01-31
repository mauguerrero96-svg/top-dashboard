
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
        });
    } catch { }
}
loadEnv();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function debugRevenue() {
    console.log('--- REVENUE DEBUG (JAN 2026) ---');

    // Define period
    const start = '2026-01-01';
    const end = '2026-01-31';

    // 1. Invoices (Paid, Jan 2026) -> This feeds Payments Page "Recaudado"
    const { data: invoices, error: invError } = await supabase
        .from('invoices')
        .select('amount, date, serial_id')
        .eq('status', 'Paid')
        .gte('date', start)
        .lte('date', end);

    if (invError) console.error('Invoices Error:', invError);
    const invoiceSum = (invoices || []).reduce((sum, i) => sum + Number(i.amount), 0);
    console.log(`\n[Invoices] Status 'Paid' in Jan 2026:`);
    console.log(`Count: ${invoices?.length}`);
    console.log(`Total Sum: $${invoiceSum.toLocaleString()}`);


    // 2. Financial Transactions (Income, Jan 2026) -> Feeds Dashboard
    const { data: transactions, error: txError } = await supabase
        .from('financial_transactions')
        .select('amount, category, description')
        .eq('type', 'income')
        .gte('date', start)
        .lte('date', end);

    if (txError) console.error('Transactions Error:', txError);
    const txSum = (transactions || []).reduce((sum, t) => sum + Number(t.amount), 0);
    console.log(`\n[Financial Transactions] Income in Jan 2026:`);
    console.log(`Count: ${transactions?.length}`);
    console.log(`Total Sum: $${txSum.toLocaleString()}`);

    // 3. Player Payments (Legacy table? Jan 2026) -> Feeds Dashboard
    const { data: playerPayments, error: ppError } = await supabase
        .from('player_payments')
        .select('amount')
        .gte('date', start)
        .lte('date', end);

    if (ppError) {
        // Table might not exist or be empty
        console.log(`\n[Player Payments] (Error or empty): ${ppError.message}`);
    } else {
        const ppSum = (playerPayments || []).reduce((sum, p) => sum + Number(p.amount), 0);
        console.log(`\n[Player Payments] in Jan 2026:`);
        console.log(`Count: ${playerPayments?.length}`);
        console.log(`Total Sum: $${ppSum.toLocaleString()}`);
        console.log(`\n--> DASHBOARD TOTAL (Tx + PP): $${(txSum + ppSum).toLocaleString()}`);
    }

    console.log('\n--- COMPARISON ---');
    console.log(`Difference (Invoices - Dashboard): $${(invoiceSum - (txSum + (playerPayments?.reduce((s, p) => s + Number(p.amount), 0) || 0))).toLocaleString()}`);
}

debugRevenue();
