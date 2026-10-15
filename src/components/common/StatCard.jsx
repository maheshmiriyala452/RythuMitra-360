import React from 'react';

/**
 * StatCard — Metric Card for Dashboards
 */
const StatCard = ({
  title,
  value,
  icon = 'bi-bar-chart',
  colorClass = 'green',
  subtitle,
  trend,
  trendType = 'up',
  onClick
}) => {
  const bgClassMap = {
    green: 'icon-bg-green',
    blue: 'icon-bg-blue',
    amber: 'icon-bg-amber',
    purple: 'icon-bg-purple'
  };

  const trendColorMap = {
    up: 'text-success',
    down: 'text-danger',
    neutral: 'text-muted'
  };

  return (
    <div 
      className={`farm-card p-3 p-md-4 h-100 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="text-muted small fw-semibold text-uppercase tracking-wider">
          {title}
        </span>
        <div className={`stat-card-icon ${bgClassMap[colorClass] || 'icon-bg-green'}`}>
          <i className={`bi ${icon}`}></i>
        </div>
      </div>

      <div className="d-flex align-items-baseline gap-2 mb-1">
        <h3 className="mb-0 fw-bold">{value}</h3>
      </div>

      {(subtitle || trend) && (
        <div className="d-flex align-items-center gap-1 small text-muted mt-2">
          {trend && (
            <span className={`fw-semibold ${trendColorMap[trendType] || 'text-success'}`}>
              <i className={`bi bi-arrow-${trendType === 'down' ? 'down' : 'up'}-right me-1`}></i>
              {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
