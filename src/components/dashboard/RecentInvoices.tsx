import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Invoice {
    id: string;
    serial_id: string;
    player_name: string;
    description: string;
    amount: number;
    date: string;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export function RecentInvoices({ invoices }: { invoices: Invoice[] }) {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'Paid': return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle, label: 'Pagado' };
            case 'Pending': return { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'Pendiente' };
            case 'Overdue': return { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: AlertCircle, label: 'Vencido' };
            default: return { color: 'bg-slate-100 text-slate-700', icon: FileText, label: status };
        }
    };

    return (
        <Card title="Últimas Facturas" description="Actividad reciente de facturación">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-slate-500 font-medium border-b border-slate-100">
                        <tr>
                            <th className="pb-3 pl-2">Factura</th>
                            <th className="pb-3">Socio</th>
                            <th className="pb-3 text-right">Monto</th>
                            <th className="pb-3 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {invoices.map((inv) => {
                            const status = getStatusConfig(inv.status);
                            const StatusIcon = status.icon;
                            return (
                                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3 pl-2">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 text-xs">{inv.serial_id}</span>
                                            <span className="text-[10px] text-slate-400">
                                                {format(parseISO(inv.date), 'd MMM', { locale: es })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <p className="font-medium text-slate-800 truncate max-w-[120px]">{inv.player_name}</p>
                                        <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{inv.description}</p>
                                    </td>
                                    <td className="py-3 text-right font-bold text-slate-900">
                                        ${inv.amount.toLocaleString()}
                                    </td>
                                    <td className="py-3 flex justify-center">
                                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${status.color}`}>
                                            <StatusIcon size={10} />
                                            {status.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                                    No hay facturas recientes
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
