import React from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  resultCount,
}) => {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="ค้นหาตามชื่อ คำสำคัญ หรือเลขที่อ้างอิง..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => onQueryChange('')}
            aria-label="ล้างคำค้นหา"
          >
            &times;
          </button>
        )}
      </div>
      <div className="search-result-count">
        พบ {resultCount} กฎเกณฑ์
      </div>
    </div>
  );
};
