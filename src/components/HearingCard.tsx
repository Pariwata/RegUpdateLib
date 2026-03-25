import React from 'react';
import { HearingItem } from '../types/regulation';
import { getDaysRemaining } from '../hooks/useHearings';

interface HearingCardProps {
  hearing: HearingItem;
}

const hearingStatusColors: Record<string, string> = {
  'เปิดรับฟัง': '#16a34a',
  'ปิดรับฟัง': '#f59e0b',
  'สรุปผล': '#64748b',
};

export const HearingCard: React.FC<HearingCardProps> = ({ hearing }) => {
  const daysRemaining = getDaysRemaining(hearing.hearingEndDate);
  const isOpen = hearing.status === 'เปิดรับฟัง';

  return (
    <div className="hearing-card">
      <div className="card-header">
        <span
          className="status-badge"
          style={{ backgroundColor: hearingStatusColors[hearing.status] }}
        >
          {hearing.status}
        </span>
        {isOpen && daysRemaining > 0 && (
          <span className={`days-remaining ${daysRemaining <= 14 ? 'urgent' : ''}`}>
            เหลือ {daysRemaining} วัน
          </span>
        )}
      </div>
      <h3 className="card-title">{hearing.title}</h3>
      <div className="card-meta">
        <span className="card-agency">{hearing.agency}</span>
        <span className="card-separator">|</span>
        <span>{hearing.category}</span>
      </div>
      <div className="hearing-period">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="period-icon">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span>
          {formatDate(hearing.hearingStartDate)} - {formatDate(hearing.hearingEndDate)}
        </span>
      </div>
      <p className="card-summary">{hearing.summary}</p>
      {isOpen && (
        <div className="hearing-action">
          <a
            href={hearing.participationUrl}
            className="hearing-link"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            ส่งความคิดเห็น
          </a>
        </div>
      )}
    </div>
  );
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
