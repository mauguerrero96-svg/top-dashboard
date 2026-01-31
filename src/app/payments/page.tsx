'use client';

import { useState, useEffect, useMemo } from 'react';
import { DollarSign, Search, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { payInvoice, updateInvoice } from '@/actions/finance';
import { fetchInvoicesAction } from '@/actions/client_data';
import { Invoice } from '@/types/bookings';
import { EditInvoiceModal } from '@/components/payments/EditInvoiceModal';
import { Edit2 } from 'lucide-react';

export default function PaymentsPage() {
    const [activeTab, setActiveTab] = useState<'receivable' | 'history'>('receivable');
    const [searchTerm, setSearchTerm] = useState('');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

    const fetchInvoices = async () => {
        setLoading(true);
        // Use Server Action
        const data = await fetchInvoicesAction();
        // data comes from invoicesService.getInvoices() which returns items with player_name
        // Mapping might be needed if types mismatch, but Invoice type should match reasonably well.
        setInvoices(data as Invoice[]);
        setLoading(false);
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleUpdateInvoice = async (updatedData: Partial<Invoice>) => {
        if (!editingInvoice) return;

        try {
            await updateInvoice({
                id: editingInvoice.id,
                amount: updatedData.amount!,
                description: updatedData.description!,
                date: updatedData.date!,
                status: editingInvoice.status,
                serial_id: editingInvoice.serial_id
            });

            // Refresh list
            fetchInvoices();
        } catch (error) {
            console.error(error);
            alert('Error al actualizar');
        }
    };

    const handleMarkAsPaid = async (id: string) => {
        try {
            const result = await payInvoice(id);
            if (result.success) {
                // Optimistically update UI
                setInvoices(current =>
                    current.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv)
                );
            }
        } catch (error) {
            alert('Error al procesar el pago. Intente nuevamente.');
            console.error(error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Overdue': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            // Tab Filtering
            if (activeTab === 'receivable') {
                if (inv.status === 'Paid') return false;
            } else {
                // history shows mainly paid, or maybe everything? Let's show Paid + All for history context
                // User usually wants to see what was paid.
                // Let's make History show EVERYTHING or just PAID?
                // Let's show "Paid" primarily, but maybe a sub-filter for All?
                // Simpler: History = Paid. Receivable = Pending/Overdue.
                if (inv.status !== 'Paid') return false;
            }

            if (!searchTerm) return true;
            const searchString = `${inv.player_name} ${inv.description} ${inv.amount} ${inv.serial_id}`.toLowerCase();
            return searchString.includes(searchTerm.toLowerCase());
        });
    }, [invoices, activeTab, searchTerm]);

    const totalRevenue = useMemo(() => {
        const now = new Date();
        return invoices
            .filter(i => i.status === 'Paid' && format(parseISO(i.date), 'yyyy-MM') === format(now, 'yyyy-MM'))
            .reduce((acc, curr) => acc + curr.amount, 0);
    }, [invoices]);

    const pendingAmount = useMemo(() =>
        invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0),
        [invoices]);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Pagos y Facturación</h1>
                    <p className="text-slate-500">Gestiona el estado financiero del club.</p>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 pr-6">
                        <div className="p-2 bg-green-50 rounded-lg text-green-600">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase">Recaudado (Mes)</p>
                            <p className="text-lg font-bold text-slate-800">${totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 pr-6">
                        <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium uppercase">Por Cobrar</p>
                            <p className="text-lg font-bold text-slate-800">${pendingAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs & Controls */}
            <div className="flex flex-col gap-4">
                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('receivable')}
                        className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'receivable' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Cuentas por Cobrar ({invoices.filter(i => i.status !== 'Paid').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'history' ? 'border-limes-500 text-lime-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        Historial de Pagos
                    </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por socio, concepto..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto min-h-[400px]">
                {loading ? (
                    <div className="flex items-center justify-center h-full py-20">
                        <Loader2 size={32} className="text-slate-300 animate-spin" />
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">ID Factura</th>
                                <th className="px-6 py-4">Socio</th>
                                <th className="px-6 py-4">Concepto</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Monto</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInvoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{inv.serial_id}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                {inv.player_name && inv.player_name.charAt(0)}
                                            </div>
                                            {inv.player_name || 'Desconocido'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{inv.description}</td>
                                    <td className="px-6 py-4 text-slate-500">{format(parseISO(inv.date), 'dd MMM yyyy', { locale: es })}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">${inv.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(inv.status)}`}>
                                            {inv.status === 'Paid' ? 'Pagado' : inv.status === 'Overdue' ? 'Vencido' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {inv.status !== 'Paid' && (
                                                <button
                                                    onClick={() => handleMarkAsPaid(inv.id)}
                                                    className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                                                >
                                                    Marcar Pagado
                                                </button>
                                            )}

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => setEditingInvoice(inv)}
                                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Editar Factura"
                                            >
                                                <Edit2 size={16} />
                                            </button>

                                            {inv.status === 'Paid' && (
                                                <div className="flex items-center gap-1 text-green-600 text-xs font-medium" title="Pagado">
                                                    <CheckCircle size={16} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
                }

                {
                    !loading && filteredInvoices.length === 0 && (
                        <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
                            <AlertCircle size={32} className="text-slate-300" />
                            <p>
                                {activeTab === 'receivable'
                                    ? '¡Excelente! No hay cuentas por cobrar pendientes.'
                                    : 'No hay historial de pagos registrado todavía.'}
                            </p>
                        </div>
                    )
                }
            </div >

            <EditInvoiceModal
                isOpen={!!editingInvoice}
                onClose={() => setEditingInvoice(null)}
                invoice={editingInvoice}
                onSubmit={handleUpdateInvoice}
            />
        </div >
    );
}
