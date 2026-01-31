'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { fetchBalanceSheetAction } from '@/actions/client_data';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function BalanceSheet() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchBalance = async () => {
            setLoading(true);
            const result = await fetchBalanceSheetAction(new Date());
            setData(result);
            setLoading(false);
        };
        fetchBalance();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 size={40} className="text-slate-300 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Balance General</h3>
                    <p className="text-slate-500 text-sm">Al {format(new Date(), "d 'de' MMMM, yyyy", { locale: es })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ASSETS */}
                <Card className="border-t-4 border-t-emerald-500">
                    <h4 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex justify-between items-center">
                        ACTIVOS
                        <span className="text-emerald-600 font-extrabold text-xl">${data.assets.total.toLocaleString()}</span>
                    </h4>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50/50">
                            <div>
                                <p className="font-bold text-slate-700">Efectivo / Bancos</p>
                                <p className="text-xs text-slate-500">Saldo acumulado en caja</p>
                            </div>
                            <span className="font-bold text-slate-900">${data.assets.cash.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-emerald-50/50">
                            <div>
                                <p className="font-bold text-slate-700">Cuentas por Cobrar</p>
                                <p className="text-xs text-slate-500">Facturas pendientes de pago</p>
                            </div>
                            <span className="font-bold text-slate-900">${data.assets.accountsReceivable.toLocaleString()}</span>
                        </div>
                    </div>
                </Card>

                <div className="space-y-8">
                    {/* LIABILITIES */}
                    <Card className="border-t-4 border-t-rose-500">
                        <h4 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex justify-between items-center">
                            PASIVOS
                            <span className="text-rose-600 font-extrabold text-xl">${data.liabilities.total.toLocaleString()}</span>
                        </h4>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-rose-50/50">
                                <div>
                                    <p className="font-bold text-slate-700">Cuentas por Pagar</p>
                                    <p className="text-xs text-slate-500">Deudas a corto plazo</p>
                                </div>
                                <span className="font-bold text-slate-900">$0</span>
                            </div>
                        </div>
                    </Card>

                    {/* EQUITY */}
                    <Card className="border-t-4 border-t-indigo-500">
                        <h4 className="text-lg font-bold text-slate-800 mb-6 pb-2 border-b border-slate-100 flex justify-between items-center">
                            CAPITAL
                            <span className="text-indigo-600 font-extrabold text-xl">${data.equity.total.toLocaleString()}</span>
                        </h4>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-indigo-50/50">
                                <div>
                                    <p className="font-bold text-slate-700">Utilidad Retenida</p>
                                    <p className="text-xs text-slate-500">Activos - Pasivos</p>
                                </div>
                                <span className="font-bold text-slate-900">${data.equity.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
