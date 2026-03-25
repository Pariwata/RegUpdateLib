import React from 'react';
import { Regulation } from '../types/regulation';

interface RegulationDetailProps {
  regulation: Regulation;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  'บังคับใช้': '#16a34a',
  'เสนอร่าง': '#ca8a04',
  'แก้ไข': '#2563eb',
  'ยกเลิก': '#dc2626',
  'รับฟังความคิดเห็น': '#9333ea',
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
          <button className="detail-close" onClick={onClose} aria-label="ปิด">
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
            <span className="detail-label">หน่วยงาน</span>
            <span className="detail-value">{regulation.agency}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-label">หมวดหมู่</span>
            <span className="detail-value">{regulation.category}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-label">ขอบเขต</span>
            <span className="detail-value">{regulation.scope}</span>
          </div>
          <div className="detail-info-item">
            <span className="detail-label">วันที่มีผลบังคับ</span>
            <span className="detail-value">
              {formatDate(regulation.effectiveDate)}
            </span>
          </div>
          <div className="detail-info-item">
            <span className="detail-label">อัปเดตล่าสุด</span>
            <span className="detail-value">
              {formatDate(regulation.lastUpdated)}
            </span>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="detail-section-title">สรุป</h3>
          <p className="detail-summary">{regulation.summary}</p>
        </div>

        <div className="detail-section">
          <h3 className="detail-section-title">แท็ก</h3>
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
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
