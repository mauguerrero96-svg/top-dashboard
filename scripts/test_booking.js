
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf8');
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = value.trim();
            if (key.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = value.trim();
        }
    });
}

// Fallback to process.env if available (unlikely in standalone node script without runner)
if (!supabaseUrl) supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!supabaseKey) supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testBooking() {
    console.log('Testing connection to Supabase...');

    // 1. Fetch a real coach
    const { data: coaches, error: coachError } = await supabase
        .from('coaches')
        .select('id, name')
        .limit(1);

    if (coachError || !coaches || coaches.length === 0) {
        console.error('Error fetching coaches or no coaches found:', coachError);
        return;
    }

    const validCoachId = coaches[0].id;
    console.log(`Found coach: ${coaches[0].name} (${validCoachId})`);

    // 2. Try to insert a dummy booking
    console.log('Attempting to insert a test booking...');
    const dummyBooking = {
        court_id: 'c1',
        player_id: null,
        coach_id: validCoachId,
        title: 'Clase de Prueba',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600 * 1000).toISOString(),
        type: 'Classes',
        status: 'Confirmed',
        price: 50
    };

    const { data, error } = await supabase
        .from('bookings')
        .insert(dummyBooking)
        .select()
        .single();

    if (error) {
        console.error('INSERT FAILED with error:', JSON.stringify(error, null, 2));
    } else {
        console.log('INSERT SUCCESS:', data);

        // Clean up
        console.log('Cleaning up test booking...');
        await supabase.from('bookings').delete().eq('id', data.id);
    }
}

testBooking();
