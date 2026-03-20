import React, { useState } from 'react';
import { SearchFilters } from '../types/regulation';
import {
  agencies,
  categories,
  jurisdictions,
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
          Filters
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
            Clear all
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="filter-body">
          <div className="filter-grid">
            <div className="filter-group">
              <label className="filter-label">Agency</label>
              <select
                className="filter-select"
                value={filters.agency}
                onChange={(e) => onFilterChange('agency', e.target.value)}
              >
                <option value="">All Agencies</option>
                {agencies.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Category</label>
              <select
                className="filter-select"
                value={filters.category}
                onChange={(e) => onFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Status</label>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Jurisdiction</label>
              <select
                className="filter-select"
                value={filters.jurisdiction}
                onChange={(e) => onFilterChange('jurisdiction', e.target.value)}
              >
                <option value="">All Jurisdictions</option>
                {jurisdictions.map((j) => (
                  <option key={j} value={j}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Effective From</label>
              <input
                type="date"
                className="filter-input"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">Effective To</label>
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
              <label className="filter-label">Sort by</label>
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
                <option value="relevance">Relevance</option>
                <option value="date">Last Updated</option>
                <option value="title">Title</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Order</label>
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
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
