import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';

interface AdditionalChargesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (charges: { freight: number, insurance: number, packing: number }) => void;
  initialCharges?: { freight: number, insurance: number, packing: number };
}

export default function AdditionalChargesModal({ isOpen, onClose, onApply, initialCharges }: AdditionalChargesModalProps) {
  const [freight, setFreight] = useState('0');
  const [insurance, setInsurance] = useState('0');
  const [packing, setPacking] = useState('0');
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFreight(initialCharges?.freight?.toString() || '0');
      setInsurance(initialCharges?.insurance?.toString() || '0');
      setPacking(initialCharges?.packing?.toString() || '0');
      setTimeout(() => {
        firstInputRef.current?.focus();
        firstInputRef.current?.select();
      }, 100);
    }
  }, [isOpen, initialCharges]);

  const handleApply = () => {
    onApply({
      freight: parseFloat(freight) || 0,
      insurance: parseFloat(insurance) || 0,
      packing: parseFloat(packing) || 0
    });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextId?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextId) {
        const next = document.getElementById(nextId) as HTMLInputElement;
        if (next) {
          next.focus();
          next.select();
        }
      } else {
        handleApply();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  const total = (parseFloat(freight) || 0) + (parseFloat(insurance) || 0) + (parseFloat(packing) || 0);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col border border-slate-200 overflow-hidden"
        style={{ animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="bg-[#1f6655] px-4 py-3 flex justify-between items-center shrink-0">
          <h2 className="text-white font-bold tracking-wide flex items-center gap-2">
            <span className="bg-emerald-700 p-1 rounded-sm"><Check size={16} /></span>
            PRE-TAX ADDITIONAL CHARGES
          </h2>
          <button onClick={onClose} className="text-emerald-100 hover:text-white bg-emerald-800/50 hover:bg-emerald-700/50 p-1.5 rounded-md transition-colors border border-emerald-700">
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 bg-slate-50">
          <p className="text-xs text-slate-500 leading-tight mb-2">
            These charges will be apportioned across all invoice items based on their base value, <strong className="text-slate-700">increasing their taxable amount</strong> before GST is calculated.
          </p>

          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-600 w-24 shrink-0">Freight & Fwd:</label>
            <input 
              ref={firstInputRef}
              id="charge-freight"
              type="number"
              value={freight}
              onChange={e => setFreight(e.target.value)}
              onKeyDown={e => handleKeyDown(e, 'charge-insurance')}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-right font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-600 w-24 shrink-0">Insurance:</label>
            <input 
              id="charge-insurance"
              type="number"
              value={insurance}
              onChange={e => setInsurance(e.target.value)}
              onKeyDown={e => handleKeyDown(e, 'charge-packing')}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-right font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-semibold text-slate-600 w-24 shrink-0">Packing/Other:</label>
            <input 
              id="charge-packing"
              type="number"
              value={packing}
              onChange={e => setPacking(e.target.value)}
              onKeyDown={e => handleKeyDown(e)}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-right font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
              placeholder="0.00"
            />
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Charges</span>
            <span className="text-lg font-black text-indigo-700">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded text-sm font-bold hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={handleApply} className="px-6 py-2 bg-emerald-600 text-white rounded text-sm font-bold hover:bg-emerald-700 flex items-center gap-2">
            Apply <span className="opacity-75 font-normal text-xs">(Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
