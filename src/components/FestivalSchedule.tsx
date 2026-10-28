import React, { useState } from 'react';
import { FESTIVAL_SCHEDULE_HIGHLIGHTS } from '../data/events';
import { Clock, MapPin, Sparkles } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export const FestivalSchedule: React.FC = () => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const currentDay = FESTIVAL_SCHEDULE_HIGHLIGHTS[activeDayIndex];

  return (
    <section id="schedule" className="py-16 lg:py-24 bg-[#100918] border-y border-[#241733] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-[#241733]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Festival Timeline (Sample Itinerary)</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FAF7F5] mt-1 font-display">
                Festival Schedule
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A89CB5] max-w-md">
              Chronological stages and venues for the 3-day sample festival calendar.
            </p>
          </div>
        </RevealOnScroll>

        {/* Day Selector Buttons with accessible touch targets */}
        <div className="flex items-center gap-2.5 mb-8 overflow-x-auto pb-2 scrollbar-thin">
          {FESTIVAL_SCHEDULE_HIGHLIGHTS.map((item, index) => {
            const isActive = activeDayIndex === index;
            return (
              <button
                key={item.day}
                onClick={() => setActiveDayIndex(index)}
                className={`px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border min-h-[44px] btn-motion ${
                  isActive
                    ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent shadow-[0_0_20px_rgba(236,72,153,0.35)] scale-102'
                    : 'bg-[#17101E] text-[#C8BFD4] border-[#2D1F3D] hover:bg-[#251833] hover:text-white hover:border-[#8B5CF6]/40'
                }`}
                aria-pressed={isActive}
              >
                <span>{item.day.split('—')[0].trim()}</span>
                <span className="hidden sm:inline text-[#A89CB5] font-normal ml-1">
                  — {item.day.split('—')[1]?.trim()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Schedule Timeline List */}
        <RevealOnScroll>
          <div className="bg-[#17101E] border border-[#2D1F3D] rounded-3xl p-6 sm:p-9 shadow-2xl">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#241733]">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#FAF7F5] font-display">
                  {currentDay.day}
                </h3>
                <p className="text-xs text-[#A89CB5] font-mono mt-0.5">
                  {currentDay.date}
                </p>
              </div>
              <span className="text-xs font-bold text-[#D4B8ED] bg-[#1A1124] px-4 py-1.5 rounded-full border border-[#3C2754] shadow-sm">
                {currentDay.events.length} Sessions Scheduled
              </span>
            </div>

            <div className="space-y-4">
              {currentDay.events.map((session, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-[#120A1A] border border-[#2D1F3D] hover:border-[#A855F7]/50 card-motion transition-all gap-4 group"
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#06B6D4] bg-[#06B6D4]/15 px-3 py-1.5 rounded-lg border border-[#06B6D4]/30 shrink-0">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{session.time}</span>
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white font-display group-hover:text-[#EC4899] transition-colors">
                        {session.title}
                      </h4>
                      <p className="text-xs text-[#A89CB5] flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#06B6D4]" aria-hidden="true" />
                        <span>{session.venue}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#8A7B9B] font-mono sm:text-right shrink-0">
                    Open for Attendees (Sample)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};
