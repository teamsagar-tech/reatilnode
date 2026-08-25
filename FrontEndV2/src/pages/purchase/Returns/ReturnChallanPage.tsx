import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function ReturnChallanPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Return Challan View | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full print:bg-white print:h-auto'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full print:p-0'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative print:border-none print:shadow-none print:bg-white'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0 print:hidden'>
               <div>View Return Challan</div>
               <div className='text-yellow-300'>RetailNode ERP</div>
            </div>
            
            <div className='p-2 flex-1 overflow-y-auto print:overflow-visible print:p-0'>
               
               {/* Printable Area */}
               <div className='max-w-[800px] mx-auto bg-white border border-gray-400 p-8 shadow-sm print:shadow-none print:border-none print:w-full print:max-w-none print:p-2'>
                  <div className='text-center border-b border-gray-400 pb-4 mb-4'>
                    <h1 className='text-2xl font-bold uppercase'>Return Challan</h1>
                    <h2 className='text-lg font-bold'>RetailNode Default Firm</h2>
                    <p>123 Business Road, Tech City, State - 400001</p>
                    <p>GSTIN: 27AABCU9603R1ZX</p>
                  </div>

                  <div className='flex justify-between mb-6'>
                    <div>
                      <p className='font-bold'>To,</p>
                      <p className='font-bold'>Supplier Name</p>
                      <p>Supplier Address Line 1</p>
                      <p>City, State - 123456</p>
                      <p>GSTIN: 27XYZ123456</p>
                    </div>
                    <div className='text-right'>
                      <p><span className='font-bold'>Challan No:</span> RC-26-001</p>
                      <p><span className='font-bold'>Date:</span> 20-Aug-2026</p>
                      <p><span className='font-bold'>Ref GRN:</span> GRN-26-010</p>
                    </div>
                  </div>

                  <table className='w-full border-collapse border border-gray-400 mb-6'>
                    <thead>
                      <tr className='bg-gray-100'>
                        <th className='border border-gray-400 px-2 py-1 text-center w-12'>Sr.</th>
                        <th className='border border-gray-400 px-2 py-1 text-left'>Item Name</th>
                        <th className='border border-gray-400 px-2 py-1 text-center w-24'>HSN/SAC</th>
                        <th className='border border-gray-400 px-2 py-1 text-center w-20'>Qty</th>
                        <th className='border border-gray-400 px-2 py-1 text-left w-32'>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='border border-gray-400 px-2 py-1 text-center'>1</td>
                        <td className='border border-gray-400 px-2 py-1'>Sample Defective Product A</td>
                        <td className='border border-gray-400 px-2 py-1 text-center'>6109</td>
                        <td className='border border-gray-400 px-2 py-1 text-center'>10 PCS</td>
                        <td className='border border-gray-400 px-2 py-1'>Color fade</td>
                      </tr>
                      <tr>
                        <td className='border border-gray-400 px-2 py-1 text-center'>2</td>
                        <td className='border border-gray-400 px-2 py-1'>Sample Defective Product B</td>
                        <td className='border border-gray-400 px-2 py-1 text-center'>6109</td>
                        <td className='border border-gray-400 px-2 py-1 text-center'>5 PCS</td>
                        <td className='border border-gray-400 px-2 py-1'>Torn</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className='border border-gray-400 px-2 py-1 text-right font-bold'>Total Quantity</td>
                        <td className='border border-gray-400 px-2 py-1 text-center font-bold'>15 PCS</td>
                        <td className='border border-gray-400 px-2 py-1 text-center font-bold'></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className='flex justify-between items-end mt-16'>
                    <div className='text-center'>
                      <p className='border-t border-gray-400 px-4 pt-1'>Transporter's Signature</p>
                    </div>
                    <div className='text-center'>
                      <p className='font-bold mb-4'>For RetailNode Default Firm</p>
                      <p className='border-t border-gray-400 px-4 pt-1'>Authorised Signatory</p>
                    </div>
                  </div>

               </div>
               
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb] print:hidden'>
             {[
               { key: 'F1', label: 'Help' },
               { key: 'Alt+P', label: 'Print' },
             ].map((f) => (
               <button 
                 key={f.key} 
                 onClick={() => { if(f.key === 'Alt+P') window.print(); }}
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
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d] print:hidden'>
          <div className='font-medium tracking-wide'>Return Challan Preview</div>
        </div>
      </div>
    </>
  );
}
