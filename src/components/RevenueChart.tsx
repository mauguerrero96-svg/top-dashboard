'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { INVOICES } from '@/lib/mockData';
import { format, parseISO, startOfMonth, eachDayOfInterval, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

export function RevenueChart() {
    // Generate data for the current month
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });

    // Aggregate revenue by day
    const data = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const revenue = INVOICES
            .filter(inv => inv.status === 'Paid' && inv.date === dateStr)
            .reduce((sum, inv) => sum + inv.amount, 0);

        return {
            date: format(day, 'd MMM', { locale: es }),
            revenue
        };
    }).slice(0, 15); // Show first 15 days for demo compactness

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="date"
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                        formatter={(value: number) => [`$${value}`, 'Ingresos']}
                    />
                    <Bar
                        dataKey="revenue"
                        fill="#f97316"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
