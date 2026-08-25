import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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
    <>
      <Helmet>
        <title>Purchase Returns | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>List of Purchase Returns</div>
               <div className='text-yellow-300'>RetailNode ERP</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               <div className='flex justify-between items-center mb-2'>
                 <div className='flex items-center gap-2'>
                   <span className='font-bold text-slate-800'>Filter Type:</span>
                   <select 
                     value={returnType}
                     onChange={(e) => setReturnType(e.target.value)}
                     className="bg-[#e0efeb] border border-slate-400 px-2 py-[2px] font-bold outline-none focus:bg-[#ffffe0]"
                   >
                     <option value="defective">Defective</option>
                     <option value="non_defective">Non-Defective</option>
                     <option value="all">All Returns</option>
                   </select>
                 </div>
                 
                 <button 
                    onClick={() => navigate('/purchase/returns/manual-purchase-return')}
                    className='bg-[#eef5ed] border border-[#a3c3be] px-3 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none'
                 >
                    + New Manual Return (Alt/Opt+C)
                 </button>
               </div>

               <div className="flex-1 overflow-y-auto border border-slate-400 bg-white">
                  <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#eef5ed] sticky top-0'>
                      <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                        <th className="px-2 py-1 border-r border-slate-300 w-12 text-center">Sr</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-32">Return No</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-32">Date</th>
                        <th className="px-2 py-1 border-r border-slate-300">Party Name</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-24 text-center">Items</th>
                        <th className="px-2 py-1 w-32 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.map((row, idx) => (
                        <tr 
                          key={row.id} 
                          className={'text-[12px] border-b border-slate-300 cursor-pointer ' + (selectedRow === idx ? 'bg-[#ffe000] font-bold' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]') + ' hover:bg-[#ffffe0]')}
                          onClick={() => setSelectedRow(idx)}
                        >
                          <td className="px-2 py-1 border-r border-slate-300 text-center">{idx + 1}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-blue-700">{row.prNo}</td>
                          <td className="px-2 py-1 border-r border-slate-300">{row.date}</td>
                          <td className="px-2 py-1 border-r border-slate-300">{row.party}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-center">{row.items}</td>
                          <td className="px-2 py-1 text-right">{row.amount}</td>
                        </tr>
                      ))}
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
               { key: 'Alt+C', label: 'Create' },
             ].map((f) => (
               <button 
                 key={f.key} 
                 className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
                 onClick={() => {
                    if(f.key === 'Alt+C') navigate('/purchase/returns/manual-purchase-return');
                 }}
               >
                 <span className='font-bold text-black text-[11px] w-[35px]'>{f.key}</span>
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
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Purchase Returns List</div>
        </div>
      </div>
    </>
  );
}
