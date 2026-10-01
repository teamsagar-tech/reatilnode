import React, { useEffect } from 'react';
import { useConfirmStore } from '../../store/useConfirmStore';

export default function ConfirmDialog() {
  const { isOpen, message, title, confirmText, cancelText, confirm, cancel } = useConfirmStore();

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if they are typing in an input inside some other modal that might have higher z-index (though this is global confirm)
      // But actually, this is global.
      if (e.key.toLowerCase() === 'y' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        confirm();
      } else if (e.key.toLowerCase() === 'n' || e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancel();
      }
    };
    
    // Use capture phase to ensure it runs before other handlers
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen, confirm, cancel]);

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
            {cancelText} (N)
          </button>
          <button
            onClick={confirm}
            className="px-4 py-1.5 bg-[#1b5e58] border border-black text-white hover:bg-[#12423d] font-bold text-[12px] shadow-[2px_2px_0_rgba(0,0,0,1)]"
          >
            {confirmText} (Y)
          </button>
        </div>
      </div>
    </div>
  );
}
