import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../../components/SearchableDropdown';

export default function QuickSellReturn() {
  const navigate = useNavigate();
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    returnNo: 'QSR-2026-045',
    customer: 'Walk-in Customer',
    settlementMode: 'Credit Note',
    remarks: '',
  });

  const [barcode, setBarcode] = useState('');

  // Auto-focus barcode on load
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        alert('Credit Note Generated Successfully!');
        navigate(-1);
      } else if (e.key === 'F3') {
        e.preventDefault();
        barcodeInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleBarcodeSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcode.trim() !== '') {
      e.preventDefault();
      alert(`Scanned Barcode: ${barcode} for Return`);
      setBarcode('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Quick Sell Return | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Quick Sell Return (Credit Note Gen)</div>
               <div className='text-yellow-300'>RetailNode ERP</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               
               {/* Voucher Top Form */}
               <div className="p-2 border-b-2 border-[#1b5e58] flex gap-4 bg-[#fcfaf2]">
                 
                 {/* Left Panel */}
                 <div className="w-[40%] flex flex-col gap-1 pr-4 border-r-2 border-[#81a09d]">
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Voucher No :</span>
                     <input type="text" disabled value={formData.returnNo} className="border border-slate-500 bg-slate-100 px-1 flex-1 text-slate-500 cursor-not-allowed" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Customer A/c :</span>
                     <SearchableDropdown id="customer" className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={formData.customer} onChange={(val) => setFormData({...formData, customer: val})} options={['Walk-in Customer', 'Ramesh Enterprises', 'Gupta Traders', 'Fashion Hub']} placeholder="Select Customer" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Settlement Mode :</span>
                     <SearchableDropdown id="settlement" className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={formData.settlementMode} onChange={(val) => setFormData({...formData, settlementMode: val})} options={['Credit Note', 'Cash Refund', 'Card / UPI Refund']} placeholder="Select Settlement" />
                   </div>
                 </div>

                 {/* Right Panel */}
                 <div className="flex-1 flex flex-col gap-1">
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Date :</span>
                     <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border border-slate-500 bg-white px-1 w-[130px] focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[120px] text-slate-800 font-bold mr-2">Remarks :</span>
                     <input type="text" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" placeholder="Reason for return..." />
                   </div>
                   
                   {/* Barcode Scanner Input */}
                   <div className="flex items-center mt-auto gap-2">
                     <span className="w-[120px] text-[#1b5e58] font-black mr-2 text-[14px]">SCAN ITEM :</span>
                     <input 
                       ref={barcodeInputRef}
                       type="text" 
                       value={barcode} 
                       onChange={e => setBarcode(e.target.value)} 
                       onKeyDown={handleBarcodeSubmit}
                       className="border-2 border-red-500 bg-red-50 focus:bg-red-100 px-2 py-1 flex-1 focus:outline-none font-bold text-[14px] transition-colors" 
                       placeholder="Scan Barcode to RETURN item..." 
                     />
                   </div>
                 </div>
               </div>

               {/* Data Grid for Scanned Items */}
               <div className='flex-1 border border-slate-400 bg-white overflow-auto outline-none mt-2 flex flex-col'>
                 <table className='w-full text-left border-collapse min-h-full' style={{ tableLayout: 'fixed' }}>
                   <thead className='bg-[#eef5ed] sticky top-0 shadow-sm z-20'>
                     <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                       <th className='px-2 py-1 border-r border-slate-300 w-[40px] text-center'>#</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[140px]'>Barcode</th>
                       <th className='px-2 py-1 border-r border-slate-300 flex-1'>Name of Item</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[100px] text-center'>Status</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[80px] text-right'>Qty</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[100px] text-right'>Rate</th>
                       <th className='px-2 py-1 border-r border-slate-300 w-[120px] text-right'>Amount (₹)</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr className='text-[12px] border-b border-slate-200 hover:bg-[#ffe000] cursor-pointer bg-red-50'>
                       <td className='px-2 py-1 border-r border-slate-300 text-center'>1</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-bold'>8901234567890</td>
                       <td className='px-2 py-1 border-r border-slate-300 font-medium'>Cotton T-Shirt Basic</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-center text-red-600 font-bold'>RETURNED</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right bg-white font-bold outline outline-1 outline-slate-400'>1</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right'>499.00</td>
                       <td className='px-2 py-1 border-r border-slate-300 text-right font-bold text-[#1b5e58]'>499.00</td>
                     </tr>
                     <tr className="h-full">
                       <td colSpan={7} className="border-none bg-white"></td>
                     </tr>
                   </tbody>
                   <tfoot className="sticky bottom-0 bg-[#eef5ed] shadow-[0_-1px_3px_rgba(0,0,0,0.1)] z-10 border-t-2 border-slate-400">
                      <tr className="font-bold text-slate-900 text-[14px]">
                        <td colSpan={4} className="px-2 py-1 border-r border-slate-300 text-right italic text-[#1b5e58]">Total Credit Note Value:</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-right text-[#1b5e58]">1</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-right"></td>
                        <td className="px-2 py-1 border-r border-slate-300 text-right text-[#1b5e58]">499.00</td>
                      </tr>
                   </tfoot>
                 </table>
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb] shrink-0'>
             {[
               { key: 'F3', label: 'Focus Scan' },
               { key: 'Cmd+A', label: 'Save & Print' }
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
          <div className='font-medium tracking-wide'>Quick Sell Return (Barcode Focus)</div>
        </div>
      </div>
    </>
  );
}
