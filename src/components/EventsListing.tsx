import React, { useState, useMemo } from 'react';
import { FestivalEvent, EventCategory } from '../types';
import { FESTIVAL_CATEGORIES } from '../data/events';
import { filterFestivalEvents } from '../utils/filtering';
import { Search, X, Filter, RotateCcw, Calendar, MapPin, Users, Tag } from 'lucide-react';

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#241733]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#EC4899]">
              Events Directory & Contests
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FAF7F5] mt-1 font-display">
              Explore Competitions
            </h2>
          </div>
          <div>
            <span className="text-xs font-mono text-[#D4B8ED] tabular-nums font-medium bg-[#1A1124] px-3.5 py-1.5 rounded-md border border-[#3C2754]">
              Showing {filteredEvents.length} of {events.length} competitions
            </span>
          </div>
        </div>

        {/* Search Bar & Category Filter Bar */}
        <div className="space-y-4 mb-8">
          {/* Keyword Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7B9B]">
              <Search className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              id="event-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by contest title, genre, venue, or rules (e.g., 'Choreo', 'Band', 'Auditorium')..."
              className="w-full pl-10 pr-10 py-3 rounded-lg bg-[#17101E] border border-[#2D1F3D] text-sm text-[#FAF7F5] placeholder-[#8A7B9B] focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] shadow-inner transition-all min-h-[44px]"
              aria-label="Search events by title, description, or venue"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8A7B9B] hover:text-white cursor-pointer min-h-[44px] min-w-[44px] justify-center"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#A89CB5]">
            <span className="font-medium text-[#C8BFD4]">Quick tags:</span>
            {quickSearchSuggestions.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-2.5 py-1 rounded-md bg-[#1A1124] text-[#D4B8ED] hover:bg-[#251833] hover:text-white transition-colors cursor-pointer text-xs min-h-[32px] border border-[#2D1F3D]"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Category Filter Tabs */}
          <div
            role="toolbar"
            aria-label="Filter events by category"
            className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin"
          >
            {FESTIVAL_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 transition-all cursor-pointer border min-h-[38px] ${
                    isActive
                      ? 'bg-gradient-to-r from-[#EC4899] to-[#8B5CF6] text-white border-transparent shadow-sm'
                      : 'bg-[#17101E] text-[#C8BFD4] border-[#2D1F3D] hover:bg-[#22162B] hover:text-white'
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
            className="py-16 px-6 text-center rounded-xl bg-[#140D1C] border border-[#2D1F3D] my-6 max-w-xl mx-auto space-y-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#1F142B] text-[#EC4899] flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-[#FAF7F5] font-display">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold bg-[#EC4899] text-white rounded-lg hover:bg-[#DB2777] transition-colors cursor-pointer shadow-sm min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Event Cards Grid */}
        {filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              return (
                <article
                  key={event.id}
                  className="flex flex-col justify-between bg-[#17101E] border border-[#2D1F3D] rounded-xl p-6 hover:shadow-lg hover:border-[#A855F7]/60 transition-all group"
                >
                  <div className="space-y-3">
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

                    {/* Capacity & Fee Row */}
                    <div className="flex items-center justify-between text-xs py-2 px-3 rounded-md bg-[#120A1A] border border-[#2A1C38] text-[#A89CB5]">
                      <div className="flex items-center gap-1.5 font-mono tabular-nums">
                        <Users className="w-3.5 h-3.5 text-[#A855F7]" aria-hidden="true" />
                        <span>{event.registeredCount}/{event.capacity} slots filled</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-[#FAF7F5]">
                        <Tag className="w-3.5 h-3.5 text-[#EC4899]" aria-hidden="true" />
                        <span className="font-mono">{event.registrationFee}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 mt-4 border-t border-[#241733] flex items-center gap-3">
                    <button
                      onClick={() => onSelectEvent(event)}
                      className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg border border-[#3C2754] text-[#FAF7F5] hover:bg-[#251833] transition-colors cursor-pointer text-center min-h-[44px]"
                      aria-label={`View rules and details for ${event.title}`}
                    >
                      Details & Rules
                    </button>
                    <button
                      onClick={() => onRegisterEvent(event)}
                      className="flex-1 py-2.5 px-3 text-xs font-semibold rounded-lg bg-[#EC4899] text-white hover:bg-[#DB2777] transition-colors cursor-pointer text-center min-h-[44px]"
                      aria-label={`Register for ${event.title}`}
                    >
                      Register (Demo)
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
