'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { TrendingDown, TrendingUp, Wallet, Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { AddTransactionModal } from '@/components/reports/AddTransactionModal';
import { financesService, Transaction } from '@/services/finances';
import { format, startOfMonth, endOfMonth, subMonths, addMonths, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// --- Colors for Charts ---
const COLORS = {
    income: ['#84cc16', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7'], // Lime, Green, Blue, Amber, Purple
    expense: ['#ef4444', '#f97316', '#eab308', '#64748b', '#06b6d4'], // Red, Orange, Yellow, Slate, Cyan
};

export default function ReportsPage() {
    // --- State ---
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true);
        const start = startOfMonth(selectedMonth);
        const end = endOfMonth(selectedMonth);
        const data = await financesService.getTransactions(start, end);
        setTransactions(data);
        setLoading(false);
    }, [selectedMonth]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setSelectedMonth(current => direction === 'prev' ? subMonths(current, 1) : addMonths(current, 1));
    };

    // 1. Calculate Totals
    const incomeTransactions = useMemo(() => transactions.filter(t => t.type === 'income'), [transactions]);
    const expenseTransactions = useMemo(() => transactions.filter(t => t.type === 'expense'), [transactions]);

    const totalRevenue = useMemo(() => incomeTransactions.reduce((acc, curr) => acc + curr.amount, 0), [incomeTransactions]);
    const totalExpenses = useMemo(() => expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0), [expenseTransactions]);

    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

    // 2. Breakdown Data for Charts
    const incomeByCat = useMemo(() => {
        const map = new Map<string, number>();
        incomeTransactions.forEach(i => {
            map.set(i.category, (map.get(i.category) || 0) + i.amount);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [incomeTransactions]);

    const expenseByCat = useMemo(() => {
        const map = new Map<string, number>();
        expenseTransactions.forEach(e => {
            map.set(e.category, (map.get(e.category) || 0) + e.amount);
        });
        return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    }, [expenseTransactions]);

    // 3. Handle New Transaction
    const handleAddTransaction = async (data: any) => {
        // Convert modal data to Transaction format
        // Modal returns: type ('Income'|'Expense'), amount, category, description, date
        const newTransaction: Transaction = {
            date: data.date,
            amount: data.amount,
            type: data.type.toLowerCase() as 'income' | 'expense',
            category: data.category,
            description: data.description,
            paymentMethod: 'Manual', // Defaulting for now
        };

        const saved = await financesService.addTransaction(newTransaction);
        if (saved) {
            fetchData(); // Refresh list
            setIsModalOpen(false);
        } else {
            alert('Error al guardar la transacción');
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTransaction}
            />

            {/* Header with Month Selector */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Reportes Financieros</h1>
                    <p className="text-slate-500 font-medium">Análisis detallado de Ingresos y Egresos por mes.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    {/* Month Selector */}
                    <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                        <button
                            onClick={() => handleMonthChange('prev')}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="px-6 text-slate-800 font-bold flex items-center gap-2 min-w-[200px] justify-center text-lg">
                            <CalendarIcon size={18} className="text-emerald-500" />
                            <span className="capitalize">{format(selectedMonth, 'MMMM yyyy', { locale: es })}</span>
                        </div>
                        <button
                            onClick={() => handleMonthChange('next')}
                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
                    >
                        <Plus size={20} />
                        <span>Registrar</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={40} className="text-slate-300 animate-spin" />
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-none bg-lime-50/50">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-lime-100 rounded-2xl text-lime-700">
                                    <Wallet size={24} />
                                </div>
                                <span className={`px-3 py-1 bg-white rounded-full text-xs font-bold shadow-sm border ${netProfit >= 0 ? 'text-lime-700 border-lime-100' : 'text-red-600 border-red-100'}`}>
                                    Net Profit
                                </span>
                            </div>
                            <div>
                                <p className="text-lime-700/70 font-bold text-sm uppercase tracking-wider">Utilidad Neta</p>
                                <h2 className={`text-4xl font-extrabold mt-1 ${netProfit >= 0 ? 'text-slate-900' : 'text-red-500'}`}>
                                    ${netProfit.toLocaleString()}
                                </h2>
                                <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                                    <span className="text-lime-600 font-bold bg-lime-100 px-1.5 rounded">{profitMargin}%</span> Margen
                                </p>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Ingresos Totales</p>
                                <h2 className="text-4xl font-extrabold text-slate-900 mt-1">${totalRevenue.toLocaleString()}</h2>
                                <p className="text-sm text-slate-400 mt-2">Facturado y cobrado</p>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                                    <TrendingDown size={24} />
                                </div>
                            </div>
                            <div>
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Egresos Operativos</p>
                                <h2 className="text-4xl font-extrabold text-slate-900 mt-1">${totalExpenses.toLocaleString()}</h2>
                                <p className="text-sm text-slate-400 mt-2">Salarios, Renta y Costos</p>
                            </div>
                        </Card>
                    </div>

                    {/* Analysis Section */}
                    {transactions.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Income Breakdown */}
                            <Card title="Fuentes de Ingreso" description="Desglose por categoría" className="lg:col-span-1 min-h-[400px]">
                                {incomeByCat.length > 0 ? (
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={incomeByCat}
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {incomeByCat.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS.income[index % COLORS.income.length]} stroke="none" />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-slate-400 font-medium">
                                        Sin ingresos este mes
                                    </div>
                                )}
                            </Card>

                            {/* Expense Breakdown */}
                            <Card title="Estructura de Costos" description="Distribución de gastos" className="lg:col-span-2 min-h-[400px]">
                                {expenseByCat.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={expenseByCat}
                                                        innerRadius={60}
                                                        outerRadius={100}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {expenseByCat.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS.expense[index % COLORS.expense.length]} stroke="none" />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                    />
                                                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        {/* Cost List */}
                                        <div className="flex flex-col justify-center gap-3 pr-4">
                                            {expenseByCat.sort((a, b) => b.value - a.value).map((cat, idx) => (
                                                <div key={cat.name} className="flex justify-between items-center p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.expense[idx % COLORS.expense.length] }} />
                                                        <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                                                    </div>
                                                    <span className="font-bold text-slate-900">${cat.value.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-[300px] flex items-center justify-center text-slate-400 font-medium">
                                        Sin gastos este mes
                                    </div>
                                )}
                            </Card>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Wallet size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No hay movimientos</h3>
                            <p className="text-slate-500">No se encontraron transacciones en {format(selectedMonth, 'MMMM yyyy', { locale: es })}.</p>
                        </div>
                    )}

                    {/* Detailed Statement Table */}
                    {transactions.length > 0 && (
                        <Card title="Balance General (Detalle)" description="Todos los movimientos del periodo.">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="text-slate-500 font-medium border-b border-slate-100">
                                        <tr>
                                            <th className="pb-4 pl-4">Concepto</th>
                                            <th className="pb-4">Categoría</th>
                                            <th className="pb-4">Fecha</th>
                                            <th className="pb-4 text-right pr-4">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {transactions.map(t => (
                                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="py-4 pl-4 font-bold text-slate-700 flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${t.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                                                    {t.description || t.paymentMethod}
                                                </td>
                                                <td className="py-4 text-slate-500">
                                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                        {t.category}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-slate-400 font-mono">{format(parseISO(t.date), 'd MMM yyyy', { locale: es })}</td>
                                                <td className={`py-4 pr-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-slate-50/80 border-t-2 border-slate-100">
                                        <tr>
                                            <td colSpan={3} className="py-4 pl-4 text-right font-bold text-slate-500 uppercase tracking-widest text-xs">Utilidad Neta del Periodo</td>
                                            <td className={`py-4 pr-4 text-right font-extrabold text-xl ${netProfit >= 0 ? 'text-lime-600' : 'text-rose-600'}`}>
                                                ${netProfit.toLocaleString()}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}

