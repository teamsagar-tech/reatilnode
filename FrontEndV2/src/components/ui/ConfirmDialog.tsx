import React from 'react';
import { useConfirmStore } from '../../store/useConfirmStore';

export default function ConfirmDialog() {
  const { isOpen, message, title, confirmText, cancelText, confirm, cancel } = useConfirmStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-sm border-2 border-slate-400 overflow-hidden">
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-2 font-bold text-slate-800 text-[13px]">
          {title || 'Confirm'}
        </div>
        <div className="p-4 text-slate-700 text-[13px] font-medium leading-relaxed">
          {message}
        </div>
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex justify-end gap-3">
          <button
            onClick={cancel}
            className="px-4 py-1.5 bg-white border border-slate-400 text-slate-700 hover:bg-slate-100 font-bold text-[12px] shadow-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={confirm}
            className="px-4 py-1.5 bg-[#1b5e58] border border-black text-white hover:bg-[#12423d] font-bold text-[12px] shadow-[2px_2px_0_rgba(0,0,0,1)]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
