import { useState, useEffect } from 'react';
import { X, Clock, ChevronDown, Check, RefreshCw } from 'lucide-react';

interface CreateBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    startTime: string; // "10:00"
    date: string; // "Oct 25"
    courtName: string;
    players: { id: string; name: string }[];
    coaches: { id: string; name: string }[];
    initialData?: any; // For editing
}

export function CreateBookingModal({ isOpen, onClose, onConfirm, startTime, date, courtName, players, coaches, initialData }: CreateBookingModalProps) {
    const [selectedPlayer, setSelectedPlayer] = useState(''); // Primary player (leader)
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]); // Additional players for classes
    const [bookingType, setBookingType] = useState('Match');
    const [duration, setDuration] = useState('1');
    const [selectedCoach, setSelectedCoach] = useState('');
    const [classTitle, setClassTitle] = useState('');
    const [selectedClinic, setSelectedClinic] = useState('');

    // Recurrence State
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceFreq, setRecurrenceFreq] = useState('Weekly'); // 'Weekly', 'Monthly'
    const [recurrenceCount, setRecurrenceCount] = useState('4'); // Default 4 occurrences

    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false);

    // Initialize state when modal opens or initialData changes
    useEffect(() => {
        if (isOpen && initialData) {
            setSelectedPlayer(initialData.playerId || '');
            setBookingType(initialData.type || 'Match');
            if (initialData.startTime && initialData.endTime) {
                const start = new Date(initialData.startTime);
                const end = new Date(initialData.endTime);
                const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                setDuration(diffHours.toString());
            } else {
                setDuration('1');
            }

            setSelectedCoach(initialData.coachId || '');
            setClassTitle(initialData.title || '');
            setSelectedClinic(initialData.clinic || '');

            // Editing usually doesn't trigger recurrence creation, so reset or handle if we tracked it in DB
            setIsRecurring(false);
            setRecurrenceFreq('Weekly');
            setRecurrenceCount('4');

            // Participants
            if (initialData.participants) {
                const participantIds = initialData.participants
                    .map((p: any) => players.find(pl => pl.name === p.name)?.id)
                    .filter(Boolean);
                setSelectedParticipants(participantIds);
            } else {
                setSelectedParticipants([]);
            }

        } else if (isOpen && !initialData) {
            // Reset for new booking
            setSelectedPlayer('');
            setSelectedParticipants([]);
            setBookingType('Match');
            setDuration('1');
            setSelectedCoach('');
            setClassTitle('');
            setSelectedClinic('');
            setIsRecurring(false);
            setRecurrenceFreq('Weekly');
            setRecurrenceCount('4');
        }
    }, [isOpen, initialData, players]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm({
            playerId: selectedPlayer,
            participantIds: bookingType === 'Classes' ? [selectedPlayer, ...selectedParticipants].filter(Boolean) : [],
            type: bookingType,
            duration,
            coachId: selectedCoach,
            title: classTitle,
            clinic: selectedClinic,
            price: bookingType === 'Match' ? 20 * parseFloat(duration) : 50 * parseFloat(duration),
            recurrence: isRecurring ? { frequency: recurrenceFreq, count: parseInt(recurrenceCount) } : null
        });
    };

    const toggleParticipant = (id: string) => {
        if (selectedParticipants.includes(id)) {
            setSelectedParticipants(selectedParticipants.filter(p => p !== id));
        } else {
            setSelectedParticipants([...selectedParticipants, id]);
        }
    };

    const clinics = ['Alto Rendimiento', 'Clinica A', 'Clinica B', 'Clinica C', 'Mini Tenis'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 relative overflow-visible ring-1 ring-black/5 max-h-[90vh] overflow-y-auto" onClick={() => setIsMultiSelectOpen(false)}>

                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{initialData ? 'Editar Reserva' : 'Nueva Reserva'}</h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                            <span className="font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full text-xs uppercase tracking-wide">{courtName}</span>
                            <span>{date} • {startTime}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-5">

                    {/* Booking Type */}
                    <div>
                        <div className="flex bg-slate-100/80 p-1 rounded-xl">
                            {['Match', 'Training', 'Classes'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setBookingType(type)}
                                    className={`
                    flex-1 py-2 text-sm font-medium rounded-lg transition-all
                    ${bookingType === type
                                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                                            : 'text-slate-500 hover:text-slate-700'}
                  `}
                                >
                                    {type === 'Match' ? 'Partido' : type === 'Training' ? 'Entreno' : 'Clase'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Clinic Selection (Optional for all, but mostly for Classes/Training) */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                            Clínica (Opcional)
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-3 pr-10 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none outline-none text-sm"
                                value={selectedClinic}
                                onChange={(e) => setSelectedClinic(e.target.value)}
                            >
                                <option value="">Sin Asignar</option>
                                {clinics.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Player Selection */}
                    <div className="relative">
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
                            {bookingType === 'Classes' ? 'Jugador Principal (Organizador)' : 'Jugador Principal'}
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-3 pr-10 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none outline-none text-sm"
                                value={selectedPlayer}
                                onChange={(e) => setSelectedPlayer(e.target.value)}
                            >
                                <option value="">Seleccionar socio...</option>
                                {players.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Multi-Participant Selection for Classes */}
                    {bookingType === 'Classes' && (
                        <div className="relative animate-in slide-in-from-top-1 duration-200" onClick={(e) => e.stopPropagation()}>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Participantes Adicionales</label>
                            <div
                                className="w-full pl-3 pr-10 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-800 font-medium cursor-pointer relative text-sm min-h-[46px] flex items-center"
                                onClick={() => setIsMultiSelectOpen(!isMultiSelectOpen)}
                            >
                                {selectedParticipants.length === 0 ? (
                                    <span className="text-slate-500">Agregar más jugadores...</span>
                                ) : (
                                    <span className="truncate">{selectedParticipants.length} seleccionados</span>
                                )}
                                <ChevronDown size={16} className={`absolute right-3 top-3.5 text-slate-400 pointer-events-none transition-transform ${isMultiSelectOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {isMultiSelectOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl ring-1 ring-black/5 z-50 max-h-48 overflow-y-auto p-1">
                                    {players.filter(p => p.id !== selectedPlayer).map(p => (
                                        <div
                                            key={p.id}
                                            onClick={() => toggleParticipant(p.id)}
                                            className="px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between text-sm transition-colors"
                                        >
                                            <span className="text-slate-700">{p.name}</span>
                                            {selectedParticipants.includes(p.id) && <Check size={14} className="text-orange-500" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Conditional Fields: Coach or Class Title */}
                    {(bookingType === 'Training' || bookingType === 'Classes') && (
                        <div className={`relative ${bookingType ? 'animate-in slide-in-from-top-1 duration-200' : ''}`}>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Entrenador</label>
                            <div className="relative">
                                <select
                                    className="w-full pl-3 pr-10 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none outline-none text-sm"
                                    value={selectedCoach}
                                    onChange={(e) => setSelectedCoach(e.target.value)}
                                >
                                    <option value="">Asignar Coach...</option>
                                    {coaches.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {bookingType === 'Classes' && (
                        <div className="animate-in slide-in-from-top-1 duration-200">
                            <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Nombre de Clase</label>
                            <input
                                type="text"
                                placeholder="Ej. Clínica de Saques"
                                className="w-full px-3 py-3 bg-slate-50 hover:bg-slate-100 border-none rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-sm"
                                value={classTitle}
                                onChange={(e) => setClassTitle(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Duration Selection */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Duración</label>
                        <div className="flex bg-slate-100/80 p-1 rounded-xl">
                            {['1', '1.5', '2'].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDuration(d)}
                                    className={`
                    flex-1 py-2 text-sm font-medium rounded-lg transition-all
                    ${duration === d
                                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                                            : 'text-slate-500 hover:text-slate-700'}
                  `}
                                >
                                    {d} hr
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recurrence Options - Only for New Bookings */}
                    {!initialData && (
                        <div className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="checkbox"
                                    id="recurrence"
                                    checked={isRecurring}
                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                                />
                                <label htmlFor="recurrence" className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                    <RefreshCw size={14} className="text-orange-600" />
                                    Repetir Reserva
                                </label>
                            </div>

                            {isRecurring && (
                                <div className="space-y-3 animate-in slide-in-from-top-1 duration-200 pl-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setRecurrenceFreq('Weekly')}
                                            className={`flex-1 text-xs py-1.5 rounded-lg border ${recurrenceFreq === 'Weekly' ? 'bg-orange-100 border-orange-200 text-orange-800 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}
                                        >
                                            Semanalmente
                                        </button>
                                        <button
                                            onClick={() => setRecurrenceFreq('Monthly')}
                                            className={`flex-1 text-xs py-1.5 rounded-lg border ${recurrenceFreq === 'Monthly' ? 'bg-orange-100 border-orange-200 text-orange-800 font-medium' : 'bg-white border-slate-200 text-slate-600'}`}
                                        >
                                            Mensualmente
                                        </button>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Repeticiones</label>
                                        <select
                                            value={recurrenceCount}
                                            onChange={(e) => setRecurrenceCount(e.target.value)}
                                            className="w-full text-xs py-1.5 px-2 rounded-lg border-slate-200 bg-white"
                                        >
                                            <option value="2">2 veces</option>
                                            <option value="4">4 veces (1 mes)</option>
                                            <option value="8">8 veces (2 meses)</option>
                                            <option value="12">12 veces (3 meses)</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={handleConfirm}
                        className="w-full py-3.5 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span>{initialData ? 'Guardar Cambios' : 'Crear Reserva'}</span>
                        <Clock size={18} className="opacity-50" />
                    </button>

                </div>
            </div>
        </div>
    );
}
