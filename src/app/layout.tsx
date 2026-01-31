import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

export const metadata: Metadata = {
    title: 'Top Tenis | Tennis Club Management',
    description: 'Premium management portal for ambitious tennis clubs.',
};

import MobileNav from '@/components/MobileNav';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-slate-50 text-slate-900`} suppressHydrationWarning>
                <div className="flex h-screen overflow-hidden flex-col md:flex-row">

                    {/* Mobile Navigation (Visible on small screens) */}
                    <MobileNav />

                    {/* Sidebar Wrapper (Hidden on mobile, visible on desktop) */}
                    <div className="hidden md:block w-72 shrink-0 border-r border-slate-200 bg-white z-20 shadow-xl shadow-slate-200/50">
                        <Sidebar />
                    </div>

                    {/* Main Content Area */}
                    <main className="flex-1 overflow-y-auto relative bg-slate-50/50">
                        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
