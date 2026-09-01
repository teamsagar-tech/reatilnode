import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumReportTemplate from '../../../components/layout/PremiumReportTemplate';
import { Undo2 } from 'lucide-react';

export default function PurchaseReturn() {
  const navigate = useNavigate();
  const [returnType, setReturnType] = useState('defective');
  const [selectedRow, setSelectedRow] = useState(0);

  const sampleData = [
    { id: 1, prNo: 'PR-26-001', date: '15-Aug-2026', party: 'ABC Textiles', items: 12, amount: '45,000.00' },
    { id: 2, prNo: 'PR-26-002', date: '18-Aug-2026', party: 'Global Fabrics', items: 5, amount: '12,500.00' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/dashboard');
      } else if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        navigate('/purchase/returns/manual-purchase-return');
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
      title="Purchase Returns"
      subtitle="Comprehensive log of all purchase returns"
      icon={<Undo2 className="w-6 h-6" />}
      onCreate={() => navigate('/purchase/returns/manual-purchase-return')}
      onExport={() => alert('Exporting to Excel...')}
      maxWidth="max-w-[1200px]"
    >
      
      {/* Top Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-4 shrink-0 flex items-center justify-between z-20">
         <div className="flex items-center gap-4">
           <div className="flex flex-col gap-1.5 min-w-[200px]">
             <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filter Type</label>
             <select 
               value={returnType}
               onChange={(e) => setReturnType(e.target.value)}
               className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none w-full focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
             >
               <option value="defective">Defective</option>
               <option value="non_defective">Non-Defective</option>
               <option value="all">All Returns</option>
             </select>
           </div>
         </div>
      </div>

      {/* Main Data Grid */}
      <div className="flex-1 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-full">
              <thead className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                 <tr className="text-slate-500 font-black text-[10px] uppercase tracking-wider">
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[60px]">Sr</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[120px]">Return No</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[120px]">Date</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 w-full">Party Name</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[100px]">Items</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-right w-[150px]">Amount (₹)</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleData.map((row, idx) => (
                  <tr 
                    key={row.id} 
                    className={`text-[13px] transition-colors cursor-pointer ${selectedRow === idx ? 'bg-indigo-50/60 shadow-[inset_3px_0_0_#4f46e5]' : 'hover:bg-slate-50'}`} 
                    onClick={() => setSelectedRow(idx)}
                  >
                    <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-indigo-700">{row.prNo}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center font-medium text-slate-600">{row.date}</td>
                    <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-800">{row.party}</td>
                    <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-slate-700">{row.items}</td>
                    <td className="px-4 py-3 text-right font-black text-slate-800">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </PremiumReportTemplate>
  );
}
