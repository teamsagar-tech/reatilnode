import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumVoucherTemplate from '../../../components/layout/PremiumVoucherTemplate';
import SearchableDropdown from '../../../components/SearchableDropdown';
import { RefreshCcw, Search, Trash2, Printer, CheckCircle2 } from 'lucide-react';

export default function SalesReturn() {
  const navigate = useNavigate();
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    date: '2026-08-24',
    transNo: '1025',
    cashCustomerName: '',
    firm: 'V.R.Pawar Sarees',
    invoiceNo: '',
    barcodeId: '',
    narration: '',
    addCharges: '0.00',
    mode: 'RG Voucher', // RG Voucher or Paid By
    paidBy: 'CASH',
    defaultMode: 'RG Voucher',
    printA4: true,
    copies: 1
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if (e.key === 'F5') {
        e.preventDefault();
        setFormData(prev => ({ ...prev, mode: 'RG Voucher' }));
      } else if (e.key === 'F6') {
        e.preventDefault();
        setFormData(prev => ({ ...prev, mode: 'Paid By' }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleSave = () => {
    alert('Sales Return Saved Successfully!');
    navigate(-1);
  };

  return (
    <PremiumVoucherTemplate
      title="Sales Return"
      subtitle="RetailNode ERP • Manage returns and refunds"
      icon={<RefreshCcw className="w-5 h-5" />}
      onSave={handleSave}
      onBack={() => navigate(-1)}
      maxWidth="max-w-[1600px]"
    >
      
      {/* Top Header Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-5 shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-8 z-20">
         {/* Left Side */}
         <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col gap-1.5">
             <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Trans No</label>
             <input type="text" value={formData.transNo} readOnly className="bg-slate-100 border border-slate-200 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-500 cursor-not-allowed outline-none" />
           </div>
           
           <div className="flex flex-col gap-1.5">
             <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Firm</label>
             <SearchableDropdown id="firm" className="bg-white border border-slate-300 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" value={formData.firm} onChange={(val) => setFormData({...formData, firm: val})} options={['V.R.Pawar Sarees', 'Main Branch', 'Wholesale Division']} placeholder="Select Firm" />
           </div>

           <div className="flex flex-col gap-1.5 col-span-2">
             <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Invoice No Search</label>
             <div className="flex gap-2">
               <input type="text" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} placeholder="Invoice No" className="bg-white border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-[150px] uppercase" />
               <div className="flex-1">
                 <SearchableDropdown id="invoice-select" className="bg-white border border-slate-300 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full" value={''} onChange={() => {}} options={[]} placeholder="Search Inv..." />
               </div>
             </div>
           </div>
         </div>

         {/* Right Side */}
         <div className="grid grid-cols-2 gap-4">
           <div className="flex flex-col gap-1.5">
             <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</label>
             <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="bg-white border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cash Customer Name</label>
             <input type="text" value={formData.cashCustomerName} onChange={e => setFormData({...formData, cashCustomerName: e.target.value})} className="bg-white border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="Optional" />
           </div>

           <div className="flex flex-col gap-1.5 col-span-2">
             <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Barcode / Item Search</label>
             <div className="flex gap-2">
               <div className="relative w-[150px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input ref={barcodeInputRef} type="text" value={formData.barcodeId} onChange={e => setFormData({...formData, barcodeId: e.target.value})} placeholder="Barcode" className="bg-white border border-slate-300 pl-9 pr-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full" />
               </div>
               <div className="flex-1">
                 <SearchableDropdown id="barcode-select" className="bg-white border border-slate-300 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none w-full" value={''} onChange={() => {}} options={[]} placeholder="Search Product..." />
               </div>
               <button className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">
                  F2 Inv Search
               </button>
             </div>
           </div>
         </div>
      </div>

      {/* Main Data Grid Area */}
      <div className="flex-1 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[300px]">
         <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
              <thead className="bg-slate-50/90 backdrop-blur-md sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                 <tr className="text-slate-500 font-black text-[10px] uppercase tracking-wider">
                   <th className="px-4 py-3 border-b border-slate-200 text-center w-[50px]">Sr</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-center">Inv No</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-center">F Year</th>
                   <th className="px-4 py-3 border-b border-slate-200">Barcode ID</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-center w-[40px]">#</th>
                   <th className="px-4 py-3 border-b border-slate-200 w-full">Item Name</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-right w-[80px]">Qty</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-right w-[100px]">Rate</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-center w-[60px]">GST%</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-right w-[120px]">Amount</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-right w-[80px]">Cmsn</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-right w-[80px]">ExCmn</th>
                   <th className="px-4 py-3 border-b border-slate-200 text-center w-[60px]">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-16">
                       <div className="flex flex-col items-center justify-center text-slate-400">
                          <RefreshCcw className="w-12 h-12 mb-4 opacity-20" />
                          <p className="font-bold text-lg">No Items Returned Yet</p>
                          <p className="text-sm font-medium mt-1">Scan barcode or search invoice to add items</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      {/* Placeholder for items logic */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
         </div>

         {/* Bottom Control & Totals Footer */}
         <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            
            {/* Left side: Narration and Print Config */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Narration</label>
                 <textarea 
                   className="bg-white border border-slate-300 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none resize-none h-[60px]"
                   value={formData.narration}
                   onChange={(e) => setFormData({...formData, narration: e.target.value})}
                   placeholder="Enter return reason or remarks..."
                 />
              </div>
              <div className="flex items-center gap-6">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${formData.printA4 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-transparent group-hover:bg-slate-300'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">Print A4 Size</span>
                 </label>
                 <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <Printer className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">Copies:</span>
                    <input type="number" className="w-10 bg-transparent text-sm font-bold text-slate-800 text-center outline-none" value={formData.copies} onChange={e => setFormData({...formData, copies: parseInt(e.target.value) || 1})} min={1} max={10} />
                 </div>
              </div>
            </div>

            {/* Middle side: Modes */}
            <div className="lg:col-span-3 flex flex-col gap-3 h-full justify-end pb-2">
               <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col gap-3">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">Return Mode</div>
                  <div className="flex gap-4">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="mode" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" checked={formData.mode === 'RG Voucher'} onChange={() => setFormData({...formData, mode: 'RG Voucher'})} />
                        <span className="text-sm font-bold text-slate-700">RG Voucher (F5)</span>
                     </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="mode" className="w-4 h-4 text-indigo-600 focus:ring-indigo-500" checked={formData.mode === 'Paid By'} onChange={() => setFormData({...formData, mode: 'Paid By'})} />
                        <span className="text-sm font-bold text-slate-700">Paid By (F6)</span>
                     </label>
                  </div>
                  {formData.mode === 'Paid By' && (
                     <select 
                       className="mt-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-sm font-bold text-slate-700 outline-none"
                       value={formData.paidBy}
                       onChange={(e) => setFormData({...formData, paidBy: e.target.value})}
                     >
                        <option value="CASH">CASH</option>
                        <option value="BANK">BANK</option>
                     </select>
                  )}
               </div>
            </div>

            {/* Right side: Totals */}
            <div className="lg:col-span-4 flex flex-col justify-end gap-3 pb-1">
               <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Qty</span>
                  <span className="text-lg font-black text-slate-800">0.00</span>
               </div>
               <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Amount</span>
                  <span className="text-lg font-black text-slate-800">₹ 0.00</span>
               </div>
               <div className="flex items-center justify-between px-4 group">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Add Charges</span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input type="text" className="w-[120px] bg-white border border-slate-300 px-3 py-1.5 pl-7 rounded-lg text-right font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" value={formData.addCharges} onChange={e => setFormData({...formData, addCharges: e.target.value})} />
                  </div>
               </div>
               <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20 mt-2 transform hover:scale-[1.01] transition-transform">
                  <span className="text-sm font-black uppercase tracking-wider">Net Refund Amount</span>
                  <span className="text-2xl font-black">₹ 0.00</span>
               </div>
            </div>
            
         </div>
      </div>
    </PremiumVoucherTemplate>
  );
}
