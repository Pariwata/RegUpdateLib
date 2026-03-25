import React, { useState } from 'react';
import { SearchFilters } from '../types/regulation';
import {
  agencies,
  categories,
  scopes,
  statuses,
} from '../data/mockRegulations';

interface FilterPanelProps {
  filters: SearchFilters;
  onFilterChange: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => void;
  onReset: () => void;
  activeFilterCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  activeFilterCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <button
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="filter-icon">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          ตัวกรอง
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
          <svg
            className={`chevron ${isExpanded ? 'expanded' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {activeFilterCount > 0 && (
          <button className="filter-reset" onClick={onReset}>
            ล้างทั้งหมด
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filter-body">
          <div className="filter-grid">
            <div className="filter-group">
              <label className="filter-label">หน่วยงาน</label>
              <select
                className="filter-select"
                value={filters.agency}
                onChange={(e) => onFilterChange('agency', e.target.value)}
              >
                <option value="">ทุกหน่วยงาน</option>
                {agencies.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">หมวดหมู่</label>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
              >
                <option value="">ทุกหมวดหมู่</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">สถานะ</label>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <option value="">ทุกสถานะ</option>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">ขอบเขต</label>
              <select
                className="filter-select"
                value={filters.scope}
                onChange={(e) => onFilterChange('scope', e.target.value)}
              >
                <option value="">ทุกขอบเขต</option>
                {scopes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">ตั้งแต่วันที่</label>
              <input
                type="date"
                className="filter-input"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">ถึงวันที่</label>
              <input
                type="date"
                className="filter-input"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-sort">
            <div className="filter-group">
              <label className="filter-label">เรียงตาม</label>
              <select
                className="filter-select"
                value={filters.sortBy}
                onChange={(e) =>
                  onFilterChange(
                    'sortBy',
                    e.target.value as SearchFilters['sortBy']
                  )
                }
              >
                <option value="relevance">ความเกี่ยวข้อง</option>
                <option value="date">วันที่อัปเดต</option>
                <option value="title">ชื่อ</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">ลำดับ</label>
              <select
                className="filter-select"
                value={filters.sortOrder}
                onChange={(e) =>
                  onFilterChange(
                    'sortOrder',
                    e.target.value as SearchFilters['sortOrder']
                  )
                }
              >
                <option value="desc">มากไปน้อย</option>
                <option value="asc">น้อยไปมาก</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
