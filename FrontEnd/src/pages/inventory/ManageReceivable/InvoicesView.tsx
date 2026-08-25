import React from "react";
import { useEffect } from 'react';

export default function InvoicesView({ onSelect, onFocusChange, goBack }: { onSelect: (inv: any) => void, onFocusChange?: (inv: any) => void, goBack: () => void }) {
  
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const initialData = React.useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    billNo: `INV-200${i + 1}`,
    date: `2026-08-${String(1 + (i % 30)).padStart(2, '0')}`,
    party: i % 3 === 0 ? 'Alpha Logistics' : (i % 3 === 1 ? 'Beta Synthetics' : 'Gamma Cottons'),
    amount: (10000 + i * 2500),
    status: i % 4 === 0 ? 'Cleared' : 'Pending'
  })), []);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...initialData];
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
  }, [initialData, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setFocusedIndex(-1); // Reset focus on sort
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

  useEffect(() => {
    if (focusedIndex >= 0 && onFocusChange) {
      onFocusChange(sortedData[focusedIndex]);
    } else if (focusedIndex === -1 && onFocusChange) {
      onFocusChange(null);
    }
  }, [focusedIndex, onFocusChange, sortedData]);

  const getSortIcon = (columnName: string) => {
    if (!sortConfig || sortConfig.key !== columnName) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className='flex flex-col h-full relative'>
      {/* Tally Style Filter Section */}
      <div className='bg-[#eef5ed] border-b-2 border-[#81a09d] p-2 flex flex-col gap-1 text-[12px] shrink-0'>
         <div className='grid grid-cols-4 gap-4'>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Party:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Bill No:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Invoice Date:</span>
              <input type="text" placeholder="DD-MM-YYYY" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Transporter:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>LR No:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>GRN:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Brand:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Item Name:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Design No:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Category:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2'>Barcode:</span>
              <input type="text" className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none' />
            </div>
            <div className='flex items-center justify-between'>
              <span className='font-bold text-slate-800 mr-2 text-right'>Stock At / Bill For:</span>
              <select className='border border-slate-400 px-1 py-[2px] w-[150px] focus:bg-[#ffffe0] outline-none'>
                 <option>Stock At</option>
                 <option>Bill For</option>
              </select>
            </div>
         </div>
      </div>

      {/* Table Section */}
      <div className='flex-1 overflow-y-auto'>
        <table className='w-full text-left border-collapse border border-slate-400'>
          <thead className='bg-[#eef5ed] sticky top-0 z-10 shadow-[0_2px_2px_-1px_rgba(0,0,0,0.3)]'>
            <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px] cursor-pointer'>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('id')}>ID{getSortIcon('id')}</th>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('billNo')}>Bill No{getSortIcon('billNo')}</th>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('date')}>Date{getSortIcon('date')}</th>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('party')}>Party{getSortIcon('party')}</th>
              <th className='px-2 py-1 border-r border-slate-300 text-right hover:bg-[#c9e1dd]' onClick={() => requestSort('amount')}>Amount{getSortIcon('amount')}</th>
              <th className='px-2 py-1 border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('status')}>Status{getSortIcon('status')}</th>
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
                <td className='px-2 py-1 border-r border-slate-300 font-medium'>{row.id}</td>
                <td className='px-2 py-1 border-r border-slate-300 font-bold text-blue-700'>{row.billNo}</td>
                <td className='px-2 py-1 border-r border-slate-300'>{row.date}</td>
                <td className='px-2 py-1 border-r border-slate-300 font-bold'>{row.party}</td>
                <td className='px-2 py-1 border-r border-slate-300 text-right font-bold'>{row.amount.toLocaleString()}</td>
                <td className='px-2 py-1 border-slate-300'>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
