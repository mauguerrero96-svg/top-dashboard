'use client';

import { DashboardPlayer } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, Mail, CheckCircle2 } from 'lucide-react';

interface PendingPaymentTableProps {
    players: DashboardPlayer[];
}

export function PendingPaymentsTable({ players }: PendingPaymentTableProps) {
    // Filter and Sort: Active + Pending Debt > 0, sorted by Debt Desc
    const pendingPlayers = players
        .filter(p => {
            const fee = p.monthly_fee || 0;
            const paid = p.total_paid || 0;
            const debt = Math.max(0, fee - paid);
            // Show if Active AND has debt > 0 (regardless of status label, to be safe)
            return p.status === 'Activo' && debt > 0;
        })
        .map(p => {
            const fee = p.monthly_fee || 0;
            const paid = p.total_paid || 0;
            const debt = Math.max(0, fee - paid);
            const progress = fee > 0 ? (paid / fee) * 100 : 0;
            return { ...p, debt, progress, fee, paid };
        })
        .sort((a, b) => b.debt - a.debt);

    return (
        <Card className="w-full border-l-4 border-l-orange-400">
            <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-orange-500" size={20} />
                <h3 className="text-lg font-bold text-slate-900">Cobranza Pendiente</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-500">
                            <th className="pb-3 font-medium pl-2">Jugador</th>
                            <th className="pb-3 font-medium">Clínica</th>
                            <th className="pb-3 font-medium text-right">Deuda</th>
                            <th className="pb-3 font-medium text-center pr-2">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingPlayers.map((player) => (
                            <tr key={player.id} className="border-b border-slate-50 last:border-0 hover:bg-orange-50/50 transition-colors">
                                <td className="py-3 font-medium text-slate-900 pl-2">
                                    <div className="flex flex-col">
                                        <span>{player.name}</span>
                                        {/* Progress Bar */}
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-lime-500 rounded-full"
                                                style={{ width: `${player.progress}%` }}
                                            />
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">
                                            Pagado: ${player.paid.toLocaleString()} de ${player.fee.toLocaleString()}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-slate-500 text-xs">{player.clinic}</td>
                                <td className="py-3 text-right font-bold text-orange-600">
                                    ${player.debt.toLocaleString()}
                                </td>
                                <td className="py-3 text-center pr-2">
                                    <a
                                        href={`mailto:${player.email}?subject=Recordatorio de Pago - Top Tennis&body=Hola ${player.name},%0D%0A%0D%0ATe recordamos que tienes un saldo pendiente de $${player.debt.toLocaleString()} correspondiente a tu mensualidad.%0D%0A%0D%0ASaludos,%0D%0ATop Tennis.`}
                                        className="inline-flex items-center gap-1 text-xs bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 px-2.5 py-1.5 rounded-md text-slate-600 transition-colors"
                                    >
                                        <Mail size={12} />
                                        Recordar
                                    </a>
                                </td>
                            </tr>
                        ))}
                        {pendingPlayers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-slate-400">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <CheckCircle2 size={32} className="text-lime-500/50" />
                                        <span>¡Todo pagado! No hay deudas pendientes.</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
