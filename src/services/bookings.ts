import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { Booking, Coach, Court } from '@/types/bookings';

export const bookingsService = {
    /**
     * Fetch all coaches
     */
    async getCoaches(): Promise<Coach[]> {
        const { data, error } = await supabase
            .from('coaches')
            .select('*');

        if (error) {
            console.error('Error fetching coaches:', error);
            return [];
        }

        return data.map((c: any) => ({
            id: c.id,
            name: c.name,
            specialty: c.specialty
        }));
    },

    async getCourts(): Promise<Court[]> {
        // Fallback since table might not exist
        return [
            { id: 'c1', name: 'Court 1 (Central)', type: 'Clay' },
            { id: 'c2', name: 'Court 2', type: 'Clay' },
            { id: 'c3', name: 'Court 3', type: 'Hard' },
            { id: 'c4', name: 'Court 4', type: 'Hard' },
        ];
    },

    /**
     * Fetch bookings for a specific date range
     */
    async getBookings(start: Date, end: Date): Promise<Booking[]> {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                player:dashboard_players!player_id(name),
                coach:coaches!coach_id(name),
                participants:booking_participants(
                    player:dashboard_players!player_id(name)
                )
            `)
            .gte('start_time', start.toISOString())
            .lt('end_time', end.toISOString());

        if (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }

        // Map Supabase result to Booking interface
        return data.map((b: any) => ({
            id: b.id,
            courtId: b.court_id,
            playerId: b.player_id || '',
            // If player relation exists, use the name, otherwise fallback or empty
            playerName: b.player?.name,
            coachId: b.coach_id,
            coachName: b.coach?.name, // Add coach name
            participants: b.participants?.map((p: any) => ({ name: p.player?.name })) || [],
            title: b.title,
            startTime: b.start_time, // ISO string
            endTime: b.end_time,     // ISO string
            type: b.type as any,
            status: b.status as any,
            price: Number(b.price),
            clinic: b.clinic
        }));
    },

    /**
     * Create a new booking (or multiple if recurring)
     */
    async createBooking(booking: Partial<Booking> & {
        participantIds?: string[];
        recurrence?: { frequency: string; count: number };
    }): Promise<Booking | null> {

        const bookingsToCreate: any[] = [];
        const baseStartTime = new Date(booking.startTime!);
        const baseEndTime = new Date(booking.endTime!);
        const count = booking.recurrence ? booking.recurrence.count : 1;
        const frequency = booking.recurrence ? booking.recurrence.frequency : 'Weekly';

        for (let i = 0; i < count; i++) {
            const currentStart = new Date(baseStartTime);
            const currentEnd = new Date(baseEndTime);

            // Calculate offset based on frequency
            if (i > 0) {
                if (frequency === 'Weekly') {
                    currentStart.setDate(currentStart.getDate() + (i * 7));
                    currentEnd.setDate(currentEnd.getDate() + (i * 7));
                } else if (frequency === 'Monthly') {
                    currentStart.setMonth(currentStart.getMonth() + i);
                    currentEnd.setMonth(currentEnd.getMonth() + i);
                }
            }

            bookingsToCreate.push({
                court_id: booking.courtId,
                player_id: booking.playerId && booking.playerId.length > 5 ? booking.playerId : null,
                coach_id: booking.coachId && booking.coachId.length > 5 ? booking.coachId : null,
                title: booking.title,
                start_time: currentStart.toISOString(),
                end_time: currentEnd.toISOString(),
                type: booking.type,
                status: booking.status || 'Confirmed',
                price: booking.price,
                clinic: booking.clinic
            });
        }

        const createdBookings: Booking[] = [];

        // Insert individually to get IDs easily for participants
        // (Could be bulk insert, but we need IDs for participants mapping)
        for (const dbBooking of bookingsToCreate) {
            const { data, error } = await supabase
                .from('bookings')
                .insert(dbBooking)
                .select()
                .single();

            if (error) {
                console.error('Error creating booking:', error);
                // Continue or abort? For now, logging error.
                continue;
            }

            // Insert participants if any
            if (booking.participantIds && booking.participantIds.length > 0) {
                const participantsData = booking.participantIds.map(pid => ({
                    booking_id: data.id,
                    player_id: pid
                }));

                const { error: partError } = await supabase
                    .from('booking_participants')
                    .insert(participantsData);

                if (partError) {
                    console.error('Error adding participants:', partError);
                }
            }

            createdBookings.push({
                id: data.id,
                courtId: data.court_id,
                playerId: data.player_id,
                coachId: data.coach_id,
                title: data.title,
                startTime: data.start_time,
                endTime: data.end_time,
                type: data.type,
                status: data.status,
                price: Number(data.price),
                clinic: data.clinic
            });
        }

        // Return the first one created (main one) or null
        return createdBookings.length > 0 ? createdBookings[0] : null;
    },

    /**
     * Update an existing booking
     */
    async updateBooking(id: string, updates: Partial<Booking> & { participantIds?: string[] }): Promise<Booking | null> {

        const dbUpdates: any = {};
        if (updates.courtId) dbUpdates.court_id = updates.courtId;
        if (updates.startTime) dbUpdates.start_time = updates.startTime;
        if (updates.endTime) dbUpdates.end_time = updates.endTime;
        if (updates.playerId !== undefined) dbUpdates.player_id = updates.playerId && updates.playerId.length > 5 ? updates.playerId : null;
        if (updates.coachId !== undefined) dbUpdates.coach_id = updates.coachId && updates.coachId.length > 5 ? updates.coachId : null;
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.type) dbUpdates.type = updates.type;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.price) dbUpdates.price = updates.price;
        if (updates.clinic !== undefined) dbUpdates.clinic = updates.clinic;

        const { data, error } = await supabase
            .from('bookings')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating booking:', error);
            return null;
        }

        // Update participants if provided
        if (updates.participantIds) {
            // First delete existing
            await supabase.from('booking_participants').delete().eq('booking_id', id);

            // Then insert new ones
            if (updates.participantIds.length > 0) {
                const participantsData = updates.participantIds.map(pid => ({
                    booking_id: id,
                    player_id: pid
                }));
                await supabase.from('booking_participants').insert(participantsData);
            }
        }

        return {
            id: data.id,
            courtId: data.court_id,
            playerId: data.player_id,
            coachId: data.coach_id,
            title: data.title,
            startTime: data.start_time,
            endTime: data.end_time,
            type: data.type,
            status: data.status,
            price: Number(data.price),
            clinic: data.clinic
        };
    }
};
