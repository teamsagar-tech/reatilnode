import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Yes, Continue',
  cancelText = 'No, Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmModalProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelBtnRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape' || e.key.toLowerCase() === 'n') {
        e.preventDefault();
        e.stopPropagation();
        onCancel();
      } else if (e.key.toLowerCase() === 'y') {
        e.preventDefault();
        e.stopPropagation();
        onConfirm();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        // If they specifically tabbed to Cancel and hit Enter, we should Cancel
        if (document.activeElement === cancelBtnRef.current) {
          onCancel();
        } else {
          onConfirm();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  if (!isOpen) return null;

  const colors = {
    danger: {
      bg: 'bg-red-50',
      icon: 'text-red-500',
      btn: 'bg-red-600 hover:bg-red-700',
      border: 'border-red-200'
    },
    warning: {
      bg: 'bg-amber-50',
      icon: 'text-amber-500',
      btn: 'bg-amber-600 hover:bg-amber-700',
      border: 'border-amber-200'
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'text-blue-500',
      btn: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-200'
    }
  }[type];

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className={`${colors.bg} p-4 flex items-start gap-3 border-b ${colors.border}`}>
          <div className="mt-1">
            <AlertTriangle className={`w-6 h-6 ${colors.icon}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-black text-slate-800">{title}</h3>
            <p className="text-sm text-slate-600 mt-1 leading-snug font-medium">{message}</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 bg-slate-50 flex justify-end gap-3">
          <button
            ref={cancelBtnRef}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-bold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 ${colors.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
