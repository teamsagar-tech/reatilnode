import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Trash2, Check, GripVertical } from 'lucide-react';

interface MultiAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attributes: any[], totalQty: number) => void;
  item: any;
  showSize: boolean;
  showColour: boolean;
  showDesign: boolean;
  showLocation?: boolean;
  availableLocations?: string[];
}

export default function MultiAttributeModal({ isOpen, onClose, onSave, item, showSize, showColour, showDesign, showLocation, availableLocations = [] }: MultiAttributeModalProps) {
  const [rows, setRows] = useState<any[]>([{ size: '', color: '', design: '', location: '', qty: '', purchaseRate: '', mrp: '' }]);
  const [focusedRow, setFocusedRow] = useState(0);
  const [focusedCol, setFocusedCol] = useState(0);

  const cellRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setRows([{ size: '', color: '', design: '', location: '', qty: '', purchaseRate: '', mrp: '' }]);
      setFocusedRow(0);
      setFocusedCol(0);
      setTimeout(() => focusCurrentCell(0, 0), 100);
    }
  }, [isOpen]);

  const getColumns = () => {
    const cols = [];
    if (showSize) cols.push({ key: 'size', label: 'Size', width: '15%' });
    if (showColour) cols.push({ key: 'color', label: 'Color', width: '15%' });
    if (showDesign) cols.push({ key: 'design', label: 'Design No', width: '15%' });
    if (showLocation) cols.push({ key: 'location', label: 'Location', width: '15%' });
    cols.push({ key: 'qty', label: 'Qty', width: '10%' });
    cols.push({ key: 'purchaseRate', label: 'Pur. Rate', width: '15%' });
    cols.push({ key: 'mrp', label: 'MRP', width: '15%' });
    return cols;
  };

  const columns = getColumns();

  const focusCurrentCell = (rIdx: number, cIdx: number) => {
    const key = `${rIdx}-${cIdx}`;
    if (cellRefs.current[key]) {
      cellRefs.current[key]?.focus();
      cellRefs.current[key]?.select();
    }
  };

  const navigateNext = (rIdx: number, cIdx: number) => {
    const isLastCell = cIdx === columns.length - 1;
    const isLastRow = rIdx === rows.length - 1;

    if (isLastCell) {
      if (isLastRow) {
        setRows(prev => [...prev, { size: '', color: '', design: '', location: '', qty: '', purchaseRate: '', mrp: '' }]);
        setFocusedRow(rIdx + 1);
        setFocusedCol(0);
        setTimeout(() => focusCurrentCell(rIdx + 1, 0), 10);
      } else {
        setFocusedRow(rIdx + 1);
        setFocusedCol(0);
        setTimeout(() => focusCurrentCell(rIdx + 1, 0), 10);
      }
    } else {
      setFocusedCol(cIdx + 1);
      setTimeout(() => focusCurrentCell(rIdx, cIdx + 1), 10);
    }
  };

  const navigatePrevious = (rIdx: number, cIdx: number) => {
    if (cIdx > 0) {
      setFocusedCol(cIdx - 1);
      setTimeout(() => focusCurrentCell(rIdx, cIdx - 1), 10);
    } else if (rIdx > 0) {
      setFocusedRow(rIdx - 1);
      setFocusedCol(columns.length - 1);
      setTimeout(() => focusCurrentCell(rIdx - 1, columns.length - 1), 10);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rIdx: number, cIdx: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      navigateNext(rIdx, cIdx);
    } else if (e.key === 'Tab') {
      if (!e.shiftKey && rIdx === rows.length - 1 && cIdx === columns.length - 1) {
        e.preventDefault();
        setFocusedRow(-1);
        setFocusedCol(-1);
        submitButtonRef.current?.focus();
        return;
      }
      e.preventDefault();
      if (e.shiftKey) {
        navigatePrevious(rIdx, cIdx);
      } else {
        navigateNext(rIdx, cIdx);
      }
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F10' && isOpen) {
        e.preventDefault();
        if (focusedRow >= 0 && rows.length > 1) {
          setRows(prev => prev.filter((_, i) => i !== focusedRow));
          const nextIndex = focusedRow === rows.length - 1 ? Math.max(0, focusedRow - 1) : focusedRow;
          setFocusedRow(nextIndex);
          setFocusedCol(0);
          setTimeout(() => focusCurrentCell(nextIndex, 0), 10);
        }
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [focusedRow, rows.length, isOpen]);

  const updateRow = (index: number, field: string, value: string) => {
    setRows(prev => {
      const newRows = [...prev];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter((_, i) => i !== index));
      if (focusedRow >= index && focusedRow > 0) {
        setFocusedRow(focusedRow - 1);
      }
    }
  };

  const calculateTotalQuantity = () => {
    return rows.reduce((total, row) => total + (Number(row.qty) || 0), 0);
  };

  const handleSave = () => {
    let total = 0;
    const attributes: any[] = [];

    rows.forEach(row => {
      const qty = parseFloat(row.qty);
      if (qty && qty > 0) {
        total += qty;
        attributes.push({
          size: showSize ? row.size : null,
          color: showColour ? row.color : null,
          design: showDesign ? row.design : null,
          location: showLocation ? row.location : null,
          qty: qty,
          purchaseRate: row.purchaseRate ? parseFloat(row.purchaseRate) : null,
          mrp: row.mrp ? parseFloat(row.mrp) : null,
        });
      }
    });

    onSave(attributes, total);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-[#e0efeb] border-2 border-[#1b5e58] shadow-[4px_4px_0px_rgba(0,0,0,0.2)] w-[90vw] max-w-6xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1b5e58] text-white px-2 py-1 flex justify-between items-center shrink-0 border-b border-[#1b5e58]">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[13px] font-bold tracking-tight">Size-Color Breakdown</h2>
            <p className="text-[11px] text-[#a4d4cc] font-medium">- {item?.item || 'Unknown Item'}</p>
          </div>
          <button onClick={onClose} className="p-0.5 hover:bg-[#12423d] transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#e0efeb] p-2 overflow-hidden">
          
          <div className="flex justify-between items-end mb-1">
             <div className="text-[11px] font-bold text-slate-800">Detailed Breakup</div>
             <div className="text-[10px] font-medium text-slate-600">Press <kbd className="px-1 py-0 bg-white border border-slate-400 mx-0.5 text-[9px] font-bold text-black">Enter</kbd> to add/next row & <kbd className="px-1 py-0 bg-white border border-slate-400 mx-0.5 text-[9px] font-bold text-black">F10</kbd> to delete row</div>
          </div>

          <div className="bg-white border border-[#a3c3be] overflow-hidden min-w-max flex flex-col min-h-0">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#1b5e58] sticky top-0 z-10">
                <tr>
                  {columns.map((col, idx) => (
                    <th key={col.key} className="px-1 py-1 border-r border-[#12423d] text-white font-bold text-[11px] text-center" style={{ width: col.width }}>
                      {col.label}
                    </th>
                  ))}
                  <th className="w-[40px] bg-[#1b5e58] border-[#12423d]"></th>
                </tr>
              </thead>
            </table>
            
            <div className="overflow-y-auto flex-1">
               <table className="w-full text-left border-collapse whitespace-nowrap">
                 <tbody className="divide-y divide-slate-300">
                   {rows.map((row, rIdx) => (
                     <tr key={rIdx} className={`group ${focusedRow === rIdx ? 'bg-[#ffffe0]' : 'bg-white'}`}>
                       {columns.map((col, cIdx) => {
                         const isFocused = focusedRow === rIdx && focusedCol === cIdx;
                         return (
                           <td key={col.key} className={`px-0 py-0 border-r border-slate-300 relative ${isFocused ? 'bg-[#ffffe0]' : ''}`} style={{ width: col.width }}>
                             <input 
                               ref={el => cellRefs.current[`${rIdx}-${cIdx}`] = el}
                               type={['qty', 'purchaseRate', 'mrp'].includes(col.key) ? 'number' : 'text'}
                               value={row[col.key] || ''}
                               onChange={(e) => updateRow(rIdx, col.key, e.target.value)}
                               onKeyDown={(e) => handleKeyDown(e, rIdx, cIdx)}
                               onFocus={() => { setFocusedRow(rIdx); setFocusedCol(cIdx); }}
                               className={`w-full bg-transparent border-0 px-1 py-0.5 text-[12px] font-bold text-slate-800 focus:bg-[#ffffe0] outline-none transition-none ${['qty', 'purchaseRate', 'mrp'].includes(col.key) ? 'text-right' : 'text-left'}`}
                               placeholder="-"
                             />
                           </td>
                         )
                       })}
                       <td className="w-[40px] text-center border-l border-slate-300 bg-white">
                         {rows.length > 1 && (
                           <button 
                             onClick={() => removeRow(rIdx)}
                             className="text-red-600 hover:text-red-800 transition-colors mx-auto"
                             title="Delete Row (F10)"
                             tabIndex={-1}
                           >
                             <Trash2 className="w-3 h-3" />
                           </button>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
          
          <div className="mt-1">
             <button 
                onClick={() => {
                   setRows(prev => [...prev, { size: '', color: '', design: '', location: '', qty: '', purchaseRate: '', mrp: '' }]);
                   setTimeout(() => focusCurrentCell(rows.length, 0), 50);
                }}
                className="text-slate-700 font-bold text-[10px] hover:text-black underline"
                type="button"
             >
                + Add Row
             </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t-2 border-[#1b5e58] bg-[#e0efeb] flex justify-between items-center shrink-0">
          <div className="flex gap-2 items-center">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Total Quantity:</span>
            <span className="text-[14px] font-black text-[#1b5e58] leading-none">
              {calculateTotalQuantity()}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-3 py-1 bg-white border border-slate-400 text-black font-bold text-[11px] hover:bg-slate-100"
              type="button"
            >
              Cancel
            </button>
            <button 
              ref={submitButtonRef}
              onClick={handleSave}
              className="px-4 py-1 bg-yellow-400 border border-yellow-600 text-black font-bold flex items-center gap-1 text-[11px] hover:bg-yellow-500 focus:ring-2 focus:ring-yellow-600 outline-none"
              type="button"
            >
              <Save className="w-3 h-3" />
              Confirm
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
