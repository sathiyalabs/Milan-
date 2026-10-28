import React from 'react';
import { Calendar, MapPin, ChevronRight, BookOpen, Sparkles, Image as ImageIcon, Flame, Radio } from 'lucide-react';
import { SAMPLE_NOTICE } from '../data/events';

interface HeroProps {
  onExploreEvents: () => void;
  onRegisterClick: () => void;
  onViewSchedule: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreEvents,
  onRegisterClick,
  onViewSchedule,
}) => {
  return (
    <section
      id="home"
      className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#241733] bg-[#09080D]"
    >
      {/* Dark Stage Atmospheric Glows and Jali Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 jali-pattern-dark" aria-hidden="true" />

      {/* Floating Ambient Aurora Spheres */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[420px] bg-gradient-to-tr from-[#EC4899]/25 via-[#8B5CF6]/20 to-[#06B6D4]/20 rounded-full blur-[110px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -top-20 -left-20 w-80 h-80 bg-[#EC4899]/15 rounded-full blur-[90px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-20 w-96 h-96 bg-[#06B6D4]/15 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Dynamic Continuous Stage Spotlight Beams (No pause button, vibrant concert motion) */}
      <div className="absolute inset-x-0 top-0 h-80 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <svg
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          className="w-full h-full opacity-60"
        >
          <defs>
            <linearGradient id="spotlightLeft" x1="0%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="spotlightRight" x1="100%" y1="0%" x2="40%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#A855F7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sweeping Left Beam */}
          <polygon
            points="120,0 680,360 420,0"
            fill="url(#spotlightLeft)"
            className="animate-spotlight-left"
          />

          {/* Sweeping Right Beam */}
          <polygon
            points="1080,0 520,360 780,0"
            fill="url(#spotlightRight)"
            className="animate-spotlight-right"
          />

          {/* Center Stage Focus Node */}
          <circle cx="600" cy="340" r="120" fill="url(#centerGlow)" className="animate-pulse" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header Badge with Live Rhythm Equalizer */}
        <div className="flex flex-col items-center justify-center text-center mb-6 animate-hero-1">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1A1124]/90 border border-[#4A2D69] text-xs font-semibold text-[#E9D5FF] tracking-wide mb-3 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            {/* Live soundwave equalizer bars */}
            <div className="flex items-end gap-1 h-4 w-5 px-0.5" aria-hidden="true">
              <span className="w-1 bg-[#EC4899] rounded-full eq-bar-1" />
              <span className="w-1 bg-[#A855F7] rounded-full eq-bar-2" />
              <span className="w-1 bg-[#06B6D4] rounded-full eq-bar-3" />
              <span className="w-1 bg-[#84CC16] rounded-full eq-bar-4" />
            </div>
            <span className="tracking-wider uppercase text-[11px] font-bold text-white">Live The Change · Cultural Fest After Dark</span>
          </div>

          <p className="text-xs uppercase tracking-[0.28em] font-bold text-[#A89CB5] flex items-center gap-2">
            <span>Music</span>
            <span className="text-[#EC4899]" aria-hidden="true">•</span>
            <span>Movement</span>
            <span className="text-[#06B6D4]" aria-hidden="true">•</span>
            <span>Drama</span>
            <span className="text-[#A855F7]" aria-hidden="true">•</span>
            <span>Runway</span>
          </p>
        </div>

        {/* Central Typographic Composition */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          {/* Transparent Logo Emblem with separate MILAN wordmark and glowing backdrop */}
          <div className="flex items-center justify-center gap-3.5 mb-3 animate-hero-2">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#06B6D4] rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity" />
              <img
                src="/assets/milan-emblem.png"
                alt="Milan Festival Emblem"
                className="relative w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-transform duration-300 group-hover:scale-110"
                width={64}
                height={64}
              />
            </div>
            <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-widest text-[#FAF7F5]">
              MILAN <span className="text-[#EC4899] drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]">’26</span>
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#FAF7F5] leading-[0.9] font-display uppercase animate-hero-2">
            FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] via-[#C084FC] to-[#06B6D4] drop-shadow-[0_0_30px_rgba(192,132,252,0.3)]">STAGE.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#D8CFE5] font-normal leading-relaxed max-w-2xl mx-auto text-balance animate-hero-3">
            Music. Movement. Drama. Explore 8 curated competitions across SRMIST Kattankulathur’s premier auditoriums and open-air arenas.
          </p>

          {/* Curatorial Sample Dates & Venue Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs sm:text-sm text-[#A89CB5] animate-hero-3">
            <div className="flex items-center gap-2 font-medium bg-[#140D1C] px-3.5 py-1.5 rounded-full border border-[#2D1F3D]">
              <Calendar className="w-4 h-4 text-[#EC4899]" aria-hidden="true" />
              <span className="text-white font-semibold">{SAMPLE_NOTICE.datesNotice}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#140D1C] px-3.5 py-1.5 rounded-full border border-[#2D1F3D]">
              <MapPin className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
              <span>Main Campus, Kattankulathur, Chennai</span>
            </div>
          </div>

          {/* High-Impact Action CTAs with glowing motion */}
          <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-center gap-4 animate-hero-4">
            <button
              onClick={onExploreEvents}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#EC4899] via-[#A855F7] to-[#06B6D4] text-white font-bold text-xs tracking-wider uppercase btn-motion flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(236,72,153,0.35)] min-h-[48px]"
            >
              <span>Explore Events</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#17101E] text-[#FAF7F5] font-bold text-xs tracking-wider uppercase hover:bg-[#251833] btn-motion border border-[#432A5F] flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[48px] hover:border-[#EC4899]"
            >
              <Flame className="w-4 h-4 text-[#EC4899]" />
              <span>Take the Spotlight</span>
            </button>

            <button
              onClick={onViewSchedule}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-[#C8BFD4] font-semibold text-xs tracking-wider uppercase hover:text-white hover:bg-[#1E132B] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px] border border-transparent hover:border-[#2D1F3D]"
            >
              <BookOpen className="w-4 h-4 text-[#06B6D4]" />
              <span>3-Day Schedule</span>
            </button>
          </div>
        </div>

        {/* Historical Archive Poster Highlight Strip */}
        <div className="mt-14 pt-8 border-t border-[#241733]/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EC4899]">
              <ImageIcon className="w-4 h-4 text-[#EC4899]" />
              <span>Festival Archive Highlights</span>
            </div>
            <p className="text-[11px] text-[#8A7B9B]">
              Historical Reference Posters from Previous Editions (Archive Reference)
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[#2D1F3D] bg-[#140D1C] p-2.5 sm:p-3.5 shadow-2xl hover:border-[#8B5CF6]/50 transition-all duration-300 group">
            <img
              src="/assets/aistudio/image_e1297c07.png"
              alt="Historical reference posters from previous editions of Milan at SRMIST"
              className="w-full h-auto object-cover rounded-xl opacity-90 group-hover:opacity-100 group-hover:scale-[1.008] transition-all duration-500"
              loading="lazy"
              width={1200}
              height={400}
            />
          </div>
        </div>

        {/* Grounded festival overview indicators with hover glow */}
        <div className="mt-10 pt-6 border-t border-[#241733]/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-xl bg-[#140D1C] border border-[#2C1D3E] card-motion group hover:border-[#EC4899]/60">
              <p className="text-2xl sm:text-3xl font-black text-white font-display group-hover:text-[#EC4899] transition-colors">6</p>
              <p className="text-xs uppercase tracking-wider text-[#A89CB5] font-semibold mt-1">Artistic Domains</p>
            </div>

            <div className="p-4 rounded-xl bg-[#140D1C] border border-[#2C1D3E] card-motion group hover:border-[#A855F7]/60">
              <p className="text-2xl sm:text-3xl font-black text-white font-display group-hover:text-[#A855F7] transition-colors">8</p>
              <p className="text-xs uppercase tracking-wider text-[#A89CB5] font-semibold mt-1">Curated Contests</p>
            </div>

            <div className="p-4 rounded-xl bg-[#140D1C] border border-[#2C1D3E] card-motion group hover:border-[#06B6D4]/60">
              <p className="text-2xl sm:text-3xl font-black text-white font-display group-hover:text-[#06B6D4] transition-colors">3 Days</p>
              <p className="text-xs uppercase tracking-wider text-[#A89CB5] font-semibold mt-1">Sample Itinerary</p>
            </div>

            <div className="p-4 rounded-xl bg-[#140D1C] border border-[#2C1D3E] card-motion group hover:border-[#84CC16]/60">
              <p className="text-2xl sm:text-3xl font-black text-[#06B6D4] font-display group-hover:text-[#84CC16] transition-colors">Interactive</p>
              <p className="text-xs uppercase tracking-wider text-[#A89CB5] font-semibold mt-1">Demo Pass Flow</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
