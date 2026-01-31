'use client';

import { useState, useEffect } from 'react';
import { DashboardPlayer, PlayerStatus, PaymentStatus, ClinicType, PaymentRecord } from '@/types/dashboard';
import { dashboardService } from '@/services/dashboard';
import { Loader2, Plus, DollarSign, History, Trash2 } from 'lucide-react';

interface PlayerFormProps {
    player?: DashboardPlayer;
    onSuccess: () => void;
    onCancel: () => void;
}

export function PlayerForm({ player, onSuccess, onCancel }: PlayerFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<DashboardPlayer>>({
        name: player?.name || '',
        email: player?.email || '',
        phone: player?.phone || '',
        clinic: player?.clinic || 'Alto Rendimiento',
        status: player?.status || 'Activo',
        monthly_fee: player?.monthly_fee || 0,
        payment_status: player?.payment_status || 'Pendiente',
    });

    // Payment State
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

    const totalPaid = player?.total_paid || 0;
    const monthlyFee = player?.monthly_fee || 0;
    const remaining = Math.max(0, monthlyFee - totalPaid);
    const progressPercent = monthlyFee > 0 ? Math.min(100, (totalPaid / monthlyFee) * 100) : 0;
    const isEditing = !!player?.id;

    useEffect(() => {
        if (player?.id) {
            loadPayments();
        }
    }, [player?.id]);

    const loadPayments = async () => {
        if (!player?.id) return;
        const history = await dashboardService.getPlayerPayments(player.id);
        setPaymentHistory(history);
    };

    const handleAddPayment = async () => {
        if (paymentAmount <= 0 || !player?.id) return;
        setPaymentLoading(true);
        try {
            const success = await dashboardService.addPayment(player.id, paymentAmount, 'Abono manual');
            if (success) {
                setPaymentAmount(0);
                loadPayments();
                onSuccess(); // Refresh parent to get new total_paid
            }
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let success = false;
            if (isEditing && player?.id) {
                success = await dashboardService.updatePlayer(player.id, formData);
            } else {
                success = await dashboardService.createPlayer(formData);
            }

            if (success) {
                onSuccess();
            } else {
                alert('Error al guardar el jugador');
            }
        } catch (error) {
            console.error(error);
            alert('Error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* General Info */}
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nombre</label>
                    <input
                        type="text"
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Teléfono</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            {/* Business Logic Info */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Clínica</label>
                    <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.clinic}
                        onChange={e => setFormData({ ...formData, clinic: e.target.value as ClinicType })}
                    >
                        <option value="Alto Rendimiento">Alto Rendimiento</option>
                        <option value="Clinica A">Clínica A</option>
                        <option value="Clinica B">Clínica B</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Estatus</label>
                    <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as PlayerStatus })}
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                        <option value="No Activo">No Activo</option>
                        <option value="Beca">Beca</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Pago</label>
                    <select
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.payment_status}
                        onChange={e => setFormData({ ...formData, payment_status: e.target.value as PaymentStatus })}
                    >
                        <option value="Pagado">Pagado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="NA">NA</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mensualidad ($)</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={formData.monthly_fee || ''}
                        onChange={e => setFormData({ ...formData, monthly_fee: parseFloat(e.target.value) })}
                    />
                </div>
            </div>

            <div className="h-px bg-slate-100 my-4" />

            {/* Account Status & Payments (Only for Editing) */}
            {isEditing ? (
                <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <DollarSign size={16} />
                        Estado de Cuenta
                    </h4>

                    {/* Progress Bar */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">Pagado: <span className="font-bold text-lime-600">${totalPaid.toLocaleString()}</span></span>
                            <span className="text-slate-600">Pendiente: <span className="font-bold text-red-500">${remaining.toLocaleString()}</span></span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div
                                className="bg-lime-500 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Add Payment */}
                    <div className="flex gap-2 items-end mb-4">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Abonar Cantidad</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:ring-2 focus:ring-lime-500 outline-none"
                                placeholder="0.00"
                                value={paymentAmount || ''}
                                onChange={e => setPaymentAmount(parseFloat(e.target.value))}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddPayment}
                            disabled={paymentLoading || !paymentAmount}
                            className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {paymentLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            Abonar
                        </button>
                    </div>

                    {/* History */}
                    {paymentHistory.length > 0 && (
                        <div className="mt-4">
                            <h5 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                <History size={12} /> Historial
                            </h5>
                            <div className="max-h-32 overflow-y-auto space-y-2 pr-1">
                                {paymentHistory.map(pay => (
                                    <div key={pay.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded border border-slate-100 group">
                                        <div className="flex gap-3">
                                            <span className="text-slate-600 font-mono">{new Date(pay.date).toLocaleDateString()}</span>
                                            {pay.notes && <span className="text-slate-400 italic truncate max-w-[100px]">{pay.notes}</span>}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-slate-800">${pay.amount.toLocaleString()}</span>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (confirm('¿Eliminar este pago?')) {
                                                        const ok = await dashboardService.deletePayment(pay.id, player!.id);
                                                        if (ok) {
                                                            loadPayments();
                                                            onSuccess();
                                                        }
                                                    }
                                                }}
                                                className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                                title="Eliminar pago"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center text-slate-500 text-sm">
                    Guarda el jugador primero para registrar abonos y ver el estado de cuenta.
                </div>
            )}

            {/* Footer */}
            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>
        </form>
    );
}
