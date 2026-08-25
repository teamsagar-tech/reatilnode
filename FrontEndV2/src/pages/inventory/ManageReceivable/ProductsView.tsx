import React, { useState, useEffect } from 'react';

export default function ProductsView({ batch, onBulkUpdate, goBack }: { batch: any, onBulkUpdate: (products: any[]) => void, goBack: () => void }) {
  
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const initialProducts = React.useMemo(() => [
    { id: 1001, itemName: 'Cotton Shirt XL', barcode: 'BC-0001', mrp: 1200, vrpRate: 800, designNo: 'D-111', brand: 'Alpha' },
    { id: 1002, itemName: 'Cotton Shirt L', barcode: 'BC-0002', mrp: 1200, vrpRate: 800, designNo: 'D-111', brand: 'Alpha' },
    { id: 1003, itemName: 'Silk Saree', barcode: 'BC-0003', mrp: 5000, vrpRate: 3500, designNo: 'D-222', brand: 'Beta' },
  ], []);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...initialProducts];
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
  }, [initialProducts, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
      } else if (e.altKey && e.key.toLowerCase() === 'u') {
        e.preventDefault();
        const selectedProducts = sortedData.filter(p => selectedIds.has(p.id));
        if (selectedProducts.length > 0) {
          onBulkUpdate(selectedProducts);
        } else {
          alert('Select at least one product using Spacebar before updating.');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goBack, onBulkUpdate, selectedIds, sortedData]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getSortIcon = (columnName: string) => {
    if (!sortConfig || sortConfig.key !== columnName) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className='flex flex-col h-full relative'>
      <div className='bg-[#eef5ed] border-b-2 border-[#81a09d] p-2 flex justify-between items-center text-[12px] shrink-0'>
         <div><span className='font-bold text-slate-800'>Batch:</span> <span className='text-blue-700 font-bold'>{batch?.batchId}</span></div>
         <div className='text-slate-700 font-bold'>
            Selected: <span className='text-blue-800'>{selectedIds.size}</span>
         </div>
         <div className='text-slate-500 italic'>Spacebar to Select | Alt+U to Bulk Update</div>
      </div>

      <div className='flex-1 overflow-y-auto'>
        <table className='w-full text-left border-collapse border border-slate-400'>
          <thead className='bg-[#eef5ed] sticky top-0 z-10 shadow-[0_2px_2px_-1px_rgba(0,0,0,0.3)]'>
            <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px] cursor-pointer'>
              <th className='px-2 py-1 border-r border-slate-300 w-8 text-center'>*</th>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('barcode')}>Barcode{getSortIcon('barcode')}</th>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('itemName')}>Item Name{getSortIcon('itemName')}</th>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('designNo')}>Design No{getSortIcon('designNo')}</th>
              <th className='px-2 py-1 border-r border-slate-300 hover:bg-[#c9e1dd]' onClick={() => requestSort('brand')}>Brand{getSortIcon('brand')}</th>
              <th className='px-2 py-1 border-r border-slate-300 text-right hover:bg-[#c9e1dd]' onClick={() => requestSort('mrp')}>MRP{getSortIcon('mrp')}</th>
              <th className='px-2 py-1 border-slate-300 text-right hover:bg-[#c9e1dd]' onClick={() => requestSort('vrpRate')}>Sell Rate{getSortIcon('vrpRate')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, idx) => {
              const isSelected = selectedIds.has(row.id);
              return (
                <tr 
                  key={row.id} 
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ') {
                      e.preventDefault();
                      toggleSelect(row.id);
                    }
                  }}
                  className={`text-[12px] border-b border-slate-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]'} ${isSelected ? '!bg-blue-100 font-bold text-blue-900' : ''} hover:bg-[#ffffe0] focus:bg-[#ffffe0] focus:outline-none cursor-pointer`}
                  onClick={() => toggleSelect(row.id)}
                >
                  <td className='px-2 py-1 border-r border-slate-300 text-center font-bold text-blue-700'>
                    {isSelected ? '✓' : ''}
                  </td>
                  <td className='px-2 py-1 border-r border-slate-300'>{row.barcode}</td>
                  <td className='px-2 py-1 border-r border-slate-300'>{row.itemName}</td>
                  <td className='px-2 py-1 border-r border-slate-300'>{row.designNo}</td>
                  <td className='px-2 py-1 border-r border-slate-300'>{row.brand}</td>
                  <td className='px-2 py-1 border-r border-slate-300 text-right'>{row.mrp.toLocaleString()}</td>
                  <td className='px-2 py-1 border-slate-300 text-right'>{row.vrpRate.toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
