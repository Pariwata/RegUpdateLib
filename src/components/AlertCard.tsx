import React from 'react';
import { RegulationAlert } from '../types/regulation';

interface AlertCardProps {
  alert: RegulationAlert;
  onMarkAsRead: (id: string) => void;
}

const impactColors: Record<string, string> = {
  'สูง': '#dc2626',
  'กลาง': '#f59e0b',
  'ต่ำ': '#16a34a',
};

const changeTypeColors: Record<string, string> = {
  'ใหม่': '#9333ea',
  'แก้ไข': '#2563eb',
  'ยกเลิก': '#dc2626',
  'ปรับปรุง': '#0ea5e9',
};

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onMarkAsRead,
}) => {
  return (
    <div
      className={`alert-card ${!alert.isRead ? 'alert-unread' : ''}`}
      onClick={() => !alert.isRead && onMarkAsRead(alert.id)}
    >
      <div className="card-header">
        <div className="alert-badges">
          <span
            className="status-badge"
            style={{ backgroundColor: impactColors[alert.impactLevel] }}
          >
            ผลกระทบ{alert.impactLevel}
          </span>
          <span
            className="status-badge change-type-badge"
            style={{ backgroundColor: changeTypeColors[alert.changeType] }}
          >
            {alert.changeType}
          </span>
        </div>
        {!alert.isRead && <span className="unread-dot" />}
      </div>
      <h3 className="card-title">{alert.title}</h3>
      <div className="card-meta">
        <span className="card-agency">{alert.agency}</span>
        <span className="card-separator">|</span>
        <span>{alert.referenceNumber}</span>
      </div>
      <p className="card-summary">{alert.summary}</p>
      <div className="card-footer">
        <div className="card-dates">
          <span>วันที่เปลี่ยนแปลง: {formatDate(alert.changeDate)}</span>
        </div>
      </div>
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
