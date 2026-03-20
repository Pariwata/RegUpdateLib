import React from 'react';
import { Regulation } from '../types/regulation';

interface RegulationCardProps {
  regulation: Regulation;
  onSelect: (regulation: Regulation) => void;
}

const statusColors: Record<string, string> = {
  active: '#16a34a',
  proposed: '#ca8a04',
  amended: '#2563eb',
  repealed: '#dc2626',
};

export const RegulationCard: React.FC<RegulationCardProps> = ({
  regulation,
  onSelect,
}) => {
  return (
    <div className="regulation-card" onClick={() => onSelect(regulation)}>
      <div className="card-header">
        <span
          className="status-badge"
          style={{ backgroundColor: statusColors[regulation.status] }}
        >
          {regulation.status}
        </span>
        <span className="reference-number">{regulation.referenceNumber}</span>
      </div>
      <h3 className="card-title">{regulation.title}</h3>
      <div className="card-meta">
        <span className="card-agency">{regulation.agency}</span>
        <span className="card-separator">|</span>
        <span className="card-category">{regulation.category}</span>
        <span className="card-separator">|</span>
        <span className="card-jurisdiction">{regulation.jurisdiction}</span>
      </div>
      <p className="card-summary">{regulation.summary}</p>
      <div className="card-footer">
        <div className="card-dates">
          <span>Effective: {formatDate(regulation.effectiveDate)}</span>
          <span>Updated: {formatDate(regulation.lastUpdated)}</span>
        </div>
        <div className="card-tags">
          {regulation.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
