'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Search, Filter, Plus, MoreHorizontal, Mail, Phone, Edit2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DashboardPlayer } from '@/types/dashboard';
import { EditPlayerModal } from '@/components/dashboard/EditPlayerModal';
import { PlayerDetailModal } from '@/components/dashboard/PlayerDetailModal';
import { dashboardService } from '@/services/dashboard';

// DB Payment Type
interface DBPayment {
    id: string;
    player_name: string;
    amount: number;
    status: string;
    payment_date: string;
}

// UI Type - Extends DashboardPlayer to include calculated balance
interface Player extends DashboardPlayer {
    balance: number;
    membershipType: string;
    nextBillingDate: string;
}

export default function PlayersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [clinicFilter, setClinicFilter] = useState<string>('All');
    const [paymentFilter, setPaymentFilter] = useState<string>('All'); // All, Paid, Debt
    const [sortOrder, setSortOrder] = useState<string>('NameAsc'); // NameAsc, NameDesc, DebtDesc

    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [selectedPlayer, setSelectedPlayer] = useState<DashboardPlayer | null>(null);
    const [viewingPlayer, setViewingPlayer] = useState<DashboardPlayer | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch players using dashboardService which returns DashboardPlayer[] (with monthly_fee, etc)
            const playersData = await dashboardService.getPlayers();

            // Fetch payments to calculate balance
            const { data: paymentsData, error: paymentsError } = await supabase
                .from('invoices') // Use 'invoices' instead of dashboard_payments
                .select('*');

            if (paymentsError) throw paymentsError;

            // Process data
            const processedPlayers = playersData.map(player => {
                // Calculate balance: sum of 'Pending' invoices. 
                // We should link by player_id preferably, but dashboardService might return joined data.
                // dashboardService.getPlayers() returns simple players list.
                // Invoices table has player_id.

                // Let's rely on player_id matching
                const playerInvoices = paymentsData.filter(
                    (p: any) => p.player_id === player.id
                );

                const balance = playerInvoices
                    .filter((p: any) => p.status === 'Pending' || p.status === 'Overdue')
                    .reduce((sum: number, p: any) => sum + Number(p.amount), 0);

                return {
                    ...player,
                    balance,
                    membershipType: (player.monthly_fee || 0) > 0 ? 'Monthly' : 'Guest',
                    nextBillingDate: '01/02/2026', // Mocked for now
                };
            });

            setPlayers(processedPlayers);

        } catch (error) {
            console.error("Error fetching player data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEditSuccess = () => {
        fetchData();
    };

    const filteredPlayers = players.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (player.email || '').toLowerCase().includes(searchTerm.toLowerCase());

        let matchesStatus = true;
        if (statusFilter !== 'All') {
            if (statusFilter === 'Active') matchesStatus = player.status === 'Activo';
            else if (statusFilter === 'Paused') matchesStatus = player.status === 'Inactivo';
            else matchesStatus = player.status === statusFilter;
        }

        let matchesClinic = true;
        if (clinicFilter !== 'All') {
            matchesClinic = player.clinic === clinicFilter;
        }

        let matchesPayment = true;
        if (paymentFilter !== 'All') {
            if (paymentFilter === 'Debt') matchesPayment = player.balance > 0;
            if (paymentFilter === 'Paid') matchesPayment = player.balance <= 0;
        }

        return matchesSearch && matchesStatus && matchesClinic && matchesPayment;
    }).sort((a, b) => {
        if (sortOrder === 'NameAsc') return a.name.localeCompare(b.name);
        if (sortOrder === 'NameDesc') return b.name.localeCompare(a.name);
        if (sortOrder === 'DebtDesc') return b.balance - a.balance;
        return 0;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">Jugadores</h1>
                    <p className="text-slate-500">Gestiona la base de datos de socios y miembros.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg shadow-orange-500/20"
                >
                    <Plus size={20} />
                    <span>Nuevo Jugador</span>
                </button>
            </div>

            {/* Filters & Search */}
            <Card className="p-4 bg-white border-slate-200 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Advanced Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500 uppercase">Filtros:</span>
                    </div>

                    <select
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                        value={clinicFilter}
                        onChange={(e) => setClinicFilter(e.target.value)}
                    >
                        <option value="All">Todas las Clínicas</option>
                        <option value="Alto Rendimiento">Alto Rendimiento</option>
                        <option value="Clinica A">Clínica A</option>
                        <option value="Clinica B">Clínica B</option>
                    </select>

                    <select
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">Todos los estados</option>
                        <option value="Active">Activos</option>
                        <option value="Paused">Inactivos</option>
                        <option value="Beca">Beca</option>
                    </select>

                    <select
                        className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                        <option value="All">Todos los Pagos</option>
                        <option value="Paid">Al día</option>
                        <option value="Debt">Con Deuda</option>
                    </select>

                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Ordenar:</span>
                        <select
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="NameAsc">Nombre A-Z</option>
                            <option value="NameDesc">Nombre Z-A</option>
                            <option value="DebtDesc">Mayor Deuda</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Players List */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Cargando jugadores...</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredPlayers.map((player) => (
                        <div
                            key={player.id}
                            onClick={() => setViewingPlayer(player)}
                            className="cursor-pointer"
                        >
                            <Card className="hover:border-orange-200 transition-all shadow-sm bg-white group border-slate-200">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-orange-600 font-bold text-lg border border-slate-200">
                                            {player.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{player.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                                <span className="flex items-center gap-1"><Mail size={14} /> {player.email || 'N/A'}</span>
                                                <span className="flex items-center gap-1"><Phone size={14} /> {player.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                        {/* Membership Info */}
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Membresía</span>
                                            <span className="text-sm font-medium text-slate-700">{player.membershipType}</span>
                                        </div>

                                        {/* Balance & Status */}
                                        <div className="flex flex-col items-end gap-1 min-w-[100px]">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estado de Cuenta</span>
                                            <div className="flex items-center gap-2">
                                                {player.balance > 0 ? (
                                                    <span className="text-sm font-bold text-red-500">Debe ${player.balance}</span>
                                                ) : (
                                                    <span className="text-sm font-bold text-green-600">Al día</span>
                                                )}
                                                <Badge variant={
                                                    player.status === 'Activo' ? 'success' :
                                                        player.status === 'Beca' ? 'info' :
                                                            player.status === 'Inactivo' ? 'warning' : 'default'
                                                }>
                                                    {player.status}
                                                </Badge>
                                            </div>
                                            <span className="text-[10px] text-slate-400">Prox. Factura: {player.nextBillingDate}</span>
                                        </div>

                                        <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            {/* Stop Propagation to prevent opening modal when clicking edit */}
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setSelectedPlayer(player)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="Editar Jugador"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </div>

                                            <div onClick={(e) => e.stopPropagation()}>
                                                <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                                    <MoreHorizontal size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}

                    {filteredPlayers.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No se encontraron jugadores que coincidan con tu búsqueda.
                        </div>
                    )}
                </div>
            )}

            {selectedPlayer && (
                <EditPlayerModal
                    player={selectedPlayer}
                    onClose={() => setSelectedPlayer(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {isCreateModalOpen && (
                <EditPlayerModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        handleEditSuccess();
                        setIsCreateModalOpen(false);
                    }}
                />
            )}

            {viewingPlayer && (
                <PlayerDetailModal
                    player={viewingPlayer}
                    onClose={() => setViewingPlayer(null)}
                />
            )}
        </div>
    );
}
