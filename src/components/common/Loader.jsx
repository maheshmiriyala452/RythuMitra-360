import React from 'react';

/**
 * Loader — Farm themed spinner and loading indicator
 */
const Loader = ({ text = 'Loading agricultural data...', fullPage = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
      <div 
        className="spinner-border text-success mb-3" 
        role="status" 
        style={{ width: '3rem', height: '3rem', borderWidth: '0.28em' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted fw-semibold mb-0 small">{text}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div 
        className="d-flex align-items-center justify-content-center position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 2000, backdropFilter: 'blur(3px)' }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
