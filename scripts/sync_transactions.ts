
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf-8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const val = match[2].trim().replace(/^['"]|['"]$/g, '');
                process.env[key] = val;
            }
        });
    } catch (e) {
        console.error('Env load failed', e);
    }
}
loadEnv();

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

console.log(`URL: ${url}`);
console.log(`Service Key Present: ${!!serviceKey}`);
console.log(`Anon Key Present: ${!!anonKey}`);

if (!url || !serviceKey) {
    console.warn("WARNING: Service Role Key missing. RLS might hide rows.");
}

const supabase = createClient(url!, serviceKey || anonKey!);

async function syncTransactions() {
    console.log('--- RE-SYNCING JAN 2026 TRANSACTIONS ---');
    const start = '2026-01-01';
    const end = '2026-01-31';

    // 1. Fetch all PAID invoices for Jan 2026
    const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('status', 'Paid')
        .gte('date', start)
        .lte('date', end);

    if (error) {
        console.error('Error fetching invoices:', error);
        return;
    }

    console.log(`Found ${invoices.length} paid invoices in Jan 2026.`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const invoice of invoices) {
        const expectedDescription = `Pago Factura ${invoice.serial_id} - ${invoice.description}`;

        // 2. Check if transaction exists
        const { data: existingTx } = await supabase
            .from('financial_transactions')
            .select('id')
            .eq('description', expectedDescription)
            .single();

        if (existingTx) {
            skippedCount++;
            continue;
        }

        console.log(`Creating transaction for Invoice ${invoice.serial_id} ($${invoice.amount})...`);

        // 3. Insert
        let { error: insertError } = await supabase
            .from('financial_transactions')
            .insert([{
                amount: invoice.amount,
                type: 'income',
                category: 'Membresía',
                description: expectedDescription,
                date: invoice.date,
                player_id: invoice.player_id,
                payment_method: 'Manual/Sync'
            }]);

        // 4. Handle Orphaned Players
        if (insertError && insertError.code === '23503') {
            console.log(`  > Player ${invoice.player_id} not found. Inserting as anonymous.`);
            const { error: retryError } = await supabase
                .from('financial_transactions')
                .insert([{
                    amount: invoice.amount,
                    type: 'income',
                    category: 'Membresía',
                    description: `${expectedDescription} (Jugador Eliminado)`,
                    date: invoice.date,
                    player_id: null,
                    payment_method: 'Manual/Sync'
                }]);
            insertError = retryError;
        }

        if (insertError) {
            console.error(`Failed to insert tx for ${invoice.serial_id}:`, insertError);
        } else {
            createdCount++;
        }
    }

    console.log(`\nSync Complete.`);
    console.log(`Created: ${createdCount}`);
    console.log(`Skipped: ${skippedCount}`);
}

syncTransactions();
