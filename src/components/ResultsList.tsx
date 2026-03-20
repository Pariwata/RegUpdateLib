import React from 'react';
import { Regulation } from '../types/regulation';
import { RegulationCard } from './RegulationCard';

interface ResultsListProps {
  results: Regulation[];
  onSelect: (regulation: Regulation) => void;
}

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  onSelect,
}) => {
  if (results.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="empty-icon">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M8 11h6" />
        </svg>
        <h3 className="empty-title">No regulations found</h3>
        <p className="empty-text">
          Try adjusting your search terms or filters to find what you're looking
          for.
        </p>
      </div>
    );
  }

  return (
    <div className="results-list">
      {results.map((regulation) => (
        <RegulationCard
          key={regulation.id}
          regulation={regulation}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
