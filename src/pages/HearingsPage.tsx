import React from 'react';
import { useHearings } from '../hooks/useHearings';
import { HearingCard } from '../components/HearingCard';
import { StatsSummary } from '../components/StatsSummary';
import { hearingAgencies, hearingStatuses } from '../data/mockHearings';

export const HearingsPage: React.FC = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    filteredHearings,
    stats,
  } = useHearings();

  const hasActiveFilters = filters.agency || filters.status;

  return (
    <div className="hearings-page">
      <StatsSummary
        items={[
          { label: 'ทั้งหมด', value: stats.total },
          { label: 'เปิดรับฟัง', value: stats.open, color: '#16a34a' },
          { label: 'ปิดรับฟัง', value: stats.closed, color: '#f59e0b' },
          { label: 'สรุปผลแล้ว', value: stats.concluded, color: '#64748b' },
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
            {hearingAgencies.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
          >
            <option value="">ทุกสถานะ</option>
            {hearingStatuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {hasActiveFilters && (
            <button className="filter-reset" onClick={resetFilters}>
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      <div className="results-list">
        {filteredHearings.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
            <h3 className="empty-title">ไม่พบรายการ Hearing</h3>
            <p className="empty-text">ลองปรับตัวกรองเพื่อดูรายการอื่น</p>
          </div>
        ) : (
          filteredHearings.map((hearing) => (
            <HearingCard key={hearing.id} hearing={hearing} />
          ))
        )}
      </div>
    </div>
  );
};
