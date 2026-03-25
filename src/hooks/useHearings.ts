import { useState, useMemo, useCallback } from 'react';
import { HearingItem } from '../types/regulation';
import { mockHearings } from '../data/mockHearings';

interface HearingFilters {
  agency: string;
  status: string;
}

const DEFAULT_HEARING_FILTERS: HearingFilters = {
  agency: '',
  status: '',
};

export function useHearings() {
  const [filters, setFilters] = useState<HearingFilters>(DEFAULT_HEARING_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof HearingFilters>(key: K, value: HearingFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_HEARING_FILTERS);
  }, []);

  const filteredHearings = useMemo(() => {
    let filtered = [...mockHearings];

    if (filters.agency) {
      filtered = filtered.filter((h) => h.agency === filters.agency);
    }
    if (filters.status) {
      filtered = filtered.filter((h) => h.status === filters.status);
    }

    // Sort: open hearings first, then by end date
    filtered.sort((a, b) => {
      const statusOrder: Record<string, number> = {
        'เปิดรับฟัง': 0,
        'ปิดรับฟัง': 1,
        'สรุปผล': 2,
      };
      const orderA = statusOrder[a.status] ?? 3;
      const orderB = statusOrder[b.status] ?? 3;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(a.hearingEndDate).getTime() - new Date(b.hearingEndDate).getTime();
    });

    return filtered;
  }, [filters]);

  const stats = useMemo(() => {
    const total = mockHearings.length;
    const open = mockHearings.filter((h) => h.status === 'เปิดรับฟัง').length;
    const closed = mockHearings.filter((h) => h.status === 'ปิดรับฟัง').length;
    const concluded = mockHearings.filter((h) => h.status === 'สรุปผล').length;
    return { total, open, closed, concluded };
  }, []);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredHearings,
    stats,
  };
}

export function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
