import React, { useState } from 'react';
import { Calendar, MapPin, ChevronRight, BookOpen, Pause, Play, Sparkles, Image as ImageIcon } from 'lucide-react';
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
  const [isMotionPaused, setIsMotionPaused] = useState(false);

  return (
    <section
      id="home"
      className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#241733] bg-[#09080D]"
    >
      {/* Dark Stage Atmospheric Glows and Jali Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 jali-pattern-dark" aria-hidden="true" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-[#EC4899]/20 via-[#8B5CF6]/15 to-[#06B6D4]/15 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Dynamic Animated Stage Light Beams (SVG) with user pause toggle */}
      <div className="absolute inset-x-0 top-0 h-64 overflow-hidden pointer-events-none opacity-40 select-none" aria-hidden="true">
        <svg
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          className={`w-full h-full transition-opacity duration-500 ${isMotionPaused ? 'opacity-20' : 'opacity-60'}`}
        >
          <defs>
            <linearGradient id="beam1" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="beam2" x1="100%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points="200,0 600,280 400,0"
            fill="url(#beam1)"
            className={isMotionPaused ? '' : 'animate-pulse'}
            style={{ animationDuration: '4s' }}
          />
          <polygon
            points="1000,0 600,280 800,0"
            fill="url(#beam2)"
            className={isMotionPaused ? '' : 'animate-pulse'}
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          />
          <circle
            cx="600"
            cy="280"
            r="80"
            fill="#EC4899"
            opacity="0.15"
            className={isMotionPaused ? '' : 'animate-ping'}
            style={{ animationDuration: '3s' }}
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curatorial Header Badge */}
        <div className="flex flex-col items-center justify-center text-center mb-6 animate-hero-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1124] border border-[#3C2852] text-xs font-semibold text-[#D4B8ED] tracking-wide mb-3">
            <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" aria-hidden="true" />
            <span className="tracking-wider uppercase text-[11px]">Live The Change · Cultural Fest After Dark</span>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-[#A89CB5]">
            Music · Movement · Drama · Runway
          </p>
        </div>

        {/* Central Typographic Composition */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Logo Emblem presentation with clean separate wordmark */}
          <div className="flex items-center justify-center gap-3 mb-2 animate-hero-2">
            <img
              src="/assets/milan-emblem.png"
              alt="Milan Festival Emblem"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_20px_rgba(236,72,153,0.35)]"
              width={56}
              height={56}
            />
            <span className="font-display text-2xl sm:text-3xl font-black tracking-widest text-[#FAF7F5]">
              MILAN <span className="text-[#EC4899]">’26</span>
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#FAF7F5] leading-[0.92] font-display uppercase animate-hero-2">
            FIND YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] via-[#A855F7] to-[#06B6D4]">STAGE.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#C8BFD4] font-normal leading-relaxed max-w-2xl mx-auto text-balance animate-hero-3">
            Music. Movement. Drama. Explore 8 curated competitions across SRMIST Kattankulathur’s premier auditoriums and open-air arenas.
          </p>

          {/* Curatorial Sample Dates & Venue Strip */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs sm:text-sm text-[#A89CB5] animate-hero-3">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-[#EC4899]" aria-hidden="true" />
              <span className="text-white font-semibold">{SAMPLE_NOTICE.datesNotice}</span>
            </div>
            <span className="hidden sm:inline text-[#3F2B57]" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#06B6D4]" aria-hidden="true" />
              <span>Main Campus, Kattankulathur, Chennai</span>
            </div>
          </div>

          {/* Action CTAs & Stage Animation Toggle */}
          <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 animate-hero-4">
            <button
              onClick={onExploreEvents}
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white font-semibold text-xs tracking-wider uppercase hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#EC4899]/20 min-h-[44px]"
            >
              <span>Explore Events</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRegisterClick}
              className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-[#17101E] text-[#FAF7F5] font-semibold text-xs tracking-wider uppercase hover:bg-[#251833] active:scale-[0.99] transition-all border border-[#3C2754] flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
            >
              <span>Take the Spotlight</span>
            </button>

            <button
              onClick={onViewSchedule}
              className="w-full sm:w-auto px-5 py-3.5 rounded-lg text-[#C8BFD4] font-medium text-xs tracking-wider uppercase hover:text-white hover:bg-[#1E132B] transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>3-Day Schedule</span>
            </button>
          </div>

          {/* Accessible Motion Pause/Play Toggle Button */}
          <div className="pt-2 flex justify-center animate-hero-4">
            <button
              type="button"
              onClick={() => setIsMotionPaused((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#140D1C] border border-[#2D1F3D] text-[11px] font-medium text-[#A89CB5] hover:text-white transition-colors cursor-pointer min-h-[36px]"
              aria-label={isMotionPaused ? 'Resume stage motion background' : 'Pause stage motion background'}
            >
              {isMotionPaused ? (
                <>
                  <Play className="w-3 h-3 text-[#84CC16]" aria-hidden="true" />
                  <span>Resume Stage Motion</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3 text-[#EC4899]" aria-hidden="true" />
                  <span>Pause Stage Motion</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Historical Archive Poster Highlight Strip */}
        <div className="mt-12 pt-8 border-t border-[#241733]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EC4899]">
              <ImageIcon className="w-4 h-4 text-[#EC4899]" />
              <span>Festival Archive Highlights</span>
            </div>
            <p className="text-[11px] text-[#8A7B9B]">
              Historical Reference Posters from Previous Editions (Archive Reference)
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#2D1F3D] bg-[#140D1C] p-2 sm:p-3 shadow-lg">
            <img
              src="/assets/aistudio/image_e1297c07.png"
              alt="Historical reference posters from previous editions of Milan at SRMIST"
              className="w-full h-auto object-cover rounded-lg opacity-85 hover:opacity-100 transition-opacity"
              loading="lazy"
              width={1200}
              height={400}
            />
          </div>
        </div>

        {/* Grounded festival overview indicators */}
        <div className="mt-8 pt-6 border-t border-[#241733]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3.5 rounded-xl bg-[#140D1C] border border-[#2C1D3E]">
              <p className="text-xl sm:text-2xl font-bold text-white font-display">6</p>
              <p className="text-xs uppercase tracking-wider text-[#A89CB5] font-medium mt-0.5">Artistic Domains</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#140D1C] border border-[#2C1D3E]">
              <p className="text-xl sm:text-2xl font-bold text-white font-display">8</p>
              <p className="text-xs uppercase tracking-wider text-[#A89CB5] font-medium mt-0.5">Curated Contests</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#140D1C] border border-[#2C1D3E]">
              <p className="text-xl sm:text-2xl font-bold text-white font-display">3 Days</p>
              <p className="text-xs uppercase tracking-wider text-[#A89CB5] font-medium mt-0.5">Sample Itinerary</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#140D1C] border border-[#2C1D3E]">
              <p className="text-xl sm:text-2xl font-bold text-[#06B6D4] font-display">Interactive</p>
              <p className="text-xs uppercase tracking-wider text-[#A89CB5] font-medium mt-0.5">Demo Pass Flow</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
