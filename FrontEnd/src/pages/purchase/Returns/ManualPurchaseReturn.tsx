import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function ManualPurchaseReturn() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firm: '',
    location: '',
    barcode: ''
  });
  
  const [scannedItems, setScannedItems] = useState([
    { id: 1, barcode: 'B001', name: 'Sample Item 1', qty: 2, rate: '500.00', amount: '1000.00' },
  ]);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/purchase/returns/purchase-return');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        // Submit return logic
        navigate('/purchase/returns/purchase-return');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleFieldKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // If barcode scan
      if ((e.target as HTMLInputElement).id === 'field-barcode' && formData.barcode) {
        setScannedItems(prev => [
          ...prev, 
          { 
            id: Date.now(), 
            barcode: formData.barcode, 
            name: 'Scanned Item', 
            qty: 1, 
            rate: '0.00', 
            amount: '0.00' 
          }
        ]);
        setFormData(prev => ({...prev, barcode: ''}));
        return;
      }

      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Manual Purchase Return | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Purchase Return (Manual)</div>
               <div className='text-yellow-300'>Voucher Creation</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               
               {/* Form Header */}
               <div className='flex flex-col mb-4 bg-white border border-slate-400 p-2 shadow-sm'>
                  <div className="flex items-center mb-1">
                    <div className="w-[120px] text-slate-800 font-bold text-[12px] text-right pr-2">Firm</div>
                    <div className="flex-1">
                      <select 
                        id="field-firm"
                        className="w-[300px] bg-[#e0efeb] border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                        value={formData.firm}
                        onChange={(e) => setFormData({...formData, firm: e.target.value})}
                        onKeyDown={(e) => handleFieldKeyDown(e, 'field-location')}
                      >
                         <option value="">Select Firm</option>
                         <option value="f1">Firm A</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-1">
                    <div className="w-[120px] text-slate-800 font-bold text-[12px] text-right pr-2">Location</div>
                    <div className="flex-1">
                      <select 
                        id="field-location"
                        className="w-[300px] bg-[#e0efeb] border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        onKeyDown={(e) => handleFieldKeyDown(e, 'field-barcode')}
                      >
                         <option value="">Select Location</option>
                         <option value="l1">Warehouse 1</option>
                      </select>
                    </div>
                  </div>
               </div>

               {/* Barcode Scan Area */}
               <div className='flex items-center mb-4 bg-[#eef5ed] border border-[#a3c3be] p-2 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'>
                  <div className="w-[120px] text-slate-800 font-bold text-[12px] text-right pr-2">Scan Barcode</div>
                  <input 
                    type="text" 
                    id="field-barcode"
                    ref={barcodeInputRef}
                    autoFocus
                    placeholder="Scan or type barcode and press Enter..."
                    className="flex-1 max-w-[400px] bg-white border border-slate-400 px-2 py-1 text-[13px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-[#1b5e58]"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    onKeyDown={(e) => handleFieldKeyDown(e, 'field-barcode')}
                  />
               </div>

               <div className="flex-1 overflow-y-auto border border-slate-400 bg-white">
                  <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#eef5ed] sticky top-0'>
                      <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                        <th className="px-2 py-1 border-r border-slate-300 w-12 text-center">Sr</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-32">Barcode</th>
                        <th className="px-2 py-1 border-r border-slate-300">Product Name</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-24 text-center">Qty</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-32 text-right">Rate</th>
                        <th className="px-2 py-1 w-32 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scannedItems.map((row, idx) => (
                        <tr key={row.id} className={'text-[12px] border-b border-slate-300 ' + (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')}>
                          <td className="px-2 py-1 border-r border-slate-300 text-center font-medium">{idx + 1}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-blue-700 font-medium">{row.barcode}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium">{row.name}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-center font-medium">{row.qty}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-right font-medium">{row.rate}</td>
                          <td className="px-2 py-1 text-right font-bold">{row.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               
               <div className="flex justify-between items-center mt-4">
                  <div className="font-bold text-slate-800">
                    Total Items: {scannedItems.length}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => navigate('/purchase/returns/purchase-return')}
                      className='bg-[#1b5e58] border border-black text-white px-4 py-1 font-bold text-[12px] hover:bg-[#12423d] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                    >
                      Save Return (Cmd/Ctrl+A)
                    </button>
                    <button 
                      onClick={() => navigate('/purchase/returns/purchase-return')}
                      className='bg-[#e0efeb] border border-black text-black px-4 py-1 font-bold text-[12px] hover:bg-[#c9e1dd] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                    >
                      Cancel (Esc)
                    </button>
                  </div>
               </div>

            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {[
               { key: 'F1', label: 'Help' },
               { key: 'F2', label: 'Date' },
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
               onClick={() => navigate('/purchase/returns/purchase-return')}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Manual Purchase Return Entry</div>
        </div>
      </div>
    </>
  );
}
