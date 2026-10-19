import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertCircle size={18} className="toast-icon-error" />;
      case 'info':
        return <Info size={18} className="toast-icon-info" />;
      case 'success':
      default:
        return <CheckCircle2 size={18} className="toast-icon-success" />;
    }
  };

  return (
    <div className={`toast-notification glass-panel toast-${toast.type || 'success'} animate-fade-in`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button 
        className="toast-close-btn" 
        onClick={onClose}
        aria-label="Dismiss toast"
      >
        <X size={15} />
      </button>
    </div>
  );
}
