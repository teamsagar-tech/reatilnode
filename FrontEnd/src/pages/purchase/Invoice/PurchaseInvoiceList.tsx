import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumReportTemplate from '../../../components/layout/PremiumReportTemplate';
import SearchableDropdown from '../../../components/SearchableDropdown';
import { FileText, Search, FilterX, Eye, EyeOff } from 'lucide-react';

export default function PurchaseInvoiceList() {
  const navigate = useNavigate();
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDetailed, setIsDetailed] = useState(false);

  const [filters, setFilters] = useState({
    fromDate: '2026-04-01',
    toDate: '2027-03-31',
    party: '',
    firm: '',
    location: '',
  });

  const invoices = [
    { id: 1, grn: '135939', recvDt: '29-Jul-26', billNo: '82474', billDate: '24-Jul-26', partyName: 'MEENAKSHI SILK KENDRA-(T NO.34)', state: 'Karnataka', verified: '', valueDiff: '', totalAmt: 57440, discount: 0, addChgs: 0, taxableAmt: 57440, gstPercent: 5, cgstAmt: 2872, sgstAmt: 0, igstAmt: 2872, addLess: 0, rOff: 0, netAmount: 63184, userName: '', items: [{ name: 'Silk Saree Kanjivaram', qty: 20, rate: 2872, amount: 57440 }], ledgers: [{ name: 'IGST @ 5%', amount: 2872 }] },
    { id: 2, grn: '135940', recvDt: '29-Jul-26', billNo: '82475', billDate: '24-Jul-26', partyName: 'MEENAKSHI SILK KENDRA-(T NO.34)', state: 'Karnataka', verified: '', valueDiff: '', totalAmt: 57440, discount: 0, addChgs: 0, taxableAmt: 57440, gstPercent: 5, cgstAmt: 2872, sgstAmt: 0, igstAmt: 2872, addLess: 0, rOff: 0, netAmount: 63184, userName: '', items: [], ledgers: [] },
    { id: 3, grn: '135777', recvDt: '24-Jul-26', billNo: '74', billDate: '24-Jul-26', partyName: 'MOHD.IKHALAS MUSSADDI-(MUMBAI)', state: 'Madhya Pradesh', verified: '', valueDiff: '', totalAmt: 51300, discount: 0, addChgs: 0, taxableAmt: 51300, gstPercent: 5, cgstAmt: 2565, sgstAmt: 0, igstAmt: 2565, addLess: 0, rOff: 0, netAmount: 56430, userName: '', items: [], ledgers: [] },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
         e.preventDefault();
         navigate(-1);
      } else if (e.key === 'ArrowDown') {
         e.preventDefault();
         setSelectedIndex(prev => Math.min(prev + 1, invoices.length - 1));
      } else if (e.key === 'ArrowUp') {
         e.preventDefault();
         setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'F1') {
         e.preventDefault();
         setIsDetailed(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'c') {
         e.preventDefault();
         navigate('/purchase-invoice');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, invoices.length]);

  const calcTotal = (field: string) => invoices.reduce((acc, inv: any) => acc + (parseFloat(inv[field]) || 0), 0);
  const fmt = (num: number) => num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <PremiumReportTemplate
      title="Purchase Invoice Register"
      subtitle="Comprehensive log of all purchase invoices"
      icon={<FileText className="w-6 h-6" />}
      onCreate={() => navigate('/purchase-invoice')}
      onExport={() => alert('Exporting to Excel...')}
      maxWidth="max-w-[1600px]"
    >
      
      {/* Top Filter Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-4 shrink-0 flex flex-wrap items-end gap-4 z-20">
         <div className="flex flex-col gap-1.5">
           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date Range</label>
           <div className="flex items-center gap-2">
             <input type="date" className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={filters.fromDate} onChange={e => setFilters({...filters, fromDate: e.target.value})} />
             <span className="text-slate-400 font-bold text-sm">to</span>
             <input type="date" className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" value={filters.toDate} onChange={e => setFilters({...filters, toDate: e.target.value})} />
           </div>
         </div>
         
         <div className="flex flex-col gap-1.5 min-w-[200px]">
           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Firm</label>
           <SearchableDropdown id="firm" className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none w-full" value={filters.firm} onChange={(v) => setFilters({...filters, firm: v})} options={['All Firms', 'Main Branch', 'Wholesale Division']} placeholder="All Firms" />
         </div>

         <div className="flex flex-col gap-1.5 min-w-[200px]">
           <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Party A/c</label>
           <SearchableDropdown id="party" className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-sm font-bold text-slate-700 outline-none w-full" value={filters.party} onChange={(v) => setFilters({...filters, party: v})} options={['All Parties', 'MEENAKSHI SILK KENDRA']} placeholder="All Parties" />
         </div>

         <div className="flex gap-2 ml-auto">
            <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-sm transition-all h-[38px]">
              <Search className="w-4 h-4" />
              Search
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 shadow-sm transition-all h-[38px]" onClick={() => setFilters({fromDate: '', toDate: '', party: '', firm: '', location: ''})}>
              <FilterX className="w-4 h-4" />
              Clear
            </button>
         </div>
      </div>

      <div className="flex justify-between items-center px-2">
         <h3 className="font-bold text-slate-700">List of Purchase Invoices</h3>
         <button 
           onClick={() => setIsDetailed(!isDetailed)} 
           className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-colors"
         >
           {isDetailed ? <><EyeOff className="w-3.5 h-3.5" /> Condensed View (F1)</> : <><Eye className="w-3.5 h-3.5" /> Detailed View (F1)</>}
         </button>
      </div>

      {/* Main Data Grid */}
      <div className="flex-1 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1800px]">
              <thead className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                 <tr className="text-slate-500 font-black text-[10px] uppercase tracking-wider">
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[80px]">GRN</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[90px]">Recv Dt</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[80px]">Bill No</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[90px]">Bill Date</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 w-[250px]">Party Name</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 w-[120px]">State</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[80px]">Verified</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[100px]">Total Amt</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[100px]">Discount</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[100px]">Add Chgs</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[120px] bg-indigo-50/50 text-indigo-700">Taxable Amt</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-center w-[60px]">GST%</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[100px]">CGST Amt</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[100px]">SGST Amt</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[100px]">IGST Amt</th>
                   <th className="px-4 py-3 border-b border-r border-slate-200 text-right w-[120px] bg-emerald-50/50 text-emerald-700">Net Amount</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv, idx) => (
                  <React.Fragment key={inv.id}>
                    <tr className={`text-[13px] transition-colors cursor-pointer ${selectedIndex === idx ? 'bg-indigo-50/60 shadow-[inset_3px_0_0_#4f46e5]' : 'hover:bg-slate-50'}`} onClick={() => setSelectedIndex(idx)}>
                      <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-slate-700">{inv.grn}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-600">{inv.recvDt}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-slate-700">{inv.billNo}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-600">{inv.billDate}</td>
                      <td className="px-4 py-3 border-r border-slate-100 font-bold text-slate-800">{inv.partyName}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-slate-600">{inv.state}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center text-slate-500">{inv.verified || '-'}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-right font-bold text-slate-700">{fmt(inv.totalAmt)}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-right text-slate-500">{inv.discount ? fmt(inv.discount) : '-'}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-right text-slate-500">{inv.addChgs ? fmt(inv.addChgs) : '-'}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-right font-black text-indigo-700 bg-indigo-50/30">{fmt(inv.taxableAmt)}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-center font-bold text-slate-500">{inv.gstPercent}%</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-right text-slate-600">{inv.cgstAmt ? fmt(inv.cgstAmt) : '-'}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-right text-slate-600">{inv.sgstAmt ? fmt(inv.sgstAmt) : '-'}</td>
                      <td className="px-4 py-3 border-r border-slate-100 text-right text-slate-600">{inv.igstAmt ? fmt(inv.igstAmt) : '-'}</td>
                      <td className="px-4 py-3 text-right font-black text-emerald-700 bg-emerald-50/30 text-[14px]">{fmt(inv.netAmount)}</td>
                    </tr>
                    
                    {/* Detailed View Expansion */}
                    {isDetailed && selectedIndex === idx && (
                      <>
                        {inv.items.length > 0 && inv.items.map((item, itemIdx) => (
                          <tr key={`item-${itemIdx}`} className="bg-indigo-50/20 border-b border-indigo-100/50">
                            <td colSpan={4} className="border-r border-indigo-100/50"></td>
                            <td colSpan={3} className="px-6 py-2 border-r border-indigo-100/50 text-xs font-semibold text-indigo-800">
                              <span className="inline-block w-4 h-4 bg-indigo-200 rounded-full text-[10px] text-center leading-4 mr-2 text-indigo-800">i</span>
                              {item.name} <span className="text-indigo-400 font-normal ml-2">({item.qty} units @ ₹{item.rate})</span>
                            </td>
                            <td className="px-4 py-2 border-r border-indigo-100/50 text-right text-xs font-bold text-indigo-900">{fmt(item.amount)}</td>
                            <td colSpan={8}></td>
                          </tr>
                        ))}
                        {inv.ledgers.length > 0 && inv.ledgers.map((ledger, ledgerIdx) => (
                          <tr key={`ledger-${ledgerIdx}`} className="bg-emerald-50/20 border-b border-emerald-100/50">
                            <td colSpan={4} className="border-r border-emerald-100/50"></td>
                            <td colSpan={3} className="px-6 py-2 border-r border-emerald-100/50 text-xs font-semibold text-emerald-800">
                              <span className="inline-block w-4 h-4 bg-emerald-200 rounded-full text-[10px] text-center leading-4 mr-2 text-emerald-800">T</span>
                              {ledger.name}
                            </td>
                            <td colSpan={7} className="border-r border-emerald-100/50"></td>
                            <td className="px-4 py-2 text-right text-xs font-bold text-emerald-900">{fmt(ledger.amount)}</td>
                            <td colSpan={1}></td>
                          </tr>
                        ))}
                      </>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
         </div>
         
         {/* Table Footer Totals */}
         <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 flex items-center shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
            <div className="font-black text-slate-800 text-sm uppercase tracking-widest w-[690px] text-right pr-4">Grand Totals :</div>
            <div className="flex-1 grid grid-cols-[100px_100px_100px_120px_60px_100px_100px_100px_120px] divide-x divide-slate-200 text-right font-black text-sm text-slate-800">
               <div className="px-4">{fmt(calcTotal('totalAmt'))}</div>
               <div className="px-4">{fmt(calcTotal('discount'))}</div>
               <div className="px-4">{fmt(calcTotal('addChgs'))}</div>
               <div className="px-4 text-indigo-700">{fmt(calcTotal('taxableAmt'))}</div>
               <div className="px-4 text-center">-</div>
               <div className="px-4 text-slate-600">{fmt(calcTotal('cgstAmt'))}</div>
               <div className="px-4 text-slate-600">{fmt(calcTotal('sgstAmt'))}</div>
               <div className="px-4 text-slate-600">{fmt(calcTotal('igstAmt'))}</div>
               <div className="px-4 text-emerald-600 text-base">{fmt(calcTotal('netAmount'))}</div>
            </div>
         </div>
      </div>
    </PremiumReportTemplate>
  );
}
