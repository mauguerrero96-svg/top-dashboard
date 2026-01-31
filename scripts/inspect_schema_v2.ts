import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
  console.log('Inspecting...');
  const { error: cErr } = await supabase.from('courts').select('*').limit(1);
  if (cErr) console.log('Courts Error:', cErr);
  else console.log('Courts table access OK');

  const { error: coErr } = await supabase.from('coaches').select('*').limit(1);
  if (coErr) console.log('Coaches Error:', coErr);
  else console.log('Coaches table access OK');
}

inspect();
