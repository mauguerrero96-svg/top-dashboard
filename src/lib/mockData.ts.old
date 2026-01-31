export type MembershipStatus = 'Active' | 'Paused' | 'Cancelled';
export type MembershipType = 'Monthly' | 'Quarterly' | 'Annual' | 'Classes';

export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  avatar?: string;
  balance: number;        // Positive = Owed, Negative = Credit
  nextBillingDate: string; // ISO date
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue';

export interface Invoice {
  id: string;
  playerId: string;
  amount: number;
  date: string; // ISO date
  status: InvoiceStatus;
  description: string;
  category: string;
}

export interface Court {
  id: string;
  name: string;
  type: 'Clay' | 'Hard' | 'Grass';
}

export interface Booking {
  id: string;
  courtId: string;
  playerId: string;
  coachId?: string; // Optional coach assignment
  title?: string;   // Optional class title (e.g. "Serve Clinic")
  startTime: string; // ISO string
  endTime: string;   // ISO string
  type: 'Match' | 'Training' | 'Tournament' | 'Classes';
  status: 'Confirmed' | 'Cancelled';
  price: number;
  playerName?: string; // Transformed from join
  coachName?: string; // Transformed from join
  participants?: { name: string }[]; // Transformed from join
  clinic?: string;
}

export interface Coach {
  id: string;
  name: string;
  specialty: string;
}

export const COACHES: Coach[] = [
  { id: 'coach-1', name: 'Toni Nadal', specialty: 'Clay Strategy' },
  { id: 'coach-2', name: 'Patrick M.', specialty: 'Serve & Volley' },
  { id: 'coach-3', name: 'Darren C.', specialty: 'Mental Game' },
];

export const PLAYERS: Player[] = [
  { id: '1', name: 'Rafael N.', email: 'rafa@clayking.com', phone: '+34 123 456 789', membershipType: 'Annual', status: 'Active', balance: 0, nextBillingDate: '2023-11-01' },
  { id: '2', name: 'Roger F.', email: 'roger@peRFect.com', phone: '+41 987 654 321', membershipType: 'Annual', status: 'Active', balance: 0, nextBillingDate: '2023-11-01' },
  { id: '3', name: 'Novak D.', email: 'nole@wolf.com', phone: '+381 555 666 777', membershipType: 'Monthly', status: 'Paused', balance: 0, nextBillingDate: '2023-11-05' },
  { id: '4', name: 'Carlos A.', email: 'carlitos@vamos.com', phone: '+34 666 777 888', membershipType: 'Monthly', status: 'Active', balance: 50, nextBillingDate: '2023-10-01' }, // Overdue
  { id: '5', name: 'Serena W.', email: 'serena@goat.com', phone: '+1 555 444 333', membershipType: 'Classes', status: 'Active', balance: 200, nextBillingDate: '2023-10-15' },
];

export const COURTS: Court[] = [
  { id: 'c1', name: 'Court 1 (Central)', type: 'Clay' },
  { id: 'c2', name: 'Court 2', type: 'Clay' },
  { id: 'c3', name: 'Court 3', type: 'Hard' },
  { id: 'c4', name: 'Court 4', type: 'Hard' },
];

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export const INVOICES: Invoice[] = [
  { id: 'INV-001', playerId: '1', amount: 450, status: 'Paid', date: '2023-10-01', description: 'Membership - Oct', category: 'Memberships' },
  { id: 'INV-002', playerId: '2', amount: 60, status: 'Pending', date: '2023-10-05', description: 'Private Lesson', category: 'Classes' },
  { id: 'INV-003', playerId: '3', amount: 450, status: 'Paid', date: '2023-10-01', description: 'Membership - Oct', category: 'Memberships' },
  { id: 'INV-004', playerId: '4', amount: 120, status: 'Overdue', date: '2023-09-28', description: 'Court Rental x3', category: 'Court Rental' },
  { id: 'INV-005', playerId: '1', amount: 200, status: 'Pending', date: '2023-10-10', description: 'Tennis Racket Stringing', category: 'Pro Shop' },
  { id: 'INV-006', playerId: '5', amount: 450, status: 'Paid', date: '2023-10-01', description: 'Membership - Oct', category: 'Memberships' },
  { id: 'INV-007', playerId: '2', amount: 30, status: 'Paid', date: '2023-10-02', description: 'Guest Fee', category: 'Court Rental' },
  { id: 'INV-008', playerId: '3', amount: 450, status: 'Pending', date: '2023-11-01', description: 'Membership - Nov', category: 'Memberships' },
  { id: 'INV-009', playerId: '4', amount: 150, status: 'Paid', date: '2023-10-15', description: 'Tournament Entry Fee', category: 'Tournaments' },
  { id: 'INV-010', playerId: '5', amount: 150, status: 'Paid', date: '2023-10-15', description: 'Tournament Entry Fee', category: 'Tournaments' },
];

export const EXPENSES: Expense[] = [
  { id: 'EXP-1', category: 'Rent', amount: 3500, date: '2023-10-01', description: 'Monthly Facility Rent' },
  { id: 'EXP-2', category: 'Salaries', amount: 4200, date: '2023-10-05', description: 'Coaches & Staff Payroll' },
  { id: 'EXP-3', category: 'Utilities', amount: 850, date: '2023-10-10', description: 'Electricity & Water' },
  { id: 'EXP-4', category: 'Equipment', amount: 600, date: '2023-10-12', description: 'New Clay Court Nets' },
  { id: 'EXP-5', category: 'Maintenance', amount: 450, date: '2023-10-15', description: 'Court Resurfacing Material' },
  { id: 'EXP-6', category: 'Marketing', amount: 300, date: '2023-10-02', description: 'Facebook Ads Campaign' },
];

// Helper to create date relative to "today" for dynamic demo
const today = new Date();
const y = today.getFullYear();
const m = today.getMonth();
const d = today.getDate();

const getDate = (dayOffset: number, hour: number) => {
  const date = new Date(y, m, d + dayOffset, hour, 0, 0);
  return date.toISOString();
};

export const BOOKINGS: Booking[] = [
  // Today
  { id: 'b1', courtId: 'c1', playerId: '1', startTime: getDate(0, 10), endTime: getDate(0, 12), type: 'Training', status: 'Confirmed', price: 100, coachId: 'coach-1', title: 'Clay Drills' },
  { id: 'b2', courtId: 'c2', playerId: '4', startTime: getDate(0, 10), endTime: getDate(0, 11), type: 'Match', status: 'Confirmed', price: 20 },
  { id: 'b3', courtId: 'c1', playerId: '2', startTime: getDate(0, 16), endTime: getDate(0, 18), type: 'Match', status: 'Confirmed', price: 40 },

  // Tomorrow
  { id: 'b4', courtId: 'c3', playerId: '3', startTime: getDate(1, 9), endTime: getDate(1, 11), type: 'Training', status: 'Confirmed', price: 100, coachId: 'coach-2' },
  { id: 'b5', courtId: 'c1', playerId: '5', startTime: getDate(1, 14), endTime: getDate(1, 15), type: 'Classes', status: 'Confirmed', price: 50, title: 'Power Serve Clinic', coachId: 'coach-3' },

  // Yesterday
  { id: 'b6', courtId: 'c2', playerId: '1', startTime: getDate(-1, 18), endTime: getDate(-1, 20), type: 'Match', status: 'Confirmed', price: 40 },
];

export const FINANCIAL_KPI = {
  revenueCurrentMonth: 12500,
  revenueLastMonth: 11200,
  activePlayers: 142,
  pendingPaymentsAmount: 3450,
  paymentRate: 88, // %
};
