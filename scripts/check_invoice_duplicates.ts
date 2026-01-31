
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from one level up from scripts/
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkDuplicates() {
  console.log('Checking for duplicates...');
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('id, serial_id, player_id, amount, date, status, description');

  if (error) {
    console.error('Error fetching invoices:', error);
    return;
  }

  // Group by unique business key
  // We consider an invoice duplicate if it has same player, same amount, same description, same date
  const groups = new Map<string, any[]>();

  invoices.forEach(inv => {
    // Key: player-amount-date-description
    // Note: dates might format slightly differently, let's take YYYY-MM
    const date = inv.date.substring(0, 7); // YYYY-MM
    const key = `${inv.player_id}-${inv.amount}-${date}-${inv.description}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(inv);
  });

  let duplicateCount = 0;
  let duplicateValue = 0;

  console.log(`Total Invoice Records: ${invoices.length}`);

  for (const [key, group] of groups.entries()) {
    if (group.length > 1) {
      console.log(`\nDuplicate Group Found (${group.length} records): ${key}`);
      // Keep the first one (or the one that is Paid?), mark others as duplicates
      // Let's just list them for now
      group.forEach(g => {
        console.log(` - ID: ${g.id} | Serial: ${g.serial_id} | Status: ${g.status} | CreatedAt: ${g.created_at || 'N/A'}`);
        if (g.status === 'Paid') {
          // If multiple are PAID, that's definitely bloating the revenue
        }
      });

      // Calculate excess value (all but one)
      // Specifically count how many 'Paid' ones are duplicates
      const paidInGroup = group.filter(g => g.status === 'Paid');
      if (paidInGroup.length > 1) {
        duplicateValue += (paidInGroup.length - 1) * Number(group[0].amount);
        duplicateCount += (paidInGroup.length - 1);
      }
    }
  }

  console.log('------------------------------------------------');
  console.log(`Estimated Duplicates (Paid Invoices counting towards revenue): ${duplicateCount}`);
  console.log(`Estimated Excess Revenue: $${duplicateValue.toLocaleString()}`);
}

checkDuplicates();
