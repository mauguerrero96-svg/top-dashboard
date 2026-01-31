
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function debugRevenue() {
    console.log('--- Debugging Payments Page Revenue ---');
    const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*');

    if (error) {
        console.error(error);
        return;
    }

    const now = '2026-01'; // Targeting Jan 2026 based on context

    // Logic from Payments Page:
    // .filter(i => i.status === 'Paid' && format(parseISO(i.date), 'yyyy-MM') === format(now, 'yyyy-MM'))

    let total = 0;
    let count = 0;

    console.log(`Analyzing ${invoices.length} total invoices...`);

    invoices.forEach(inv => {
        const invDate = inv.date.substring(0, 7); // YYYY-MM
        const isPaid = inv.status === 'Paid';
        const isThisMonth = invDate === now;

        if (isPaid && isThisMonth) {
            total += Number(inv.amount);
            count++;
            console.log(`[INCLUDE] ID: ${inv.serial_id} | Amount: $${inv.amount} | Date: ${inv.date} | Desc: ${inv.description}`);
        } else {
            // console.log(`[SKIP] ID: ${inv.serial_id} | Status: ${inv.status} | Date: ${invDate}`);
        }
    });

    console.log('--------------------------------');
    console.log(`Total Paid Invoices (Jan 2026): ${count}`);
    console.log(`Calculated Revenue: $${total.toLocaleString()}`);
}

debugRevenue();
