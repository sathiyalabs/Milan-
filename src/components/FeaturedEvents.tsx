import React from 'react';
import { FestivalEvent } from '../types';
import { ArrowRight, MapPin, Users, Tag } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface FeaturedEventsProps {
  events: FestivalEvent[];
  onSelectEvent: (event: FestivalEvent) => void;
  onQuickRegister: (event: FestivalEvent) => void;
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({
  events,
  onSelectEvent,
  onQuickRegister,
}) => {
  const featured = events.filter((e) => e.isFeatured).slice(0, 3);

  return (
    <section className="py-16 bg-[#09080D] border-b border-[#241733]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899]">
                Curatorial Highlights
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF7F5] mt-1 font-display">
                Featured Competitions
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A89CB5] max-w-md">
              Highlighted contests showcasing western dance formations, live amplified rock ensembles, and campus runway styling.
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((event, index) => {
            return (
              <RevealOnScroll key={event.id} delayMs={index * 120} className="h-full">
              <article
                key={event.id}
                className="flex flex-col justify-between bg-[#17101E] border border-[#2D1F3D] rounded-xl p-6 hover:shadow-lg hover:border-[#A855F7]/60 transition-all group"
              >
                <div>
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs font-medium text-[#A89CB5] mb-3">
                    <span className="text-[#EC4899] font-bold">{event.category}</span>
                    <span aria-hidden="true" className="text-[#3C2754]">·</span>
                    <span>{event.day}</span>
                    <span aria-hidden="true" className="text-[#3C2754]">·</span>
                    <span className="font-mono tabular-nums">{event.date.split('(')[0].trim()}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#FAF7F5] tracking-tight group-hover:text-[#EC4899] transition-colors font-display mb-2">
                    {event.title}
                  </h3>

                  <p className="text-xs text-[#C8BFD4] leading-relaxed mb-4 line-clamp-3">
                    {event.shortDescription}
                  </p>

                  <div className="space-y-2 py-3 border-y border-[#241733] text-xs text-[#A89CB5]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" aria-hidden="true" />
                      <span className="truncate text-[#C8BFD4]">{event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between text-[#8A7B9B]">
                      <span className="flex items-center gap-1.5 font-mono tabular-nums">
                        <Users className="w-3.5 h-3.5 text-[#A855F7]" aria-hidden="true" />
                        {event.registeredCount}/{event.capacity} registered
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#FAF7F5]">
                        <Tag className="w-3.5 h-3.5 text-[#EC4899]" aria-hidden="true" />
                        <span className="font-mono">{event.registrationFee}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-5 flex items-center gap-3">
                  <button
                    onClick={() => onSelectEvent(event)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg border border-[#3C2754] text-[#FAF7F5] hover:bg-[#251833] transition-colors cursor-pointer text-center min-h-[44px]"
                    aria-label={`View full details for ${event.title}`}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onQuickRegister(event)}
                    className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg bg-[#EC4899] text-white hover:bg-[#DB2777] transition-colors cursor-pointer text-center flex items-center justify-center gap-1 min-h-[44px]"
                    aria-label={`Register for ${event.title}`}
                  >
                    <span>Register</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};
