export type TherapistStatus = 'available' | 'busy' | 'break' | 'offline';
export type Gender = 'male' | 'female' | 'any';
export type ServiceType = 'massage' | 'facial' | 'body-treatment' | 'therapy';
export type ClientStatus = 'waiting' | 'in-service' | 'completed' | 'no-show';
export type AppointmentType = 'walk-in' | 'booking';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  duration: number; // in minutes
  price: number;
  commission: number; // percentage
}

export interface Therapist {
  id: string;
  name: string;
  gender: Gender;
  status: TherapistStatus;
  photoUrl?: string;
  commissionRate: number; // percentage
  totalServes: number;
  todayServes: number;
  todayCommission: number;
  rating: number;
  isBestPerformer?: boolean;
  currentClient?: string;
  serviceEndTime?: Date;
  lastServedTime?: Date;
  specialties: ServiceType[];
  serviceIds: string[]; // IDs of services this therapist can perform
}

export interface Client {
  id: string;
  name?: string;
  phone?: string;
  gender?: Gender;
  preferredGender?: Gender;
  service: Service;
  status: ClientStatus;
  type: AppointmentType;
  assignedTherapist?: string;
  waitingSince: Date;
  estimatedStartTime?: Date;
  scheduledTime?: Date;
  priority: number;
  notes?: string;
}

export interface QueueEntry {
  id: string;
  client: Client;
  position: number;
  waitTime: number; // in minutes
  isLate?: boolean;
}

export interface DailyReport {
  date: Date;
  totalClients: number;
  totalRevenue: number;
  totalCommissions: number;
  therapistReports: TherapistReport[];
}

export interface TherapistReport {
  therapistId: string;
  therapistName: string;
  serves: number;
  revenue: number;
  commission: number;
  averageRating: number;
}

export interface Schedule {
  id: string;
  therapistId: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
  isAvailable: boolean;
}
