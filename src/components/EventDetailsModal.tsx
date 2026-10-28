import React, { useEffect, useRef } from 'react';
import { FestivalEvent } from '../types';
import { X, Calendar, MapPin, Users, ShieldAlert, Award, Mail, ArrowRight, Tag } from 'lucide-react';

interface EventDetailsModalProps {
  event: FestivalEvent | null;
  onClose: () => void;
  onRegisterFromModal: (event: FestivalEvent) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onRegisterFromModal,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  // Track the trigger element when the modal opens and manage focus
  useEffect(() => {
    if (event) {
      previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Focus first focusable item inside dialog
      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === 'Tab') {
          if (!modalRef.current) return;
          const focusables = Array.from(
            modalRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

          if (focusables.length === 0) return;

          const firstElement = focusables[0];
          const lastElement = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
        previouslyFocusedElementRef.current?.focus();
      };
    }
  }, [event ? event.id : null]); // Only re-run when event ID changes, not on parent re-renders!

  if (!event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-[#09080D]/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-event-title"
        aria-describedby="modal-event-description"
        className="relative w-full max-w-2xl bg-[#17101E] border border-[#3C2754] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#2A1C38] bg-[#120A1A] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#A89CB5]">
              <span className="text-[#EC4899]">{event.category}</span>
              <span aria-hidden="true" className="text-[#3C2754]">·</span>
              <span>{event.day}</span>
              <span aria-hidden="true" className="text-[#3C2754]">·</span>
              <span>{event.participationType}</span>
            </div>
            <h2
              id="modal-event-title"
              className="text-2xl sm:text-3xl font-bold text-[#FAF7F5] tracking-tight font-display"
            >
              {event.title}
            </h2>
            <p className="text-xs text-[#C8BFD4] italic">
              "{event.tagline}"
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close event details modal"
            className="p-2 rounded-lg text-[#A89CB5] hover:text-white hover:bg-[#251833] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-[#FAF7F5] divide-y divide-[#241733]">
          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#140D1C] border border-[#2D1F3D]">
              <span className="text-[#8A7B9B] block text-[11px] font-medium">Date & Time</span>
              <span className="font-semibold text-white font-mono tabular-nums block mt-1">
                {event.date.split('(')[0].trim()}
              </span>
              <span className="text-[#A89CB5] text-[11px] font-mono">{event.time}</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140D1C] border border-[#2D1F3D]">
              <span className="text-[#8A7B9B] block text-[11px] font-medium">Campus Stage</span>
              <span className="font-semibold text-white block mt-1 truncate" title={event.venue}>
                {event.venue}
              </span>
              <span className="text-[#A89CB5] text-[11px]">Kattankulathur</span>
            </div>

            <div className="p-3 rounded-lg bg-[#140D1C] border border-[#2D1F3D]">
              <span className="text-[#8A7B9B] block text-[11px] font-medium">Slot Capacity</span>
              <span className="font-semibold text-white font-mono tabular-nums block mt-1">
                {event.registeredCount}/{event.capacity} Slots
              </span>
              <span className="text-[#EC4899] text-[11px] font-medium">
                {event.capacity - event.registeredCount} spots open
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#140D1C] border border-[#2D1F3D]">
              <span className="text-[#8A7B9B] block text-[11px] font-medium">Registration Fee</span>
              <span className="font-semibold text-white block mt-1 font-mono">
                {event.registrationFee}
              </span>
              <span className="text-[#A89CB5] text-[11px]">{event.prizePool}</span>
            </div>
          </div>

          {/* Detailed Narrative */}
          <div className="pt-6 space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAF7F5]">
              Competition Overview
            </h3>
            <p
              id="modal-event-description"
              className="text-xs sm:text-sm text-[#C8BFD4] leading-relaxed"
            >
              {event.fullDescription}
            </p>
          </div>

          {/* Rules & Guidelines */}
          <div className="pt-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAF7F5] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#F43F5E]" aria-hidden="true" />
              <span>Rules & Guidelines</span>
            </h3>
            <ul className="space-y-2 text-xs text-[#A89CB5] list-disc pl-5">
              {event.rules.map((rule, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Evaluation Criteria */}
          <div className="pt-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAF7F5] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
              <span>Evaluation Rubric</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {event.judgingCriteria.map((criterion, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#140D1C] border border-[#2C1D3E] text-[#C8BFD4] flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] shrink-0" aria-hidden="true" />
                  <span>{criterion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fictional Student Coordinators */}
          <div className="pt-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAF7F5]">
              Student Event Coordinators (Sample Desk)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {event.coordinators.map((coord, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#120A1A] border border-[#2D1F3D] space-y-1"
                >
                  <p className="font-bold text-white">{coord.name}</p>
                  <p className="text-[#A89CB5] text-[11px]">{coord.role}</p>
                  <div className="flex items-center gap-1 text-[#8A7B9B] text-[11px] pt-0.5">
                    <Mail className="w-3 h-3 text-[#EC4899]" aria-hidden="true" />
                    <span>{coord.contact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-[#2A1C38] bg-[#120A1A] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-[#8A7B9B] text-center sm:text-left">
            Fictional student demonstration · Data processed locally in memory
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold rounded-lg border border-[#3C2754] text-[#FAF7F5] hover:bg-[#251833] transition-colors cursor-pointer min-h-[44px]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onRegisterFromModal(event);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-bold rounded-lg bg-[#EC4899] text-white hover:bg-[#DB2777] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
            >
              <span>Register for this Event</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
