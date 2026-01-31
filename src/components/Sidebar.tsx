'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, CreditCard, BarChart3, Settings, LogOut, Activity } from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [

    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calendario', href: '/bookings', icon: Calendar },
    { name: 'Jugadores', href: '/players', icon: Users },
    { name: 'Finanzas', href: '/finances', icon: BarChart3 },
    { name: 'Pagos', href: '/payments', icon: CreditCard },
    { name: 'Torneos', href: '/tournaments', icon: Activity },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full h-full bg-white flex flex-col font-sans">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 shrink-0 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-lime-400/30">
                        <Activity size={22} className="stroke-[2.5px]" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Top Tenis</h1>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Management</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Principal</p>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-lime-50 text-slate-900 font-bold shadow-sm shadow-lime-100"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                            )}
                        >
                            <Icon size={20} className={clsx("transition-colors", isActive ? "text-lime-600" : "text-slate-400 group-hover:text-slate-600")} />
                            <span>{item.name}</span>

                            {isActive && (
                                <div className="absolute right-3 w-1.5 h-1.5 bg-lime-500 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 mt-auto border-t border-slate-100">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">Alex Admin</p>
                            <p className="text-xs text-slate-500 truncate">alex@clubace.com</p>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <button className="flex-1 flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors">
                            <Settings size={16} />
                        </button>
                        <button className="flex-1 flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
