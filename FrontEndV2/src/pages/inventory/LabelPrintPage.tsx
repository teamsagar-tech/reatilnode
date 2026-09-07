import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

// Tally-style input
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

export default function LabelPrintPage() {
  const navigate = useNavigate();
  const [batchId, setBatchId] = useState('');
  const [isVerticalLayout, setIsVerticalLayout] = useState(true);
  const printableWindowRef = useRef<Window | null>(null);

  // Mock Products for the Grid
  const [products, setProducts] = useState<any[]>([
    { id: 1, name: 'Saree Type A', category: 'Saree', qty: 10, rate: 500, mrp: 999 },
    { id: 2, name: 'Saree Type B', category: 'Saree', qty: 5, rate: 600, mrp: 1299 },
  ]);
  
  const [focusedRow, setFocusedRow] = useState(0);

  // Keyboard navigation for the grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        setFocusedRow(prev => Math.min(prev + 1, products.length - 1));
      } else if (e.key === 'ArrowUp') {
        setFocusedRow(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'F7') {
        alert("F7 Pressed: Open Multi-Size Modal (Mock)");
      } else if (e.key === 'F8') {
        alert("F8 Pressed: Open Multi-Location Modal (Mock)");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products]);

  const handleFetchBatch = async () => {
    // In reality, this would fetch from /api/label-print/batch
    alert(`Fetching batch details for ${batchId}`);
  };

  const handlePrint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) {
      alert("Please enter a valid Batch ID");
      return;
    }

    const origin = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const fullUrl = `${origin}/api/label-print/batch`;

    try {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = fullUrl;
      form.style.display = "none";

      const batchInp = document.createElement("input");
      batchInp.type = "hidden";
      batchInp.name = "batchId";
      batchInp.value = String(batchId);
      form.appendChild(batchInp);

      const autoInp = document.createElement("input");
      autoInp.type = "hidden";
      autoInp.name = "autoprint";
      autoInp.value = "1";
      form.appendChild(autoInp);

      const layoutInp = document.createElement("input");
      layoutInp.type = "hidden";
      layoutInp.name = "isVerticalLayout";
      layoutInp.value = isVerticalLayout ? "true" : "false";
      form.appendChild(layoutInp);

      document.body.appendChild(form);

      let targetWin = printableWindowRef.current;
      if (!targetWin || targetWin.closed) {
        const name = "retailnode_print_win_" + Date.now();
        targetWin = window.open("", name);
        printableWindowRef.current = targetWin;
      }
      form.target = targetWin?.name || "_blank";
      
      form.submit();
      
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 5000);
    } catch (err) {
      console.error("Print error:", err);
      alert("Failed to initiate printing.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Label Print Voucher | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            
            {/* Header Section */}
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Inventory Vouchers</div>
               <div className='text-yellow-300'>Label Print Verification</div>
            </div>
            
            <div className='p-2 shrink-0 border-b-2 border-slate-300 bg-white'>
              <div className="flex gap-8">
                  <div className="w-[300px]">
                     <InputRow 
                        label="Batch ID" 
                        value={batchId} 
                        onChange={setBatchId} 
                        onKeyDown={(e: any) => { if (e.key === 'Enter') handleFetchBatch(); }}
                        placeholder="Scan or Enter Batch..." 
                     />
                  </div>
                  <div className="flex items-center gap-4 text-[12px] font-bold text-slate-700">
                      <span>Layout:</span>
                      <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" checked={isVerticalLayout} onChange={() => setIsVerticalLayout(true)}/> Vertical
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                          <input type="radio" checked={!isVerticalLayout} onChange={() => setIsVerticalLayout(false)}/> Horizontal
                      </label>
                  </div>
              </div>
            </div>

            {/* Grid Section (Tally Style) */}
            <div className='flex-1 overflow-y-auto bg-white flex flex-col'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#eef5ed] sticky top-0 border-b-2 border-[#81a09d]'>
                        <tr className='text-[#1b5e58] font-bold text-[12px]'>
                            <th className="px-2 py-1 border-r border-[#81a09d] w-[50px]">S.No</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Item Name</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Category</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right w-[80px]">Qty</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right w-[100px]">Rate</th>
                            <th className="px-2 py-1 text-right w-[100px]">MRP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p, idx) => (
                            <tr 
                              key={p.id} 
                              className={`text-[12px] border-b border-slate-200 cursor-pointer ${focusedRow === idx ? 'bg-[#ffffe0] font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-800'}`}
                              onClick={() => setFocusedRow(idx)}
                            >
                                <td className="px-2 py-1 border-r border-slate-200">{idx + 1}</td>
                                <td className="px-2 py-1 border-r border-slate-200">{p.name}</td>
                                <td className="px-2 py-1 border-r border-slate-200">{p.category}</td>
                                <td className="px-2 py-1 border-r border-slate-200 text-right">{p.qty}</td>
                                <td className="px-2 py-1 border-r border-slate-200 text-right">{p.rate.toFixed(2)}</td>
                                <td className="px-2 py-1 text-right">{p.mrp.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Summary */}
            <div className='bg-[#eef5ed] border-t-2 border-[#81a09d] p-2 flex justify-between shrink-0 font-bold text-[12px]'>
                <div className='text-slate-700'>Total Items: {products.length}</div>
                <div className='flex gap-4'>
                    <button onClick={handlePrint} className='bg-[#1b5e58] text-white px-6 py-1 hover:bg-[#144743] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]'>
                        Print Labels (Alt+P)
                    </button>
                </div>
            </div>

          </div>

          {/* Right Sidebar Action Keys */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {[
               { key: 'F4', label: 'Contra' },
               { key: 'F5', label: 'Payment' },
               { key: 'F7', label: 'Multi Size' },
               { key: 'F8', label: 'Multi Loc' },
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
             <button onClick={() => navigate('/dashboard')} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left'>
                 <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Voucher Verification Mode</div>
        </div>
      </div>
    </>
  );
}
