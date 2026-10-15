import React, { useEffect } from 'react';

/**
 * Modal — Accessible dialog window
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md' // sm, md, lg, xl
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        role="dialog"
        aria-modal="true"
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', zIndex: 1060 }}
      >
        <div className={`modal-dialog modal-dialog-centered modal-${size}`} role="document">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
            <div className="modal-header border-bottom px-4 py-3 bg-light" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <h5 className="modal-title fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                {title}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            
            <div className="modal-body p-4">
              {children}
            </div>

            {footer && (
              <div className="modal-footer border-top px-4 py-3 bg-light" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
