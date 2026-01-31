export type PlayerStatus = 'Activo' | 'Inactivo' | 'No Activo' | 'Beca';
export type PaymentStatus = 'Pagado' | 'Pendiente' | 'NA';
export type ClinicType = 'Alto Rendimiento' | 'Clinica A' | 'Clinica B';

export interface PlayerSchedule {
    id: string;
    player_id: string;
    day_of_week: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
    start_time: string; // HH:MM:SS
    end_time: string;   // HH:MM:SS
}

export interface DashboardPlayer {
    id: string; // uuid
    name: string;
    email: string;
    phone: string;
    status: PlayerStatus;
    monthly_fee: number;
    payment_status: PaymentStatus;
    clinic: ClinicType;
    schedules?: PlayerSchedule[];
    total_paid?: number; // Added for partial payments
    created_at?: string;
    updated_at?: string;
}

export interface PaymentRecord {
    id: string;
    player_id: string;
    amount: number;
    notes?: string;
    date: string;
}

export interface DashboardPayment {
    id?: string;
    player_id?: string; // or name as per prompt, but id is better practices, prompt says "player_id o player_name"
    player_name?: string;
    month: string;
    amount: number;
    status: string; // likely 'Pagado' etc
    payment_date: string;
    payment_method: string;
}

export interface AttendanceRecord {
    id: string;
    player_id: string;
    check_in_time: string;
    notes?: string;
    created_at?: string;
}
