import React, { useState, useMemo } from 'react';
import { FestivalEvent, EventCategory } from '../types';
import { FESTIVAL_CATEGORIES } from '../data/events';
import { filterFestivalEvents } from '../utils/filtering';
import { Search, X, Filter, RotateCcw, Calendar, MapPin, Users, Tag, Sparkles } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

interface EventsListingProps {
  events: FestivalEvent[];
  onSelectEvent: (event: FestivalEvent) => void;
  onRegisterEvent: (event: FestivalEvent) => void;
}

export const EventsListing: React.FC<EventsListingProps> = ({
  events,
  onSelectEvent,
  onRegisterEvent,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Use shared filtering utility
  const filteredEvents = useMemo(() => {
    return filterFestivalEvents(events, selectedCategory, searchQuery);
  }, [events, selectedCategory, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const quickSearchSuggestions = ['Choreo', 'Band', 'Vogue', 'Classical', 'Natak', 'Painting'];

  return (
    <section id="events" className="py-16 lg:py-24 bg-[#09080D] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#241733]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Events Directory & Contests</span>
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#FAF7F5] mt-1 font-display">
                Explore Competitions
              </h2>
            </div>
            <div>
              <span className="text-xs font-mono text-[#D4B8ED] tabular-nums font-bold bg-[#1A1124] px-4 py-2 rounded-lg border border-[#3C2754] shadow-sm">
                Showing {filteredEvents.length} of {events.length} competitions
              </span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Search Bar & Category Filter Bar */}
        <div className="space-y-4 mb-10">
          {/* Keyword Search Input with glowing focus */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7B9B] group-focus-within:text-[#EC4899] transition-colors">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="event-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by contest title, genre, venue, or rules (e.g., 'Choreo', 'Band', 'Auditorium')..."
              className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-[#17101E] border border-[#2D1F3D] text-sm text-[#FAF7F5] placeholder-[#8A7B9B] focus:border-[#EC4899] focus:ring-2 focus:ring-[#EC4899]/30 shadow-inner transition-all min-h-[46px] focus:outline-none"
              aria-label="Search events by title, description, or venue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A7B9B] hover:text-white cursor-pointer min-h-[44px] min-w-[44px] justify-center transition-colors"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#A89CB5]">
            <span className="font-semibold text-[#D4B8ED]">Quick tags:</span>
            {quickSearchSuggestions.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className={`px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-all border min-h-[32px] ${
                  searchQuery.toLowerCase() === term.toLowerCase()
                    ? 'bg-[#EC4899] text-white border-transparent shadow-[0_0_10px_rgba(236,72,153,0.4)]'
                    : 'bg-[#1A1124] text-[#D4B8ED] border-[#2D1F3D] hover:bg-[#251833] hover:text-white hover:border-[#8B5CF6]/50'
                }`}
              >
                #{term}
              </button>
            ))}
          </div>

          {/* Category Filter Tabs with dynamic glow */}
          <div
            role="toolbar"
            aria-label="Filter events by category"
            className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin pt-1"
          >
            {FESTIVAL_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer border min-h-[40px] btn-motion ${
                    isActive
                      ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent shadow-[0_0_18px_rgba(236,72,153,0.35)] scale-102'
                      : 'bg-[#17101E] text-[#C8BFD4] border-[#2D1F3D] hover:bg-[#22162B] hover:text-white hover:border-[#8B5CF6]/40'
                  }`}
                  aria-pressed={isActive}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State View */}
        {filteredEvents.length === 0 && (
          <div
            role="status"
            className="py-16 px-6 text-center rounded-2xl bg-[#140D1C] border border-[#2D1F3D] my-8 max-w-xl mx-auto space-y-4 shadow-xl"
          >
            <div className="w-14 h-14 rounded-full bg-[#1F142B] text-[#EC4899] flex items-center justify-center mx-auto shadow-inner">
              <Filter className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold text-[#FAF7F5] font-display">
              No Competitions Found
            </h3>
            <p className="text-xs text-[#A89CB5] max-w-md mx-auto leading-relaxed">
              No events matched your search{' '}
              {searchQuery && (
                <strong className="text-white">"{searchQuery}"</strong>
              )}{' '}
              {selectedCategory !== 'All' && (
                <span>
                  under the <strong className="text-white">{selectedCategory}</strong> category
                </span>
              )}
              . Try checking for typos or resetting your filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-[#EC4899] text-white rounded-lg hover:bg-[#DB2777] transition-all cursor-pointer shadow-lg shadow-[#EC4899]/25 min-h-[44px] btn-motion"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              return (
                <RevealOnScroll key={event.id} delayMs={idx * 60} className="h-full">
                  <article
                    className="flex flex-col justify-between bg-[#17101E] border border-[#2D1F3D] rounded-2xl p-6 card-motion group h-full hover:border-[#8B5CF6]/60 transition-all duration-300"
                  >
                    <div className="space-y-3.5">
                      {/* Unboxed clean metadata with typographic separators */}
                      <div className="flex items-center gap-2 text-xs font-medium text-[#A89CB5]">
                        <span className="text-[#EC4899] font-bold tracking-wide">
                          {event.category}
                        </span>
                        <span aria-hidden="true" className="text-[#3C2754]">·</span>
                        <span>{event.day}</span>
                        <span aria-hidden="true" className="text-[#3C2754]">·</span>
                        <span className="font-mono tabular-nums">{event.participationType}</span>
                      </div>

                      <h3 className="text-xl font-bold text-[#FAF7F5] tracking-tight group-hover:text-[#EC4899] transition-colors font-display">
                        {event.title}
                      </h3>

                      <p className="text-xs text-[#C8BFD4] leading-relaxed line-clamp-2">
                        {event.shortDescription}
                      </p>

                      {/* Venue & Date Details */}
                      <div className="pt-3 pb-1 border-t border-[#241733] space-y-2 text-xs text-[#A89CB5]">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#EC4899] shrink-0" aria-hidden="true" />
                          <span className="font-mono tabular-nums text-[#FAF7F5]">{event.date.split('(')[0].trim()} · {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" aria-hidden="true" />
                          <span className="truncate text-[#C8BFD4]">{event.venue}</span>
                        </div>
                      </div>

                      {/* Capacity & Fee Row with micro-badges */}
                      <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-[#120A1A] border border-[#2A1C38] text-[#A89CB5]">
                        <div className="flex items-center gap-1.5 font-mono tabular-nums">
                          <Users className="w-3.5 h-3.5 text-[#A855F7]" aria-hidden="true" />
                          <span>{event.registeredCount}/{event.capacity} slots</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-[#FAF7F5]">
                          <Tag className="w-3.5 h-3.5 text-[#EC4899]" aria-hidden="true" />
                          <span className="font-mono">{event.registrationFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions with tactile micro-motion */}
                    <div className="pt-5 mt-4 border-t border-[#241733] flex items-center gap-3">
                      <button
                        onClick={() => onSelectEvent(event)}
                        className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg border border-[#3C2754] text-[#FAF7F5] hover:bg-[#251833] btn-motion cursor-pointer text-center min-h-[44px]"
                        aria-label={`View rules and details for ${event.title}`}
                      >
                        Details & Rules
                      </button>
                      <button
                        onClick={() => onRegisterEvent(event)}
                        className="flex-1 py-2.5 px-3 text-xs font-bold rounded-lg bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white hover:opacity-95 btn-motion cursor-pointer text-center min-h-[44px] shadow-sm shadow-[#EC4899]/20"
                        aria-label={`Register for ${event.title}`}
                      >
                        Register (Demo)
                      </button>
                    </div>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
