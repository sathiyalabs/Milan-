import React, { useState, useEffect, useRef } from 'react';
import { FestivalEvent, RegistrationFormData, FormErrors, ConfirmedRegistration } from '../types';
import {
  validateRegistrationField,
  validateRegistrationForm,
  generateSamplePaymentReference,
} from '../utils/validation';
import {
  AlertCircle,
  Loader2,
  Ticket,
  Printer,
  RotateCcw,
  MapPin,
  QrCode,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface RegistrationFormProps {
  events: FestivalEvent[];
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  events,
  selectedEventId,
  onEventChange,
}) => {
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    college: '',
    eventId: selectedEventId || (events[0]?.id ?? ''),
    participationType: 'Solo',
    teamName: '',
    teamSize: 2,
    specialRequirements: '',
    demoPaymentReference: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedPass, setConfirmedPass] = useState<ConfirmedRegistration | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);
  const confirmationHeadingRef = useRef<HTMLHeadingElement>(null);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentEvent = events.find((e) => e.id === formData.eventId) || events[0];

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  // Sync eventId when prop changes from outside (e.g. from event cards or modal)
  useEffect(() => {
    if (selectedEventId && selectedEventId !== formData.eventId) {
      setFormData((prev) => ({
        ...prev,
        eventId: selectedEventId,
      }));
    }
  }, [selectedEventId]);

  // Revalidate dependent fields on event change without silently clamping team size
  useEffect(() => {
    if (currentEvent) {
      setFormData((prev) => {
        let updatedType = prev.participationType;
        if (currentEvent.participationType === 'Team') {
          updatedType = 'Team';
        } else if (currentEvent.participationType === 'Solo') {
          updatedType = 'Solo';
        }

        // Preserve user's entered teamSize as-is, do not silently clamp!
        return {
          ...prev,
          participationType: updatedType,
          demoPaymentReference: currentEvent.feeAmount === 0 ? '' : prev.demoPaymentReference,
        };
      });

      // Revalidate team size and payment reference against the new event bounds
      setErrors((prevErrors) => {
        const next = { ...prevErrors };

        if (formData.participationType === 'Team' || currentEvent.participationType === 'Team') {
          const teamSizeErr = validateRegistrationField('teamSize', formData.teamSize, formData, currentEvent);
          if (teamSizeErr) {
            next.teamSize = teamSizeErr;
          } else {
            delete next.teamSize;
          }
        }

        if (currentEvent.feeAmount === 0) {
          delete next.demoPaymentReference;
        } else if (touched.demoPaymentReference) {
          const payErr = validateRegistrationField('demoPaymentReference', formData.demoPaymentReference, formData, currentEvent);
          if (payErr) {
            next.demoPaymentReference = payErr;
          }
        }

        return next;
      });
    }
  }, [currentEvent ? currentEvent.id : null]);

  const handleBlur = (field: keyof RegistrationFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateRegistrationField(field, formData[field], formData, currentEvent);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof RegistrationFormData, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (field === 'eventId') {
      onEventChange(value);
    }

    if (touched[field]) {
      const error = validateRegistrationField(field, value, updated, currentEvent);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleFillSampleReference = () => {
    const sampleRef = generateSamplePaymentReference();
    handleChange('demoPaymentReference', sampleRef);
    setTouched((prev) => ({ ...prev, demoPaymentReference: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent repeated submission while already pending
    if (isSubmitting) return;

    // Capture frozen snapshot of validated data
    const submissionSnapshot: RegistrationFormData = { ...formData };

    // Validate using shared utility
    const formErrors = validateRegistrationForm(submissionSnapshot, currentEvent);

    setTouched({
      fullName: true,
      registrationNumber: true,
      email: true,
      phone: true,
      college: true,
      eventId: true,
      participationType: true,
      teamName: true,
      teamSize: true,
      demoPaymentReference: true,
      agreeTerms: true,
    });

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) {
      // Focus first invalid field
      const fieldsOrder: Array<keyof RegistrationFormData> = [
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
      const firstInvalid = fieldsOrder.find((f) => !!formErrors[f]);
      if (firstInvalid) {
        const el = document.getElementById(`reg-${firstInvalid}`);
        el?.focus();
      }
      return;
    }

    // Enter pending submission state
    setIsSubmitting(true);

    submitTimerRef.current = setTimeout(() => {
      setIsSubmitting(false);

      // Generate full crypto.randomUUID() for pass ID
      const fullPassId = `DEMO-PASS-${crypto.randomUUID().toUpperCase()}`;

      const confirmed: ConfirmedRegistration = {
        ticketId: fullPassId,
        registrationData: submissionSnapshot,
        event: currentEvent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        demoPaymentReference: currentEvent.feeAmount > 0 ? submissionSnapshot.demoPaymentReference.trim() : undefined,
        isPaidEvent: currentEvent.feeAmount > 0,
        feeAmount: currentEvent.feeAmount,
      };

      setConfirmedPass(confirmed);

      // Respect prefers-reduced-motion in programmatic scroll and focus confirmation heading
      setTimeout(() => {
        const prefersReduced = typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        confirmationRef.current?.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start',
        });

        confirmationHeadingRef.current?.focus({ preventScroll: true });
      }, 50);
    }, 600);
  };

  const handleRegisterAnother = () => {
    setConfirmedPass(null);
    setFormData({
      fullName: '',
      registrationNumber: '',
      email: '',
      phone: '',
      college: '',
      eventId: events[0]?.id ?? '',
      participationType: 'Solo',
      teamName: '',
      teamSize: 2,
      specialRequirements: '',
      demoPaymentReference: '',
      agreeTerms: false,
    });
    setErrors({});
    setTouched({});
  };

  return (
    <section id="registration" className="py-16 lg:py-24 bg-[#09080D] border-t border-[#241733] scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899]">
            Simulated Assessment Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF7F5] font-display">
            Delegate Demo Registration
          </h2>
          <p className="text-xs sm:text-sm text-[#A89CB5] max-w-lg mx-auto">
            Test the registration validation flow. Data exists only in local memory during your browser session and is never persisted.
          </p>
        </div>

        {/* DEMO CONFIRMATION PASS VIEW */}
        {confirmedPass ? (
          <div
            ref={confirmationRef}
            role="region"
            aria-label="Demo Registration Confirmation Pass"
            className="bg-[#17101E] border-2 border-[#A855F7] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#FAF7F5]"
          >
            {/* Pass Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-dashed border-[#3D2759] gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded bg-[#F43F5E]/20 border border-[#F43F5E]/40 text-xs font-bold text-[#F43F5E] uppercase tracking-wider mb-2">
                  DEMO — NOT VALID FOR ENTRY
                </span>
                <h3
                  ref={confirmationHeadingRef}
                  tabIndex={-1}
                  className="text-2xl sm:text-3xl font-black text-[#FAF7F5] font-display focus:outline-none"
                >
                  MILAN ’26 SIMULATED PASS
                </h3>
                <p className="text-xs text-[#C8BFD4] mt-0.5">
                  SRMIST Cultural Fest · Simulated Delegate Pass
                </p>
              </div>

              <div className="text-left sm:text-right font-mono">
                <span className="text-[11px] text-[#A89CB5] block">Generated Pass ID (UUID)</span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wider block break-all font-mono">
                  {confirmedPass.ticketId}
                </span>
                <span className="text-[11px] text-[#84CC16] font-semibold flex items-center gap-1 sm:justify-end mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Validated in Memory</span>
                </span>
              </div>
            </div>

            {/* Pass Body Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div>
                  <span className="text-[#A89CB5] block uppercase tracking-wider text-[10px]">
                    Delegate Name
                  </span>
                  <p className="text-base font-bold text-white">
                    {confirmedPass.registrationData.fullName}
                  </p>
                  <p className="text-[#C8BFD4]">
                    Roll/ID: {confirmedPass.registrationData.registrationNumber}
                  </p>
                </div>

                <div>
                  <span className="text-[#A89CB5] block uppercase tracking-wider text-[10px]">
                    Institution
                  </span>
                  <p className="font-semibold text-white">
                    {confirmedPass.registrationData.college}
                  </p>
                </div>

                <div>
                  <span className="text-[#A89CB5] block uppercase tracking-wider text-[10px]">
                    Simulated Contact
                  </span>
                  <p className="text-[#C8BFD4]">{confirmedPass.registrationData.email}</p>
                  <p className="text-[#C8BFD4]">{confirmedPass.registrationData.phone}</p>
                </div>
              </div>

              <div className="space-y-3 bg-[#120A1A] p-4 rounded-xl border border-[#2D1F3D]">
                <div>
                  <span className="text-[#A89CB5] block uppercase tracking-wider text-[10px]">
                    Registered Competition
                  </span>
                  <p className="text-sm font-bold text-[#EC4899]">
                    {confirmedPass.event.title}
                  </p>
                  <p className="text-[#C8BFD4] text-[11px]">
                    Category: {confirmedPass.event.category} · {confirmedPass.event.day}
                  </p>
                </div>

                {confirmedPass.registrationData.participationType === 'Team' && (
                  <div>
                    <span className="text-[#A89CB5] block uppercase tracking-wider text-[10px]">
                      Team Details
                    </span>
                    <p className="font-semibold text-white">
                      {confirmedPass.registrationData.teamName} ({confirmedPass.registrationData.teamSize} Contingent Members)
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[#A89CB5] block uppercase tracking-wider text-[10px]">
                    Venue & Scheduled Slot
                  </span>
                  <p className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>{confirmedPass.event.venue}</span>
                  </p>
                  <p className="text-[#C8BFD4] font-mono mt-0.5">
                    Slot: {confirmedPass.event.time}
                  </p>
                </div>

                {/* Demo Payment Status Display */}
                <div className="pt-2 border-t border-[#2A1C38]">
                  <span className="text-[#A89CB5] block uppercase tracking-wider text-[10px]">
                    Fee & Reference Status
                  </span>
                  {confirmedPass.isPaidEvent ? (
                    <div className="space-y-0.5 mt-0.5">
                      <p className="font-semibold text-[#84CC16]">
                        Demo reference accepted — payment not verified.
                      </p>
                      <p className="font-mono text-[#FAF7F5] text-[11px]">
                        Ref: {confirmedPass.demoPaymentReference}
                      </p>
                      <p className="text-[11px] text-[#A89CB5]">
                        Sample Fee: ₹{confirmedPass.feeAmount} (Fictional Simulation)
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold text-[#84CC16] mt-0.5">
                      Free demo registration.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Disclaimer Footer Box */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#120A1A] border border-[#2D1F3D] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-full h-full text-[#09080D]" aria-hidden="true" />
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-white">Assessment Verification Note</p>
                  <p className="text-[11px] text-[#A89CB5]">
                    This pass is an in-memory prototype artifact. It does not grant festival admission.
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-[#8A7B9B] font-mono shrink-0">
                Created at {confirmedPass.timestamp}
              </div>
            </div>

            {/* Pass Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleRegisterAnother}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-[#3C2754] text-xs font-semibold text-[#FAF7F5] hover:bg-[#251833] transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Register Another Delegate</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white text-xs font-bold hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save Pass (Demo)</span>
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="bg-[#17101E] border border-[#2D1F3D] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
          >
            {/* Overall form error banner */}
            {Object.keys(errors).length > 0 && Object.values(errors).some(Boolean) && (
              <div
                role="alert"
                className="p-4 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#FCA5A5] text-xs space-y-1"
              >
                <div className="flex items-center gap-2 font-bold text-white">
                  <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0" aria-hidden="true" />
                  <span>Please review the highlighted fields before submitting:</span>
                </div>
                <ul className="list-disc pl-6 space-y-0.5">
                  {Object.entries(errors).map(([key, msg]) =>
                    msg ? <li key={key}>{msg}</li> : null
                  )}
                </ul>
              </div>
            )}

            {/* Field Set 1: Personal Credentials */}
            <fieldset className="space-y-4" disabled={isSubmitting}>
              <legend className="text-xs font-bold uppercase tracking-wider text-[#FAF7F5] border-b border-[#2A1C38] pb-2 w-full">
                1. Participant Information
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label
                    htmlFor="reg-fullName"
                    className="block text-xs font-semibold text-[#FAF7F5]"
                  >
                    Full Name <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    id="reg-fullName"
                    name="fullName"
                    type="text"
                    required
                    maxLength={70}
                    disabled={isSubmitting}
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Priyadarshini Iyer"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#120A1A] border ${
                      errors.fullName
                        ? 'border-[#F43F5E] focus:ring-[#F43F5E]'
                        : 'border-[#3C2754] focus:border-[#A855F7]'
                    } text-[#FAF7F5] focus:outline-none focus:ring-1 min-h-[44px]`}
                  />
                  {errors.fullName && (
                    <p id="fullName-error" role="alert" className="text-[11px] text-[#FCA5A5] font-medium">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* College Roll No / Reg ID */}
                <div className="space-y-1">
                  <label
                    htmlFor="reg-registrationNumber"
                    className="block text-xs font-semibold text-[#FAF7F5]"
                  >
                    College Roll No / Reg ID <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    id="reg-registrationNumber"
                    name="registrationNumber"
                    type="text"
                    required
                    maxLength={30}
                    disabled={isSubmitting}
                    value={formData.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    onBlur={() => handleBlur('registrationNumber')}
                    placeholder="e.g. RA2311003010482"
                    aria-invalid={!!errors.registrationNumber}
                    aria-describedby={errors.registrationNumber ? 'regNum-error' : undefined}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#120A1A] border ${
                      errors.registrationNumber
                        ? 'border-[#F43F5E] focus:ring-[#F43F5E]'
                        : 'border-[#3C2754] focus:border-[#A855F7]'
                    } text-[#FAF7F5] focus:outline-none focus:ring-1 min-h-[44px]`}
                  />
                  {errors.registrationNumber && (
                    <p id="regNum-error" role="alert" className="text-[11px] text-[#FCA5A5] font-medium">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>

                {/* Institutional Email */}
                <div className="space-y-1">
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-semibold text-[#FAF7F5]"
                  >
                    Institutional Email Address <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    required
                    maxLength={80}
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="student@srmist.edu.in"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#120A1A] border ${
                      errors.email
                        ? 'border-[#F43F5E] focus:ring-[#F43F5E]'
                        : 'border-[#3C2754] focus:border-[#A855F7]'
                    } text-[#FAF7F5] focus:outline-none focus:ring-1 min-h-[44px]`}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="text-[11px] text-[#FCA5A5] font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label
                    htmlFor="reg-phone"
                    className="block text-xs font-semibold text-[#FAF7F5]"
                  >
                    10-Digit Mobile Number <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    name="phone"
                    type="tel"
                    required
                    maxLength={15}
                    disabled={isSubmitting}
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    placeholder="9876543210"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#120A1A] border ${
                      errors.phone
                        ? 'border-[#F43F5E] focus:ring-[#F43F5E]'
                        : 'border-[#3C2754] focus:border-[#A855F7]'
                    } text-[#FAF7F5] focus:outline-none focus:ring-1 min-h-[44px]`}
                  />
                  {errors.phone && (
                    <p id="phone-error" role="alert" className="text-[11px] text-[#FCA5A5] font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* College / Institution */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-college"
                  className="block text-xs font-semibold text-[#FAF7F5]"
                >
                  Institution / University / Campus <span className="text-[#F43F5E]">*</span>
                </label>
                <input
                  id="reg-college"
                  name="college"
                  type="text"
                  required
                  maxLength={100}
                  disabled={isSubmitting}
                  value={formData.college}
                  onChange={(e) => handleChange('college', e.target.value)}
                  onBlur={() => handleBlur('college')}
                  placeholder="e.g. SRM Institute of Science and Technology, Kattankulathur"
                  aria-invalid={!!errors.college}
                  aria-describedby={errors.college ? 'college-error' : undefined}
                  className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#120A1A] border ${
                    errors.college
                      ? 'border-[#F43F5E] focus:ring-[#F43F5E]'
                      : 'border-[#3C2754] focus:border-[#A855F7]'
                  } text-[#FAF7F5] focus:outline-none focus:ring-1 min-h-[44px]`}
                />
                {errors.college && (
                  <p id="college-error" role="alert" className="text-[11px] text-[#FCA5A5] font-medium">
                    {errors.college}
                  </p>
                )}
              </div>
            </fieldset>

            {/* Field Set 2: Event Choice & Team Setup */}
            <fieldset className="space-y-4 pt-2" disabled={isSubmitting}>
              <legend className="text-xs font-bold uppercase tracking-wider text-[#FAF7F5] border-b border-[#2A1C38] pb-2 w-full">
                2. Competition Selection
              </legend>

              {/* Event Select Dropdown */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-eventId"
                  className="block text-xs font-semibold text-[#FAF7F5]"
                >
                  Select Competition <span className="text-[#F43F5E]">*</span>
                </label>
                <select
                  id="reg-eventId"
                  name="eventId"
                  disabled={isSubmitting}
                  value={formData.eventId}
                  onChange={(e) => handleChange('eventId', e.target.value)}
                  onBlur={() => handleBlur('eventId')}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#120A1A] border border-[#3C2754] text-[#FAF7F5] focus:border-[#A855F7] focus:outline-none focus:ring-1 focus:ring-[#A855F7] min-h-[44px]"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id} className="bg-[#17101E] text-white">
                      {ev.title} ({ev.category} · {ev.registrationFee})
                    </option>
                  ))}
                </select>

                {currentEvent && (
                  <div className="mt-2 p-3 rounded-lg bg-[#120A1A] border border-[#2D1F3D] text-xs text-[#A89CB5] space-y-1">
                    <p className="font-semibold text-white">
                      {currentEvent.title} — {currentEvent.participationType} Event
                    </p>
                    <p className="text-[11px] text-[#C8BFD4]">
                      Venue: {currentEvent.venue} · Time: {currentEvent.time}
                    </p>
                    <p className="text-[11px] font-semibold text-[#EC4899]">
                      Fee: {currentEvent.registrationFee}
                      {currentEvent.feeAmount > 0 && ' (Requires demo payment reference)'}
                    </p>
                  </div>
                )}
              </div>

              {/* Participation Mode */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-[#FAF7F5]">
                  Participation Mode
                </span>
                <div className="flex items-center gap-6 text-xs font-medium text-[#C8BFD4]">
                  <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="radio"
                      name="participationType"
                      value="Solo"
                      checked={formData.participationType === 'Solo'}
                      disabled={isSubmitting || currentEvent?.participationType === 'Team'}
                      onChange={() => handleChange('participationType', 'Solo')}
                      className="text-[#EC4899] focus:ring-[#A855F7] w-4 h-4"
                    />
                    <span>Solo Participant</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                    <input
                      type="radio"
                      name="participationType"
                      value="Team"
                      checked={formData.participationType === 'Team'}
                      disabled={isSubmitting || currentEvent?.participationType === 'Solo'}
                      onChange={() => handleChange('participationType', 'Team')}
                      className="text-[#EC4899] focus:ring-[#A855F7] w-4 h-4"
                    />
                    <span>Team / Crew</span>
                  </label>
                </div>
              </div>

              {/* Conditional Team Details */}
              {formData.participationType === 'Team' && (
                <div className="p-4 rounded-xl bg-[#120A1A] border border-[#2D1F3D] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label
                        htmlFor="reg-teamName"
                        className="block text-xs font-semibold text-[#FAF7F5]"
                      >
                        Team / Society / Crew Name <span className="text-[#F43F5E]">*</span>
                      </label>
                      <input
                        id="reg-teamName"
                        name="teamName"
                        type="text"
                        maxLength={80}
                        disabled={isSubmitting}
                        value={formData.teamName}
                        onChange={(e) => handleChange('teamName', e.target.value)}
                        onBlur={() => handleBlur('teamName')}
                        placeholder="e.g. Groove Society Crew"
                        aria-invalid={!!errors.teamName}
                        aria-describedby={errors.teamName ? 'teamName-error' : undefined}
                        className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#17101E] border ${
                          errors.teamName ? 'border-[#F43F5E]' : 'border-[#3C2754]'
                        } text-[#FAF7F5] min-h-[44px]`}
                      />
                      {errors.teamName && (
                        <p id="teamName-error" role="alert" className="text-[11px] text-[#FCA5A5]">
                          {errors.teamName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="reg-teamSize"
                        className="block text-xs font-semibold text-[#FAF7F5]"
                      >
                        Team Size ({currentEvent?.minTeamSize ?? 2}–{currentEvent?.maxTeamSize ?? 20} members) <span className="text-[#F43F5E]">*</span>
                      </label>
                      <input
                        id="reg-teamSize"
                        name="teamSize"
                        type="number"
                        min={currentEvent?.minTeamSize ?? 2}
                        max={currentEvent?.maxTeamSize ?? 25}
                        step="1"
                        disabled={isSubmitting}
                        value={formData.teamSize === '' ? '' : formData.teamSize}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            handleChange('teamSize', '');
                          } else {
                            handleChange('teamSize', Number(val));
                          }
                        }}
                        onBlur={() => handleBlur('teamSize')}
                        aria-invalid={!!errors.teamSize}
                        aria-describedby={errors.teamSize ? 'teamSize-error' : undefined}
                        className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#17101E] border ${
                          errors.teamSize ? 'border-[#F43F5E]' : 'border-[#3C2754]'
                        } text-[#FAF7F5] font-mono min-h-[44px]`}
                      />
                      {errors.teamSize && (
                        <p id="teamSize-error" role="alert" className="text-[11px] text-[#FCA5A5]">
                          {errors.teamSize}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Special Requirements (Optional) */}
              <div className="space-y-1">
                <label
                  htmlFor="reg-specialRequirements"
                  className="block text-xs font-semibold text-[#FAF7F5]"
                >
                  Technical / Audio / Prop Notes (Optional)
                </label>
                <textarea
                  id="reg-specialRequirements"
                  name="specialRequirements"
                  rows={2}
                  maxLength={250}
                  disabled={isSubmitting}
                  value={formData.specialRequirements}
                  onChange={(e) => handleChange('specialRequirements', e.target.value)}
                  placeholder="e.g. 2 DI boxes for acoustic guitar, wireless vocal mic..."
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-[#120A1A] border border-[#3C2754] text-[#FAF7F5] focus:border-[#A855F7] focus:outline-none focus:ring-1 focus:ring-[#A855F7]"
                />
              </div>
            </fieldset>

            {/* Field Set 3: Demo Payment Reference */}
            <fieldset className="space-y-3 pt-2" disabled={isSubmitting}>
              <legend className="text-xs font-bold uppercase tracking-wider text-[#FAF7F5] border-b border-[#2A1C38] pb-2 w-full">
                3. Payment Reference (Simulation)
              </legend>

              {currentEvent && currentEvent.feeAmount > 0 ? (
                <div className="p-4 rounded-xl bg-[#1A1124] border border-[#8B5CF6]/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label
                        htmlFor="reg-demoPaymentReference"
                        className="block text-xs font-bold text-[#D4B8ED]"
                      >
                        Demo payment reference <span className="text-[#F43F5E]">*</span>
                      </label>
                      <p className="text-[11px] text-[#A89CB5] mt-0.5">
                        Use a fictional reference. No payment is collected or verified.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleFillSampleReference}
                      className="self-start sm:self-center px-3 py-1.5 rounded-md bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 text-[#D4B8ED] hover:bg-[#8B5CF6]/30 transition-colors text-xs font-bold cursor-pointer whitespace-nowrap min-h-[36px]"
                    >
                      Use sample reference
                    </button>
                  </div>

                  <div>
                    <input
                      id="reg-demoPaymentReference"
                      name="demoPaymentReference"
                      type="text"
                      maxLength={30}
                      disabled={isSubmitting}
                      value={formData.demoPaymentReference}
                      onChange={(e) => handleChange('demoPaymentReference', e.target.value.toUpperCase())}
                      onBlur={() => handleBlur('demoPaymentReference')}
                      placeholder="DEMO-MILAN-XXXXXXXX"
                      aria-invalid={!!errors.demoPaymentReference}
                      aria-describedby={errors.demoPaymentReference ? 'payRef-error' : undefined}
                      className={`w-full px-3.5 py-2.5 rounded-lg text-sm bg-[#120A1A] font-mono uppercase tracking-wider border ${
                        errors.demoPaymentReference ? 'border-[#F43F5E]' : 'border-[#3C2754]'
                      } text-[#FAF7F5] min-h-[44px]`}
                    />
                    {errors.demoPaymentReference && (
                      <p id="payRef-error" role="alert" className="text-[11px] text-[#FCA5A5] font-medium mt-1">
                        {errors.demoPaymentReference}
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-[#8A7B9B]">
                    Fictional format required: <code className="font-mono text-[#D4B8ED]">DEMO-MILAN-XXXXXXXX</code> (8 uppercase letters or digits).
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#064E3B]/20 border border-[#059669]/40 text-xs text-[#A7F3D0]">
                  <p className="font-semibold text-white">Free demo registration.</p>
                  <p className="text-[11px] text-[#6EE7B7] mt-0.5">
                    This competition has no registration fee. No payment reference is needed.
                  </p>
                </div>
              )}
            </fieldset>

            {/* Field Set 4: Demo Acknowledgment */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
                <input
                  id="reg-agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  disabled={isSubmitting}
                  checked={formData.agreeTerms}
                  onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                  onBlur={() => handleBlur('agreeTerms')}
                  className="mt-1 text-[#EC4899] focus:ring-[#A855F7] rounded border-[#3C2754] w-4 h-4 shrink-0 bg-[#120A1A]"
                />
                <span className="text-xs text-[#C8BFD4] leading-relaxed">
                  I understand this is a <strong className="text-white">demonstration prototype</strong> for the SRMIST DSA selection task. No actual payment is taken, no personal data is stored, and the generated pass is not valid for campus admission.
                </span>
              </label>
              {errors.agreeTerms && (
                <p role="alert" className="text-[11px] text-[#FCA5A5] font-medium mt-1 pl-7">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-[#2A1C38] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-[#8A7B9B]">
                * Required fields for assessment validation
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold tracking-wider uppercase rounded-lg bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-wait transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EC4899]/20 cursor-pointer min-h-[44px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Demo Pass...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Generate Demo Pass</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
