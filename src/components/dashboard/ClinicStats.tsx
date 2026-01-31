'use client';

import { ClinicStats } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Users, DollarSign, AlertCircle } from 'lucide-react';

interface ClinicStatsProps {
    stats: ClinicStats[];
}

export function ClinicStatsCards({ stats }: ClinicStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
                <Card key={stat.clinic} className="border-none shadow-md hover:shadow-lg">
                    <h4 className="text-md font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                        {stat.clinic}
                    </h4>

                    <div className="space-y-4">
                        {/* Jugadores */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <Users size={16} />
                                <span>Jugadores</span>
                            </div>
                            <span className="font-bold text-slate-900">{stat.activePlayers}</span>
                        </div>

                        {/* Ingresos */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                <DollarSign size={16} />
                                <span>Ingresos</span>
                            </div>
                            <span className="font-bold text-emerald-600">${stat.totalRevenue.toLocaleString()}</span>
                        </div>

                        {/* Pendiente */}
                        <div className="flex items-center justify-between bg-orange-50 p-2 rounded-lg">
                            <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
                                <AlertCircle size={14} />
                                <span>Pendiente</span>
                            </div>
                            <span className="font-bold text-orange-700">${stat.pendingRevenue.toLocaleString()}</span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
