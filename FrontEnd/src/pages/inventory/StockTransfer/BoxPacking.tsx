import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function BoxPacking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestId: 'REQ-2026-001',
    boxId: 'BOX-001',
    barcode: '',
    vrpRate: ''
  });

  const [packedItems, setPackedItems] = useState([
    { id: 1, name: 'Sample Item 1', category: 'Men', vrpRate: '550', qty: 10, barcodeType: 'Piece' }
  ]);

  const handleManualScan = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (formData.barcode.trim() !== '') {
         setPackedItems([...packedItems, {
           id: Date.now(),
           name: 'Scanned Item',
           category: 'Men',
           vrpRate: formData.vrpRate || '100',
           qty: 1,
           barcodeType: 'Piece'
         }]);
         setFormData({...formData, barcode: '', vrpRate: ''});
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate('/inventory/stock-transfer/list');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Box Packing | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Box Packing</div>
               <div className='text-yellow-300'>Scan Barcodes</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
              
              <div className="grid grid-cols-2 gap-4 border border-slate-400 p-2 bg-[#eef5ed] shrink-0 mb-2">
                 <div className="flex flex-col gap-1">
                    <div className="flex">
                       <span className="w-24 font-bold text-slate-800">Request ID:</span>
                       <input 
                         className="flex-1 bg-white border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                         value={formData.requestId}
                         onChange={(e) => setFormData({...formData, requestId: e.target.value})}
                       />
                    </div>
                    <div className="flex mt-1">
                       <span className="w-24 font-bold text-slate-800">Box ID:</span>
                       <input 
                         className="flex-1 bg-white border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                         value={formData.boxId}
                         onChange={(e) => setFormData({...formData, boxId: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="flex flex-col gap-1 border-l border-slate-400 pl-4">
                    <div className="flex">
                       <span className="w-24 font-bold text-slate-800">Barcode:</span>
                       <input 
                         className="flex-1 bg-[#e0efeb] border border-slate-800 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:ring-1 ring-slate-900"
                         placeholder="Scan barcode..."
                         value={formData.barcode}
                         onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                         onKeyDown={handleManualScan}
                         autoFocus
                       />
                    </div>
                    <div className="flex mt-1">
                       <span className="w-24 font-bold text-slate-800">Sell Rate:</span>
                       <input 
                         className="w-32 bg-white border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                         value={formData.vrpRate}
                         onChange={(e) => setFormData({...formData, vrpRate: e.target.value})}
                         placeholder="Optional"
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
                      <th className="px-2 py-1 border-r border-slate-300">Product Name</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-24">Category</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-24 text-right">Sell Rate</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-24 text-right">Qty</th>
                      <th className="px-2 py-1 w-24">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packedItems.map((row, idx) => (
                      <tr key={row.id} className="text-[12px] border-b border-slate-300 bg-white hover:bg-[#ffffe0]">
                        <td className="px-2 py-1 border-r border-slate-300 text-center">{idx + 1}</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-blue-700 font-bold">{row.name}</td>
                        <td className="px-2 py-1 border-r border-slate-300">{row.category}</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-right font-medium text-green-700">₹{row.vrpRate}</td>
                        <td className="px-2 py-1 border-r border-slate-300 text-right font-bold text-slate-900">{row.qty}</td>
                        <td className="px-2 py-1">{row.barcodeType}</td>
                      </tr>
                    ))}
                    {/* Empty rows to fill space */}
                    {[...Array(10)].map((_, i) => (
                      <tr key={`empty-${i}`} className="text-[12px] border-b border-slate-300 bg-[#fcfaf2]">
                        <td className="px-2 py-4 border-r border-slate-300"></td>
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
              
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {[
               { key: 'F1', label: 'Help' },
               { key: 'F3', label: 'Box List' },
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
          <div className='font-medium tracking-wide'>Box Packing Terminal</div>
          <div className='font-medium tracking-wide'>{packedItems.length} Unique Items</div>
        </div>
      </div>
    </>
  );
}
