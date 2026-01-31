'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center text-slate-900 shadow-sm">
                        <span className="font-bold text-xs">TT</span>
                    </div>
                    Top Tenis
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar Container */}
                    <div className="relative w-72 h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 z-10"
                        >
                            <X size={20} />
                        </button>

                        {/* Reuse existing Sidebar Component */}
                        <div className="flex-1 overflow-hidden" onClick={(e) => {
                            // Close when clicking a link (optional optimization, assumes sidebar contains links)
                            if ((e.target as HTMLElement).closest('a')) {
                                setIsOpen(false);
                            }
                        }}>
                            <Sidebar />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
