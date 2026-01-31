'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Invoice } from '@/services/invoices';

interface EditInvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Partial<Invoice>) => Promise<void>;
    invoice: Invoice | null;
}

export function EditInvoiceModal({ isOpen, onClose, onSubmit, invoice }: EditInvoiceModalProps) {
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (invoice) {
            setAmount(invoice.amount.toString());
            setDescription(invoice.description);
            // Format date to YYYY-MM-DD for input
            const d = new Date(invoice.date);
            setDate(d.toISOString().split('T')[0]);
        }
    }, [invoice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoice) return;

        setIsLoading(true);
        try {
            await onSubmit({
                ...invoice,
                amount: parseFloat(amount),
                description,
                date
            });
            onClose();
        } catch (error) {
            console.error(error);
            alert('Error al guardar cambios');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !invoice) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Editar Factura</h3>
                        <p className="text-xs text-slate-500 font-medium">{invoice.serial_id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Monto</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all font-bold text-slate-800"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Concepto / Descripción</label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all text-sm font-medium text-slate-700"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Fecha de Emisión</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all text-sm font-medium text-slate-700"
                        />
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            <span>Guardar</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
