'use client';

import { useState } from 'react';
import { LayoutDashboard, FileText, Activity } from 'lucide-react';
import { IncomeStatement } from '@/components/finances/IncomeStatement';
import { BalanceSheet } from '@/components/finances/BalanceSheet';
import { UsageReports } from '@/components/finances/UsageReports';

export default function FinancesPage() {
    const [activeTab, setActiveTab] = useState<'income' | 'balance' | 'usage'>('income');

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Finanzas y Reportes</h1>
                <p className="text-slate-500 font-medium">Gestión financiera avanzada y métricas operativas.</p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm border border-slate-200 w-fit">
                <button
                    onClick={() => setActiveTab('income')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'income'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                >
                    <FileText size={18} />
                    <span>Estado de Resultados</span>
                </button>
                <button
                    onClick={() => setActiveTab('balance')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'balance'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                >
                    <LayoutDashboard size={18} />
                    <span>Balance General</span>
                </button>
                <button
                    onClick={() => setActiveTab('usage')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'usage'
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                >
                    <Activity size={18} />
                    <span>Reportes de Uso</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'income' && <IncomeStatement />}
                {activeTab === 'balance' && <BalanceSheet />}
                {activeTab === 'usage' && <UsageReports />}
            </div>
        </div>
    );
}
