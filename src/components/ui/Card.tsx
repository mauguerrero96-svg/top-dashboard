import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
    children: ReactNode;
    className?: string; // Additional classes
    title?: string;
    description?: string; // Added optional description
    action?: ReactNode;   // Added optional action button
}

export function Card({ children, className, title, description, action }: CardProps) {
    return (
        <div className={clsx(
            'bg-white rounded-2xl md:rounded-[32px] border-none shadow-xl shadow-slate-200/50 p-5 md:p-8 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-lime-500/10 hover:-translate-y-1',
            className
        )}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-6">
                    <div>
                        {title && <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>}
                        {description && <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>}
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="flex-1 relative z-10">
                {children}
            </div>
        </div>
    );
}
