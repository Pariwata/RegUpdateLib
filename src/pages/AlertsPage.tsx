import React from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { AlertCard } from '../components/AlertCard';
import { StatsSummary } from '../components/StatsSummary';
import { alertAgencies, changeTypes, impactLevels } from '../data/mockAlerts';

export const AlertsPage: React.FC = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredAlerts,
    stats,
    markAsRead,
    markAllAsRead,
  } = useAlerts();

  const hasActiveFilters = filters.agency || filters.changeType || filters.impactLevel;

  return (
    <div className="alerts-page">
      <StatsSummary
        items={[
          { label: 'ทั้งหมด', value: stats.total },
          { label: 'ยังไม่อ่าน', value: stats.unread, color: '#2563eb' },
          { label: 'ผลกระทบสูง', value: stats.high, color: '#dc2626' },
          { label: 'ผลกระทบกลาง', value: stats.medium, color: '#f59e0b' },
          { label: 'ผลกระทบต่ำ', value: stats.low, color: '#16a34a' },
        ]}
      />

      <div className="alert-filters">
        <div className="alert-filter-row">
          <select
            className="filter-select"
            value={filters.agency}
            onChange={(e) => updateFilter('agency', e.target.value)}
          >
            <option value="">ทุกหน่วยงาน</option>
            {alertAgencies.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filters.changeType}
            onChange={(e) => updateFilter('changeType', e.target.value)}
          >
            <option value="">ทุกประเภทการเปลี่ยนแปลง</option>
            {changeTypes.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filters.impactLevel}
            onChange={(e) => updateFilter('impactLevel', e.target.value)}
          >
            <option value="">ทุกระดับผลกระทบ</option>
            {impactLevels.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button className="filter-reset" onClick={resetFilters}>
              ล้างตัวกรอง
            </button>
          )}
        </div>
        {stats.unread > 0 && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            อ่านทั้งหมดแล้ว
          </button>
        )}
      </div>

      <div className="results-list">
        {filteredAlerts.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h3 className="empty-title">ไม่พบการแจ้งเตือน</h3>
            <p className="empty-text">ลองปรับตัวกรองเพื่อดูการแจ้งเตือนอื่น</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};
