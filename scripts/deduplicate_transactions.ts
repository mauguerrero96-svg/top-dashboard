
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

async function cleanup() {
    console.log('--- CLEANING DUPLICATES ---');

    // Fetch all transactions from Jan 2026
    const { data: txs, error } = await supabase
        .from('financial_transactions')
        .select('id, description, created_at')
        .gte('date', '2026-01-01')
        .lte('date', '2026-01-31')
        .order('created_at', { ascending: true }); // Oldest first

    if (error) {
        console.error(error);
        return;
    }

    const seen = new Set();
    const toDelete: string[] = [];

    for (const tx of txs) {
        if (seen.has(tx.description)) {
            // Duplicate!
            console.log(`Marking duplicate for deletion: ${tx.description} (${tx.id})`);
            toDelete.push(tx.id);
        } else {
            seen.add(tx.description);
        }
    }

    console.log(`Found ${toDelete.length} duplicates.`);

    if (toDelete.length > 0) {
        const { error: delError } = await supabase
            .from('financial_transactions')
            .delete()
            .in('id', toDelete);

        if (delError) console.error('Delete Error:', delError);
        else console.log('Successfully deleted duplicates.');
    }
}

cleanup();
