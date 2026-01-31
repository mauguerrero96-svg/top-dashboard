import { Booking } from '@/types/bookings';
import { parseISO, differenceInMinutes, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export const HOURLY_RATE = 20;
export const CLASS_HOURLY_RATE = 50;
export const LIGHT_FEE = 10;

/**
 * Calculates the price of a booking based on duration and type.
 */
export function calculateBookingPrice(
    startTime: Date,
    endTime: Date,
    type: Booking['type']
): number {
    const durationMinutes = differenceInMinutes(endTime, startTime);
    const durationHours = durationMinutes / 60;

    let baseRate = HOURLY_RATE;
    if (type === 'Classes' || type === 'Training') {
        baseRate = CLASS_HOURLY_RATE;
    }

    let price = baseRate * durationHours;

    // Add light fee if playing after 18:00 (6 PM)
    const hour = startTime.getHours();
    if (hour >= 18) {
        price += LIGHT_FEE;
    }

    return Math.round(price);
}

/**
 * Checks if a time slot is available for a specific court.
 */
export function isCourtAvailable(
    bookings: Booking[],
    courtId: string,
    startTime: Date,
    endTime: Date,
    excludeBookingId?: string
): boolean {
    const conflictingBooking = bookings.find(b => {
        if (b.courtId !== courtId) return false;
        if (b.status === 'Cancelled') return false;
        if (excludeBookingId && b.id === excludeBookingId) return false;

        const bStart = parseISO(b.startTime);
        const bEnd = parseISO(b.endTime);

        // Check overlap: (StartA < EndB) and (EndA > StartB)
        return startTime < bEnd && endTime > bStart;
    });

    return !conflictingBooking;
}

/**
 * calculates earnings per court within a date range.
 */
export function getCourtEarnings(
    bookings: Booking[],
    courtId: string,
    startDate: Date,
    endDate: Date
) {
    const relevantBookings = bookings.filter(b => {
        if (b.courtId !== courtId) return false;
        if (b.status !== 'Confirmed') return false;
        const bStart = parseISO(b.startTime);
        return isWithinInterval(bStart, { start: startDate, end: endDate });
    });

    const totalRevenue = relevantBookings.reduce((sum, b) => sum + (b.price || 0), 0);
    const totalMinutes = relevantBookings.reduce((sum, b) => {
        return sum + differenceInMinutes(parseISO(b.endTime), parseISO(b.startTime));
    }, 0);

    return {
        revenue: totalRevenue,
        hoursBooked: Math.round(totalMinutes / 60 * 10) / 10,
        bookingCount: relevantBookings.length
    };
}
