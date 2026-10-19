import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  count = 1
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="modal-container delete-modal-container glass-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-modal-icon-wrap">
          <AlertTriangle size={32} className="delete-alert-icon" />
        </div>

        <h3 className="delete-modal-title">
          {count > 1 ? `Delete ${count} Users?` : `Delete User Account?`}
        </h3>

        <p className="delete-modal-text">
          {count > 1 ? (
            <>Are you sure you want to permanently delete these <strong>{count} selected users</strong>? This will revoke all their workspace authorizations and cannot be undone.</>
          ) : (
            <>Are you sure you want to permanently delete <strong>{userName}</strong>? This action will immediately terminate active sessions and remove directory credentials.</>
          )}
        </p>

        <div className="delete-modal-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            id="confirm-delete-btn"
            type="button" 
            className="btn-danger" 
            onClick={onConfirm}
          >
            Yes, Permanently Delete
          </button>
        </div>
      </div>
    </div>
  );
}
