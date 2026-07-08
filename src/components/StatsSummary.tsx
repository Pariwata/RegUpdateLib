import React from 'react';

interface StatItem {
  label: string;
  value: number;
  color?: string;
}

interface StatsSummaryProps {
  items: StatItem[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ items }) => {
  return (
    <div className="stats-summary">
      {items.map((item) => (
        <div key={item.label} className="stat-box">
          <span
            className="stat-value"
            style={item.color ? { color: item.color } : undefined}
          >
            {item.value}
          </span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
