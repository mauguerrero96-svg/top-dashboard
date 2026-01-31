
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixMissingRevenue() {
    console.log('--- Fixing Missing Revenue ---');

    // 1. Get Paid Invoices (The Source of Truth for "Recaudado")
    const { data: invoices } = await supabase
        .from('invoices')
        .select('*')
        .eq('status', 'Paid')
        .gte('date', '2026-01-01')
        .lte('date', '2026-01-31');

    if (!invoices) return;

    // 2. Get Existing Income Transactions
    const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('type', 'income') // Only Income
        .gte('date', '2026-01-01')
        .lte('date', '2026-01-31');

    const createdTx = [];

    console.log(`Paid Invoices: ${invoices.length}`);
    console.log(`Existing Income Txs: ${transactions?.length}`);

    for (const inv of invoices) {
        // Try to find a match
        // Match logic: 
        // 1. Description contains serial_id (Best)
        // 2. OR (Amount match AND Player match AND Date match) (Fallback)

        let match = transactions?.find(t =>
            (t.description && t.description.includes(inv.serial_id))
        );

        if (!match) {
            // Fallback check
            match = transactions?.find(t =>
                Math.abs(Number(t.amount) - Number(inv.amount)) < 0.01 &&
                t.date === inv.date &&
                t.player_id === inv.player_id
            );
        }

        if (!match) {
            console.log(`MISSING Transaction for Invoice ${inv.serial_id} ($${inv.amount})`);

            // Create it

            const newTx = {
                amount: inv.amount,
                type: 'income',
                category: 'Membresía',
                description: `Pago Factura ${inv.serial_id} - ${inv.description || 'Sin descripción'}`,
                date: inv.date,
                player_id: inv.player_id,
                payment_method: 'Sistema'
            };

            let { error } = await supabase.from('financial_transactions').insert([newTx]);

            if (error) {
                // If FK violation (code 23503), retry without player_id
                if (error.code === '23503') {
                    console.warn(`FK Error for ${inv.serial_id}. Retrying with NULL player_id...`);
                    const fallbackTx = { ...newTx, player_id: null };
                    const { error: fallbackError } = await supabase.from('financial_transactions').insert([fallbackTx]);
                    if (fallbackError) {
                        console.error(`FAILED fallback for ${inv.serial_id}:`, fallbackError);
                    } else {
                        createdTx.push(inv.serial_id + ' (orphaned)');
                    }
                } else {
                    console.error(`Error creating tx for ${inv.serial_id}:`, error);
                }
            } else {
                createdTx.push(inv.serial_id);
            }
        }
    }

    console.log(`--------------------------------`);
    console.log(`Created ${createdTx.length} missing transactions.`);
}

fixMissingRevenue();
