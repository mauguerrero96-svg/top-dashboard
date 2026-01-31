'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Save, Loader2, DollarSign, ArrowUpCircle, ArrowDownCircle, User } from 'lucide-react';
import { addTransaction } from '@/actions/finance';
import { DashboardPlayer } from '@/types/dashboard';

// Categories tailored for tennis club management
const INCOME_CATEGORIES = ['Clases', 'Torneos', 'Rentas', 'Membresías', 'Abono', 'Venta de Equipo', 'Otros'];
const EXPENSE_CATEGORIES = ['Mantenimiento', 'Salarios', 'Equipo', 'Servicios', 'Impuestos', 'Otros'];

interface FinanceManagerProps {
    players: DashboardPlayer[];
}

export function FinanceManager({ players }: FinanceManagerProps) {
    const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(INCOME_CATEGORIES[0]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await addTransaction({
                amount: parseFloat(amount),
                type: activeTab,
                category,
                description,
                date,
                player_id: selectedPlayerId || undefined
            });

            setMessage({ type: 'success', text: `${activeTab === 'income' ? 'Ingreso' : 'Egreso'} registrado correctamente.` });
            setAmount('');
            setDescription('');
            setSelectedPlayerId('');
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al guardar el registro.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full h-full">
            <div className="flex flex-col h-full">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <DollarSign className="text-lime-600" size={20} />
                        Gestión Financiera
                    </h3>
                    <p className="text-sm text-slate-500">Registrar movimientos diarios</p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('income');
                            setCategory(INCOME_CATEGORIES[0]);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'income'
                            ? 'bg-white text-lime-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <ArrowUpCircle size={16} className={activeTab === 'income' ? 'text-lime-600' : ''} />
                        Ingreso
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('expense');
                            setCategory(EXPENSE_CATEGORIES[0]);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'expense'
                            ? 'bg-white text-red-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <ArrowDownCircle size={16} className={activeTab === 'expense' ? 'text-red-600' : ''} />
                        Egreso
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-slate-700 mb-1">Monto</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-slate-700 mb-1">Fecha</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Categoría</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all cursor-pointer"
                        >
                            {(activeTab === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Descripción</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all"
                            placeholder="Detalles del movimiento..."
                        />
                    </div>

                    {/* Player Selection */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Vincular Jugador (Opcional)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <User size={16} />
                            </span>
                            <select
                                value={selectedPlayerId}
                                onChange={(e) => setSelectedPlayerId(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-lime-500 outline-none transition-all cursor-pointer"
                            >
                                <option value="">-- Seleccionar Jugador --</option>
                                {players.map(player => (
                                    <option key={player.id} value={player.id}>
                                        {player.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-auto pt-4">
                        {message && (
                            <div className={`mb-3 p-2 rounded text-xs font-medium ${message.type === 'success' ? 'bg-lime-50 text-lime-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2.5 px-4 rounded-lg font-medium text-white shadow-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'income'
                                ? 'bg-lime-600 hover:bg-lime-700 focus:ring-lime-500'
                                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                } focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {isLoading ? 'Guardando...' : 'Guardar Movimiento'}
                        </button>
                    </div>
                </form>
            </div>
        </Card>
    );
}
