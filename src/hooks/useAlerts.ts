import { useState, useMemo, useCallback } from 'react';
import { RegulationAlert } from '../types/regulation';
import { mockAlerts } from '../data/mockAlerts';

interface AlertFilters {
  agency: string;
  changeType: string;
  impactLevel: string;
}

const DEFAULT_ALERT_FILTERS: AlertFilters = {
  agency: '',
  changeType: '',
  impactLevel: '',
};

export function useAlerts() {
  const [alerts, setAlerts] = useState<RegulationAlert[]>(mockAlerts);
  const [filters, setFilters] = useState<AlertFilters>(DEFAULT_ALERT_FILTERS);

  const updateFilter = useCallback(
    <K extends keyof AlertFilters>(key: K, value: AlertFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_ALERT_FILTERS);
  }, []);

  const markAsRead = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  }, []);

  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    if (filters.agency) {
      filtered = filtered.filter((a) => a.agency === filters.agency);
    }
    if (filters.changeType) {
      filtered = filtered.filter((a) => a.changeType === filters.changeType);
    }
    if (filters.impactLevel) {
      filtered = filtered.filter((a) => a.impactLevel === filters.impactLevel);
    }

    // Sort by date descending (newest first)
    filtered.sort(
      (a, b) =>
        new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime()
    );

    return filtered;
  }, [alerts, filters]);

  const stats = useMemo(() => {
    const total = alerts.length;
    const unread = alerts.filter((a) => !a.isRead).length;
    const high = alerts.filter((a) => a.impactLevel === 'สูง').length;
    const medium = alerts.filter((a) => a.impactLevel === 'กลาง').length;
    const low = alerts.filter((a) => a.impactLevel === 'ต่ำ').length;
    return { total, unread, high, medium, low };
  }, [alerts]);

  return {
    filters,
    updateFilter,
    resetFilters,
    filteredAlerts,
    stats,
    markAsRead,
    markAllAsRead,
  };
}
