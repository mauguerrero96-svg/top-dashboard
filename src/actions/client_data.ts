'use server';

import { bookingsService } from '@/services/bookings';
import { dashboardService } from '@/services/dashboard';

export async function fetchBookings(start: Date, end: Date) {
    return bookingsService.getBookings(start, end);
}

export async function fetchPlayers() {
    return dashboardService.getPlayers();
}

export async function fetchCoaches() {
    return bookingsService.getCoaches();
}

export async function fetchCourts() {
    return bookingsService.getCourts();
}

export async function createBookingAction(data: any) {
    return bookingsService.createBooking(data);
}

export async function updateBookingAction(id: string, data: any) {
    return bookingsService.updateBooking(id, data);
}
