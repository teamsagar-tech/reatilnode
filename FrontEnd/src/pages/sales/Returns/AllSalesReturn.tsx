import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumReportTemplate from '../../../components/layout/PremiumReportTemplate';
import SearchableDropdown from '../../../components/SearchableDropdown';
import { BookCopy, Search, FilterX } from 'lucide-react';

export default function AllSalesReturn() {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  
  const [selectedRow, setSelectedRow] = useState(0);

  const sampleData = [
    { id: 1, date: '22/08/2026', returnNo: 'SR-2026-102', origInvNo: 'INV-5012', customerName: 'Ramesh Enterprises', settlementMode: 'Credit Note', totQty: 3, amount: '4,500.00', status: 'Unsettled' },
    { id: 2, date: '24/08/2026', returnNo: 'QSR-2026-045', origInvNo: '-', customerName: 'Walk-in Customer', settlementMode: 'Cash Refund', totQty: 1, amount: '499.00', status: 'Refunded' }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedRow(prev => Math.min(prev + 1, sampleData.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedRow(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, sampleData.length]);

  return (
    <PremiumReportTemplate
      title="All Sales Returns"
      subtitle="Credit Note Register • View and manage all customer returns"
      icon={<BookCopy className="w-6 h-6" />}
      onExport={() => alert('Exporting to Excel...')}
      maxWidth="max-w-[1400px]"
    >
      
      {/* Top Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-4 shrink-0 flex flex-wrap items-end gap-4 z-20">
         <div className="flex flex-col gap-1.5">
           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date Range</label>
           <div className="flex items-center gap-2">
             <input type="date" className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} />
             <span className="text-slate-400 font-bold text-sm">to</span>
             <input type="date" className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} />
           </div>
         </div>
         
         <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Search Customer</label>
           <SearchableDropdown id="search-cust" className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none w-full" value={''} onChange={() => {}} options={['Walk-in Customer', 'Ramesh Enterprises']} placeholder="Type to search..." />
         </div>

         <div className="flex gap-2 ml-auto">
            <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-sm transition-all h-[38px]">
              <Search className="w-4 h-4" />
              Fetch Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 shadow-sm transition-all h-[38px]" onClick={() => setDateRange({from: '', to: ''})}>
              <FilterX className="w-4 h-4" />
              Clear
            </button>
         </div>
      </div>

      {/* Main Data Grid */}
      <div className="flex-1 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-full">
              <thead className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                 <tr className="text-slate-500 font-black text-[10px] uppercase tracking-wider">
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[120px]">Date</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[160px]">Return / CN No</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[140px]">Orig Inv No</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 w-full">Customer Name</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 w-[160px]">Settlement Mode</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[100px]">Tot Qty</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[140px]">Amount (₹)</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-center w-[120px]">Status</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleData.map((row, idx) => (
                  <tr 
                    key={row.id} 
                    className={`text-[13px] transition-colors cursor-pointer ${selectedRow === idx ? 'bg-indigo-50/60 shadow-[inset_3px_0_0_#4f46e5]' : 'hover:bg-slate-50'}`}
                    onClick={() => setSelectedRow(idx)}
                  >
                    <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-600 font-medium">{row.date}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-indigo-700">{row.returnNo}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center font-medium text-slate-500">{row.origInvNo}</td>
                    <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-800">{row.customerName}</td>
                    <td className="px-4 py-3 border-r border-slate-100 font-medium text-slate-600">{row.settlementMode}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-right font-bold text-slate-700">{row.totQty}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-right font-black text-slate-800">{row.amount}</td>
                    <td className="px-4 py-3 text-center">
                       <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${row.status === 'Unsettled' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                         {row.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
         
         {/* Table Footer Totals */}
         <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 flex items-center shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
            <div className="font-black text-slate-800 text-sm uppercase tracking-widest flex-1 text-right pr-6 border-r border-slate-200">Grand Total :</div>
            <div className="w-[100px] text-right px-4 font-black text-sm text-slate-700 border-r border-slate-200">4</div>
            <div className="w-[140px] text-right px-4 font-black text-sm text-indigo-700 border-r border-slate-200">₹ 4,999.00</div>
            <div className="w-[120px]"></div>
         </div>
      </div>
    </PremiumReportTemplate>
  );
}
