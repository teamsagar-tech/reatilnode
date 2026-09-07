import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ label, value, onChange, placeholder = '', type = 'text', onKeyDown }: any) => (
  <div className="flex items-center text-[12px] mb-1">
    <label className="w-[120px] font-semibold text-slate-700 shrink-0">{label}</label>
    <span className="font-bold mr-1 text-slate-400">:</span>
    <input
      type={type}
      className="flex-1 border border-slate-300 px-1 py-[2px] focus:outline-none focus:border-[#1b5e58] focus:bg-[#ffffe0] bg-white transition-colors"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  </div>
);

export default function BulkLabelPrintPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [focusedRow, setFocusedRow] = useState(0);

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/label-print/bulk-invoices`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setInvoices(data.data.invoices);
      }
    } catch (err) {
      console.error('Failed to fetch bulk invoices', err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setFocusedRow(prev => Math.min(prev + 1, invoices.length - 1));
      } else if (e.key === 'ArrowUp') {
        setFocusedRow(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        alert(`Generating bulk labels for invoice: ${invoices[focusedRow]?.bill_no}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [invoices, focusedRow]);

  return (
    <>
      <Helmet>
        <title>Bulk Label Print | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Inventory Operations</div>
               <div className='text-yellow-300'>Bulk Label Print (Delivered Invoices)</div>
            </div>
            
            <div className='flex-1 overflow-y-auto bg-white flex flex-col mt-2'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#eef5ed] sticky top-0 border-b-2 border-[#81a09d]'>
                        <tr className='text-[#1b5e58] font-bold text-[12px]'>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Bill Date</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Bill No</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">GRN</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Party Name</th>
                            <th className="px-2 py-1 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-8 text-slate-400 font-bold">No delivered invoices found for bulk print</td></tr>
                        ) : (
                            invoices.map((inv, idx) => (
                                <tr 
                                  key={inv.id} 
                                  className={`text-[12px] border-b border-slate-200 cursor-pointer ${focusedRow === idx ? 'bg-[#ffffe0] font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-800'}`}
                                  onClick={() => setFocusedRow(idx)}
                                >
                                    <td className="px-2 py-1 border-r border-slate-200">{new Date(inv.bill_date).toLocaleDateString()}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{inv.bill_no}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{inv.grn}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{inv.party_name}</td>
                                    <td className="px-2 py-1 text-center font-bold text-[#1b5e58] underline">
                                        {focusedRow === idx ? '[Enter] Generate' : 'Generate'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className='bg-[#eef5ed] border-t-2 border-[#81a09d] p-2 flex justify-between shrink-0 font-bold text-[12px]'>
                <div className='text-slate-700'>Total Invoices: {invoices.length}</div>
            </div>

          </div>

          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             <button onClick={() => navigate('/dashboard')} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left'>
                 <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
          
        </div>
        
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Bulk Label Operation</div>
        </div>
      </div>
    </>
  );
}
