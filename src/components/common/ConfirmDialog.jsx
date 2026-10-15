import React from 'react';
import Modal from './Modal';

/**
 * ConfirmDialog — Deletion or destructive action confirmation modal
 */
const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to delete this record? This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger',
  isLoading = false
}) => {
  const footer = (
    <div className="d-flex justify-content-end gap-2 w-100">
      <button 
        type="button" 
        className="btn btn-light btn-sm px-3" 
        onClick={onClose}
        disabled={isLoading}
      >
        Cancel
      </button>
      <button 
        type="button" 
        className={`btn btn-${confirmVariant} btn-sm px-3 d-flex align-items-center gap-1`} 
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading && <span className="spinner-border spinner-border-sm me-1" role="status"></span>}
        <i className="bi bi-trash3 me-1"></i>
        {confirmText}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
    >
      <div className="d-flex align-items-start gap-3">
        <div className="text-danger fs-3">
          <i className="bi bi-exclamation-triangle-fill"></i>
        </div>
        <div>
          <p className="text-secondary small mb-0">
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
