'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Booking, Coach, Court } from '@/types/bookings';
import { fetchBookings, fetchPlayers, fetchCoaches, fetchCourts, createBookingAction, updateBookingAction } from '@/actions/client_data';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Plus, Loader2 } from 'lucide-react';
import { format, addDays, isSameDay, parseISO, getHours, getMinutes, differenceInMinutes, startOfDay, endOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import clsx from 'clsx';
import { CreateBookingModal } from '@/components/CreateBookingModal';
import { DashboardPlayer } from '@/types/dashboard';

const START_HOUR = 7;
const END_HOUR = 22;
const SLOT_HEIGHT = 80; // px per hour

export default function BookingsPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);
    const [players, setPlayers] = useState<DashboardPlayer[]>([]);
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newBookingData, setNewBookingData] = useState({ startTime: '', courtName: '' });

    // Fetch Bookings & Players & Coaches & Courts
    const fetchData = useCallback(async () => {
        setLoading(true);
        const start = startOfDay(selectedDate);
        const end = endOfDay(selectedDate);

        const [bookingsData, playersData, coachesData, courtsData] = await Promise.all([
            fetchBookings(start, end),
            fetchPlayers(),
            fetchCoaches(),
            fetchCourts()
        ]);

        setBookings(bookingsData);
        setPlayers(playersData);
        setCoaches(coachesData);
        setCourts(courtsData);
        setLoading(false);
    }, [selectedDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // DnD State
    const [draggedBookingId, setDraggedBookingId] = useState<string | null>(null);

    const handleEditBooking = (booking: Booking, e: React.MouseEvent) => {
        e.stopPropagation();
        setNewBookingData({
            startTime: format(parseISO(booking.startTime), 'HH:mm'),
            courtName: courts.find(c => c.id === booking.courtId)?.name || ''
        });
        // Pass full booking data to modal
        // We need to reconstruct the object expected by the modal
        setIsModalOpen(true);
        setEditingBooking(booking);
    };

    const [editingBooking, setEditingBooking] = useState<any>(null);

    // Update handleOpenModal to clear editing state
    const handleOpenModal = (hour: number, courtName: string) => {
        setEditingBooking(null);
        setNewBookingData({
            startTime: `${hour}:00`,
            courtName
        });
        setIsModalOpen(true);
    };

    const handleCreateBooking = async (bookingDetails: any) => {
        const court = courts.find(c => c.name === newBookingData.courtName);
        if (!court) return;

        // Create ISO times for the new booking
        const [hourStr] = newBookingData.startTime.split(':');
        const startHour = parseInt(hourStr);
        const duration = parseFloat(bookingDetails.duration);

        const start = new Date(selectedDate);
        start.setHours(startHour, 0, 0, 0);

        const end = new Date(start);
        end.setMinutes(start.getMinutes() + duration * 60);

        // Simple Conflict Check
        const hasConflict = bookings.some(b =>
            b.courtId === court.id &&
            isSameDay(parseISO(b.startTime), selectedDate) &&
            (
                (start >= parseISO(b.startTime) && start < parseISO(b.endTime)) ||
                (end > parseISO(b.startTime) && end <= parseISO(b.endTime))
            )
        );

        if (hasConflict) {
            alert("¡Conflicto! Ya existe una reserva en este horario.");
            return;
        }

        // Call Service
        const newBooking = await createBookingAction({
            courtId: court.id,
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            ...bookingDetails, // playerId, participantIds, type, coachId, title, price
            status: 'Confirmed'
        });

        if (newBooking) {
            // Optimistic update
            const player = players.find(p => p.id === newBooking.playerId);
            const coach = coaches.find(c => c.id === newBooking.coachId);
            const bookingWithRelations = {
                ...newBooking,
                playerName: player?.name,
                coachName: coach?.name
            };

            setBookings([...bookings, bookingWithRelations]);
            setIsModalOpen(false);
        } else {
            alert("Error al guardar la reserva.");
        }
    };

    const handleSaveBooking = async (bookingDetails: any) => {
        if (editingBooking) {
            // Update existing
            const start = new Date(selectedDate);
            const [hourStr] = newBookingData.startTime.split(':'); // This might be old, be careful. 
            // Actually, for editing, we might want to keep original time unless changed.
            // But the modal logic calculates duration.

            // Let's rely on modal returning specific details.
            // However, modal returns duration, type, etc.

            // If we didn't change time in modal (modal doesn't have time picker yet, implies keeping same slot unless we dragged)
            // But wait, the user asked to edit AFTER creation.
            // The modal allows changing type, player, coach, duration.
            // If duration changes, end time changes.

            const currentStart = parseISO(editingBooking.startTime);
            const newDuration = parseFloat(bookingDetails.duration);
            const newEnd = new Date(currentStart.getTime() + newDuration * 60 * 60 * 1000);

            const updated = await updateBookingAction(editingBooking.id, {
                ...bookingDetails,
                startTime: currentStart.toISOString(),
                endTime: newEnd.toISOString()
            });

            if (updated) {
                const player = players.find(p => p.id === updated.playerId);
                const coach = coaches.find(c => c.id === updated.coachId);
                const bookingWithRelations = {
                    ...updated,
                    playerName: player?.name,
                    coachName: coach?.name,
                    participants: updated.participants
                };

                setBookings(bookings.map(b => b.id === updated.id ? bookingWithRelations : b));
                setIsModalOpen(false);
                setEditingBooking(null);
            } else {
                alert("Error al actualizar la reserva.");
            }

        } else {
            // Create New (Existing Logic)
            await handleCreateBooking(bookingDetails);
        }
    };

    // Existing handleCreateBooking needs to remain as "create only" helper or be merged
    // Let's reuse the logic inside handleSaveBooking but keep handleCreateBooking for clarity if needed, 
    // or just make handleSaveBooking the main confirm handler.

    // START Drag and Drop Handlers
    const handleDragStart = (e: React.DragEvent, bookingId: string) => {
        setDraggedBookingId(bookingId);
        e.dataTransfer.setData('bookingId', bookingId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, courtId: string, hour: number) => {
        e.preventDefault();
        const bookingId = e.dataTransfer.getData('bookingId');
        if (!bookingId) return;

        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) return;

        // Calculate new times
        const newStart = new Date(selectedDate);
        newStart.setHours(hour, 0, 0, 0);

        const durationMs = parseISO(booking.endTime).getTime() - parseISO(booking.startTime).getTime();
        const newEnd = new Date(newStart.getTime() + durationMs);

        // Conflict Check (excluding self)
        const hasConflict = bookings.some(b =>
            b.id !== bookingId &&
            b.courtId === courtId &&
            isSameDay(parseISO(b.startTime), selectedDate) &&
            (
                (newStart >= parseISO(b.startTime) && newStart < parseISO(b.endTime)) ||
                (newEnd > parseISO(b.startTime) && newEnd <= parseISO(b.endTime))
            )
        );

        if (hasConflict) {
            alert("¡Conflicto! Ya existe una reserva en este horario.");
            return;
        }

        // Optimistic Update
        const updatedBooking = { ...booking, courtId, startTime: newStart.toISOString(), endTime: newEnd.toISOString() };
        setBookings(bookings.map(b => b.id === bookingId ? updatedBooking : b));

        // Persist
        const result = await updateBookingAction(bookingId, {
            courtId,
            startTime: newStart.toISOString(),
            endTime: newEnd.toISOString()
        });

        if (!result) {
            // Revert if failed
            alert("Error al mover la reserva.");
            fetchData(); // Refetch to reset
        }
        setDraggedBookingId(null);
    };

    const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => START_HOUR + i);

    // Helper to check if a slot is occupied
    const isSlotOccupied = (courtId: string, hour: number) => {
        const slotStart = new Date(selectedDate);
        slotStart.setHours(hour, 0, 0, 0);
        const slotEnd = new Date(slotStart);
        slotEnd.setHours(hour + 1);

        return bookings.some(b => {
            if (b.courtId !== courtId) return false;
            const start = parseISO(b.startTime);
            const end = parseISO(b.endTime);
            return (start < slotEnd && end > slotStart);
        });
    };

    // Helper to find bookings
    const getBookingsForCourt = (courtId: string) => {
        return bookings.filter(b => {
            const bookingDate = parseISO(b.startTime);
            return b.courtId === courtId && isSameDay(bookingDate, selectedDate);
        });
    };

    const getPositionStyles = (startTime: string, endTime: string) => {
        const start = parseISO(startTime);
        const end = parseISO(endTime);

        const startMinutesFromOpening = (getHours(start) - START_HOUR) * 60 + getMinutes(start);
        const durationMins = differenceInMinutes(end, start);

        const top = (startMinutesFromOpening / 60) * SLOT_HEIGHT;
        const height = (durationMins / 60) * SLOT_HEIGHT;

        return { top: `${top}px`, height: `${height}px` };
    };

    const getTypeStyle = (type: string) => {
        switch (type) {
            case 'Training': return 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25';
            case 'Match': return 'bg-green-500 hover:bg-green-600 shadow-green-500/25';
            case 'Classes': return 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/25';
            default: return 'bg-purple-500 hover:bg-purple-600 shadow-purple-500/25';
        }
    };

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-6rem)]">
            {/* Modal */}
            <CreateBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSaveBooking}
                startTime={newBookingData.startTime}
                date={format(selectedDate, 'MMM d', { locale: es })}
                courtName={newBookingData.courtName}
                players={players}
                coaches={coaches}
                initialData={editingBooking}
            />

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">Calendario Diario</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-500">Gestión de reservas (Drag & Drop para mover).</p>
                        {loading && <Loader2 size={16} className="text-indigo-600 animate-spin" />}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                        <button
                            onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="px-4 text-slate-800 font-medium flex items-center justify-center gap-2 min-w-[160px] text-sm md:text-lg">
                            <CalendarIcon size={16} className="text-orange-500" />
                            <span className="capitalize">{format(selectedDate, 'EEEE, d MMM', { locale: es })}</span>
                        </div>
                        <button
                            onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                            className="p-2 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <button className="bg-orange-500 text-white px-4 py-2.5 rounded-lg hover:bg-orange-600 transition-colors font-medium shadow-lg shadow-orange-500/20 text-sm whitespace-nowrap">
                        + Reserva Rápida
                    </button>
                </div>
            </div>

            {/* Main Scheduler Container with Horizontal Scroll Support */}
            <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-xl flex flex-col relative text-sm shadow-sm">
                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <div className="min-w-[900px] h-full flex flex-col">

                        {/* Header: Courts */}
                        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 sticky top-0 z-20">
                            <div className="w-16 shrink-0 border-r border-slate-200 font-bold text-slate-400 flex items-center justify-center sticky left-0 z-30 bg-slate-50">
                                <Clock size={20} />
                            </div>
                            <div className="flex-1 grid grid-cols-4">
                                {courts.map(court => (
                                    <div key={court.id} className="p-3 text-center border-r border-slate-200 last:border-0 relative min-w-[120px]">
                                        <div className="font-bold text-slate-800 text-base truncate">{court.name}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">{court.type}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scrollable Grid Area */}

                        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
                            <div className="flex relative" style={{ height: (hours.length * SLOT_HEIGHT) + 'px' }}>

                                {/* Time Column */}
                                <div className="w-16 shrink-0 border-r border-slate-200 bg-white sticky left-0 z-10 flex flex-col">
                                    {hours.map(hour => (
                                        <div key={hour} className="border-b border-slate-100 text-xs text-slate-400 font-medium flex items-start justify-center pt-2 relative" style={{ height: SLOT_HEIGHT }}>
                                            <span className="-translate-y-1/2 bg-white px-1 relative z-10">{hour}:00</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Courts Columns Container */}
                                <div className="flex-1 grid grid-cols-4 relative bg-white"
                                    style={{
                                        backgroundImage: `linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)`,
                                        backgroundSize: `100% ${SLOT_HEIGHT}px`
                                    }}>

                                    {courts.map(court => (
                                        <div key={court.id} className="border-r border-slate-100 last:border-0 relative h-full group/court">
                                            {/* Empty Slot Interactions (Hover & Dash Indicator) */}
                                            {hours.map(hour => {
                                                const occupied = isSlotOccupied(court.id, hour);
                                                if (occupied) return null; // Don't render empty slot interaction if occupied

                                                return (
                                                    <div
                                                        key={hour}
                                                        onClick={() => handleOpenModal(hour, court.name)}
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, court.id, hour)}
                                                        className="absolute w-full hover:bg-slate-50 transition-colors group/hour flex items-center justify-center cursor-pointer"
                                                        style={{ top: (hour - START_HOUR) * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                                                    >
                                                        {/* Empty Slot Dash Indicator (Reference Image Style) */}
                                                        <div className="w-8 h-1.5 bg-slate-100 rounded-full group-hover/hour:bg-slate-200 transition-colors" />

                                                        {/* Plus Icon on Hover (Optional, keeping it subtle) */}
                                                        <Plus className="absolute text-orange-400 opacity-0 group-hover/hour:opacity-100 transition-opacity transform scale-75" />
                                                    </div>
                                                );
                                            })}

                                            {/* Render Bookings */}
                                            {isModalOpen && newBookingData.courtName === court.name && !editingBooking && (
                                                <div
                                                    className="absolute inset-x-1 rounded-lg p-3 bg-orange-500/90 backdrop-blur-[1px] z-20 flex flex-col animate-pulse border-none shadow-lg"
                                                    style={{
                                                        top: (parseInt(newBookingData.startTime.split(':')[0]) - START_HOUR) * SLOT_HEIGHT,
                                                        height: SLOT_HEIGHT
                                                    }}
                                                >
                                                    <div className="flex justify-between items-start text-xs font-bold uppercase text-white mb-0.5">
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                                            <span>Reservando...</span>
                                                        </div>
                                                        <span>{newBookingData.startTime}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {getBookingsForCourt(court.id).map(booking => {
                                                const styles = getPositionStyles(booking.startTime, booking.endTime);

                                                // Calculate display name for participants
                                                let displayTitle = booking.playerName || 'Cliente';
                                                if (booking.participants && booking.participants.length > 1) {
                                                    displayTitle = `${booking.participants[0].name} +${booking.participants.length - 1}`;
                                                } else if (booking.participants && booking.participants.length === 1) {
                                                    displayTitle = booking.participants[0].name;
                                                }

                                                return (
                                                    <div
                                                        key={booking.id}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, booking.id)}
                                                        onClick={(e) => {
                                                            handleEditBooking(booking, e);
                                                            setEditingBooking(booking);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className={clsx(
                                                            "absolute inset-x-1 rounded-lg p-3 text-white shadow-md overflow-hidden transition-all hover:brightness-105 hover:scale-[1.01] z-10 cursor-pointer flex flex-col border-none ring-1 ring-black/5",
                                                            getTypeStyle(booking.type),
                                                            draggedBookingId === booking.id ? 'opacity-50 scale-95' : ''
                                                        )}
                                                        style={styles}
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            {booking.type === 'Match' && <User size={14} className="opacity-90" />}
                                                            {booking.type === 'Training' && <div className="w-3.5 h-3.5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold">T</div>}
                                                            {booking.type === 'Classes' && <div className="w-3.5 h-3.5 bg-white/20 rounded-full flex items-center justify-center text-[10px] font-bold">C</div>}

                                                            <span className="text-xs font-bold uppercase tracking-wide opacity-90">{booking.title || booking.type}</span>
                                                        </div>

                                                        <div className="font-bold text-sm truncate leading-tight mb-0.5">
                                                            {displayTitle}
                                                        </div>

                                                        {booking.coachName && (
                                                            <div className="text-xs opacity-90 font-medium flex items-center gap-1">
                                                                <span className="opacity-75">w/</span> {booking.coachName}
                                                            </div>
                                                        )}

                                                        <div className="mt-auto text-[10px] font-medium opacity-80 bg-black/10 self-start px-1.5 py-0.5 rounded text-white">
                                                            {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
