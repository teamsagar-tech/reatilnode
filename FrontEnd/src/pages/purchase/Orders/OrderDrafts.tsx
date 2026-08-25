import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function OrderDrafts() {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/dashboard');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedRow((prev) => Math.min(prev + 1, sampleData.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedRow((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        // Action to open draft
      } else if (e.altKey && (e.code === 'KeyC' || e.key.toLowerCase() === 'c' || e.key === 'ç')) {
        e.preventDefault();
        navigate('/purchase/orders/create'); // Navigate to PO Creation
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const sampleData = [
    { draftId: 'DRF-1001', partyName: 'ABC Distributors', orderDate: '2026-08-01', createdAt: '2026-08-01 10:00' },
    { draftId: 'DRF-1002', partyName: 'XYZ Wholesalers', orderDate: '2026-08-02', createdAt: '2026-08-02 11:30' },
    { draftId: 'DRF-1003', partyName: 'LMN Suppliers', orderDate: '2026-08-03', createdAt: '2026-08-03 14:15' },
  ];

  return (
    <>
      <Helmet>
        <title>PO Drafts | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Purchase Order</div>
               <div className='text-yellow-300'>List of Drafts</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
              <div className='flex justify-between items-center mb-2 shrink-0'>
                <div className='font-bold text-slate-800 text-[14px]'>Saved Purchase Order Drafts</div>
                <button 
                  onClick={() => navigate('/purchase/orders/create')} 
                  className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none'
                >Create New PO (Alt/Opt+C)</button>
              </div>
              
              <div className="flex-1 overflow-y-auto border border-slate-400">
                <table className='w-full text-left border-collapse'>
                  <thead className='bg-[#eef5ed] sticky top-0'>
                    <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                      <th className="px-2 py-1 border-r border-slate-300 w-12 text-center">Sr</th>
                      <th className="px-2 py-1 border-r border-slate-300">Draft ID</th>
                      <th className="px-2 py-1 border-r border-slate-300">Party Name</th>
                      <th className="px-2 py-1 border-r border-slate-300">Order Date</th>
                      <th className="px-2 py-1">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 font-medium text-slate-500">No drafts found.</td>
                      </tr>
                    ) : (
                      sampleData.map((row, idx) => (
                        <tr 
                          key={row.draftId} 
                          className={'text-[12px] border-b border-slate-300 cursor-pointer ' + (selectedRow === idx ? 'bg-[#ffe000] font-bold text-black' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]') + ' hover:bg-[#ffffe0]')}
                          onClick={() => setSelectedRow(idx)}
                        >
                          <td className="px-2 py-1 border-r border-slate-300 text-center text-slate-700">{idx + 1}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-slate-900">{row.draftId}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-slate-700">{row.partyName}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-slate-700">{row.orderDate}</td>
                          <td className="px-2 py-1 text-slate-700">{row.createdAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {[
               { key: 'F1', label: 'Help' },
               { key: 'F2', label: 'Date' },
               { key: 'F3', label: 'Company' },
               { key: 'F4', label: 'Edit' },
               { key: 'F5', label: 'Delete' },
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
             <div className="flex flex-col items-center justify-center p-2 mb-2 border-t border-[#a3c3be] mx-2 pt-4">
               <svg width="64" height="64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="100" cy="100" r="86" fill="transparent" stroke="#1b5e58" strokeWidth="14" />
                 <circle cx="14" cy="100" r="8" fill="transparent" stroke="#1b5e58" strokeWidth="5" />
                 <circle cx="186" cy="100" r="8" fill="transparent" stroke="#1b5e58" strokeWidth="5" />
                 <text x="100" y="100" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="72" textAnchor="middle" dominantBaseline="central">
                   <tspan fill="#12423d">RN</tspan><tspan fill="#1b5e58">.</tspan>
                 </text>
               </svg>
               <span className="font-extrabold text-[13px] text-[#12423d] mt-2 uppercase tracking-widest text-center">RetailNode</span>
             </div>

             <button 
               onClick={() => navigate('/dashboard')}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>PO Drafts</div>
          <div className='font-medium tracking-wide'>{sampleData.length} Draft(s)</div>
        </div>
      </div>
    </>
  );
}
