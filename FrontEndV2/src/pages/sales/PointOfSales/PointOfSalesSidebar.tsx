import React from 'react';

export default function PointOfSalesSidebar() {
  const shortcuts = [
    { key: 'F1', label: 'Cash Pay' },
    { key: 'F2', label: 'Exchange' },
    { key: 'F3', label: 'Card / UPI' },
    { key: 'F4', label: 'Customer List' },
    { key: 'F5', label: 'Packing Slip' },
    { key: 'F6', label: 'Select P-Slip' },
    { key: 'F7', label: 'Cash' },
    { key: 'F8', label: 'Credit' },
    { key: 'F9', label: 'Advance' },
    { key: 'F11', label: 'Sales Return' },
    { key: '', label: 'Adv. Memo List' },
    { key: 'Ctrl+P', label: 'Reprint' },
    { key: 'Ctrl+E', label: 'Edit' },
    { key: '', label: 'Reset All' },
    { key: '', label: 'Invoice Search' },
    { key: 'Ctrl+L', label: 'Print Last' },
  ];

  return (
    <div className='w-[130px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
       {shortcuts.map((f, idx) => (
         <button 
           key={idx} 
           className='flex flex-row items-center px-1 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
         >
           {f.key && <span className='font-bold text-red-700 text-[10px] w-[35px] text-right pr-1'>{f.key}:</span>}
           {!f.key && <span className='w-[35px]'></span>}
           <span className={`text-blue-900 text-[10px] font-bold ${f.key ? 'border-l border-[#a3c3be] pl-1' : ''}`}>{f.label}</span>
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
         className='flex flex-row items-center px-1 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
       >
           <span className='font-bold text-red-700 text-[10px] w-[35px] text-right pr-1'>Esc:</span>
           <span className='text-blue-900 text-[10px] font-bold border-l border-[#a3c3be] pl-1'>Exit</span>
       </button>
    </div>
  );
}
