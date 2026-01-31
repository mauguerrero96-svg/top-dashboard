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

// Invoices Actions
import { invoicesService } from '@/services/invoices';

export async function fetchInvoicesAction() {
    return invoicesService.getInvoices();
}

export async function fetchAllInvoicesAction() {
    // We need to access the DB directly or expose a method in invoicesService or dashboardService
    // dashboardService has getInvoices(limit).
    // Let's use invoicesService.getInvoices() which fetches all by default or add a new method.
    // Actually invoicesService.getInvoices() fetches all.
    return invoicesService.getInvoices();
}

// Finances Actions
import { financesService } from '@/services/finances';

export async function fetchTransactionsAction(start: Date, end: Date) {
    return financesService.getTransactions(start, end);
}

// Player Actions
export async function getAttendanceAction(playerId: string) {
    return dashboardService.getAttendanceHistory(playerId);
}

export async function checkInPlayerAction(playerId: string) {
    return dashboardService.checkInPlayer(playerId);
}

export async function fetchPlayerPaymentsAction(playerId: string) {
    return dashboardService.getPlayerPayments(playerId);
}

export async function addPaymentAction(playerId: string, amount: number, notes: string) {
    return dashboardService.addPayment(playerId, amount, notes);
}

export async function deletePaymentAction(paymentId: string, playerId: string) {
    return dashboardService.deletePayment(paymentId, playerId);
}

export async function createPlayerAction(data: any) {
    return dashboardService.createPlayer(data);
}

export async function updatePlayerAction(id: string, data: any) {
    return dashboardService.updatePlayer(id, data);
}

// More Finance Actions
export async function deleteTransactionAction(id: string, type: string, sourceTable?: string, playerId?: string) {
    return financesService.deleteTransaction(id, type, sourceTable, playerId);
}

export async function updateTransactionAction(transaction: any) {
    return financesService.updateTransaction(transaction);
}

export async function fetchBalanceSheetAction(date: Date) {
    return financesService.getBalanceSheet(date);
}

export async function fetchUsageStatsAction(start: Date, end: Date) {
    return dashboardService.getUsageStats(start, end);
}



