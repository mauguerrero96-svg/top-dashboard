
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkTables() {
    const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    if (error) {
        // Try a different way or just list known tables by trying to select
        console.log("Could not query information_schema via API (expected). Checking specific tables...");

        const tablesToCheck = ['bookings', 'coaches', 'courts', 'court_schedules', 'invoices', 'financial_transactions', 'players', 'dashboard_players'];

        for (const t of tablesToCheck) {
            const { error: tErr, count } = await supabase.from(t).select('*', { count: 'exact', head: true });
            if (tErr) {
                console.log(`Table '${t}' DOES NOT exist or error: ${tErr.message}`);
            } else {
                console.log(`Table '${t}' exists. Rows: ${count}`);
            }
        }
        return;
    }

    console.log("Tables found:", data);
}

checkTables();
