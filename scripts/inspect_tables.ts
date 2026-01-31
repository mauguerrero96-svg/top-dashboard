import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
  console.log('--- TABLES ---');
  const tables = ['bookings', 'coaches', 'dashboard_players', 'courts'];
  for (const t of tables) {
      const { data, error } = await supabase.from(t).select('*').limit(1);
      if (error) console.log(t + ' ERROR: ' + error.message);
      else console.log(t + ' OK. sample: ', data);
  }
}

inspect();
