'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, DollarSign } from 'lucide-react';

export interface TransactionInitialData {
    type: 'Income' | 'Expense';
    description: string;
    amount: number;
    category: string;
    date: string;
}

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (transaction: any) => void;
    initialData?: TransactionInitialData | null;
}

const INCOME_CATEGORIES = ['Memberships', 'Classes', 'Court Rental', 'Pro Shop', 'Tournaments'];
const EXPENSE_CATEGORIES = ['Rent', 'Salaries', 'Utilities', 'Equipment', 'Maintenance', 'Marketing', 'Other'];

export function AddTransactionModal({ isOpen, onClose, onSubmit, initialData }: AddTransactionModalProps) {
    const [type, setType] = useState<'Income' | 'Expense'>(initialData?.type || 'Income');
    const [description, setDescription] = useState(initialData?.description || '');
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [date, setDate] = useState(initialData?.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);

    // Update state when initialData or isOpen changes
    // Use useEffect to sync state with props
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setType(initialData.type);
                setDescription(initialData.description);
                setAmount(initialData.amount.toString());
                setCategory(initialData.category);
                setDate(initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
            } else {
                // Reset if opening in create mode
                setDescription('');
                setAmount('');
                setCategory('');
                // Keep type and date defaults or reset them if needed
                // setType('Income'); // Optional: reset type to default
                setDate(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!description || !amount || !category) return;

        onSubmit({
            type,
            description,
            amount: parseFloat(amount),
            category,
            date,
        });

        // Reset form
        setDescription('');
        setAmount('');
        setCategory('');
        setType('Income');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden ring-1 ring-black/5">

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{initialData ? 'Editar Transacción' : 'Nueva Transacción'}</h2>
                        <p className="text-sm text-slate-500 mt-1">{initialData ? 'Modificar detalles del movimiento' : 'Registrar movimiento financiero'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5">

                    {/* Type Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => { setType('Income'); setCategory(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'Income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Ingreso
                        </button>
                        <button
                            onClick={() => { setType('Expense'); setCategory(''); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${type === 'Expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Egreso
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Monto</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3 text-slate-400">
                                <DollarSign size={18} />
                            </div>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full pl-9 pr-4 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-lime-500/20 outline-none transition-all"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Categoría</label>
                        <div className="relative">
                            <select
                                className="w-full pl-3 pr-10 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-lime-500/20 transition-all appearance-none outline-none text-sm"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Seleccionar categoría...</option>
                                {(type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Descripción</label>
                        <input
                            type="text"
                            placeholder="Ej. Pago de mensualidad"
                            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-lime-500/20 outline-none transition-all text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Fecha</label>
                        <input
                            type="date"
                            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-lime-500/20 outline-none transition-all text-sm"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!amount || !category || !description}
                        className={`w-full py-3.5 mt-2 rounded-xl font-bold shadow-lg transition-all transform active:scale-[0.98]
                            ${!amount || !category || !description ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20'}
                        `}
                    >
                        {initialData ? 'Guardar Cambios' : (type === 'Income' ? 'Registrar Ingreso' : 'Registrar Gasto')}
                    </button>

                </div>
            </div>
        </div>
    );
}
