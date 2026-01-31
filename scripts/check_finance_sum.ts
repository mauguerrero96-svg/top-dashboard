
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTransactions() {
    console.log('Checking Financial Transactions for Jan 2026...');

    // 1. Financial Transactions
    const { data: txs, error: txError } = await supabase
        .from('financial_transactions')
        .select('*')
        .gte('date', '2026-01-01')
        .lte('date', '2026-01-31');

    if (txError) console.error(txError);

    const txSum = txs?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    console.log(`Financial Transactions: ${txs?.length} records | Sum: $${txSum}`);

    // 2. Player Payments
    const { data: pay, error: payError } = await supabase
        .from('player_payments')
        .select('*')
        .gte('date', '2026-01-01')
        .lte('date', '2026-01-31');

    if (payError) console.error(payError);

    const paySum = pay?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    console.log(`Player Payments: ${pay?.length} records | Sum: $${paySum}`);

    console.log(`Total Dashboard Revenue: $${txSum + paySum}`);
}

checkTransactions();
