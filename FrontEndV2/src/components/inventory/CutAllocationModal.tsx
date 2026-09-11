import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface CutAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (allocatedCuts: any[]) => void;
  categoryName: string;
  initialCuts?: any[]; 
}

export default function CutAllocationModal({ isOpen, onClose, onSave, categoryName, initialCuts = [] }: CutAllocationModalProps) {
  const [cuts, setCuts] = useState<any[]>([]);
  const [selectedCuts, setSelectedCuts] = useState<Set<number>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchCuts();
      const initialIds = initialCuts.map(c => c.id);
      setSelectedCuts(new Set(initialIds));
      setActiveIndex(0);
    }
  }, [isOpen]);

  const fetchCuts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/cut`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCuts(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => Math.min(prev + 1, cuts.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (cuts[activeIndex]) {
          const cutId = cuts[activeIndex].id;
          setSelectedCuts(prev => {
            const next = new Set(prev);
            if (next.has(cutId)) next.delete(cutId);
            else next.add(cutId);
            return next;
          });
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const finalCuts = cuts.filter(c => selectedCuts.has(c.id));
        onSave(finalCuts);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, cuts, activeIndex, selectedCuts, onSave, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-[#fcfaf2] rounded shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col border-2 border-[#81a09d] relative">
        {/* Header */}
        <div className="bg-[#1b5e58] flex justify-between items-center p-2 text-white shrink-0">
          <div>
            <h2 className="text-[12px] font-bold uppercase tracking-wider">Map Cuts</h2>
            <p className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider">{categoryName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-200 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 flex-1 overflow-y-auto">
           <table className="w-full text-left border-collapse border border-slate-400">
              <thead className="bg-[#eef5ed] sticky top-0">
                <tr className="border-b-2 border-slate-400 text-slate-900 font-bold text-[11px]">
                  <th className="px-2 py-1 border-r border-slate-300 w-10 text-center">✓</th>
                  <th className="px-2 py-1 border-r border-slate-300">Cut Name</th>
                  <th className="px-2 py-1">Cut Size</th>
                </tr>
              </thead>
              <tbody>
                {cuts.map((cut, idx) => {
                  const isSelected = selectedCuts.has(cut.id);
                  const isActive = idx === activeIndex;
                  return (
                    <tr key={cut.id} 
                      onClick={() => {
                        setSelectedCuts(prev => {
                          const next = new Set(prev);
                          if (next.has(cut.id)) next.delete(cut.id);
                          else next.add(cut.id);
                          return next;
                        });
                        setActiveIndex(idx);
                      }}
                      className={`text-[11px] border-b border-slate-300 cursor-pointer ${isActive ? 'bg-[#ffe000]' : (isSelected ? 'bg-emerald-50' : 'bg-white')}`}
                    >
                      <td className="px-2 py-1 border-r border-slate-300 text-center text-slate-800">
                        {isSelected && <Check className="w-3 h-3 mx-auto text-emerald-700 font-bold" />}
                      </td>
                      <td className="px-2 py-1 border-r border-slate-300 font-bold text-slate-800">{cut.cut_name}</td>
                      <td className="px-2 py-1 text-slate-700 font-medium">{cut.cut_size}</td>
                    </tr>
                  )
                })}
                {cuts.length === 0 && (
                   <tr><td colSpan={3} className="px-2 py-4 text-center text-slate-500 text-[11px]">No cuts available</td></tr>
                )}
              </tbody>
           </table>
        </div>

        <div className="bg-[#eef5ed] p-2 border-t border-slate-400 flex justify-between text-[11px] text-slate-700 font-bold">
           <span>Navigate: ↑ ↓</span>
           <span>Select: Space</span>
           <span>Save: Ctrl+A</span>
           <span>Close: Esc</span>
        </div>
      </div>
    </div>
  );
}
