import { supabase } from '@/lib/supabase';
import { startOfMonth, endOfMonth } from 'date-fns';
import { DashboardPlayer, DashboardPayment, PaymentRecord } from '@/types/dashboard';

export interface ClinicStats {
    clinic: string;
    activePlayers: number;
    totalRevenue: number;
    pendingRevenue: number;
}

export interface DashboardStats {
    confirmedRevenue: number;
    pendingRevenue: number;
    activePlayers: number;
    activeScholarships: number;
    clinicStats: ClinicStats[];
}

export const dashboardService = {
    /**
     * Fetches all players from the consolidated 'players' table
     */
    async getPlayers(): Promise<DashboardPlayer[]> {
        const { data, error } = await supabase
            .from('dashboard_players')
            .select(`
                *,
                schedules:player_schedules(*)
            `);

        if (error) {
            console.error('Error fetching players:', error);
            return [];
        }

        return (data as DashboardPlayer[]).map(player => ({
            ...player,
            payment_status: player.status === 'Inactivo' ? 'NA' : player.payment_status
        })) || [];
    },

    /**
     * Fetches payments (invoices)
     */
    async getInvoices(limit = 10) {
        const { data, error } = await supabase
            .from('invoices')
            .select(`
                *,
                player:dashboard_players(name)
            `)
            .order('date', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching invoices:', error);
            return [];
        }
        return data.map((inv: any) => ({
            ...inv,
            player_name: inv.player?.name || 'Desconocido'
        }));
    },

    /**
     * Calculates the main KPIs based on Real Data (Invoices & Players)
     */
    async getStats(): Promise<DashboardStats> {
        // 1. Fetch Players for Counts & Linking
        const players = await this.getPlayers();

        // 2. Fetch Payments (Cash Flow) for Current Month
        const now = new Date();
        const start = startOfMonth(now).toISOString();
        const end = endOfMonth(now).toISOString();

        // 2a. Player Payments
        const { data: payments } = await supabase
            .from('player_payments')
            .select('amount, player_id')
            .gte('date', start)
            .lte('date', end);

        // 2b. Other Income (Financial Transactions)
        const { data: otherIncome } = await supabase
            .from('financial_transactions')
            .select('amount')
            .eq('type', 'income')
            .gte('date', start)
            .lte('date', end);

        // 2c. Fetch Pending Invoices (Accounts Receivable) - Global Snapshot
        // 2c. Fetch Pending Invoices (Accounts Receivable) - Global Snapshot
        // Business Rule: 
        // - If today is 1st-5th: Grace period. Only count debt from previous months (exclude current).
        // - If today is 6th+: Grace period over. Count ALL unpaid invoices (Past + Current).
        const currentDay = now.getDate();
        let pendingQuery = supabase
            .from('invoices')
            .select('amount, player_id')
            .in('status', ['Pending', 'Overdue']);

        if (currentDay <= 5) {
            pendingQuery = pendingQuery.lt('date', start); // Only past months
        }

        const { data: pendingInvoices } = await pendingQuery;

        // Calculate Revenue (Cash Basis)
        const playerRevenue = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);
        const otherRevenue = (otherIncome || []).reduce((sum, t) => sum + Number(t.amount), 0);
        const confirmedRevenue = playerRevenue + otherRevenue;

        // Calculate Pending (Accounts Receivable) - Based on Invoices
        // Business Rule: Exclude 'Inactivo' players from this global sum
        const pendingRevenue = (pendingInvoices || []).reduce((sum, inv) => {
            const player = players.find(p => p.id === inv.player_id);
            // Only count if player exists AND is not Inactive
            if (player && player.status === 'Inactivo') {
                return sum;
            }
            return sum + Number(inv.amount);
        }, 0);

        // Player Counts
        const activePlayers = players.filter(p => p.status === 'Activo').length;
        const activeScholarships = players.filter(p => p.status === 'Beca').length;

        // Clinic Stats (Breakdown)
        const clinicMap = new Map<string, ClinicStats>();

        // Init stats with players
        players.forEach(p => {
            const clinicName = p.clinic || 'Sin Clínica';
            if (!clinicMap.has(clinicName)) {
                clinicMap.set(clinicName, {
                    clinic: clinicName,
                    activePlayers: 0,
                    totalRevenue: 0,
                    pendingRevenue: 0
                });
            }
            if (p.status === 'Activo') {
                clinicMap.get(clinicName)!.activePlayers++;
            }
        });

        // Add Revenue to Clinics (based on payments linked to players)
        (payments || []).forEach(pay => {
            const player = players.find(p => p.id === pay.player_id);
            if (player) {
                const clinicName = player.clinic || 'Sin Clínica';
                if (clinicMap.has(clinicName)) {
                    clinicMap.get(clinicName)!.totalRevenue += Number(pay.amount);
                }
            }
        });

        // Add Pending Revenue to Clinics (based on invoices linked to players)
        (pendingInvoices || []).forEach(inv => {
            const player = players.find(p => p.id === inv.player_id);
            if (player) {
                const clinicName = player.clinic || 'Sin Clínica';
                if (clinicMap.has(clinicName)) {
                    clinicMap.get(clinicName)!.pendingRevenue += Number(inv.amount);
                }
            }
        });

        return {
            confirmedRevenue,
            pendingRevenue,
            activePlayers,
            activeScholarships,
            clinicStats: Array.from(clinicMap.values())
        };
    },

    /**
     * Updates a player's information
     */
    async updatePlayer(id: string, updates: Partial<DashboardPlayer>): Promise<boolean> {
        const { schedules, ...validUpdates } = updates;
        // Business Rule: If status is changin to 'Inactivo', payment_status must be 'NA'
        if (validUpdates.status === 'Inactivo') {
            validUpdates.payment_status = 'NA';
        }

        const { error } = await supabase
            .from('dashboard_players') // Updated to 'players'
            .update(validUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating player:', error);
            return false;
        }
        return true;
    },

    /**
     * Creates a new player
     */
    async createPlayer(player: Partial<DashboardPlayer>): Promise<boolean> {
        // Remove id if present and empty, and remove undefined fields
        const { id, schedules, ...cleanData } = player;
        // Ensure defaults
        const newPlayer = {
            ...cleanData,
            status: cleanData.status || 'Activo',
            payment_status: cleanData.payment_status || 'Pendiente',
            clinic: cleanData.clinic || 'Alto Rendimiento',
            total_paid: 0
        };

        const { error } = await supabase
            .from('dashboard_players')
            .insert(newPlayer);

        if (error) {
            console.error('Error creating player:', error);
            return false;
        }
        return true;
    },

    /**
     * Records a new attendance check-in
     */
    async checkInPlayer(playerId: string, notes?: string): Promise<boolean> {
        const { error } = await supabase
            .from('attendance_checkins')
            .insert([{ player_id: playerId, notes }]);

        if (error) {
            console.error('Error checking in:', error);
            return false;
        }
        return true;
    },

    /**
     * Fetches attendance history for a player
     */
    async getAttendanceHistory(playerId: string) {
        const { data, error } = await supabase
            .from('attendance_checkins')
            .select('*')
            .eq('player_id', playerId)
            .order('check_in_time', { ascending: false });

        if (error) {
            console.error('Error fetching attendance:', error);
            return [];
        }
        return data || [];
    },

    /**
     * Get recent payments for a player
     */
    async getPlayerPayments(playerId: string): Promise<PaymentRecord[]> {
        const { data, error } = await supabase
            .from('player_payments')
            .select('*')
            .eq('player_id', playerId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching payments:', error);
            return [];
        }
        return data || [];
    },

    /**
     * Add a partial payment
     */
    async addPayment(playerId: string, amount: number, notes?: string): Promise<boolean> {
        // 1. Insert payment record
        const { error: insertError } = await supabase
            .from('player_payments')
            .insert([{ player_id: playerId, amount, notes }]);

        if (insertError) {
            console.error('Error inserting payment:', insertError);
            return false;
        }

        // 2. Update player total_paid
        // We need to fetch current total first or rely on DB trigger.
        // Let's do it simply here: fetch current -> add -> update
        // Better: SQL query to increment? Supabase supports rpc or just simple update if we know the value.
        // Let's fetch current player to ensure accuracy.
        const { data: player } = await supabase.from('dashboard_players').select('total_paid, monthly_fee').eq('id', playerId).single();

        if (player) {
            const currentTotal = Number(player.total_paid || 0);
            const fee = Number(player.monthly_fee || 0);
            const newTotal = currentTotal + amount;

            // Logic to update status if paid in full
            let newStatus = 'Pendiente';
            if (newTotal >= fee && fee > 0) {
                newStatus = 'Pagado';
            }

            const { error: updateError } = await supabase
                .from('dashboard_players')
                .update({
                    total_paid: newTotal,
                    payment_status: newStatus
                })
                .eq('id', playerId);

            if (updateError) {
                console.error('Error updating player total:', updateError);
                return false; // Though payment was inserted... ideally transaction
            }
        }

        return true;
    },

    /**
     * Delete a partial payment
     */
    async deletePayment(paymentId: string, playerId: string): Promise<boolean> {
        // 1. Delete the payment
        const { error: deleteError } = await supabase
            .from('player_payments')
            .delete()
            .eq('id', paymentId);

        if (deleteError) {
            console.error('Error deleting payment:', deleteError);
            return false;
        }

        // 2. Recalculate Total Paid
        const { data: payments } = await supabase
            .from('player_payments')
            .select('amount')
            .eq('player_id', playerId);

        const newTotal = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        // 3. Fetch Monthly Fee to determine new status
        const { data: player } = await supabase
            .from('dashboard_players')
            .select('monthly_fee')
            .eq('id', playerId)
            .single();

        const fee = Number(player?.monthly_fee || 0);

        let newStatus = 'Pendiente';
        if (newTotal >= fee && fee > 0) {
            newStatus = 'Pagado';
        }

        // 4. Update Player
        const { error: updateError } = await supabase
            .from('dashboard_players')
            .update({
                total_paid: newTotal,
                payment_status: newStatus
            })
            .eq('id', playerId);

        if (updateError) {
            console.error('Error updating player after deletion:', updateError);
            return false;
        }

        return true;
    },

    /**
     * Get Usage Statistics for Reports
     */
    async getUsageStats(startDate: Date, endDate: Date) {
        const start = startDate.toISOString();
        const end = endDate.toISOString();

        // 1. Bookings by Coach & Court
        const { data: bookings, error: bookingsError } = await supabase
            .from('bookings')
            .select('*, coach:coaches(name)')
            .gte('start_time', start)
            .lte('start_time', end);

        if (bookingsError) {
            console.error('Error fetching bookings stats:', bookingsError);
            return null;
        }

        // Aggregate by Coach
        const coachMap = new Map<string, number>();
        // Aggregate by Court
        const courtMap = new Map<string, number>();

        bookings?.forEach(b => {
            // Coach
            const coachName = b.coach?.name || 'Sin Coach';
            coachMap.set(coachName, (coachMap.get(coachName) || 0) + 1);

            // Court (resource_id is usually the court identifier)
            const courtName = `Cancha ${b.resource_id}`;
            courtMap.set(courtName, (courtMap.get(courtName) || 0) + 1);
        });

        // 2. Attendance Trend
        const { data: attendance, error: attError } = await supabase
            .from('attendance_checkins')
            .select('check_in_time')
            .gte('check_in_time', start)
            .lte('check_in_time', end);

        if (attError) {
            console.error('Error fetching attendance stats:', attError);
        }

        // Aggregate Attendance by Day
        const attendanceMap = new Map<string, number>();
        attendance?.forEach(a => {
            const day = a.check_in_time.split('T')[0]; // YYYY-MM-DD
            attendanceMap.set(day, (attendanceMap.get(day) || 0) + 1);
        });

        return {
            byCoach: Array.from(coachMap.entries()).map(([name, value]) => ({ name, value })),
            byCourt: Array.from(courtMap.entries()).map(([name, value]) => ({ name, value })),
            attendance: Array.from(attendanceMap.entries())
                .map(([date, count]) => ({ date, count }))
                .sort((a, b) => a.date.localeCompare(b.date))
        };
    }
};
