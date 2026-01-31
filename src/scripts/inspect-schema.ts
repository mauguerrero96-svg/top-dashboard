import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Manually load env vars because tsx doesn't do it automatically for .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    content.split('\n').forEach(line => {
        if (!line || line.startsWith('#')) return;
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            const val = values.join('=').trim().replace(/^["']|["']$/g, '');
            process.env[key.trim()] = val;
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing env vars (NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTables() {
    console.log("🔍 Inspecting table schemas...");

    // Check dashboard_players
    const { data: players, error: playersError } = await supabase
        .from('dashboard_players')
        .select('*')
        .limit(1);

    if (playersError) {
        console.error("❌ Error fetching dashboard_players:", playersError.message);
    } else {
        console.log("✅ dashboard_players sample:", players?.[0] || "Table is empty");
    }

    // Check dashboard_payments
    const { data: payments, error: paymentsError } = await supabase
        .from('dashboard_payments')
        .select('*')
        .limit(1);

    if (paymentsError) {
        console.error("❌ Error fetching dashboard_payments:", paymentsError.message);
    } else {
        console.log("✅ dashboard_payments sample:", payments?.[0] || "Table is empty");
    }
}

inspectTables();
