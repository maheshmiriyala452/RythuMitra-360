import React from 'react';

/**
 * AlertMessage — Toast or inline status message
 */
const AlertMessage = ({
  type = 'success', // success, danger, warning, info
  message,
  onClose,
  dismissible = true
}) => {
  if (!message) return null;

  const iconMap = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill'
  };

  const alertClassMap = {
    success: 'alert-success border-success-subtle text-success-emphasis',
    danger: 'alert-danger border-danger-subtle text-danger-emphasis',
    warning: 'alert-warning border-warning-subtle text-warning-emphasis',
    info: 'alert-info border-info-subtle text-info-emphasis'
  };

  return (
    <div 
      className={`alert ${alertClassMap[type] || alertClassMap.info} ${dismissible ? 'alert-dismissible' : ''} fade show d-flex align-items-center shadow-sm mb-3`} 
      role="alert"
      style={{ borderRadius: '10px' }}
    >
      <i className={`bi ${iconMap[type] || iconMap.info} fs-5 me-2`}></i>
      <div className="flex-grow-1 small fw-medium">
        {message}
      </div>
      {dismissible && onClose && (
        <button 
          type="button" 
          className="btn-close" 
          aria-label="Close" 
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;
