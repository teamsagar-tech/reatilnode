import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function StockTransferList() {
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(0);
  const [status, setStatus] = useState('All');

  const sampleData = [
    { id: '1', requestId: 'REQ-2026-001', fromLocation: 'Main Godown', toLocation: 'Store A', status: 'Pending' },
    { id: '2', requestId: 'REQ-2026-002', fromLocation: 'Store B', toLocation: 'Main Godown', status: 'Approved' },
    { id: '3', requestId: 'REQ-2026-003', fromLocation: 'Main Godown', toLocation: 'Store C', status: 'Shipped' },
  ];

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
        // Action to open transfer
      } else if (e.altKey && (e.code === 'KeyC' || e.key.toLowerCase() === 'c' || e.key === 'ç')) {
        e.preventDefault();
        navigate('/inventory/stock-transfer/request');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, selectedRow]);

  return (
    <>
      <Helmet>
        <title>Stock Transfers | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Stock Transfers</div>
               <div className='text-yellow-300'>Transfer Requests List</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
              
              <div className="flex justify-between items-center mb-2 shrink-0">
                <div className='font-bold text-[14px] flex items-center gap-2'>
                   Status:
                   <select 
                      className="bg-[#e0efeb] border border-slate-400 px-1 py-[2px] font-bold outline-none focus:bg-[#ffffe0]"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                       <option value="All">All</option>
                       <option value="Pending">Pending</option>
                       <option value="Approved">Approved</option>
                       <option value="Shipped">Shipped</option>
                       <option value="Delivered">Delivered</option>
                       <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <button 
                  onClick={() => navigate('/inventory/stock-transfer/request')} 
                  className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none'
                >Create Request (Alt/Opt+C)</button>
              </div>
              
              <div className="flex-1 overflow-y-auto border border-slate-400">
                <table className='w-full text-left border-collapse'>
                  <thead className='bg-[#eef5ed] sticky top-0'>
                    <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                      <th className="px-2 py-1 border-r border-slate-300 w-12 text-center">Sr</th>
                      <th className="px-2 py-1 border-r border-slate-300">Request ID</th>
                      <th className="px-2 py-1 border-r border-slate-300">Source Location</th>
                      <th className="px-2 py-1 border-r border-slate-300">Destination Location</th>
                      <th className="px-2 py-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 font-medium text-slate-500">No requests found.</td>
                      </tr>
                    ) : (
                      sampleData.map((row, idx) => (
                        <tr 
                          key={row.id} 
                          className={'text-[12px] border-b border-slate-300 cursor-pointer ' + (selectedRow === idx ? 'bg-[#ffe000] font-bold text-black' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]') + ' hover:bg-[#ffffe0]')}
                          onClick={() => setSelectedRow(idx)}
                        >
                          <td className="px-2 py-1 border-r border-slate-300 text-center font-medium">{idx + 1}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-bold text-blue-700">{row.requestId}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-bold text-slate-800">{row.fromLocation}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-bold text-slate-800">{row.toLocation}</td>
                          <td className="px-2 py-1 font-bold text-slate-800">{row.status}</td>
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
          <div className='font-medium tracking-wide'>Stock Transfer Requests List</div>
          <div className='font-medium tracking-wide'>{sampleData.length} Request(s)</div>
        </div>
      </div>
    </>
  );
}
