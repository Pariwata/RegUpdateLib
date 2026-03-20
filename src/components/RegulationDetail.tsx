import React from 'react';
import { Regulation } from '../types/regulation';

interface RegulationDetailProps {
  regulation: Regulation;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  active: '#16a34a',
  proposed: '#ca8a04',
  amended: '#2563eb',
  repealed: '#dc2626',
};

export const RegulationDetail: React.FC<RegulationDetailProps> = ({
  regulation,
  onClose,
}) => {
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <h2 className="detail-title">{regulation.title}</h2>
          <button className="detail-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="detail-badges">
          <span
            className="status-badge"
            style={{ backgroundColor: statusColors[regulation.status] }}
          >
            {regulation.status}
          </span>
          <span className="detail-ref">{regulation.referenceNumber}</span>
        </div>

        <div className="detail-info-grid">
          <div className="detail-info-item">
            <span className="detail-label">Agency</span>
            <span className="detail-value">{regulation.agency}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-label">Category</span>
            <span className="detail-value">{regulation.category}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-label">Jurisdiction</span>
            <span className="detail-value">{regulation.jurisdiction}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-label">Effective Date</span>
            <span className="detail-value">
              {formatDate(regulation.effectiveDate)}
            </span>
          </div>
          <div className="detail-info-item">
            <span className="detail-label">Last Updated</span>
            <span className="detail-value">
              {formatDate(regulation.lastUpdated)}
            </span>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="detail-section-title">Summary</h3>
          <p className="detail-summary">{regulation.summary}</p>
        </div>

        <div className="detail-section">
          <h3 className="detail-section-title">Tags</h3>
          <div className="card-tags">
            {regulation.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
