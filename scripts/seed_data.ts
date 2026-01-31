
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
    console.log('Seeding data...');

    // 1. Seed Courts
    const { data: existingCourts } = await supabase.from('courts').select('*');
    let courts = existingCourts || [];
    if (courts.length === 0) {
        console.log('Inserting Courts...');
        const { data, error } = await supabase.from('courts').insert([
            { name: 'Court 1 (Central)', type: 'Clay' },
            { name: 'Court 2', type: 'Clay' },
            { name: 'Court 3', type: 'Hard' },
            { name: 'Court 4', type: 'Hard' }
        ]).select();
        if (error) console.error('Error inserting courts:', error);
        else courts = data;
    } else {
        console.log(`Found ${courts.length} courts. Skipping insert.`);
    }

    // 2. Seed Coaches
    const { data: existingCoaches } = await supabase.from('coaches').select('*');
    let coaches = existingCoaches || [];
    if (coaches.length === 0) {
        console.log('Inserting Coaches...');
        const { data, error } = await supabase.from('coaches').insert([
            { name: 'Toni Nadal', specialty: 'Clay Strategy' },
            { name: 'Patrick M.', specialty: 'Serve & Volley' },
            { name: 'Darren C.', specialty: 'Mental Game' }
        ]).select();
        if (error) console.error('Error inserting coaches:', error);
        else coaches = data;
    } else {
        console.log(`Found ${coaches.length} coaches. Skipping insert.`);
    }

    // 3. Seed Bookings (Optional, just to have something)
    const { count } = await supabase.from('bookings').select('*', { count: 'exact', head: true });
    if (count === 0 && courts.length > 0) {
        console.log('Inserting sample bookings...');
        // Need a player
        const { data: players } = await supabase.from('dashboard_players').select('id').limit(1);
        if (players && players.length > 0) {
            const playerId = players[0].id;
            const courtId = courts[0].id;

            const now = new Date();
            const startTime = new Date(now.setHours(10, 0, 0, 0)).toISOString();
            const endTime = new Date(now.setHours(11, 0, 0, 0)).toISOString();

            const { error } = await supabase.from('bookings').insert({
                court_id: courtId,
                player_id: playerId, // Assuming FK points to dashboard_players or compatible
                start_time: startTime,
                end_time: endTime,
                type: 'Match',
                status: 'Confirmed',
                price: 50,
                title: 'Sample Match'
            });
            if (error) console.error('Error inserting booking:', error);
            else console.log('Inserted sample booking');
        } else {
            console.log('No players found in dashboard_players to link booking.');
        }
    } else {
        console.log(`Found ${count} bookings. Skipping insert.`);
    }
}

seed();
