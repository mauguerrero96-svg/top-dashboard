'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction } from '@/types/dashboard';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface CategoryDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string;
    type: 'income' | 'expense';
    transactions: Transaction[];
    total: number;
}

export function CategoryDetailsModal({ isOpen, onClose, category, type, transactions, total }: CategoryDetailsModalProps) {
    if (!isOpen) return null;

    // Filter transactions for this specific category and type
    const categoryTransactions = transactions.filter(t =>
        t.category === category && t.type === type.toLowerCase()
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{category}</h3>
                        <p className={`text-sm font-bold ${type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            Total: ${total.toLocaleString()}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* List */}
                <div className="overflow-y-auto p-2">
                    {categoryTransactions.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">No se encontraron transacciones.</div>
                    ) : (
                        <div className="space-y-1">
                            {categoryTransactions.map((tx, idx) => (
                                <div key={idx} className="p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium text-slate-800 text-sm line-clamp-1">{tx.description || 'Sin descripción'}</span>
                                        <span className={`font-bold text-sm ${type === 'income' ? 'text-emerald-600' : 'text-slate-700'}`}>
                                            ${tx.amount.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-400">
                                        <span>{format(parseISO(tx.date), "d MMM, yyyy", { locale: es })}</span>
                                        {tx.paymentMethod && (
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium">
                                                {tx.paymentMethod}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

