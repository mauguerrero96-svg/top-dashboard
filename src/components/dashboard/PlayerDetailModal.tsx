'use client';

import { useState, useEffect } from 'react';
import { DashboardPlayer, PlayerSchedule } from '@/types/dashboard';
import { supabase } from '@/lib/supabase';
import { X, Loader2, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { dashboardService } from '@/services/dashboard';
import { AttendanceRecord } from '@/types/dashboard';

import { PlayerForm } from '@/components/dashboard/PlayerForm';
import { Edit2, MapPin } from 'lucide-react';

interface PlayerDetailModalProps {
    player: DashboardPlayer;
    onClose: () => void;
    onUpdate?: () => void;
}

interface Invoice {
    id: string;
    serial_id: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';
    date: string;
    description: string;
}

export function PlayerDetailModal({ player, onClose, onUpdate }: PlayerDetailModalProps) {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'training' | 'attendance'>('overview');
    const [isEditing, setIsEditing] = useState(false);

    // Data States
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [schedules, setSchedules] = useState<PlayerSchedule[]>([]);
    const [nextBookings, setNextBookings] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [checkingIn, setCheckingIn] = useState(false);

    useEffect(() => {
        if (isEditing) return;

        const fetchData = async () => {
            setLoading(true);

            // 1. Fetch Invoices
            const invoicesPromise = supabase
                .from('invoices')
                .select('*')
                .eq('player_id', player.id)
                .order('date', { ascending: false });

            // 2. Fetch Recurring Schedule
            const schedulesPromise = supabase
                .from('player_schedules')
                .select('*')
                .eq('player_id', player.id);

            // 3. Fetch Next Bookings (Upcoming)
            const now = new Date().toISOString();
            const bookingsPromise = supabase
                .from('bookings')
                .select('*, coach:coaches(name)')
                .eq('player_id', player.id)
                .gte('start_time', now)
                .order('start_time', { ascending: true })
                .limit(5);

            const [invRes, schedRes, bookRes, attRes] = await Promise.all([
                invoicesPromise,
                schedulesPromise,
                bookingsPromise,
                dashboardService.getAttendanceHistory(player.id)
            ]);

            if (invRes.data) setInvoices(invRes.data as Invoice[]);
            if (schedRes.data) setSchedules(schedRes.data as PlayerSchedule[]);
            if (bookRes.data) setNextBookings(bookRes.data);
            if (attRes) setAttendance(attRes as AttendanceRecord[]);

            setLoading(false);
        };

        fetchData();
    }, [player.id, isEditing]);

    const handleCheckIn = async () => {
        setCheckingIn(true);
        const success = await dashboardService.checkInPlayer(player.id);
        if (success) {
            // Re-fetch attendance
            const history = await dashboardService.getAttendanceHistory(player.id);
            setAttendance(history as AttendanceRecord[]);
            // switch to attendance tab
            setActiveTab('attendance');
        }
        setCheckingIn(false);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Paid':
                return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle size={12} /> Pagado</span>;
            case 'Pending':
                return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100"><Clock size={12} /> Pendiente</span>;
            case 'Overdue':
                return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100"><AlertCircle size={12} /> Vencido</span>;
            default:
                return <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-500">{status}</span>;
        }
    };

    const dayLabels: Record<string, string> = { Mon: 'Lunes', Tue: 'Martes', Wed: 'Miércoles', Thu: 'Jueves', Fri: 'Viernes', Sat: 'Sábado', Sun: 'Domingo' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
            <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${isEditing ? 'scale-100' : ''}`} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div>
                        {isEditing ? (
                            <h3 className="text-xl font-bold text-slate-800">Editar Perfil</h3>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold text-slate-800">{player.name}</h3>
                                <p className="text-sm text-slate-500">{player.email} • {player.clinic}</p>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                            >
                                <Edit2 size={14} /> Editar
                            </button>
                        )}
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-200 rounded-lg">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {isEditing ? (
                    <div className="p-6 overflow-y-auto">
                        <PlayerForm
                            player={player}
                            onSuccess={() => {
                                setIsEditing(false);
                                if (onUpdate) onUpdate();
                                window.location.reload();
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                    </div>
                ) : (
                    <>
                        {/* Tabs */}
                        <div className="flex border-b border-slate-100 px-6">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Resumen
                            </button>
                            <button
                                onClick={() => setActiveTab('payments')}
                                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'payments' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Pagos
                            </button>
                            <button
                                onClick={() => setActiveTab('training')}
                                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'training' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Entrenamientos
                            </button>
                            <button
                                onClick={() => setActiveTab('attendance')}
                                className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attendance' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                            >
                                Asistencia
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto min-h-[300px]">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-indigo-500" size={32} />
                                </div>
                            ) : (
                                <>
                                    {/* OVERVIEW TAB */}
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estado Actual</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className={`w-3 h-3 rounded-full ${player.status === 'Activo' ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                                                        <span className="text-lg font-bold text-slate-700">{player.status}</span>
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Saldo Pendiente</p>
                                                    <p className={`mt-1 text-2xl font-extrabold ${player.payment_status === 'Pagado' ? 'text-green-600' : 'text-red-500'}`}>
                                                        {player.payment_status === 'Pagado' ? '$0.00' : 'Pendiente'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800 mb-3">Próxima Clase</h4>
                                                {nextBookings.length > 0 ? (
                                                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                                <Calendar size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800">{nextBookings[0].title || 'Entrenamiento'}</p>
                                                                <p className="text-xs text-slate-500">
                                                                    {format(parseISO(nextBookings[0].start_time), "EEEE d 'de' MMMM, h:mm a", { locale: es })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {nextBookings[0].coach && (
                                                            <div className="text-right">
                                                                <p className="text-xs text-slate-400 font-bold uppercase">Coach</p>
                                                                <p className="text-sm font-medium text-slate-700">{nextBookings[0].coach.name}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-500 text-sm italic">No hay clases programadas próximamente.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* PAYMENTS TAB */}
                                    {activeTab === 'payments' && (
                                        <div>
                                            {invoices.length > 0 ? (
                                                <div className="border border-slate-100 rounded-xl overflow-hidden">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                                            <tr>
                                                                <th className="px-4 py-3">Referencia</th>
                                                                <th className="px-4 py-3">Fecha</th>
                                                                <th className="px-4 py-3">Concepto</th>
                                                                <th className="px-4 py-3">Estado</th>
                                                                <th className="px-4 py-3 text-right">Monto</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {invoices.map((inv) => (
                                                                <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                                                                    <td className="px-4 py-3 font-mono text-slate-400 text-xs">{inv.serial_id}</td>
                                                                    <td className="px-4 py-3 text-slate-600">
                                                                        {format(parseISO(inv.date), 'd MMM yyyy', { locale: es })}
                                                                    </td>
                                                                    <td className="px-4 py-3 font-medium text-slate-700">{inv.description}</td>
                                                                    <td className="px-4 py-3">{getStatusBadge(inv.status)}</td>
                                                                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                                                                        ${inv.amount.toLocaleString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                                                    <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                                                        <DollarSign size={20} />
                                                    </div>
                                                    <p className="text-slate-500 font-medium">No hay pagos registrados</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ATTENDANCE TAB */}
                                    {activeTab === 'attendance' && (
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div>
                                                    <h4 className="text-sm font-bold text-slate-800">Registrar Asistencia</h4>
                                                    <p className="text-xs text-slate-500">Marca la asistencia de hoy</p>
                                                </div>
                                                <button
                                                    onClick={handleCheckIn}
                                                    disabled={checkingIn}
                                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                                                >
                                                    {checkingIn ? (
                                                        <Loader2 className="animate-spin" size={16} />
                                                    ) : (
                                                        <CheckCircle size={16} />
                                                    )}
                                                    Check-in Ahora
                                                </button>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Historial de Asistencia</h4>
                                                {attendance.length > 0 ? (
                                                    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                                                        <table className="w-full text-sm text-left">
                                                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                                                <tr>
                                                                    <th className="px-4 py-3">Fecha y Hora</th>
                                                                    <th className="px-4 py-3">Día</th>
                                                                    <th className="px-4 py-3">Notas</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {attendance.map((record) => (
                                                                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                                                        <td className="px-4 py-3 font-mono text-slate-600">
                                                                            {format(parseISO(record.check_in_time), 'PP p', { locale: es })}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-slate-600 capitalize">
                                                                            {format(parseISO(record.check_in_time), 'EEEE', { locale: es })}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-slate-500 italic">
                                                                            {record.notes || '-'}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                                                        <div className="mx-auto w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-2">
                                                            <MapPin size={20} />
                                                        </div>
                                                        <p className="text-slate-500 text-sm">Sin historial de asistencia.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* TRAINING TAB */}
                                    {activeTab === 'training' && (
                                        <div className="space-y-6">
                                            {/* Recurring Schedule */}
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Horario Habitual</h4>
                                                {schedules.length > 0 ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                        {schedules.map(sch => (
                                                            <div key={sch.id} className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center text-center">
                                                                <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full text-xs mb-1">
                                                                    {dayLabels[sch.day_of_week]}
                                                                </span>
                                                                <span className="text-slate-700 font-mono font-medium text-sm">
                                                                    {sch.start_time.slice(0, 5)} - {sch.end_time.slice(0, 5)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-500 text-sm italic">Sin horario fijo asignado.</p>
                                                )}
                                            </div>

                                            {/* Next Sessions */}
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Próximas Sesiones</h4>
                                                {nextBookings.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {nextBookings.map(book => (
                                                            <div key={book.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex flex-col items-center justify-center bg-white border border-slate-200 w-10 h-10 rounded-lg text-xs font-bold text-slate-600">
                                                                        <span>{format(parseISO(book.start_time), 'd')}</span>
                                                                        <span className="text-[10px] text-slate-400 uppercase">{format(parseISO(book.start_time), 'MMM', { locale: es })}</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-slate-800 text-sm">{book.title}</p>
                                                                        <p className="text-xs text-slate-500">{format(parseISO(book.start_time), 'h:mm a')}</p>
                                                                    </div>
                                                                </div>
                                                                {book.coach && (
                                                                    <div className="text-right">
                                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Coach</p>
                                                                        <p className="text-xs font-medium text-slate-700">{book.coach.name}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-500 text-sm italic">No hay reservas futuras.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}

                {/* Footer */}
                {!isEditing && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-end">
                        <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
