import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold text-dark">RythuMitra 360</span>
          <span>&mdash;</span>
          <span>Smart Agriculture Management Platform</span>
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 small">
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
            API Live (Port 5001)
          </span>
          <span className="small text-muted">
            Major Project • <strong>Codegnan IT Solutions</strong>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
