import React from "react";
import { useEffect } from 'react';

export default function BatchesView({ invoice, onSelect, goBack }: { invoice: any, onSelect: (batch: any) => void, goBack: () => void }) {
  
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const initialBatches = React.useMemo(() => [
    { id: 101, batchId: 'B-1001', location: 'Main Warehouse', quantity: 150, uniqueBarcodes: 150 },
    { id: 102, batchId: 'B-1002', location: 'Store 1', quantity: 50, uniqueBarcodes: 50 },
  ], []);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...initialBatches];
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
  }, [initialBatches, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setFocusedIndex(-1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, sortedData.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        onSelect(sortedData[focusedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goBack, onSelect, focusedIndex, sortedData]);

  const getSortIcon = (columnName: string) => {
    if (!sortConfig || sortConfig.key !== columnName) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className='flex flex-col h-full relative'>
      <div className='bg-[#eef5ed] border-b-2 border-[#81a09d] p-2 flex justify-between items-center text-[12px] shrink-0'>
         <div><span className='font-bold text-slate-800'>Invoice Bill No:</span> <span className='text-blue-700 font-bold'>{invoice?.billNo}</span></div>
         <div><span className='font-bold text-slate-800'>Party:</span> <span>{invoice?.party}</span></div>
         <div className='text-slate-500 italic'>Select a batch to view products (Press Enter)</div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <table className='w-full text-left border-collapse border border-slate-400'>
          <thead className='bg-[#eef5ed] sticky top-0 z-10 shadow-[0_2px_2px_-1px_rgba(0,0,0,0.3)]'>
            <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px] cursor-pointer'>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('batchId')}>Batch ID{getSortIcon('batchId')}</th>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('location')}>Location{getSortIcon('location')}</th>
              <th className='px-2 py-1 border-r border-slate-300 text-right hover:bg-[#c9e1dd]' onClick={() => requestSort('quantity')}>Quantity{getSortIcon('quantity')}</th>
              <th className='px-2 py-1 border-slate-300 text-right hover:bg-[#c9e1dd]' onClick={() => requestSort('uniqueBarcodes')}>Unique Barcodes{getSortIcon('uniqueBarcodes')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => (
              <tr 
                key={row.id} 
                tabIndex={0}
                onClick={() => {
                  setFocusedIndex(idx);
                  onSelect(row);
                }}
                className={`text-[12px] border-b border-slate-300 ${idx === focusedIndex ? '!bg-blue-100 font-bold text-blue-900' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')} hover:bg-[#ffffe0] cursor-pointer`}
              >
                <td className='px-2 py-1 border-r border-slate-300 font-bold text-blue-700'>{row.batchId}</td>
                <td className='px-2 py-1 border-r border-slate-300'>{row.location}</td>
                <td className='px-2 py-1 border-r border-slate-300 text-right font-bold'>{row.quantity}</td>
                <td className='px-2 py-1 border-slate-300 text-right font-bold'>{row.uniqueBarcodes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
