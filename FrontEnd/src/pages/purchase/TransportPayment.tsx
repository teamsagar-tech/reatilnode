import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../components/SearchableDropdown';

export default function TransportPayment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    paymentNo: 'TP-2026-001',
    transporter: '',
    paymentMode: 'Bank Transfer',
    ledgerAc: '',
    amount: '',
    refNo: '',
    remarks: ''
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        alert('Transport Payment Saved Successfully!');
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Transport Payment | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Transport Payment Voucher</div>
               <div className='text-yellow-300'>RetailNode ERP</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               
               {/* Voucher Top Form */}
               <div className="p-2 border-b-2 border-[#1b5e58] flex gap-4 bg-[#fcfaf2]">
                 
                 {/* Left Panel */}
                 <div className="w-[35%] flex flex-col gap-1 pr-4 border-r-2 border-[#81a09d]">
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
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Transporter A/c :</span>
                     <SearchableDropdown id="transporter" className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={formData.transporter} onChange={(val) => setFormData({...formData, transporter: val})} options={['VRL Logistics', 'SafeExpress', 'Delhivery Freight', 'TCI Express']} placeholder="Select Transporter" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Amount (₹) :</span>
                     <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="border border-slate-500 bg-white px-1 w-[130px] focus:outline-none focus:border-black focus:bg-[#ffffe0] text-right font-bold text-[#1b5e58]" placeholder="0.00" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Remarks :</span>
                     <input type="text" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" placeholder="Any narration..." />
                   </div>
                 </div>
               </div>

               {/* Data Grid for Pending/Done Payments */}
               <div className='flex-1 border border-slate-400 bg-white overflow-auto outline-none mt-2'>
                 <table className='w-full text-left border-collapse' style={{ tableLayout: 'fixed' }}>
                   <thead className='bg-[#eef5ed] sticky top-0 shadow-sm z-20'>
                     <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                       <th className='px-2 py-1 border-r border-slate-300 w-[90px] text-center'>Date</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[120px]'>Payment No</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[140px]'>Transporter</th>
                       <th className='px-2 py-1 border-r border-slate-300'>Remarks</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[120px] text-right'>Amount (₹)</th>
                       <th className='px-2 py-1 w-[100px] text-center'>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className='text-[12px] border-b border-slate-200 hover:bg-[#ffe000] cursor-pointer bg-white'>
                       <td className='px-2 py-1 border-r border-slate-300 text-center'>20/08/2026</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-medium'>TP-2026-003</td>
                       <td className='px-2 py-1 border-r border-slate-300'>VRL Logistics</td>
                       <td className='px-2 py-1 border-r border-slate-300'>Advance payment</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right'>15,000.00</td>
                       <td className='px-2 py-1 text-center font-bold text-green-600'>Done</td>
                     </tr>
                     <tr className='text-[12px] border-b border-slate-200 hover:bg-[#ffe000] cursor-pointer bg-[#fcfaf2]'>
                       <td className='px-2 py-1 border-r border-slate-300 text-center'>22/08/2026</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-medium'>TP-2026-004</td>
                       <td className='px-2 py-1 border-r border-slate-300'>Delhivery Freight</td>
                       <td className='px-2 py-1 border-r border-slate-300'>Pending clearance</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right'>8,500.00</td>
                       <td className='px-2 py-1 text-center font-bold text-orange-500'>Pending</td>
                     </tr>
                     <tr className='text-[12px] border-b border-slate-200 hover:bg-[#ffe000] cursor-pointer bg-white'>
                       <td className='px-2 py-1 border-r border-slate-300 text-center'>23/08/2026</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-medium'>TP-2026-005</td>
                       <td className='px-2 py-1 border-r border-slate-300'>TCI Express</td>
                       <td className='px-2 py-1 border-r border-slate-300'>Bill #1245 Settlement</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right'>42,100.00</td>
                       <td className='px-2 py-1 text-center font-bold text-green-600'>Done</td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb] shrink-0'>
             {[
               { key: 'Cmd+A', label: 'Save' }
             ].map((f) => (
               <button 
                 key={f.key} 
                 className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
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
          <div className='font-medium tracking-wide'>Transport Payment</div>
        </div>
      </div>
    </>
  );
}
