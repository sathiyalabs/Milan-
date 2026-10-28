export type EventCategory =
  | 'All'
  | 'Dance'
  | 'Music'
  | 'Drama'
  | 'Fashion'
  | 'Fine Arts'
  | 'Literary & Media';

export interface Coordinator {
  name: string;
  role: string;
  contact: string;
}

export interface FestivalEvent {
  id: string;
  title: string;
  category: Exclude<EventCategory, 'All'>;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  date: string;
  day: 'Day 1' | 'Day 2' | 'Day 3';
  time: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  participationType: 'Solo' | 'Team' | 'Solo or Team';
  minTeamSize?: number;
  maxTeamSize?: number;
  feeAmount: number; // 0 for free events, > 0 for sample paid event
  registrationFee: string;
  prizePool: string;
  rules: string[];
  judgingCriteria: string[];
  coordinators: Coordinator[];
  isFeatured?: boolean;
  accentColor: string;
}

export interface RegistrationFormData {
  fullName: string;
  registrationNumber: string;
  email: string;
  phone: string;
  college: string;
  eventId: string;
  participationType: 'Solo' | 'Team';
  teamName: string;
  teamSize: number | ''; // Allows empty string while user is actively editing
  specialRequirements: string;
  demoPaymentReference: string; // Required only when feeAmount > 0
  agreeTerms: boolean;
}

export type FormErrors = Partial<Record<keyof RegistrationFormData, string>>;

export interface ConfirmedRegistration {
  ticketId: string; // Generated using crypto.randomUUID()
  registrationData: RegistrationFormData;
  event: FestivalEvent;
  timestamp: string;
  demoPaymentReference?: string;
  isPaidEvent: boolean;
  feeAmount: number;
}
