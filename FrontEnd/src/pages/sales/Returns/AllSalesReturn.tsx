import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../../components/SearchableDropdown';

export default function AllSalesReturn() {
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>All Sales Returns (Credit Notes) | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>All Sales Returns (Credit Note Register)</div>
               <div className='text-yellow-300'>RetailNode ERP</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               
               {/* Filter Bar */}
               <div className="p-2 border-b-2 border-[#1b5e58] flex gap-4 bg-[#fcfaf2] items-end">
                 <div className="flex flex-col gap-1 w-[150px]">
                   <label className="font-bold text-slate-800 text-[11px]">From Date</label>
                   <input type="date" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} className="border border-slate-500 bg-white px-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                 </div>
                 <div className="flex flex-col gap-1 w-[150px]">
                   <label className="font-bold text-slate-800 text-[11px]">To Date</label>
                   <input type="date" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} className="border border-slate-500 bg-white px-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                 </div>
                 <div className="flex flex-col gap-1 flex-1">
                   <label className="font-bold text-slate-800 text-[11px]">Search Customer</label>
                   <SearchableDropdown id="search-cust" className="border border-slate-500 bg-white px-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={''} onChange={() => {}} options={['Walk-in Customer', 'Ramesh Enterprises']} placeholder="Type to search..." />
                 </div>
                 <button className="bg-[#1b5e58] text-white px-4 py-1 font-bold border border-[#12423d] hover:bg-[#12423d] shadow-[inset_1px_1px_0_rgba(255,255,255,0.3)]">
                   Fetch Data
                 </button>
               </div>

               {/* Data Grid */}
               <div className='flex-1 border border-slate-400 bg-white overflow-auto outline-none mt-2 flex flex-col'>
                 <table className='w-full text-left border-collapse min-h-full' style={{ tableLayout: 'fixed' }}>
                   <thead className='bg-[#eef5ed] sticky top-0 shadow-sm z-20'>
                     <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                       <th className='px-2 py-1 border-r border-slate-300 w-[100px]'>Date</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[140px]'>Return / CN No</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[140px]'>Orig Inv No</th>
                       <th className='px-2 py-1 border-r border-slate-300 flex-1'>Customer Name</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[140px]'>Settlement Mode</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[80px] text-right'>Tot Qty</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[120px] text-right'>Amount (₹)</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[120px] text-center'>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className='text-[12px] border-b border-slate-200 hover:bg-[#ffe000] cursor-pointer bg-white'>
                       <td className='px-2 py-1 border-r border-slate-300 text-center'>22/08/2026</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-bold'>SR-2026-102</td>
                       <td className='px-2 py-1 border-r border-slate-300'>INV-5012</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-medium'>Ramesh Enterprises</td>
                       <td className='px-2 py-1 border-r border-slate-300'>Credit Note</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right'>3</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right font-bold'>4,500.00</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-center font-bold text-orange-600'>Unsettled</td>
                     </tr>
                     <tr className='text-[12px] border-b border-slate-200 hover:bg-[#ffe000] cursor-pointer bg-[#fcfaf2]'>
                       <td className='px-2 py-1 border-r border-slate-300 text-center'>24/08/2026</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-bold'>QSR-2026-045</td>
                       <td className='px-2 py-1 border-r border-slate-300'>-</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-medium'>Walk-in Customer</td>
                       <td className='px-2 py-1 border-r border-slate-300'>Cash Refund</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right'>1</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right font-bold'>499.00</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-center font-bold text-green-600'>Refunded</td>
                     </tr>
                     <tr className="h-full">
                       <td colSpan={8} className="border-none bg-white"></td>
                     </tr>
                   </tbody>
                   <tfoot className="sticky bottom-0 bg-[#eef5ed] shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-10 border-t-2 border-slate-400">
                      <tr className="font-bold text-slate-900 text-[14px]">
                        <td colSpan={5} className="px-2 py-1 border-r border-slate-300 text-right italic">Grand Total:</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-right">4</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-right">4,999.00</td>
                        <td className="px-2 py-1 border-r border-slate-300"></td>
                      </tr>
                   </tfoot>
                 </table>
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb] shrink-0'>
             {[
               { key: 'Enter', label: 'View Note' }
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
          <div className='font-medium tracking-wide'>All Sales Returns (Credit Note Register)</div>
        </div>
      </div>
    </>
  );
}
