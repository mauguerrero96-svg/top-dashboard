import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function inspect() {
  const { data: courts } = await supabase.from('courts').select('*').limit(1);
  const { data: coaches } = await supabase.from('coaches').select('*').limit(1);
  console.log('Courts sample:', courts);
  console.log('Coaches sample:', coaches);
  
  // Try to insert to check types if empty
  // Actually better to just assume text if we controlled creation, or check errors.
}

inspect();
