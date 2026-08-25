import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function StockRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firm: 'Main Firm',
    sourceLocation: 'Store A',
    destinationLocation: 'Main Godown',
    narration: ''
  });

  const [products, setProducts] = useState([
    { id: 1, item: '', qty: '', rate: '', amount: '' }
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/inventory/stock-transfer/list');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        // Save action
        navigate('/inventory/stock-transfer/list');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Stock Request Creation | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Inventory Voucher Creation</div>
               <div className='text-yellow-300'>Stock Transfer Request</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
              
              {/* Top Header Fields */}
              <div className="grid grid-cols-2 gap-4 mb-2 shrink-0 border-b border-slate-300 pb-2">
                <div className="flex flex-col gap-1">
                  <div className="flex">
                    <span className="w-32 font-bold text-slate-800">Request No.</span>
                    <span className="font-bold mr-1">:</span>
                    <input 
                      className="w-32 bg-[#e0efeb] border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value="New"
                      disabled
                    />
                  </div>
                  <div className="flex mt-1">
                    <span className="w-32 font-bold text-slate-800">Source Godown</span>
                    <span className="font-bold mr-1">:</span>
                    <input 
                      className="flex-1 bg-[#e0efeb] border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.sourceLocation}
                      onChange={(e) => setFormData({...formData, sourceLocation: e.target.value})}
                      autoFocus
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex justify-end">
                    <span className="w-32 font-bold text-slate-800 text-right mr-2">Date</span>
                    <span className="font-bold mr-1">:</span>
                    <input 
                      type="date"
                      className="w-32 bg-[#e0efeb] border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={new Date().toISOString().split('T')[0]}
                      readOnly
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="w-32 font-bold text-slate-800 text-right mr-2">Dest. Godown</span>
                    <span className="font-bold mr-1">:</span>
                    <input 
                      className="w-32 bg-[#e0efeb] border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.destinationLocation}
                      onChange={(e) => setFormData({...formData, destinationLocation: e.target.value})}
                    />
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
                      <th className="px-2 py-1 border-r border-slate-300 w-24 text-right">Quantity</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-24 text-right">Rate</th>
                      <th className="px-2 py-1 w-32 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((row, idx) => (
                      <tr key={row.id} className="text-[12px] border-b border-slate-300 bg-[#fcfaf2] hover:bg-[#ffffe0]">
                        <td className="px-2 py-1 border-r border-slate-300 text-center font-medium">{idx + 1}</td>
                        <td className="px-0 py-0 border-r border-slate-300">
                          <input className="w-full bg-transparent px-2 py-1 outline-none focus:bg-[#ffffe0] focus:ring-1 ring-inset ring-slate-800 font-bold" />
                        </td>
                        <td className="px-0 py-0 border-r border-slate-300">
                           <input className="w-full bg-transparent px-2 py-1 outline-none focus:bg-[#ffffe0] focus:ring-1 ring-inset ring-slate-800 font-bold text-right" />
                        </td>
                        <td className="px-0 py-0 border-r border-slate-300">
                           <input className="w-full bg-transparent px-2 py-1 outline-none focus:bg-[#ffffe0] focus:ring-1 ring-inset ring-slate-800 font-bold text-right" disabled />
                        </td>
                        <td className="px-0 py-0">
                           <input className="w-full bg-transparent px-2 py-1 outline-none focus:bg-[#ffffe0] focus:ring-1 ring-inset ring-slate-800 font-bold text-right" disabled />
                        </td>
                      </tr>
                    ))}
                    {/* Empty rows to fill space */}
                    {[...Array(10)].map((_, i) => (
                      <tr key={`empty-${i}`} className="text-[12px] border-b border-slate-300 bg-[#fcfaf2]">
                        <td className="px-2 py-4 border-r border-slate-300"></td>
                        <td className="px-2 py-4 border-r border-slate-300"></td>
                        <td className="px-2 py-4 border-r border-slate-300"></td>
                        <td className="px-2 py-4 border-r border-slate-300"></td>
                        <td className="px-2 py-4"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Bottom Narration */}
              <div className="mt-2 shrink-0 border-t border-slate-300 pt-2 flex items-start gap-4">
                 <div className="flex-1 flex gap-2 items-center">
                    <span className="font-bold text-slate-800">Narration:</span>
                    <textarea 
                      className="flex-1 bg-[#e0efeb] border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 resize-none h-10"
                      value={formData.narration}
                      onChange={(e) => setFormData({...formData, narration: e.target.value})}
                    />
                 </div>
              </div>
              
              <div className="flex justify-end mt-4">
                 <button className="bg-[#1b5e58] border border-black text-white px-6 py-1 font-bold text-[12px] shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-[#12423d]">
                    Send Request (Cmd/Ctrl+A)
                 </button>
              </div>
              
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {[
               { key: 'F1', label: 'Help' },
               { key: 'F2', label: 'Date' },
               { key: 'F3', label: 'Company' },
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
               onClick={() => navigate('/inventory/stock-transfer/list')}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Stock Transfer Request Creation</div>
        </div>
      </div>
    </>
  );
}
