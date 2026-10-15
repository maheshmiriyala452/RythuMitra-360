import React from 'react';

/**
 * EmptyState — User-friendly empty dataset indicator
 */
const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No records found',
  description = 'There is currently no data available in this section.',
  actionText,
  onAction
}) => {
  return (
    <div className="farm-card p-5 text-center my-3">
      <div 
        className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3 text-success shadow-sm"
        style={{ width: '70px', height: '70px', fontSize: '2rem' }}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <h5 className="fw-bold text-dark mb-2">{title}</h5>
      <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '420px' }}>
        {description}
      </p>
      {actionText && onAction && (
        <button 
          type="button" 
          className="btn btn-farm btn-sm px-3"
          onClick={onAction}
        >
          <i className="bi bi-plus-circle me-1"></i>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
