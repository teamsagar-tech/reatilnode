import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../components/SearchableDropdown';
import { toast } from "../../store/useToastStore";

export default function HundekariPayment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    paymentNo: `HP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    hundekari_name: '',
    hundekari_id: '',
    paymentMode: 'Bank Transfer',
    ledgerAc: '',
    ratePerBale: '',
    amount: '',
    refNo: '',
    remarks: ''
  });

  const [hundekaris, setHundekaris] = useState<any[]>([]);
  const [pendingLRs, setPendingLRs] = useState<any[]>([]);
  const [totalPendingBales, setTotalPendingBales] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7189'}/api/logistics/hundekari`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setHundekaris(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, []);

  const handleHundekariSelect = async (opt: any) => {
    setFormData(prev => ({ ...prev, hundekari_name: opt.name || opt.hundekari_name, hundekari_id: opt.id }));
    
    // Fetch pending LRs for this hundekari
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7189'}/api/logistics/hundekari-pending-lrs/${opt.id}`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingLRs(data.pending_lrs || []);
        setTotalPendingBales(data.total_pending_bales || 0);
        
        // Auto calculate amount if rate is set
        if (formData.ratePerBale) {
            setFormData(prev => ({ ...prev, amount: String((data.total_pending_bales || 0) * parseFloat(formData.ratePerBale)) }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRateChange = (val: string) => {
      setFormData(prev => ({ 
          ...prev, 
          ratePerBale: val, 
          amount: val && !isNaN(Number(val)) ? String(Number(val) * totalPendingBales) : prev.amount 
      }));
  };

  const handleSave = async () => {
    if (!formData.hundekari_id || !formData.amount) {
        toast.warning('Please select Hundekari and enter Amount');
        return;
    }
    setIsSaving(true);
    try {
      const payload = {
          payment_no: formData.paymentNo,
          payment_date: formData.date,
          hundekari_id: formData.hundekari_id,
          payment_mode: formData.paymentMode,
          ledger_id: null,
          amount: formData.amount,
          ref_no: formData.refNo,
          remarks: formData.remarks,
          lr_ids: pendingLRs.map(lr => lr.id)
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7189'}/api/logistics/hundekari-payments`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` 
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
          toast.success('Hundekari Payment Saved Successfully!');
          navigate(-1);
      } else {
          toast.error(data.message || 'Failed to save');
      }
    } catch (e) {
        console.error(e);
        toast.error('Server Error');
    } finally {
        setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, handleSave]);

  return (
    <>
      <Helmet>
        <title>Hundekari Payment | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Hundekari Payment Voucher</div>
               <div className='text-yellow-300'>RetailNode ERP</div>
            </div>
            
            <div className='flex flex-col p-4 overflow-hidden h-full gap-2'>
               {/* Form Header */}
               <div className="flex gap-10 bg-[#eef5ed] p-3 border border-[#a3c3be] shadow-sm">
                 {/* Left Panel */}
                 <div className="flex-1 flex flex-col gap-1">
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Payment No :</span>
                     <input type="text" disabled value={formData.paymentNo} className="border border-slate-500 bg-slate-100 px-1 flex-1 text-slate-500 cursor-not-allowed" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Payment Mode :</span>
                     <SearchableDropdown id="payment-mode" className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={formData.paymentMode} onChange={(val) => setFormData({...formData, paymentMode: val})} options={['Cash', 'Bank Transfer', 'Cheque', 'UPI']} placeholder="Select Mode" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Ledger A/c :</span>
                     <SearchableDropdown id="ledger-ac" className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={formData.ledgerAc} onChange={(val) => setFormData({...formData, ledgerAc: val})} options={['HDFC Bank A/c', 'ICICI Current A/c', 'Main Cash', 'Petty Cash']} placeholder="Select Ledger" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Ref/Cheque No :</span>
                     <input type="text" value={formData.refNo} onChange={e => setFormData({...formData, refNo: e.target.value})} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0] uppercase" placeholder="UTR / CHQ No." />
                   </div>
                 </div>

                 {/* Right Panel */}
                 <div className="flex-1 flex flex-col gap-1">
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Date :</span>
                     <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border border-slate-500 bg-white px-1 w-[130px] focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Hundekari A/c :</span>
                     <SearchableDropdown 
                        id="hundekari" 
                        className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" 
                        value={formData.hundekari_name} 
                        onChange={(val) => setFormData({...formData, hundekari_name: val, hundekari_id: ''})} 
                        onSelect={handleHundekariSelect}
                        options={hundekaris} 
                        displayKey="hundekari_name"
                        placeholder="Select Hundekari" 
                     />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Rate/Bale (₹) :</span>
                     <input type="number" value={formData.ratePerBale} onChange={e => handleRateChange(e.target.value)} className="border border-slate-500 bg-white px-1 w-[130px] focus:outline-none focus:border-black focus:bg-[#ffffe0] text-right font-bold text-black" placeholder="Optional" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Amount (₹) :</span>
                     <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="border border-slate-500 bg-yellow-50 px-1 w-[130px] focus:outline-none focus:border-black focus:bg-[#ffffe0] text-right font-bold text-[#1b5e58]" placeholder="0.00" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Remarks :</span>
                     <input type="text" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" placeholder="Any narration..." />
                   </div>
                 </div>
               </div>

               {/* Data Grid for Pending LRs */}
               <div className="mt-2 mb-1 flex justify-between items-end">
                   <div className="text-[12px] font-bold text-[#1b5e58]">Unpaid Inwarded LRs (Pending Vouchers)</div>
                   {totalPendingBales > 0 && (
                       <div className="text-[13px] font-bold bg-yellow-100 text-yellow-800 px-3 py-1 border border-yellow-400 shadow-sm rounded-sm">
                           Total Pending Bales: {totalPendingBales}
                       </div>
                   )}
               </div>
               <div className='flex-1 border border-slate-400 bg-white overflow-auto outline-none'>
                 <table className='w-full text-left border-collapse' style={{ tableLayout: 'fixed' }}>
                   <thead className='bg-[#eef5ed] sticky top-0 shadow-sm z-20'>
                     <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                       <th className='px-2 py-1 border-r border-slate-300 w-[120px] text-center'>Inward Date</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[180px]'>LR No</th>
                       <th className='px-2 py-1 border-r border-slate-300'>Transporter</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[120px] text-center'>Bales</th>
                       <th className='px-2 py-1 w-[100px] text-center'>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {pendingLRs.length > 0 ? pendingLRs.map((lr, i) => (
                         <tr key={lr.id} className={`text-[12px] border-b border-slate-200 hover:bg-[#ffe000] cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]'}`}>
                             <td className='px-2 py-1 border-r border-slate-300 text-center'>{lr.inward_date}</td>
                             <td className='px-2 py-1 border-r border-slate-300 font-medium'>{lr.lr_no}</td>
                             <td className='px-2 py-1 border-r border-slate-300'>{lr.transporter || '-'}</td>
                             <td className='px-2 py-1 border-r border-slate-300 text-center font-bold'>{lr.bales}</td>
                             <td className='px-2 py-1 text-center font-bold text-orange-500'>Pending</td>
                         </tr>
                     )) : (
                         <tr>
                             <td colSpan={5} className="px-2 py-8 text-center text-slate-500 italic">
                                 Select a Hundekari to view unpaid LRs.
                             </td>
                         </tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb] shrink-0'>
             {[
               { key: 'Cmd+A', label: 'Save', action: handleSave }
             ].map((f) => (
               <button 
                 key={f.key} 
                 onClick={f.action}
                 disabled={isSaving}
                 className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] disabled:opacity-50'
               >
                 <span className='font-bold text-black text-[11px] w-[35px]'>{f.key}</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
               </button>
             ))}
             <div className='flex-1' />
             <button 
               onClick={() => navigate(-1)}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Hundekari Payment</div>
        </div>
      </div>
    </>
  );
}
