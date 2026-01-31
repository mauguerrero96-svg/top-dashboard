import { createClient } from '@supabase/supabase-js';

// This client uses the Service Role Key, granting it full access to your database.
// It bypasses Row Level Security (RLS).
// NEVER use this client on the client-side (browser).
export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
