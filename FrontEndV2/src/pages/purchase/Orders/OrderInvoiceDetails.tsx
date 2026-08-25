import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function OrderInvoiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/purchase/orders/invoices');
      } else if (e.altKey && (e.key.toLowerCase() === 'p' || e.key === 'π')) {
        e.preventDefault();
        // Print action
        alert('Print triggered');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Order Invoice Details | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Purchase Order Viewer</div>
               <div className='text-yellow-300'>Order No: PO-2026-00{id}</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
              
              {/* Header Info */}
              <div className="grid grid-cols-2 border border-slate-400 p-2 mb-2 bg-[#eef5ed] shrink-0">
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800">Party Name</span>
                    <span className="font-bold mr-1">:</span>
                    <span className="font-bold text-slate-900">ABC Distributors</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800">Order No.</span>
                    <span className="font-bold mr-1">:</span>
                    <span className="font-bold text-slate-900">PO-2026-00{id}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800">Order Date</span>
                    <span className="font-bold mr-1">:</span>
                    <span className="font-bold text-slate-900 w-24">2026-08-01</span>
                  </div>
                  <div className="flex">
                    <span className="w-24 font-bold text-slate-800">Status</span>
                    <span className="font-bold mr-1">:</span>
                    <span className="font-bold text-green-700 w-24">Approved</span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-y-auto border border-slate-400 mt-2">
                <table className='w-full text-left border-collapse'>
                  <thead className='bg-[#eef5ed] sticky top-0'>
                    <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                      <th className="px-2 py-1 border-r border-slate-300 w-10 text-center">Sr</th>
                      <th className="px-2 py-1 border-r border-slate-300">Name of Item</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-24">HSN</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-24 text-right">Quantity</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-24 text-right">Rate</th>
                      <th className="px-2 py-1 w-32 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((idx) => (
                      <tr key={idx} className="text-[12px] border-b border-slate-300 bg-white hover:bg-[#ffffe0]">
                        <td className="px-2 py-1 border-r border-slate-300 text-center font-medium">{idx}</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-slate-900 font-bold">Sample Item {idx}</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-slate-800">6203</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-slate-800 text-right">100</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-slate-800 text-right">550.00</td>
                        <td className="px-2 py-1 text-slate-900 font-bold text-right">55,000.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Totals */}
              <div className="mt-2 shrink-0 border-t border-slate-400 pt-2 flex items-start gap-4">
                 <div className="flex-1 flex gap-2 items-center">
                    <span className="font-bold text-slate-800">Narration:</span>
                    <span className="text-slate-900 italic">Please deliver within 10 days.</span>
                 </div>
                 <div className="w-48 text-right font-bold text-[14px]">
                    Total: <span className="text-xl ml-2 text-slate-900">₹ 1,65,000.00</span>
                 </div>
              </div>
              
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {[
               { key: 'F1', label: 'Help' },
               { key: 'Alt+P', label: 'Print' },
             ].map((f) => (
               <button 
                 key={f.key} 
                 className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
               >
                 <span className='font-bold text-black text-[11px] w-[25px]'>{f.key}</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
               </button>
             ))}
             <div className='flex-1' />
             <button 
               onClick={() => navigate('/purchase/orders/invoices')}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Invoice Viewer</div>
        </div>
      </div>
    </>
  );
}
