'use server';

import { supabaseServer } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export interface TransactionData {
    amount: number;
    type: 'income' | 'expense';
    category: string;
    description: string;
    date: string;
    player_id?: string;
}

export async function addTransaction(data: TransactionData) {
    const supabase = supabaseServer;

    // 1. Insert Transaction
    const { error } = await supabase
        .from('financial_transactions')
        .insert([
            {
                amount: data.amount,
                type: data.type,
                category: data.category,
                description: data.description,
                date: data.date,
                player_id: data.player_id || null,
            },
        ]);

    if (error) {
        console.error('Error adding transaction:', error);
        throw new Error('Failed to add transaction');
    }

    // 2. Data Sync: If linked to Player & Income, pay off pending invoices
    if (data.type === 'income' && data.player_id) {
        // Fetch pending invoices for this player, oldest first
        const { data: invoices } = await supabase
            .from('invoices')
            .select('*')
            .eq('player_id', data.player_id)
            .in('status', ['Pending', 'Overdue'])
            .order('date', { ascending: true });

        if (invoices && invoices.length > 0) {
            let remainingPayment = data.amount;

            for (const invoice of invoices) {
                if (remainingPayment <= 0) break;

                const invoiceAmount = Number(invoice.amount);

                if (remainingPayment >= invoiceAmount) {
                    await supabase
                        .from('invoices')
                        .update({ status: 'Paid' })
                        .eq('id', invoice.id);
                    remainingPayment -= invoiceAmount;
                }
            }
        }
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function payInvoice(invoiceId: string) {
    const supabase = supabaseServer;

    // 1. Get Invoice Details
    const { data: invoice, error: fetchError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();

    if (fetchError || !invoice) {
        console.error('Error fetching invoice:', fetchError);
        throw new Error('Invoice not found');
    }

    // 2. Mark as Paid
    const { error: updateError } = await supabase
        .from('invoices')
        .update({ status: 'Paid' })
        .eq('id', invoiceId);

    if (updateError) {
        console.error('Error updating invoice:', updateError);
        throw new Error('Failed to update invoice');
    }

    // 3. Create Financial Transaction (Income)
    // We use the invoice details to create an accurate income record
    const { error: txError } = await supabase
        .from('financial_transactions')
        .insert([{
            amount: invoice.amount,
            type: 'income',
            category: 'Membresía', // Or 'Cuotas' depending on standardized categories
            description: `Pago Factura ${invoice.serial_id} - ${invoice.description}`,
            date: new Date().toISOString().split('T')[0], // Today
            player_id: invoice.player_id,
            payment_method: 'Manual'
        }]);

    if (txError) {
        console.error('Error creating transaction:', txError);
        // We do NOT rollback invoice update here to favor user experience (debt cleared), 
        // but ideally this should be a transaction.
    }

    // 4. Revalidate all relevant paths
    revalidatePath('/dashboard');
    revalidatePath('/payments');
    revalidatePath('/finances');

    return { success: true };
}

export async function updateInvoice(invoice: { id: string, amount: number, description: string, date: string, status: 'Paid' | 'Pending' | 'Overdue', serial_id: string }) {
    const supabase = supabaseServer;

    // 1. Update Invoice
    const { error: invError } = await supabase
        .from('invoices')
        .update({
            amount: invoice.amount,
            description: invoice.description,
            date: invoice.date
        })
        .eq('id', invoice.id);

    if (invError) {
        console.error('Error updating invoice:', invError);
        throw new Error('Failed to update invoice');
    }

    // 2. If Invoice is Paid, attempt to update linked Transaction
    // Constraint: We rely on the description pattern "Pago Factura [Serial]..." to link them.
    if (invoice.status === 'Paid') {
        const expectedDescriptionPattern = `Pago Factura ${invoice.serial_id}%`;

        // Find transaction
        const { data: txs } = await supabase
            .from('financial_transactions')
            .select('id')
            .ilike('description', expectedDescriptionPattern)
            .limit(1);

        if (txs && txs.length > 0) {
            const txId = txs[0].id;
            // Update transaction
            const { error: txUpdateError } = await supabase
                .from('financial_transactions')
                .update({
                    amount: invoice.amount,
                    description: `Pago Factura ${invoice.serial_id} - ${invoice.description}`,
                    date: invoice.date // Keeping dates in sync
                })
                .eq('id', txId);

            if (txUpdateError) {
                console.warn('Could not sync transaction update:', txUpdateError);
            }
        }
    }

    revalidatePath('/payments');
    revalidatePath('/dashboard');
    revalidatePath('/finances');

    return { success: true };
}
