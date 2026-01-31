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

export interface Expense {
    id: string;
    category: string;
    amount: number;
    date: string;
    description: string;
}
