import { PlayerForm } from '@/components/dashboard/PlayerForm';
import { DashboardPlayer } from '@/types/dashboard';
import { X } from 'lucide-react';

interface EditPlayerModalProps {
    player?: DashboardPlayer;
    onClose: () => void;
    onSuccess: () => void;
}

export function EditPlayerModal({ player, onClose, onSuccess }: EditPlayerModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800">{player ? 'Editar Jugador' : 'Nuevo Jugador'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <PlayerForm
                        player={player}
                        onSuccess={() => {
                            onSuccess();
                            onClose();
                        }}
                        onCancel={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
