import { FestivalEvent, RegistrationFormData, FormErrors } from '../types';

export const DEMO_PAYMENT_REF_REGEX = /^DEMO-MILAN-[A-Z0-9]{8}$/;

/**
 * Normalises phone input by stripping permitted whitespace, brackets, hyphens, and standard country code prefix.
 */
export function normalisePhoneNumber(phoneRaw: string): string {
  // Strip permitted separators: spaces, dashes, dots, parentheses
  const stripped = String(phoneRaw || '').replace(/[\s\-\(\)\.]/g, '');
  // Strip standard +91 or 0 prefix
  return stripped.replace(/^(\+91|0)/, '');
}

/**
 * Validates a single registration field given form data, the target event, and optional valid event IDs.
 */
export function validateRegistrationField(
  name: keyof RegistrationFormData,
  value: any,
  data: Partial<RegistrationFormData>,
  event?: FestivalEvent | null,
  validEventIds?: string[]
): string | undefined {
  switch (name) {
    case 'fullName': {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) return 'Full name is required.';
      if (trimmed.length < 2) return 'Full name must contain at least 2 characters.';
      if (trimmed.length > 70) return 'Full name cannot exceed 70 characters.';
      break;
    }
    case 'registrationNumber': {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) return 'College Roll No or Registration ID is required.';
      if (trimmed.length < 3) return 'Registration ID must be at least 3 characters.';
      if (trimmed.length > 30) return 'Registration ID cannot exceed 30 characters.';
      break;
    }
    case 'email': {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) return 'Institutional email address is required.';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmed)) {
        return 'Please provide a valid email format (e.g. name@college.edu).';
      }
      if (trimmed.length > 80) return 'Email address cannot exceed 80 characters.';
      break;
    }
    case 'phone': {
      const cleanPhone = normalisePhoneNumber(String(value || ''));
      if (!cleanPhone) return 'Mobile number is required.';
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return 'Please enter a valid 10-digit mobile number starting with 6-9.';
      }
      break;
    }
    case 'college': {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) return 'Institution or University name is required.';
      if (trimmed.length < 3) return 'Institution name must be at least 3 characters.';
      if (trimmed.length > 100) return 'Institution name cannot exceed 100 characters.';
      break;
    }
    case 'eventId': {
      if (!value) return 'Please select a competition from the list.';
      if (validEventIds && validEventIds.length > 0 && !validEventIds.includes(String(value))) {
        return 'Selected competition is not recognized in the schedule.';
      }
      break;
    }
    case 'teamName': {
      if (data.participationType === 'Team') {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        if (!trimmed) return 'Team or Crew name is required for team participation.';
        if (trimmed.length < 2) return 'Team name must be at least 2 characters.';
        if (trimmed.length > 80) return 'Team name cannot exceed 80 characters.';
      }
      break;
    }
    case 'teamSize': {
      if (data.participationType === 'Team') {
        if (value === '' || value === undefined || value === null) {
          return 'Team size is required.';
        }
        const num = Number(value);
        if (isNaN(num) || !Number.isInteger(num)) {
          return 'Team size must be a whole integer number.';
        }
        const min = event?.minTeamSize ?? 2;
        const max = event?.maxTeamSize ?? 25;
        if (num < min || num > max) {
          return `Team size for this event must be between ${min} and ${max} members.`;
        }
      }
      break;
    }
    case 'demoPaymentReference': {
      // Required ONLY when event has a sample fee > 0
      if (event && event.feeAmount > 0) {
        const trimmed = typeof value === 'string' ? value.trim() : '';
        if (!trimmed) {
          return 'Demo payment reference is required for events with a sample fee.';
        }
        if (!DEMO_PAYMENT_REF_REGEX.test(trimmed)) {
          return 'Must match fictional format: DEMO-MILAN-XXXXXXXX (8 uppercase letters or digits).';
        }
      }
      break;
    }
    case 'agreeTerms': {
      if (!value) {
        return 'You must acknowledge that this is a simulated assessment demonstration.';
      }
      break;
    }
    default:
      break;
  }
  return undefined;
}

/**
 * Validates all registration fields and returns an error dictionary.
 */
export function validateRegistrationForm(
  formData: RegistrationFormData,
  event?: FestivalEvent | null,
  validEventIds?: string[]
): FormErrors {
  const errors: FormErrors = {};
  const fields: Array<keyof RegistrationFormData> = [
    'fullName',
    'registrationNumber',
    'email',
    'phone',
    'college',
    'eventId',
    'participationType',
    'teamName',
    'teamSize',
    'demoPaymentReference',
    'agreeTerms',
  ];

  fields.forEach((field) => {
    const err = validateRegistrationField(field, formData[field], formData, event, validEventIds);
    if (err) {
      errors[field] = err;
    }
  });

  return errors;
}

/**
 * Helper to generate a documented fictional payment reference for evaluation testing.
 */
export function generateSamplePaymentReference(): string {
  const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase().padEnd(8, '0');
  return `DEMO-MILAN-${randomSuffix}`;
}
