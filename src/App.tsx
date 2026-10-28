/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SAMPLE_EVENTS } from './data/events';
import { FestivalEvent } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FestivalIntro } from './components/FestivalIntro';
import { FeaturedEvents } from './components/FeaturedEvents';
import { EventsListing } from './components/EventsListing';
import { EventDetailsModal } from './components/EventDetailsModal';
import { RegistrationForm } from './components/RegistrationForm';
import { FestivalSchedule } from './components/FestivalSchedule';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export default function App() {
  const [selectedEventForModal, setSelectedEventForModal] = useState<FestivalEvent | null>(null);
  const [selectedEventIdForReg, setSelectedEventIdForReg] = useState<string>(SAMPLE_EVENTS[0]?.id || '');
  const [activeSection, setActiveSection] = useState('home');

  // Programmatic scroll respecting prefers-reduced-motion
  const scrollToSection = (sectionId: string, focusInput = false) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const prefersReduced = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      element.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'start',
      });

      if (focusInput) {
        setTimeout(() => {
          const firstInput = document.getElementById('reg-fullName');
          firstInput?.focus();
        }, prefersReduced ? 50 : 400);
      }
    }
  };

  const handleQuickRegister = (event: FestivalEvent) => {
    setSelectedEventIdForReg(event.id);
    scrollToSection('registration', true);
  };

  const handleRegisterFromModal = (event: FestivalEvent) => {
    setSelectedEventForModal(null);
    setSelectedEventIdForReg(event.id);
    scrollToSection('registration', true);
  };

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ['home', 'about', 'events', 'schedule', 'registration', 'faq'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.25 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#09080D] text-[#FAF7F5] selection:bg-[#EC4899] selection:text-white">
      {/* Top Navigation Bar with unobtrusive demo notice */}
      <Navbar
        onNavigate={(id) => scrollToSection(id, false)}
        onOpenRegister={() => scrollToSection('registration', true)}
        activeSection={activeSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Editorial Hero */}
        <Hero
          onExploreEvents={() => scrollToSection('events', false)}
          onRegisterClick={() => scrollToSection('registration', true)}
          onViewSchedule={() => scrollToSection('schedule', false)}
        />

        {/* Artistic Pillars */}
        <FestivalIntro />

        {/* Flagship Curated Contests */}
        <FeaturedEvents
          events={SAMPLE_EVENTS}
          onSelectEvent={(event) => setSelectedEventForModal(event)}
          onQuickRegister={handleQuickRegister}
        />

        {/* Searchable & Filterable Events Directory */}
        <EventsListing
          events={SAMPLE_EVENTS}
          onSelectEvent={(event) => setSelectedEventForModal(event)}
          onRegisterEvent={handleQuickRegister}
        />

        {/* Chronological Schedule */}
        <FestivalSchedule />

        {/* Validated Demo Registration & Pass Generation */}
        <RegistrationForm
          events={SAMPLE_EVENTS}
          selectedEventId={selectedEventIdForReg}
          onEventChange={(id) => setSelectedEventIdForReg(id)}
        />

        {/* Guidelines & FAQ */}
        <FAQ />
      </main>

      {/* Editorial Footer */}
      <Footer onNavigate={(id) => scrollToSection(id, false)} />

      {/* Accessible Event Details Modal */}
      <EventDetailsModal
        event={selectedEventForModal}
        onClose={() => setSelectedEventForModal(null)}
        onRegisterFromModal={handleRegisterFromModal}
      />
    </div>
  );
}
