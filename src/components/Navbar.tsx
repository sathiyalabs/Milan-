import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenRegister: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenRegister, activeSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle mobile menu keyboard controls (Escape, Tab trap, focus restore)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsMobileMenuOpen(false);
          menuButtonRef.current?.focus();
          return;
        }

        if (e.key === 'Tab') {
          if (!mobileNavRef.current) return;
          const focusables = Array.from(
            mobileNavRef.current.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
          ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Focus first item in mobile menu
      setTimeout(() => {
        const firstBtn = mobileNavRef.current?.querySelector<HTMLElement>('button, a');
        firstBtn?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  const handleLinkClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(sectionId);
    menuButtonRef.current?.focus();
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-[#09080D]/95 backdrop-blur-md border-b border-[#2C1C3D] shadow-md shadow-black/40'
          : 'bg-[#09080D] border-b border-[#1A1224]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        {/* Zone 1: Transparent Milan Emblem with separate MILAN text title */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('home');
          }}
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-[#EC4899] rounded-sm py-1"
          aria-label="Milan 2026 Home"
        >
          <img
            src="/assets/milan-emblem.png"
            alt="Milan Cultural Festival Emblem"
            className="w-9 h-9 object-contain shrink-0 group-hover:scale-105 transition-transform"
            width={36}
            height={36}
            loading="eager"
          />
          <div className="flex flex-col">
            <span className="font-display tracking-tight text-xl sm:text-2xl font-black text-[#FAF7F5] leading-none">
              MILAN <span className="text-[#EC4899]">’26</span>
            </span>
            <span className="text-[10px] text-[#A89CB5] tracking-wider uppercase font-semibold">
              SRMIST Cultural Fest
            </span>
          </div>
        </a>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#C8BFD4]"
        >
          <button
            onClick={() => handleLinkClick('home')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              activeSection === 'home' ? 'text-white border-b-2 border-[#EC4899]' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleLinkClick('about')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              activeSection === 'about' ? 'text-white border-b-2 border-[#EC4899]' : ''
            }`}
          >
            Pillars
          </button>
          <button
            onClick={() => handleLinkClick('events')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              activeSection === 'events' ? 'text-white border-b-2 border-[#EC4899]' : ''
            }`}
          >
            Events
          </button>
          <button
            onClick={() => handleLinkClick('schedule')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              activeSection === 'schedule' ? 'text-white border-b-2 border-[#EC4899]' : ''
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => handleLinkClick('faq')}
            className={`whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer py-1 ${
              activeSection === 'faq' ? 'text-white border-b-2 border-[#EC4899]' : ''
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenRegister}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold tracking-wider uppercase bg-[#EC4899] text-white rounded-lg hover:bg-[#DB2777] btn-motion cursor-pointer shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#EC4899]"
          >
            Register (Demo)
          </button>

          {/* Mobile menu toggle */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="md:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-[#FAF7F5] hover:bg-[#1E132B] transition-colors flex items-center justify-center cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-18 z-50 bg-[#09080D]/85 backdrop-blur-md md:hidden animate-modal-backdrop"
          onClick={() => {
            setIsMobileMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
        >
          <div
            ref={mobileNavRef}
            className="bg-[#17101E] border-b border-[#36254A] px-6 py-6 space-y-4 shadow-2xl animate-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col space-y-1">
              <button
                onClick={() => handleLinkClick('home')}
                className="text-left py-3 text-base font-semibold text-[#FAF7F5] border-b border-[#2C1D3E] min-h-[44px] flex items-center hover:text-[#EC4899]"
              >
                Overview
              </button>
              <button
                onClick={() => handleLinkClick('about')}
                className="text-left py-3 text-base font-semibold text-[#FAF7F5] border-b border-[#2C1D3E] min-h-[44px] flex items-center hover:text-[#EC4899]"
              >
                Artistic Pillars
              </button>
              <button
                onClick={() => handleLinkClick('events')}
                className="text-left py-3 text-base font-semibold text-[#FAF7F5] border-b border-[#2C1D3E] min-h-[44px] flex items-center hover:text-[#EC4899]"
              >
                Competitions
              </button>
              <button
                onClick={() => handleLinkClick('schedule')}
                className="text-left py-3 text-base font-semibold text-[#FAF7F5] border-b border-[#2C1D3E] min-h-[44px] flex items-center hover:text-[#EC4899]"
              >
                Timeline & Venues
              </button>
              <button
                onClick={() => handleLinkClick('faq')}
                className="text-left py-3 text-base font-semibold text-[#FAF7F5] border-b border-[#2C1D3E] min-h-[44px] flex items-center hover:text-[#EC4899]"
              >
                Guidelines & FAQ
              </button>
            </nav>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-3.5 text-center text-xs font-bold tracking-wider uppercase bg-[#EC4899] text-white rounded-lg hover:bg-[#DB2777] btn-motion min-h-[44px]"
              >
                Register for Events (Demo)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
