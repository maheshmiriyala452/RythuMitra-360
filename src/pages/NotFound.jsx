import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-4 text-center">
      <div className="farm-card p-5 shadow-lg max-w-500 mx-auto" style={{ maxWidth: '480px' }}>
        <div 
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success mb-4"
          style={{ width: '90px', height: '90px', fontSize: '2.8rem' }}
        >
          <i className="bi bi-compass"></i>
        </div>
        
        <h1 className="display-4 fw-extrabold text-dark font-heading mb-2">404</h1>
        <h4 className="fw-bold text-dark mb-2">Lost in the Fields?</h4>
        <p className="text-muted small mb-4">
          The page or route you are looking for does not exist or may have been harvested. Let us guide you back to familiar pastures.
        </p>

        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
          <Link to="/dashboard" className="btn btn-farm btn-sm px-3 py-2">
            <i className="bi bi-speedometer2 me-1"></i>
            Go to Dashboard
          </Link>
          <Link to="/" className="btn btn-outline-secondary btn-sm px-3 py-2">
            <i className="bi bi-house me-1"></i>
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
