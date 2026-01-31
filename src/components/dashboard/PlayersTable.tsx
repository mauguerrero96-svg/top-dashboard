'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardPlayer } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, Filter } from 'lucide-react';
import { EditPlayerModal } from './EditPlayerModal';

interface PlayersTableProps {
    players: DashboardPlayer[];
}

export function PlayersTable({ players }: PlayersTableProps) {
    const router = useRouter();
    const [filterClinic, setFilterClinic] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterPayment, setFilterPayment] = useState<string>('all');
    const [search, setSearch] = useState('');

    // Edit State
    const [selectedPlayer, setSelectedPlayer] = useState<DashboardPlayer | null>(null);

    const filteredPlayers = players.filter(p => {
        const matchClinic = filterClinic === 'all' || p.clinic === filterClinic;
        const matchStatus = filterStatus === 'all' || p.status === filterStatus;
        const matchPayment = filterPayment === 'all' || p.payment_status === filterPayment;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.email || '').toLowerCase().includes(search.toLowerCase());
        return matchClinic && matchStatus && matchPayment && matchSearch;
    });

    const handleEditSuccess = () => {
        // Refresh the page data
        router.refresh();
    };

    return (
        <Card className="w-full">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-900">Players Overview</h3>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar jugador..."
                            className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-lime-500 outline-none w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <select
                        className="px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-lime-500 outline-none cursor-pointer"
                        value={filterClinic}
                        onChange={(e) => setFilterClinic(e.target.value)}
                    >
                        <option value="all">Todas las Clínicas</option>
                        <option value="Alto Rendimiento">Alto Rendimiento</option>
                        <option value="Clinica A">Clínica A</option>
                        <option value="Clinica B">Clínica B</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-lime-500 outline-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                        <option value="Beca">Beca</option>
                    </select>

                    <select
                        className="px-3 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-lime-500 outline-none cursor-pointer"
                        value={filterPayment}
                        onChange={(e) => setFilterPayment(e.target.value)}
                    >
                        <option value="all">Todos los Pagos</option>
                        <option value="Pagado">Pagado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="NA">NA</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-500">
                            <th className="pb-3 font-medium pl-2">Name</th>
                            <th className="pb-3 font-medium">Clinic</th>
                            <th className="pb-3 font-medium text-center">Status</th>
                            <th className="pb-3 font-medium">Horario</th>
                            <th className="pb-3 font-medium text-right">Fee</th>
                            <th className="pb-3 font-medium text-center">Payment</th>
                            <th className="pb-3 font-medium text-right pr-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlayers.map((player) => {
                            // Summarize schedule
                            const schedules = player.schedules || [];
                            const days = schedules.map(s => s.day_of_week).join(', ');
                            const time = schedules[0]?.start_time?.slice(0, 5) || '';
                            const scheduleSummary = days ? `${days} ${time}` : 'Sin horario';

                            return (
                                <tr key={player.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="py-3 font-medium text-slate-900 pl-2">{player.name}</td>
                                    <td className="py-3 text-slate-500">{player.clinic}</td>
                                    <td className="py-3 text-center">
                                        <Badge variant={
                                            player.status === 'Activo' ? 'success' :
                                                player.status === 'Beca' ? 'info' : 'default'
                                        }>
                                            {player.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-sm text-slate-500 truncate max-w-[150px]" title={scheduleSummary}>
                                        {scheduleSummary}
                                    </td>
                                    <td className="py-3 text-right font-bold text-slate-800">
                                        ${player.monthly_fee?.toLocaleString()}
                                    </td>
                                    <td className="py-3 text-center">
                                        <Badge variant={
                                            player.payment_status === 'Pagado' ? 'success' :
                                                player.payment_status === 'Pendiente' ? 'warning' : 'default'
                                        }>
                                            {player.payment_status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 text-right pr-2">
                                        <button
                                            onClick={() => setSelectedPlayer(player)}
                                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                        >
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredPlayers.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-400">
                                    No players found matching filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedPlayer && (
                <EditPlayerModal
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                    onSuccess={handleEditSuccess}
                />
            )}
        </Card>
    );
}
