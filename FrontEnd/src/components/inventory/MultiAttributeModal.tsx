import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface MultiAttributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (attributes: any[], totalQty: number) => void;
  item: any;
  showSize: boolean;
  showColour: boolean;
  showDesign: boolean;
}

// Dummy data for sizes and colors based on backend setup
const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34'];
const AVAILABLE_COLORS = ['Red', 'Blue', 'Black', 'White', 'Green'];
const AVAILABLE_DESIGNS = ['D101', 'D102', 'D103', 'D201'];

export default function MultiAttributeModal({ isOpen, onClose, onSave, item, showSize, showColour, showDesign }: MultiAttributeModalProps) {
  // matrix state: mapping of "rowKey-colKey" -> qty
  const [matrix, setMatrix] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setMatrix({}); // reset or load existing item.attributes if we had them
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine rows and columns based on active toggles
  let columns = showSize ? AVAILABLE_SIZES : ['Qty'];
  let rows = ['Item'];
  let rowType = 'None';

  if (showColour && showDesign) {
    // If both are active, we might do combinations, but for simplicity, let's use Design as row and Color as sub-row? 
    // Usually one is the primary Y-axis. Let's use Design as Y-axis.
    rows = AVAILABLE_DESIGNS;
    rowType = 'Design';
  } else if (showColour) {
    rows = AVAILABLE_COLORS;
    rowType = 'Color';
  } else if (showDesign) {
    rows = AVAILABLE_DESIGNS;
    rowType = 'Design';
  }

  const handleQtyChange = (row: string, col: string, val: string) => {
    setMatrix(prev => ({
      ...prev,
      [`${row}-${col}`]: val
    }));
  };

  const handleSave = () => {
    let total = 0;
    const attributes: any[] = [];

    rows.forEach(r => {
      columns.forEach(c => {
        const val = parseFloat(matrix[`${r}-${c}`]);
        if (val && val > 0) {
          total += val;
          attributes.push({
            size: showSize ? c : null,
            color: showColour ? (rowType === 'Color' ? r : null) : null,
            design: showDesign ? (rowType === 'Design' ? r : null) : null,
            qty: val
          });
        }
      });
    });

    onSave(attributes, total);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[80vw] max-w-5xl flex flex-col max-h-[85vh] border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-lg font-black tracking-tight">Multi-Attribute Entry</h2>
            <p className="text-xs text-indigo-300 font-bold mt-0.5">{item?.item || 'Unknown Item'} - Enter Quantity Breakup</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Matrix Area */}
        <div className="flex-1 overflow-auto p-6 bg-slate-50">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-indigo-50/80 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-4 py-3 border-b border-r border-indigo-100 text-indigo-900 font-black text-xs uppercase tracking-wider bg-indigo-100/50">
                    {rowType !== 'None' ? rowType : 'Attribute'}
                  </th>
                  {columns.map(col => (
                    <th key={col} className="px-3 py-3 border-b border-indigo-100 text-center text-indigo-900 font-bold text-xs uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-3 border-b border-l border-indigo-100 text-right text-indigo-900 font-black text-xs uppercase tracking-wider bg-indigo-100/50">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(row => {
                  let rowTotal = 0;
                  columns.forEach(col => {
                    const val = parseFloat(matrix[`${row}-${col}`]);
                    if (val) rowTotal += val;
                  });

                  return (
                    <tr key={row} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 border-r border-slate-100 font-bold text-slate-700 text-sm bg-slate-50/30">
                        {row}
                      </td>
                      {columns.map(col => (
                        <td key={col} className="px-2 py-2">
                          <input 
                            type="number" 
                            min="0"
                            value={matrix[`${row}-${col}`] || ''}
                            onChange={(e) => handleQtyChange(row, col, e.target.value)}
                            className="w-full min-w-[60px] text-center bg-white border border-slate-200 rounded-md px-2 py-1.5 text-sm font-black text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            placeholder="-"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2 border-l border-slate-100 text-right font-black text-indigo-700 text-sm bg-indigo-50/30">
                        {rowTotal > 0 ? rowTotal : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Grand Total Qty</span>
            <span className="text-2xl font-black text-indigo-600">
              {Object.values(matrix).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0)}
            </span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-8 py-2 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Confirm & Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
