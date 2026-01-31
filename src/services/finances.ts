import { supabaseServer as supabase } from '@/lib/supabaseServer';

export interface Transaction {
    id?: string;
    date: string; // YYYY-MM-DD
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description?: string;
    paymentMethod: string;
    bookingId?: string;
    sourceTable?: 'financial_transactions' | 'player_payments';
    playerId?: string;
}

export const financesService = {
    /**
     * Get all transactions within a date range
     */
    async getTransactions(startDate: Date, endDate: Date): Promise<Transaction[]> {
        // 1. Fetch Manual Transactions
        const { data: manualData, error: manualError } = await supabase
            .from('financial_transactions')
            .select('*')
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        if (manualError) {
            console.error('Error fetching manual transactions:', manualError);
            return [];
        }

        // 2a. Fetch Paid Invoices (Deprecated for cash flow, kept empty to minimize code change impact if needed later)
        const invoiceData: any[] = [];

        // 3. Fetch Player Payments (Abonos)
        const { data: paymentsData, error: paymentsError } = await supabase
            .from('player_payments')
            .select('*, player:dashboard_players(name, clinic)')
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString());

        if (paymentsError) {
            console.error('Error fetching player payments:', paymentsError);
            return [];
        }

        // 3. Map Manual Transactions
        const manualTransactions: Transaction[] = (manualData || []).map((t: any) => ({
            id: t.id,
            date: t.date,
            amount: Number(t.amount),
            type: t.type,
            category: t.category,
            description: t.description,
            paymentMethod: t.payment_method,
            bookingId: t.booking_id,
            sourceTable: 'financial_transactions'
        }));

        // 4. (Removed) Map Invoices to Transactions
        // We now rely on player_payments for cash flow to avoid double counting.
        // If we included Paid Invoices here, we would count the income twice (once in Invoice, once in Payment).

        // 5. Map Player Payments
        const paymentTransactions: Transaction[] = (paymentsData || []).map((pay: any) => ({
            id: pay.id,
            date: pay.date,
            amount: Number(pay.amount),
            type: 'income',
            category: pay.player?.clinic || 'Abono',
            description: `Abono - ${pay.player?.name || 'Usuario'}`,
            paymentMethod: 'Parcial',
            sourceTable: 'player_payments',
            playerId: pay.player_id
        }));

        // 6. Combine and Sort
        return [...manualTransactions, ...paymentTransactions].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    },

    /**
     * Add a new transaction
     */
    async addTransaction(transaction: Transaction): Promise<Transaction | null> {
        const { data, error } = await supabase
            .from('financial_transactions')
            .insert({
                date: transaction.date,
                amount: transaction.amount,
                type: transaction.type,
                category: transaction.category,
                description: transaction.description,
                payment_method: transaction.paymentMethod,
                booking_id: transaction.bookingId
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding transaction:', error);
            return null;
        }

        return {
            id: data.id,
            date: data.date,
            amount: Number(data.amount),
            type: data.type,
            category: data.category,
            description: data.description,
            paymentMethod: data.payment_method,
            bookingId: data.booking_id
        };
    },

    /**
     * Get monthly summary (income vs expenses)
     * For simplicity, this acts as a helper to process data on client side or could be a DB function
     * Here we'll stick to basic fetching and letting client aggregate for charts
     */
    /**
     * Get Balance Sheet Data (Snapshot at specific date)
     */
    async getBalanceSheet(date: Date) {
        const dateStr = date.toISOString();

        // 1. Calculate Cash on Hand (Retained Earnings)
        // Fetch ALL transactions up to this date
        // Note: For a real app, we would use a materialized view or perform this calculation in SQL.
        // For this scale, we sum everything.

        // Paid Invoices Sum (REMOVED to avoid double counting with player_payments)
        const totalInvoicedIncome = 0;

        // Player Payments Sum
        const { data: playerPay } = await supabase
            .from('player_payments')
            .select('amount')
            .lte('date', dateStr);
        const totalPlayerPayments = playerPay?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

        // Manual Transactions Sum
        const { data: manualTx } = await supabase
            .from('financial_transactions')
            .select('amount, type')
            .lte('date', dateStr);

        const manualIncome = manualTx?.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0) || 0;
        const manualExpenses = manualTx?.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const cashOnHand = (totalInvoicedIncome + manualIncome + totalPlayerPayments) - manualExpenses;

        // 2. Accounts Receivable (Pending Invoices)
        const { data: pendingInv } = await supabase
            .from('invoices')
            .select('amount')
            .eq('status', 'Pending')
            .lte('date', dateStr);

        const accountsReceivable = pendingInv?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

        return {
            assets: {
                cash: cashOnHand,
                accountsReceivable: accountsReceivable,
                total: cashOnHand + accountsReceivable
            },
            liabilities: {
                total: 0 // Placeholder
            },
            equity: {
                total: cashOnHand + accountsReceivable // Assets - Liabilities
            }
        };
    },

    /**
     * Delete a transaction
     */
    async deleteTransaction(id: string, type: string, sourceTable?: string, playerId?: string): Promise<boolean> {
        if (!sourceTable) {
            // Fallback for legacy calls or defaults
            sourceTable = 'financial_transactions';
        }

        if (sourceTable === 'player_payments') {
            // Use logic similar to dashboardService.deletePayment
            // 1. Get payment to verify (optional, but good for validation)
            // 2. Delete
            const { error: deleteError } = await supabase
                .from('player_payments')
                .delete()
                .eq('id', id);

            if (deleteError) {
                console.error('Error deleting player payment:', deleteError);
                return false;
            }

            // 3. Recalculate Player Total if playerId is present
            if (playerId) {
                const { data: payments } = await supabase
                    .from('player_payments')
                    .select('amount')
                    .eq('player_id', playerId);

                const newTotal = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

                // Get monthly fee
                const { data: player } = await supabase
                    .from('dashboard_players')
                    .select('monthly_fee')
                    .eq('id', playerId)
                    .single();

                const fee = Number(player?.monthly_fee || 0);
                let newStatus = 'Pendiente';
                if (newTotal >= fee && fee > 0) newStatus = 'Pagado';

                await supabase
                    .from('dashboard_players')
                    .update({ total_paid: newTotal, payment_status: newStatus })
                    .eq('id', playerId);
            }
            return true;

        } else {
            // Regular Financial Transaction
            const { error } = await supabase
                .from('financial_transactions')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting transaction:', error);
                return false;
            }
            return true;
        }
    },

    /**
     * Update a transaction
     */
    async updateTransaction(transaction: Transaction): Promise<boolean> {
        if (!transaction.id || !transaction.sourceTable) return false;

        if (transaction.sourceTable === 'player_payments') {
            // Update the payment record
            const { error } = await supabase
                .from('player_payments')
                .update({
                    amount: transaction.amount,
                    date: transaction.date,
                    notes: transaction.description // Map description to notes
                })
                .eq('id', transaction.id);

            if (error) {
                console.error('Error updating player payment:', error);
                return false;
            }

            // Recalc Player Total
            if (transaction.playerId) {
                const { data: payments } = await supabase
                    .from('player_payments')
                    .select('amount')
                    .eq('player_id', transaction.playerId);

                const newTotal = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

                // Get monthly fee
                const { data: player } = await supabase
                    .from('dashboard_players')
                    .select('monthly_fee')
                    .eq('id', transaction.playerId)
                    .single();

                const fee = Number(player?.monthly_fee || 0);
                let newStatus = 'Pendiente';
                if (newTotal >= fee && fee > 0) newStatus = 'Pagado';

                await supabase
                    .from('dashboard_players')
                    .update({ total_paid: newTotal, payment_status: newStatus })
                    .eq('id', transaction.playerId);
            }
            return true;

        } else {
            // Financial Transaction
            const { error } = await supabase
                .from('financial_transactions')
                .update({
                    amount: transaction.amount,
                    date: transaction.date,
                    type: transaction.type,
                    category: transaction.category,
                    description: transaction.description,
                    payment_method: transaction.paymentMethod
                })
                .eq('id', transaction.id);

            if (error) {
                console.error('Error updating finance transaction:', error);
                return false;
            }
            return true;
        }
    }
};
