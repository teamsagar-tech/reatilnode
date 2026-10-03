import React, { useEffect } from 'react';
import { useConfirmStore } from '../../store/useConfirmStore';
import { AlertCircle } from 'lucide-react';

export default function ConfirmDialog() {
  const { isOpen, title, message, onConfirm, onCancel, closeConfirm } = useConfirmStore();

  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation(); // Stop propagation to other handlers like in ItemMaster
      
      if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
        closeConfirm();
      } else if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') {
        e.preventDefault();
        onCancel();
        closeConfirm();
      }
    };

    // Use capture phase to ensure this runs before the page-level event listeners
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isOpen, onConfirm, onCancel, closeConfirm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">{title}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{message}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button 
              onClick={() => { onConfirm(); closeConfirm(); }}
              className="flex-1 bg-amber-500 text-white font-bold py-2.5 rounded-xl hover:bg-amber-600 shadow-md shadow-amber-200 transition-all"
            >
              Yes <span className="opacity-70 text-xs ml-1">(Y)</span>
            </button>
            <button 
              onClick={() => { onCancel(); closeConfirm(); }}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-200 transition-all"
            >
              No <span className="opacity-70 text-xs ml-1">(N)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
