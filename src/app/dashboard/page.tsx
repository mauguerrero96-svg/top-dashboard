import { Card } from '@/components/ui/Card';
import { dashboardService } from '@/services/dashboard';

import { FinanceManager } from '@/components/dashboard/FinanceManager';
import { RecentInvoices } from '@/components/dashboard/RecentInvoices';

import { ClinicStatsCards } from '@/components/dashboard/ClinicStats';
import { DollarSign, Users, AlertCircle, GraduationCap } from 'lucide-react';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // Fetch data
    const stats = await dashboardService.getStats();
    const players = await dashboardService.getPlayers();
    const recentInvoices = await dashboardService.getInvoices(5);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center text-slate-900">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Panel Operativo</h1>
                    <p className="text-slate-500">Gestión de club, pagos y KPIs.</p>
                </div>
            </div>

            {/* A. KPIs PRINCIPALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Ingresos Confirmados */}
                <Card className="border-none shadow-xl shadow-lime-500/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-lime-100 rounded-full flex items-center justify-center text-lime-700">
                            <DollarSign size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold bg-lime-50 text-lime-700 px-2 py-1 rounded-full border border-lime-200">
                            Confirmado
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Ingresos Mensuales</p>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            ${stats.confirmedRevenue.toLocaleString()}
                        </h2>
                    </div>
                </Card>

                {/* Ingresos Pendientes */}
                <Card className="border-none shadow-xl shadow-orange-500/10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-100 rounded-full flex items-center justify-center text-orange-700">
                            <AlertCircle size={24} />
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded-full border border-orange-200">
                            Por Cobrar
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium mb-1">Ingresos Pendientes</p>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            ${stats.pendingRevenue.toLocaleString()}
                        </h2>
                    </div>
                </Card>

                {/* Jugadores Activos */}
                <Card title="Jugadores Activos" description="Total inscritos activos">
                    <div className="flex items-end justify-between mt-2">
                        <h2 className="text-4xl font-bold text-slate-900">{stats.activePlayers}</h2>
                        <div className="p-3 bg-sky-100 text-sky-600 rounded-full">
                            <Users size={24} />
                        </div>
                    </div>
                </Card>

                {/* Becas Activas */}
                <Card title="Becas Activas" description="Apoyo deportivo">
                    <div className="flex items-end justify-between mt-2">
                        <h2 className="text-4xl font-bold text-slate-900">{stats.activeScholarships}</h2>
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                            <GraduationCap size={24} />
                        </div>
                    </div>
                </Card>
            </div>

            {/* B. KPIs POR CLÍNICA */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 ml-1">Rendimiento por Clínica</h3>
                <ClinicStatsCards stats={stats.clinicStats} />
            </div>

            {/* TABLAS CORE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <FinanceManager players={players} />
                </div>
                <div className="lg:col-span-1">
                    <RecentInvoices invoices={recentInvoices} />
                </div>
            </div>
        </div>
    );
}
