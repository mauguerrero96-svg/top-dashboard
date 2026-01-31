'use client';

import { Fragment } from 'react';
import { DashboardPlayer, PlayerSchedule } from '@/types/dashboard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CalendarViewProps {
    players: DashboardPlayer[];
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_LABELS: Record<string, string> = {
    Mon: 'Lunes', Tue: 'Martes', Wed: 'Miércoles', Thu: 'Jueves', Fri: 'Viernes', Sat: 'Sábado', Sun: 'Domingo'
};

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00

export function CalendarView({ players }: CalendarViewProps) {
    // 1. Flatten all schedules into a single list of events
    const events = players.flatMap(player =>
        (player.schedules || []).map(schedule => ({
            ...schedule,
            player
        }))
    );

    // Helper to find events for a specific day and hour
    const getEventsForSlot = (day: string, hour: number) => {
        return events.filter(e => {
            // Very simple parsing: assuming HH:MM:SS format from Supabase Time type
            const startHour = parseInt(e.start_time.split(':')[0]);
            return e.day_of_week === day && startHour === hour;
        });
    };

    return (
        <Card className="w-full overflow-hidden">
            <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Calendario Semanal</h3>
                <span className="text-sm text-slate-500">Horarios de cancha</span>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-[800px] grid grid-cols-8 gap-0 border-l border-t border-slate-200">

                    {/* Header Row */}
                    <div className="p-2 bg-slate-50 border-b border-r border-slate-200 text-xs font-bold text-slate-500 text-center sticky left-0 z-10">
                        Hora
                    </div>
                    {DAYS.map(day => (
                        <div key={day} className="p-2 bg-slate-50 border-b border-r border-slate-200 text-sm font-bold text-slate-700 text-center">
                            {DAY_LABELS[day]}
                        </div>
                    ))}

                    {/* Time Slots */}
                    {HOURS.map(hour => (
                        <Fragment key={hour}>
                            {/* Reference Column */}
                            <div className="p-2 border-b border-r border-slate-200 text-xs text-slate-400 font-medium text-center sticky left-0 bg-white z-10">
                                {hour}:00
                            </div>

                            {/* Day Columns */}
                            {DAYS.map(day => {
                                const slotEvents = getEventsForSlot(day, hour);
                                return (
                                    <div key={`${day}-${hour}`} className="min-h-[60px] border-b border-r border-slate-200 relative p-1 group hover:bg-slate-50 transition-colors">
                                        {slotEvents.map((event, idx) => (
                                            <div
                                                key={`${event.id}-${idx}`}
                                                className={`
                          text-[10px] p-1 mb-1 rounded border shadow-sm truncate cursor-pointer hover:scale-105 transition-transform relative z-0 hover:z-20
                          ${event.player.clinic === 'Alto Rendimiento' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' :
                                                        event.player.clinic === 'Clinica A' ? 'bg-sky-50 border-sky-100 text-sky-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}
                        `}
                                                title={`${event.player.name} (${event.start_time} - ${event.end_time})`}
                                            >
                                                <span className="font-bold block">{event.player.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </Fragment>
                    ))}
                </div>
            </div>
        </Card>
    );
}
