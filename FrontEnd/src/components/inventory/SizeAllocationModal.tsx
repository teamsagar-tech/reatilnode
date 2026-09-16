import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SizeAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (allocatedSizes: any[], summaryInfo: any) => void;
  itemName: string;
  brandId?: string | number;
}

export default function SizeAllocationModal({ isOpen, onClose, onSave, itemName, brandId }: SizeAllocationModalProps) {
  const [sizeGroups, setSizeGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [rateStep, setRateStep] = useState('0');
  const [baseMrp, setBaseMrp] = useState('');
  const [mrpStep, setMrpStep] = useState('0');
  
  const [matrixData, setMatrixData] = useState<any[]>([]);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Fetch Size Groups
  useEffect(() => {
    if (isOpen) {
      const fetchSizeGroups = async () => {
        try {
          const token = localStorage.getItem('token');
          // If brand is provided, you might want to fetch /api/masters/size-groups/brand/:brandId
          // For now, fetch all for flexibility, or you can implement the Brand linkage logic here
          const response = await fetch('/api/masters/size-groups', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setSizeGroups(data);
          }
        } catch (error) {
          console.error("Error fetching size groups", error);
        }
      };
      fetchSizeGroups();
      
      // Reset state
      setSelectedGroupId('');
      setBaseRate('');
      setRateStep('0');
      setBaseMrp('');
      setMrpStep('0');
      setMatrixData([]);
    }
  }, [isOpen, brandId]);

  const handleGenerateGrid = () => {
    if (!selectedGroupId) {
      alert('Please select a size group first.');
      return;
    }
    
    const group = sizeGroups.find(g => g.id.toString() === selectedGroupId.toString());
    if (!group || !group.sizes) return;

    let sizesArray = [];
    if (typeof group.sizes === 'string') {
        try { sizesArray = JSON.parse(group.sizes); } catch(e) { sizesArray = group.sizes.split(','); }
    } else {
        sizesArray = group.sizes;
    }

    const bRate = parseFloat(baseRate) || 0;
    const rStep = parseFloat(rateStep) || 0;
    const bMrp = parseFloat(baseMrp) || 0;
    const mStep = parseFloat(mrpStep) || 0;

    const newMatrix = sizesArray.map((size: string, index: number) => ({
      size: size.trim(),
      qty: '', // Empty initially
      rate: bRate + (rStep * index),
      mrp: bMrp + (mStep * index),
    }));

    setMatrixData(newMatrix);
    
    // Auto focus the first quantity input after generation
    setTimeout(() => {
      firstInputRef.current?.focus();
    }, 100);
  };

  const handleQtyChange = (index: number, value: string) => {
    const updated = [...matrixData];
    updated[index].qty = value;
    setMatrixData(updated);
  };
  
  const handleRateChange = (index: number, value: string) => {
    const updated = [...matrixData];
    updated[index].rate = parseFloat(value) || 0;
    setMatrixData(updated);
  };
  
  const handleMrpChange = (index: number, value: string) => {
    const updated = [...matrixData];
    updated[index].mrp = parseFloat(value) || 0;
    setMatrixData(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'qty' | 'rate' | 'mrp', index: number) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      // Allow default tab behavior to move horizontally!
      // If we want Enter to also move horizontally:
      if (e.key === 'Enter') {
        e.preventDefault();
        const nextId = `${type}-input-${index + 1}`;
        const nextElement = document.getElementById(nextId);
        if (nextElement) {
          nextElement.focus();
        } else {
          // If at the end of the row, move to next row if desired, or save button
          document.getElementById('save-matrix-btn')?.focus();
        }
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Move vertically between Qty, Rate, MRP rows
      const types = ['qty', 'rate', 'mrp'];
      const currentTypeIdx = types.indexOf(type);
      let nextType = type;
      if (e.key === 'ArrowDown' && currentTypeIdx < 2) nextType = types[currentTypeIdx + 1] as any;
      if (e.key === 'ArrowUp' && currentTypeIdx > 0) nextType = types[currentTypeIdx - 1] as any;
      
      const nextId = `${nextType}-input-${index}`;
      document.getElementById(nextId)?.focus();
    }
  };

  // Global Ctrl+A listener for saving
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        processSave();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  });

  const processSave = () => {
    // Filter out sizes that have no quantity
    const finalAllocations = matrixData.filter(row => row.qty && parseFloat(row.qty) > 0);
    
    if (finalAllocations.length === 0) {
      if (window.confirm('No quantities entered. Close without saving?')) {
        onClose();
      }
      return;
    }

    let totalQty = 0;
    let totalAmount = 0;
    finalAllocations.forEach(row => {
      const q = parseFloat(row.qty) || 0;
      const r = parseFloat(row.rate) || 0;
      totalQty += q;
      totalAmount += (q * r);
    });

    const avgRate = totalQty > 0 ? (totalAmount / totalQty) : 0;

    const summaryInfo = {
      totalQty,
      avgRate,
      totalAmount,
      isMatrixSummary: true
    };

    onSave(finalAllocations, summaryInfo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-6xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center shrink-0">
          <div>
            <h2 className="font-bold text-lg leading-tight">Size Allocation Matrix</h2>
            <div className="text-indigo-200 text-xs">{itemName}</div>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-50 flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Setup Bar */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Size Group</label>
              <select 
                value={selectedGroupId}
                onChange={e => setSelectedGroupId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-800 rounded-md focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              >
                <option value="">-- Select Group --</option>
                {sizeGroups.map(sg => (
                  <option key={sg.id} value={sg.id}>{sg.group_name}</option>
                ))}
              </select>
            </div>
            <div className="w-[100px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Base Rate</label>
              <input type="number" value={baseRate} onChange={e => setBaseRate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-800 rounded-md focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-right" />
            </div>
            <div className="w-[100px]">
              <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Step (+₹)</label>
              <input type="number" value={rateStep} onChange={e => setRateStep(e.target.value)} className="w-full bg-emerald-50 border border-emerald-200 px-2 py-1.5 text-xs font-bold text-emerald-800 rounded-md focus:outline-none focus:border-emerald-400 text-right" />
            </div>
            <div className="w-[100px]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Base MRP</label>
              <input type="number" value={baseMrp} onChange={e => setBaseMrp(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-800 rounded-md focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 text-right" />
            </div>
            <div className="w-[100px]">
              <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Step (+₹)</label>
              <input type="number" value={mrpStep} onChange={e => setMrpStep(e.target.value)} className="w-full bg-emerald-50 border border-emerald-200 px-2 py-1.5 text-xs font-bold text-emerald-800 rounded-md focus:outline-none focus:border-emerald-400 text-right" />
            </div>
            <button 
              onClick={handleGenerateGrid}
              className="bg-slate-800 text-white font-bold text-xs px-4 py-1.5 rounded-md hover:bg-slate-900 transition-colors shadow-sm"
            >
              Generate Grid
            </button>
          </div>

          {/* Matrix Area */}
          {matrixData.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto custom-scrollbar pb-2">
              <table className="w-full border-collapse text-left min-w-max">
                <thead>
                  <tr>
                    <th className="bg-slate-100 border-b border-r border-slate-200 p-2 text-xs font-bold text-slate-700 w-[120px] sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">Details</th>
                    {matrixData.map((col, idx) => (
                      <th key={idx} className="bg-indigo-50 border-b border-r border-slate-200 p-2 text-xs font-black text-indigo-900 text-center min-w-[80px]">
                        Size {col.size}
                      </th>
                    ))}
                    <th className="bg-slate-100 border-b border-slate-200 p-2 text-xs font-bold text-slate-700 text-right min-w-[100px]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Quantity Row */}
                  <tr>
                    <td className="bg-white border-b border-r border-slate-200 p-2 text-xs font-bold text-slate-800 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      Quantity
                    </td>
                    {matrixData.map((col, idx) => (
                      <td key={idx} className="bg-white border-b border-r border-slate-200 p-1">
                        <input 
                          id={`qty-input-${idx}`}
                          ref={idx === 0 ? firstInputRef : null}
                          type="number"
                          value={col.qty}
                          onChange={e => handleQtyChange(idx, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, 'qty', idx)}
                          className="w-full text-center bg-slate-50 border border-slate-300 rounded focus:bg-[#ffffe0] focus:border-indigo-500 focus:outline-none text-xs font-bold py-1"
                        />
                      </td>
                    ))}
                    <td className="bg-slate-50 border-b border-slate-200 p-2 text-xs font-black text-slate-800 text-right">
                      {matrixData.reduce((acc, curr) => acc + (parseFloat(curr.qty) || 0), 0)}
                    </td>
                  </tr>

                  {/* Purchase Rate Row */}
                  <tr>
                    <td className="bg-white border-b border-r border-slate-200 p-2 text-xs font-bold text-slate-600 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      Pur. Rate
                    </td>
                    {matrixData.map((col, idx) => (
                      <td key={idx} className="bg-white border-b border-r border-slate-200 p-1">
                        <input 
                          id={`rate-input-${idx}`}
                          type="number"
                          value={col.rate}
                          onChange={e => handleRateChange(idx, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, 'rate', idx)}
                          className="w-full text-center border-none focus:bg-[#ffffe0] focus:outline-none text-[11px] font-semibold text-slate-700 py-1"
                        />
                      </td>
                    ))}
                    <td className="bg-slate-50 border-b border-slate-200 p-2 text-xs font-medium text-slate-600 text-right">
                      -
                    </td>
                  </tr>

                  {/* MRP Row */}
                  <tr>
                    <td className="bg-white border-b border-r border-slate-200 p-2 text-xs font-bold text-slate-600 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      MRP
                    </td>
                    {matrixData.map((col, idx) => (
                      <td key={idx} className="bg-white border-b border-r border-slate-200 p-1">
                        <input 
                          id={`mrp-input-${idx}`}
                          type="number"
                          value={col.mrp}
                          onChange={e => handleMrpChange(idx, e.target.value)}
                          onKeyDown={e => handleKeyDown(e, 'mrp', idx)}
                          className="w-full text-center border-none focus:bg-[#ffffe0] focus:outline-none text-[11px] font-semibold text-slate-700 py-1"
                        />
                      </td>
                    ))}
                    <td className="bg-slate-50 border-b border-slate-200 p-2 text-xs font-medium text-slate-600 text-right">
                      -
                    </td>
                  </tr>
                  
                  {/* Amount Row (Calculated) */}
                  <tr>
                    <td className="bg-slate-50 border-r border-slate-200 p-2 text-[11px] font-bold text-slate-500 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      Amount
                    </td>
                    {matrixData.map((col, idx) => (
                      <td key={idx} className="bg-slate-50 border-r border-slate-200 p-2 text-[11px] font-bold text-indigo-700 text-center">
                        {((parseFloat(col.qty) || 0) * (parseFloat(col.rate) || 0)).toFixed(2)}
                      </td>
                    ))}
                    <td className="bg-indigo-50 p-2 text-xs font-black text-indigo-900 text-right">
                      ₹{matrixData.reduce((acc, curr) => acc + ((parseFloat(curr.qty) || 0) * (parseFloat(curr.rate) || 0)), 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mr-1">TAB</kbd> to move right, <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mr-1">↓↑</kbd> to move vertical
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-50">Cancel</button>
            <button 
              id="save-matrix-btn"
              onClick={processSave}
              className="px-6 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700 shadow-md flex items-center gap-2"
            >
              Save Matrix <span className="opacity-75 font-normal">(Ctrl+A)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
