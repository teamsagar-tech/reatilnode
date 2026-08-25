import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../../components/SearchableDropdown';

export default function SalesReturn() {
  const navigate = useNavigate();
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    date: '2026-08-24',
    transNo: '1025',
    cashCustomerName: '',
    firm: 'V.R.Pawar Sarees',
    invoiceNo: '',
    barcodeId: '',
    narration: '',
    addCharges: '0.00',
    mode: 'RG Voucher', // RG Voucher or Paid By
    paidBy: 'CASH',
    defaultMode: 'RG Voucher'
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        alert('Sales Return Saved Successfully!');
        navigate(-1);
      } else if (e.key === 'F5') {
        e.preventDefault();
        setFormData(prev => ({ ...prev, mode: 'RG Voucher' }));
      } else if (e.key === 'F6') {
        e.preventDefault();
        setFormData(prev => ({ ...prev, mode: 'Paid By' }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Sales Return | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Sales Return</div>
               <div className='text-yellow-300'>RetailNode ERP</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               
               {/* Voucher Top Form */}
               <div className="p-2 border-b-2 border-[#1b5e58] flex gap-4 bg-[#fcfaf2]">
                 
                 {/* Left Panel */}
                 <div className="w-[45%] flex flex-col gap-1 pr-4 border-r-2 border-[#81a09d]">
                   <div className="flex items-center">
                     <span className="w-[100px] text-slate-800 font-bold mr-2 text-right">Trans No :</span>
                     <input type="text" value={formData.transNo} readOnly className="border border-slate-500 bg-slate-100 px-1 w-[100px] text-slate-500 outline-none" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[100px] text-slate-800 font-bold mr-2 text-right">Firm :</span>
                     <SearchableDropdown id="firm" className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={formData.firm} onChange={(val) => setFormData({...formData, firm: val})} options={['V.R.Pawar Sarees', 'Main Branch', 'Wholesale Division']} placeholder="Select Firm" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[100px] text-slate-800 font-bold mr-2 text-right">Invoice No :</span>
                     <div className="flex flex-1 gap-1">
                       <input type="text" value={formData.invoiceNo} onChange={e => setFormData({...formData, invoiceNo: e.target.value})} className="border border-slate-500 bg-white px-1 w-[80px] focus:outline-none focus:border-black focus:bg-[#ffffe0] uppercase" />
                       <SearchableDropdown id="invoice-select" className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={''} onChange={() => {}} options={[]} placeholder="Search Inv..." />
                     </div>
                   </div>
                 </div>

                 {/* Right Panel */}
                 <div className="flex-1 flex flex-col gap-1">
                   <div className="flex items-center">
                     <span className="w-[150px] whitespace-nowrap text-slate-800 font-bold mr-2 text-right">Date :</span>
                     <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="border border-slate-500 bg-white px-1 w-[120px] focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                   </div>
                   <div className="flex items-center">
                     <span className="w-[150px] whitespace-nowrap text-slate-800 font-bold mr-2 text-right">Cash Customer Name :</span>
                     <input type="text" value={formData.cashCustomerName} onChange={e => setFormData({...formData, cashCustomerName: e.target.value})} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                   </div>
                   <div className="flex items-center mt-auto">
                     <span className="w-[150px] whitespace-nowrap text-slate-800 font-bold mr-2 text-right">Barcode ID :</span>
                     <div className="flex flex-1 gap-1">
                       <input 
                         ref={barcodeInputRef}
                         type="text" 
                         value={formData.barcodeId} 
                         onChange={e => setFormData({...formData, barcodeId: e.target.value})} 
                         className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" 
                       />
                       <SearchableDropdown id="barcode-select" className="border border-slate-500 bg-white px-1 w-[100px] focus:outline-none focus:border-black focus:bg-[#ffffe0]" value={''} onChange={() => {}} options={[]} placeholder="" />
                       <button className="px-3 py-1 bg-slate-200 border border-slate-400 font-bold text-[11px] hover:bg-slate-300">F2 - Invoice Search</button>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Data Grid for Returned Items */}
               <div className='flex-1 border border-slate-400 bg-white overflow-auto outline-none mt-2 flex flex-col'>
                 <table className='w-full text-left border-collapse min-h-full' style={{ tableLayout: 'fixed' }}>
                   <thead className='bg-[#eef5ed] sticky top-0 shadow-sm z-20'>
                     <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[11px] leading-tight'>
                       <th className='px-1 py-1 border-r border-slate-300 w-[30px] text-center'>Sr.</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[70px]'>Inv No</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[50px]'>F Year</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[100px]'>Barcode ID</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[30px] text-center'>#</th>
                       <th className='px-1 py-1 border-r border-slate-300 flex-1'>Item Name</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[40px] text-right'>Qty</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[70px] text-right'>Rate</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[40px] text-center'>GST</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[80px] text-right'>Amount</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[30px]'>SL</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[40px] text-right'>Cmsn</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[50px] text-right'>ExCmn</th>
                       <th className='px-1 py-1 border-r border-slate-300 w-[80px]'>Firm</th>
                     </tr>
                   </thead>
                   <tbody>
                     {/* Empty grid row as per screenshot */}
                     <tr className="h-full">
                       <td colSpan={14} className="border-none"></td>
                     </tr>
                   </tbody>
                 </table>
               </div>
               
               {/* Bottom Footer Action Area */}
               <div className="flex gap-4 p-2 bg-[#fcfaf2] border-t-2 border-[#1b5e58] shrink-0">
                  {/* Left Narration & Print config */}
                  <div className="flex flex-col w-[250px] gap-1">
                     <div className="flex gap-2 h-[45px]">
                        <span className="font-bold text-[11px] text-slate-800">Narration :</span>
                        <textarea 
                           className="flex-1 border border-slate-500 bg-white p-1 text-[11px] resize-none focus:outline-none focus:border-black focus:bg-[#ffffe0]"
                           value={formData.narration}
                           onChange={(e) => setFormData({...formData, narration: e.target.value})}
                        />
                     </div>
                     <div className="flex gap-4 items-center pl-16">
                        <label className="flex items-center gap-1 font-bold text-[11px]">
                           <input type="checkbox" defaultChecked /> Print A4
                        </label>
                        <div className="flex items-center gap-1 font-bold text-[11px]">
                           Copies <input type="number" defaultValue={1} className="border border-slate-400 w-[40px] px-1 h-[20px]" />
                        </div>
                     </div>
                  </div>
                  
                  {/* Right Totals & Mode Box */}
                  <div className="flex-1 flex flex-col gap-1 justify-end items-end">
                     <div className="flex items-center gap-4 font-bold text-[12px] text-slate-800">
                        <div className="flex items-center gap-1">
                           <span>Total Qty :</span>
                           <input type="text" readOnly className="border border-slate-400 w-[60px] px-1 text-right bg-slate-100" />
                        </div>
                        <div className="flex items-center gap-1">
                           <span>Total Amount :</span>
                           <input type="text" readOnly className="border border-slate-400 w-[90px] px-1 text-right bg-slate-100" />
                        </div>
                        <div className="flex items-center gap-1">
                           <span>Add Charges :</span>
                           <input type="text" value={formData.addCharges} onChange={e => setFormData({...formData, addCharges: e.target.value})} className="border border-slate-500 bg-white w-[70px] px-1 text-right focus:bg-[#ffffe0] outline-none" />
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                           <span>Net Amount :</span>
                           <input type="text" readOnly className="border border-slate-400 w-[90px] px-1 text-right bg-slate-100 font-black text-black" />
                        </div>
                     </div>
                     
                     <div className="flex w-full items-center justify-end gap-2 mt-1">
                        <div className="bg-[#ccffcc] border border-[#a3e8a3] flex gap-4 items-center p-1 px-4 relative">
                           <div className="absolute -top-[7px] left-2 bg-[#ccffcc] px-1 text-[10px] text-slate-600 font-bold leading-none">Mode</div>
                           <label className="flex items-center gap-1 font-bold text-[11px] text-slate-600 cursor-pointer">
                              <span>F5 : RG Voucher</span>
                              <input type="radio" name="mode" checked={formData.mode === 'RG Voucher'} onChange={() => setFormData({...formData, mode: 'RG Voucher'})} />
                           </label>
                           <label className="flex items-center gap-1 font-bold text-[11px] text-slate-600 cursor-pointer">
                              <span>F6 : Paid By</span>
                              <input type="radio" name="mode" checked={formData.mode === 'Paid By'} onChange={() => setFormData({...formData, mode: 'Paid By'})} />
                           </label>
                           <select 
                              disabled={formData.mode !== 'Paid By'}
                              className="border border-slate-400 bg-white text-[11px] px-1 py-[2px] w-[100px] outline-none disabled:bg-slate-100"
                              value={formData.paidBy}
                              onChange={(e) => setFormData({...formData, paidBy: e.target.value})}
                           >
                              <option value="CASH">CASH</option>
                              <option value="BANK">BANK</option>
                           </select>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                           <span className="text-[11px] text-slate-600 font-bold">Default Mode :</span>
                           <select 
                              className="border border-slate-400 bg-white text-[11px] px-1 py-[2px] outline-none"
                              value={formData.defaultMode}
                              onChange={(e) => setFormData({...formData, defaultMode: e.target.value})}
                           >
                              <option value="RG Voucher">RG Voucher</option>
                           </select>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb] shrink-0'>
             {[
               { key: 'F10', label: 'Delete Row' },
               { key: 'F1', label: 'Ok / Save' }
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
             
             {/* Map bottom buttons to sidebar as per standard Tally UI */}
             {[
               { key: 'R', label: 'Register' },
               { key: 'P', label: 'Print' },
               { key: 'S', label: 'Search' }
             ].map((f) => (
               <button 
                 key={f.key} 
                 className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
               >
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>{f.key}</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
               </button>
             ))}
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
          <div className='font-medium tracking-wide'>Sales Return Items</div>
        </div>
      </div>
    </>
  );
}
