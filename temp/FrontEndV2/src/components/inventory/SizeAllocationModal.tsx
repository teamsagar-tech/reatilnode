import { confirmDialog } from '../../store/useConfirmStore';
import { toast } from '../../store/useToastStore';
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
  initialSizeSet?: string;
  expectedTotalQty?: number | null;
  initialMatrixData?: any[];
}

export default function SizeAllocationModal({ isOpen, onClose, onSave, itemName, brandId, initialSizeSet, expectedTotalQty, initialMatrixData }: SizeAllocationModalProps) {
  const [sizeGroups, setSizeGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [rateStep, setRateStep] = useState('');
  const [baseMrp, setBaseMrp] = useState('');
  const [mrpStep, setMrpStep] = useState('');
  
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
        const arr = Array.isArray(data) ? data : [];
        setSizeGroups(arr);
        
        if (initialSizeSet) {
          const match = arr.find((g: any) => g.name && g.name.toLowerCase() === initialSizeSet.toLowerCase());
          if (match) {
            setSelectedGroupId(match.id.toString());
            setSearchText(match.name);
            setTimeout(() => {
              if (initialMatrixData && initialMatrixData.length > 0) {
                 document.getElementById('base-rate-input')?.focus();
              } else {
                 generateGrid(match, '', '', '', '', 'base-rate');
              }
            }, 100);
          } else {
            setSearchText(initialSizeSet);
            setSelectedGroupId('');
            setTimeout(() => {
              if (initialMatrixData && initialMatrixData.length > 0) {
                 document.getElementById('base-rate-input')?.focus();
              } else {
                 generateGrid({ name: initialSizeSet }, '', '', '', '', 'base-rate');
              }
            }, 100);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch size sets', err);
    }
  };

  // Fetch Size Groups
  useEffect(() => {
    if (isOpen) {
      // Reset state
      setSelectedGroupId('');
      setSearchText('');
      if (initialMatrixData && initialMatrixData.length > 0) { 
        setMatrixData(initialMatrixData);
        setBaseRate(initialMatrixData[0].rate || '');
        setBaseMrp(initialMatrixData[0].mrp || '');
        if (initialMatrixData.length > 1) {
          const r0 = parseFloat(initialMatrixData[0].rate) || 0;
          const r1 = parseFloat(initialMatrixData[1].rate) || 0;
          setRateStep(r1 - r0 !== 0 ? (r1 - r0).toString() : '');
          const m0 = parseFloat(initialMatrixData[0].mrp) || 0;
          const m1 = parseFloat(initialMatrixData[1].mrp) || 0;
          setMrpStep(m1 - m0 !== 0 ? (m1 - m0).toString() : '');
        } else {
          setRateStep('');
          setMrpStep('');
        }
      } else { 
        setMatrixData([]); 
        setBaseRate('');
        setRateStep('');
        setBaseMrp('');
        setMrpStep('');
      }

      fetchSizeGroups();
      
      setTimeout(() => {
        document.getElementById('base-rate-input')?.focus();
      }, 200);
    }
  }, [isOpen, brandId, initialSizeSet]);

  const generateGrid = async (group: any, bRate = baseRate, rStep = rateStep, bMrp = baseMrp, mStep = mrpStep, focusTarget: 'none' | 'base-rate' | 'first-qty' = 'none') => {
    let sizesArray: any[] = [];
    const sizesData = group.sizes_list || group.sizes || [];
    
    if (typeof sizesData === 'string') {
        try { sizesArray = JSON.parse(sizesData); } catch(e) { sizesArray = sizesData.split(','); }
    } else {
        sizesArray = sizesData;
    }

    if (!sizesArray || sizesArray.length === 0) {
      const groupName = group.name || group.groupName || group.group_name || '';
      if (groupName.includes('-')) {
        const parts = groupName.split('-');
        if (parts.length === 2) {
          const start = parseInt(parts[0], 10);
          const end = parseInt(parts[1], 10);
          if (!isNaN(start) && !isNaN(end) && start < end) {
            let step = (end - start) % 2 === 0 ? 2 : 1;
            sizesArray = [];
            for (let i = start; i <= end; i += step) {
              sizesArray.push(i.toString());
            }
          }
        }
      }
    }

    const baseR = parseFloat(bRate) || 0;
    const rateS = parseFloat(rStep) || 0;
    const baseM = parseFloat(bMrp) || 0;
    const mrpS = parseFloat(mStep) || 0;

    setMatrixData(prev => {
      // Check if we already have non-empty quantities in this size set
      const hasAnyExistingQty = sizesArray.some(s => {
        const existing = prev?.find(m => m.size === s.trim());
        return existing && existing.qty && parseFloat(existing.qty) > 0;
      });

      let baseQty = 0;
      let remainderQty = 0;
      
      if (!hasAnyExistingQty && expectedTotalQty && expectedTotalQty > 0 && sizesArray.length > 0) {
        baseQty = Math.floor(expectedTotalQty / sizesArray.length);
        remainderQty = expectedTotalQty % sizesArray.length;
      }

      return sizesArray.map((size: string, index: number) => {
        const existing = prev?.find(m => m.size === size.trim());
        let assignedQty = existing ? existing.qty : '';
        
        if (!hasAnyExistingQty && expectedTotalQty && expectedTotalQty > 0) {
           const qtyForThisSize = baseQty + (index < remainderQty ? 1 : 0);
           if (qtyForThisSize > 0) {
               assignedQty = qtyForThisSize.toString();
           }
        }
        
        return {
          size: size.trim(),
          qty: assignedQty,
          rate: baseR + (rateS * index),
          mrp: baseM + (mrpS * index),
        };
      });
    });
    
    if (focusTarget !== 'none') {
      setTimeout(() => {
        if (focusTarget === 'base-rate') {
          document.getElementById('base-rate-input')?.focus();
        } else if (focusTarget === 'first-qty') {
          firstInputRef.current?.focus();
        }
      }, 100);
    }
  };

  
  const handleQtyChange = async (index: number, value: string) => {
    const updated = [...matrixData];
    updated[index].qty = value;
    setMatrixData(updated);
  };
  
  
  const handleBaseRateChange = async (value: string) => {
    setBaseRate(value);
    const stepVal = parseFloat(rateStep) || 0;
    const currentBase = parseFloat(value) || 0;
    if (value === '') return;
    setMatrixData(prev => {
      const newData = [...prev];
      for (let i = 0; i < newData.length; i++) {
         newData[i].rate = (currentBase + (stepVal * i)).toFixed(2);
      }
      return newData;
    });
  };

  const handleBaseMrpChange = async (value: string) => {
    setBaseMrp(value);
    const stepVal = parseFloat(mrpStep) || 0;
    const currentBase = parseFloat(value) || 0;
    if (value === '') return;
    setMatrixData(prev => {
      const newData = [...prev];
      for (let i = 0; i < newData.length; i++) {
         newData[i].mrp = (currentBase + (stepVal * i)).toString();
      }
      return newData;
    });
  };

  const handleRateStepChange = async (value: string) => {
    setRateStep(value);
    const stepVal = parseFloat(value) || 0;
    const currentBase = parseFloat(baseRate) || 0;
    if (baseRate === '') return;
    setMatrixData(prev => {
      const newData = [...prev];
      for (let i = 0; i < newData.length; i++) {
         newData[i].rate = (currentBase + (stepVal * i)).toFixed(2);
      }
      return newData;
    });
  };

  const handleMrpStepChange = async (value: string) => {
    setMrpStep(value);
    const stepVal = parseFloat(value) || 0;
    const currentBase = parseFloat(baseMrp) || 0;
    if (baseMrp === '') return;
    setMatrixData(prev => {
      const newData = [...prev];
      for (let i = 0; i < newData.length; i++) {
         newData[i].mrp = (currentBase + (stepVal * i)).toString();
      }
      return newData;
    });
  };

const handleRateChange = async (index: number, value: string) => {
    const updated = [...matrixData];
    updated[index].rate = parseFloat(value) || 0;
    setMatrixData(updated);
  };
  
  const handleMrpChange = async (index: number, value: string) => {
    const updated = [...matrixData];
    updated[index].mrp = parseFloat(value) || 0;
    setMatrixData(updated);
  };

  const handleKeyDown = async (e: React.KeyboardEvent, type: 'qty' | 'rate' | 'mrp', index: number) => {
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
    const handleGlobalKey = async (e: KeyboardEvent) => {
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

  const processSave = async () => {
    // Filter out sizes that have no quantity
    const finalAllocations = matrixData.filter(row => row.qty && parseFloat(row.qty) > 0);
    
    if (finalAllocations.length === 0) {
      if (await confirmDialog('No quantities entered. Close without saving?')) {
        onClose();
      }
      return;
    }

    let totalQty = 0;
    let totalAmount = 0;
    let totalMrpAmount = 0;
    finalAllocations.forEach(row => {
      const q = parseFloat(row.qty) || 0;
      const r = parseFloat(row.rate) || 0;
      const m = parseFloat(row.mrp) || 0;
      totalQty += q;
      totalAmount += (q * r);
      totalMrpAmount += (q * m);
    });

    if (expectedTotalQty && totalQty !== expectedTotalQty) {
      toast.error(`Validation Error: The total quantity in the matrix (${totalQty}) does not match the quantity entered in the main row (${expectedTotalQty}). Please correct it.`);
      return;
    }

    const avgRate = totalQty > 0 ? (totalAmount / totalQty).toFixed(2) : 0;
    const avgMrp = totalQty > 0 ? (totalMrpAmount / totalQty).toFixed(2) : 0;

    const summaryInfo = {
      totalQty,
      avgRate,
      avgMrp,
      totalAmount,
      isMatrixSummary: true,
      sizeDisplay: searchText,
      size_group_id: selectedGroupId
    };

    onSave(finalAllocations, summaryInfo);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-fit max-w-[95vw] max-h-[90vh] flex flex-col border border-slate-200 relative mx-auto">
        
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
                    setTimeout(() => generateGrid(opt, baseRate, rateStep, baseMrp, mrpStep, 'base-rate'), 0);
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
            
          </div>

          </div>


        {/* Matrix Area (Scrollable) */}
        <div className="p-4 bg-slate-50 flex flex-col gap-4 overflow-y-auto flex-1 custom-scrollbar relative z-[10]">
          {matrixData.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto custom-scrollbar pb-2">
              <table className="w-max border-collapse text-left">
                <thead>
                  <tr>
                    <th className="bg-slate-100 border-b border-r border-slate-200 p-2 text-xs font-bold text-slate-700 px-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0] w-[1%] whitespace-nowrap">Details</th>
                    {matrixData.map((col, idx) => (
                      <th key={idx} className="bg-indigo-50 border-b border-r border-slate-200 p-1 text-xs font-black text-indigo-900 text-center min-w-[45px] w-[50px]">{col.size}</th>
                    ))}
                    <th className="bg-slate-100 border-b border-slate-200 p-2 text-xs font-bold text-slate-700 text-right px-4 whitespace-nowrap">Total</th>
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
                    <td className="bg-white border-b border-r border-slate-200 p-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      <div className="flex items-center justify-start gap-4">
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Pur. Rate</span>
                        <div className="flex items-center gap-1.5">
                          <input autoComplete="off" placeholder="Base" type="number" id="base-rate-input" className="w-[70px] bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-xs text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('rate-step-input')?.focus(); } }} value={baseRate} onChange={e => handleBaseRateChange(e.target.value)} />
                          <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-1 rounded border border-emerald-200">
                            <span className="text-[10px] text-emerald-700 uppercase font-bold">+</span>
                            <input autoComplete="off" placeholder="Step" type="number" id="rate-step-input" className="w-[50px] bg-transparent text-xs text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('base-mrp-input')?.focus(); } }} value={rateStep} onChange={e => handleRateStepChange(e.target.value)} />
                          </div>
                        </div>
                      </div>
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
                    <td className="bg-white border-b border-r border-slate-200 p-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      <div className="flex items-center justify-start gap-4">
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">MRP</span>
                        <div className="flex items-center gap-1.5">
                          <input autoComplete="off" placeholder="Base" type="number" id="base-mrp-input" className="w-[70px] bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-xs text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('mrp-step-input')?.focus(); } }} value={baseMrp} onChange={e => handleBaseMrpChange(e.target.value)} />
                          <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-1 rounded border border-emerald-200">
                            <span className="text-[10px] text-emerald-700 uppercase font-bold">+</span>
                            <input autoComplete="off" placeholder="Step" type="number" id="mrp-step-input" className="w-[50px] bg-transparent text-xs text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('qty-input-0')?.focus(); } }} value={mrpStep} onChange={e => handleMrpStepChange(e.target.value)} />
                          </div>
                        </div>
                      </div>
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
                  
                  
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-white rounded-b-xl border-t border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">
              <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mr-1">TAB</kbd> to move right, <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded mr-1">↓↑</kbd> to move vertical
            </div>
            
            {expectedTotalQty !== null && expectedTotalQty !== undefined && (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4 h-6">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Matrix Total:</span>
                  <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                    matrixData.reduce((acc, curr) => acc + (parseFloat(curr.qty) || 0), 0) === expectedTotalQty 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {matrixData.reduce((acc, curr) => acc + (parseFloat(curr.qty) || 0), 0)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Required:</span>
                  <span className="text-xs font-black bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                    {expectedTotalQty}
                  </span>
                </div>
                {matrixData.reduce((acc, curr) => acc + (parseFloat(curr.qty) || 0), 0) !== expectedTotalQty && (
                  <div className="flex items-center gap-1.5 ml-1">
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Diff:</span>
                    <span className="text-xs font-black text-amber-600">
                      {expectedTotalQty - matrixData.reduce((acc, curr) => acc + (parseFloat(curr.qty) || 0), 0)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} tabIndex={-1} className="px-4 py-1.5 border border-slate-200 text-slate-600 rounded text-xs font-bold hover:bg-slate-50">Cancel</button>
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
