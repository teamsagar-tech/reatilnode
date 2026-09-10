import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import SearchableDropdown from '../SearchableDropdown';
import MasterCreationModal from './MasterCreationModal';

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
  const [showMasterModal, setShowMasterModal] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchSizeGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSizeGroups(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch size sets', err);
    }
  };

  // Fetch Size Groups
  useEffect(() => {
    if (isOpen) {
      fetchSizeGroups();
      
      // Reset state
      setSelectedGroupId('');
      setSearchText('');
      setBaseRate('');
      setRateStep('0');
      setBaseMrp('');
      setMrpStep('0');
      setMatrixData([]);
    }
  }, [isOpen, brandId]);

  const handleGenerateGrid = () => {
    if (!selectedGroupId) {
      if (searchText.trim() !== '') {
        setShowMasterModal(true);
      } else {
        alert('Please select a size set first.');
      }
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
      isMatrixSummary: true,
      sizeDisplay: searchText
    };

    onSave(finalAllocations, summaryInfo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-slate-200 relative">
        
        {/* Header */}
        <div className="bg-[#1b5e58] rounded-t-xl flex justify-between items-center p-3 text-white shrink-0">
          <div>
            <h2 className="text-[13px] font-black uppercase tracking-wider">Size Allocation Matrix</h2>
            <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">{itemName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-emerald-200 transition-colors p-1 rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setup Bar (Moved outside scroll area so dropdown isn't clipped) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 z-[70] relative">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] relative z-[60]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Size Set</label>
              <div className="w-[300px]">
                <SearchableDropdown 
                  value={searchText}
                  onChange={(val) => {
                    setSearchText(val);
                    const group = sizeGroups.find(g => (g.name || '').toLowerCase() === val.toLowerCase());
                    setSelectedGroupId(group ? group.id : '');
                  }}
                  onSelect={(opt) => {
                    setSearchText(opt.name);
                    setSelectedGroupId(opt.id);
                  }}
                  options={sizeGroups}
                  displayKey="name"
                  placeholder="Select Group or Alt+C to create"
                  className="w-full bg-white border border-[#a3c3be] px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                  width="100%"
                  renderOption={(opt, isSelected) => {
                    let sizesStr = '';
                    if (opt.sizes_list) {
                      try {
                        const arr = typeof opt.sizes_list === 'string' ? JSON.parse(opt.sizes_list) : opt.sizes_list;
                        sizesStr = Array.isArray(arr) ? arr.join(', ') : '';
                      } catch(e) {}
                    }
                    return (
                      <div className="flex justify-between items-center w-full gap-2">
                        <span className="font-bold text-slate-800 whitespace-nowrap">{opt.name}</span>
                        <span className="text-slate-500 text-[10px] truncate">{sizesStr}</span>
                      </div>
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
                      e.preventDefault();
                      setShowMasterModal(true);
                    }
                  }}
                  onNotFound={() => setShowMasterModal(true)}
                  width="w-[300px]"
                />
              </div>
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

          </div>


        {/* Matrix Area (Scrollable) */}
        <div className="p-4 bg-slate-50 flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar relative z-[10]">
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
        <div className="bg-white rounded-b-xl border-t border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
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

      <MasterCreationModal 
        isOpen={showMasterModal}
        onClose={() => setShowMasterModal(false)}
        masterType="sizeset"
        initialValue={searchText}
        onSave={async (type, data) => {
          await fetchSizeGroups();
          // After fetching, try to auto-select the newly created set by name
          setTimeout(() => {
            setSizeGroups(prev => {
              const newGroup = prev.find(g => g.name === data.name || g.name === data.groupName || g.name === data.group_name);
              if (newGroup) {
                setSelectedGroupId(newGroup.id);
                setSearchText(newGroup.name);
              }
              return prev;
            });
          }, 500);
          setShowMasterModal(false);
        }}
      />
    </div>
  );
}
