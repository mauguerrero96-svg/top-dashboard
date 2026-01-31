import { supabase } from '@/lib/supabase';

export interface Invoice {
    id: string;
    serial_id: string;
    player_id?: string;
    player_name?: string; // For display after join
    description: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    created_at?: string;
}

export const invoicesService = {
    async getInvoices() {
        // We join with players table to get the name
        const { data, error } = await supabase
            .from('invoices')
            .select(`
                *,
                dashboard_players (
                    name
                )
            `)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching invoices:', error);
            return [];
        }

        return data.map((inv: any) => ({
            ...inv,
            player_name: inv.dashboard_players?.name || 'Unknown'
        }));
    },

    async updateStatus(id: string, status: 'Paid' | 'Pending' | 'Overdue') {
        // If marking as Paid, we should record the transaction
        if (status === 'Paid') {
            const { data: invoice } = await supabase
                .from('invoices')
                .select('*')
                .eq('id', id)
                .single();

            if (invoice) {
                // Record Income
                const { error: txError } = await supabase
                    .from('financial_transactions')
                    .insert([{
                        amount: invoice.amount,
                        type: 'income',
                        category: 'Membresía', // Default category for invoice payments
                        description: `Pago Factura ${invoice.serial_id} - ${invoice.description}`,
                        date: new Date().toISOString().split('T')[0],
                        player_id: invoice.player_id
                    }]);

                if (txError) {
                    console.error('Error creating transaction for invoice payment:', txError);
                    // Continue to update status? Or fail? Let's log but continue to clear debt.
                }
            }
        }

        const { error } = await supabase
            .from('invoices')
            .update({ status })
            .eq('id', id);

        return !error;
    },

    async createInvoice(invoice: Partial<Invoice>) {
        const { data, error } = await supabase
            .from('invoices')
            .insert([invoice])
            .select()
            .single();

        if (error) {
            console.error('Error creating invoice:', error);
            return null;
        }
        return data;
    }
};
