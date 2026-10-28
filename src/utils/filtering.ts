import { FestivalEvent, EventCategory } from '../types';

/**
 * Case-insensitive combined search and category filtering for festival events.
 * Used identically in the UI components and test suites.
 */
export function filterFestivalEvents(
  events: FestivalEvent[],
  selectedCategory: EventCategory,
  searchQuery: string
): FestivalEvent[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return events.filter((event) => {
    // 1. Category filter
    const matchesCategory =
      selectedCategory === 'All' || event.category === selectedCategory;

    if (!matchesCategory) return false;

    // 2. Keyword search
    if (!normalizedQuery) return true;

    return (
      event.title.toLowerCase().includes(normalizedQuery) ||
      event.shortDescription.toLowerCase().includes(normalizedQuery) ||
      event.fullDescription.toLowerCase().includes(normalizedQuery) ||
      event.venue.toLowerCase().includes(normalizedQuery) ||
      event.category.toLowerCase().includes(normalizedQuery) ||
      event.tagline.toLowerCase().includes(normalizedQuery) ||
      event.rules.some((rule) => rule.toLowerCase().includes(normalizedQuery)) ||
      event.judgingCriteria.some((c) => c.toLowerCase().includes(normalizedQuery))
    );
  });
}
