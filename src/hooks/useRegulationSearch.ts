import { useState, useMemo, useCallback } from 'react';
import { Regulation, SearchFilters, DEFAULT_FILTERS } from '../types/regulation';
import { mockRegulations } from '../data/mockRegulations';

export function useRegulationSearch() {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [selectedRegulation, setSelectedRegulation] =
    useState<Regulation | null>(null);

  const updateFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const results = useMemo(() => {
    let filtered = [...mockRegulations];

    // Text search
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.referenceNumber.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by agency
    if (filters.agency) {
      filtered = filtered.filter((r) => r.agency === filters.agency);
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((r) => r.category === filters.category);
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((r) => r.status === filters.status);
    }

    // Filter by jurisdiction
    if (filters.jurisdiction) {
      filtered = filtered.filter(
        (r) => r.jurisdiction === filters.jurisdiction
      );
    }

    // Date range filters
    if (filters.dateFrom) {
      filtered = filtered.filter((r) => r.effectiveDate >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter((r) => r.effectiveDate <= filters.dateTo);
    }

    // Sorting
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortBy) {
        case 'date':
          cmp =
            new Date(a.lastUpdated).getTime() -
            new Date(b.lastUpdated).getTime();
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'relevance':
        default:
          if (filters.query) {
            const q = filters.query.toLowerCase();
            const scoreA = a.title.toLowerCase().includes(q) ? 2 : 1;
            const scoreB = b.title.toLowerCase().includes(q) ? 2 : 1;
            cmp = scoreB - scoreA;
          }
          break;
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return filtered;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.agency) count++;
    if (filters.category) count++;
    if (filters.status) count++;
    if (filters.jurisdiction) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    return count;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    results,
    selectedRegulation,
    setSelectedRegulation,
    activeFilterCount,
  };
}
