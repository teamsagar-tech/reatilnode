import React, { useState, useEffect } from 'react';

export default function PointOfSalesTable({ cart }: { cart: any[] }) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...cart];
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [cart, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, sortedData.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedData.length]);

  const getSortIcon = (columnName: string) => {
    if (!sortConfig || sortConfig.key !== columnName) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const cols = [
    { key: 'sr', label: 'Sr', right: false },
    { key: 'sl', label: 'SL', right: false },
    { key: 'barcode', label: 'Barcode', right: false },
    { key: 'category', label: 'Category', right: false },
    { key: 'size', label: 'Size', right: false },
    { key: 'gst', label: 'GST%', right: true },
    { key: 'itemName', label: 'Item Name', right: false },
    { key: 'qty', label: 'Qty', right: true },
    { key: 'mtrs', label: 'Mtrs', right: true },
    { key: 'total', label: 'Total', right: true },
    { key: 'mrp', label: 'MRP', right: true },
    { key: 'saleRate', label: 'Sale Rate', right: true },
    { key: 'amount', label: 'Amount', right: true },
    { key: 'stock', label: 'Stock', right: true },
  ];

  return (
    <table className='w-full text-left border-collapse'>
      <thead className='bg-[#eef5ed] sticky top-0 z-10 shadow-[0_2px_2px_-1px_rgba(0,0,0,0.3)]'>
        <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px] cursor-pointer'>
          {cols.map(c => (
            <th 
              key={c.key} 
              className={`px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd] ${c.right ? 'text-right' : ''}`}
              onClick={() => requestSort(c.key)}
            >
              {c.label}{getSortIcon(c.key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.length === 0 && (
          <tr>
            <td colSpan={cols.length} className="text-center py-8 text-slate-400 italic">
              Scan barcode to add items...
            </td>
          </tr>
        )}
        {sortedData.map((row, idx) => (
          <tr 
            key={row.id} 
            tabIndex={0}
            onClick={() => setFocusedIndex(idx)}
            className={`text-[12px] border-b border-slate-300 ${idx === focusedIndex ? '!bg-blue-100 font-bold text-blue-900' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')} hover:bg-[#ffffe0] cursor-pointer`}
          >
            <td className="px-2 py-[2px] border-r border-slate-300 text-slate-600">{row.sr}</td>
            <td className="px-2 py-[2px] border-r border-slate-300">{row.sl}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 font-bold text-slate-800">{row.barcode}</td>
            <td className="px-2 py-[2px] border-r border-slate-300">{row.category}</td>
            <td className="px-2 py-[2px] border-r border-slate-300">{row.size}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 text-right">{row.gst}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 text-slate-800">{row.itemName}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 text-right font-bold text-blue-800">{row.qty}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 text-right">{row.mtrs || ''}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 text-right">{Number(row.total).toFixed(2)}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 text-right">{Number(row.mrp).toFixed(2)}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 text-right">{Number(row.saleRate).toFixed(2)}</td>
            <td className="px-2 py-[2px] border-r border-slate-300 text-right font-bold text-red-700">{Number(row.amount).toFixed(2)}</td>
            <td className="px-2 py-[2px] border-slate-300 text-right">{row.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
