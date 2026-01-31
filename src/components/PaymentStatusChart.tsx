'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { INVOICES } from '@/lib/mockData';

export function PaymentStatusChart() {
    const paid = INVOICES.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
    const pending = INVOICES.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
    const overdue = INVOICES.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);

    const data = [
        { name: 'Pagado', value: paid, color: '#22c55e' }, // green-500
        { name: 'Pendiente', value: pending, color: '#f97316' }, // orange-500
        { name: 'Vencido', value: overdue, color: '#ef4444' }, // red-500
    ];

    return (
        <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
