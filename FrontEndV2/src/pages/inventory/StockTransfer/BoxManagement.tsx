import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { QRCodeSVG } from 'qrcode.react';

export default function BoxManagement() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    requestId: 'REQ-2026-001',
    boxCount: 2
  });

  const [boxes, setBoxes] = useState<any[]>([]);

  const handleCreateBoxes = () => {
     const newBoxes = [];
     for(let i=1; i<=formData.boxCount; i++) {
        newBoxes.push({
           boxId: `${formData.requestId}-BOX${i}`,
           requestId: formData.requestId
        });
     }
     setBoxes(newBoxes);
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
        <title>Box Management | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Box Management</div>
               <div className='text-yellow-300'>Generate Boxes</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
              
              <div className="flex gap-4 border border-slate-400 p-2 bg-[#eef5ed] shrink-0 items-end mb-2">
                 <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-800">Request ID:</span>
                    <input 
                      className="w-48 bg-white border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.requestId}
                      onChange={(e) => setFormData({...formData, requestId: e.target.value})}
                    />
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-800">No. of Boxes:</span>
                    <input 
                      type="number"
                      className="w-32 bg-white border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.boxCount}
                      onChange={(e) => setFormData({...formData, boxCount: parseInt(e.target.value)})}
                    />
                 </div>
                 <button 
                   onClick={handleCreateBoxes}
                   className="bg-[#1b5e58] text-white px-4 py-[3px] font-bold border border-black shadow-[2px_2px_0_rgba(0,0,0,1)] hover:bg-[#12423d]"
                 >
                   Create Boxes
                 </button>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto border border-slate-400 bg-white p-4">
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {boxes.map((box, i) => (
                       <div key={i} className="border-2 border-slate-400 p-2 flex flex-col items-center justify-center bg-[#fcfaf2]">
                          <div className="font-bold text-slate-900 mb-2">{i+1}/{boxes.length}</div>
                          <QRCodeSVG value={box.boxId} size={100} />
                          <div className="font-bold text-[11px] mt-2 text-center text-slate-800">{box.boxId}</div>
                       </div>
                    ))}
                 </div>
                 {boxes.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                       No boxes generated yet.
                    </div>
                 )}
              </div>
              
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {[
               { key: 'F1', label: 'Help' },
               { key: 'Alt+P', label: 'Print Labels' },
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
          <div className='font-medium tracking-wide'>Box Management</div>
        </div>
      </div>
    </>
  );
}
