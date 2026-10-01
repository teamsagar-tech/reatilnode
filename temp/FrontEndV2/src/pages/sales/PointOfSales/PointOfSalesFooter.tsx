import React from 'react';

export default function PointOfSalesFooter({ cart }: { cart: any[] }) {
  
  const mrpTotal = cart.reduce((sum, item) => sum + (Number(item.mrp) * Number(item.qty)), 0);
  const billAmount = cart.reduce((sum, item) => sum + Number(item.amount), 0);
  const pcs = cart.reduce((sum, item) => sum + Number(item.qty), 0);
  const taxableAmt = cart.reduce((sum, item) => {
    const amt = Number(item.amount);
    const gst = Number(item.gst);
    return sum + (amt / (1 + (gst / 100)));
  }, 0);
  const gstAmt = billAmount - taxableAmt;

  return (
    <div className='bg-[#e0efeb] border-t-2 border-[#81a09d] flex-shrink-0 flex flex-col'>
      
      {/* Top Totals Strip */}
      <div className='flex border-b border-[#81a09d]'>
        <div className='flex-1 border-r border-[#81a09d] p-1 flex flex-col items-center bg-[#fcfaf2]'>
          <span className='font-bold text-slate-700 text-[11px]'>MRP Total</span>
          <span className='font-bold text-[15px]'>{mrpTotal.toFixed(2)}</span>
        </div>
        <div className='flex-1 border-r border-[#81a09d] p-1 flex flex-col items-center bg-[#fcfaf2]'>
          <span className='font-bold text-slate-700 text-[11px]'>Discount</span>
          <span className='font-bold text-[15px]'>0.00</span>
        </div>
        <div className='flex-1 border-r border-[#81a09d] p-1 flex flex-col items-center bg-[#eef5ed]'>
          <span className='font-bold text-blue-800 text-[11px]'>Bill Amount</span>
          <span className='font-bold text-[15px] text-blue-900'>{billAmount.toFixed(2)}</span>
        </div>
        <div className='flex-1 border-r border-[#81a09d] p-1 flex flex-col items-center bg-[#fcfaf2]'>
          <span className='font-bold text-slate-700 text-[11px]'>Pcs</span>
          <span className='font-bold text-[15px]'>{pcs}</span>
        </div>
        <div className='flex-1 border-r border-[#81a09d] p-1 flex flex-col items-center bg-[#fcfaf2]'>
          <span className='font-bold text-red-700 text-[11px]'>Less Exch</span>
          <span className='font-bold text-[15px] text-red-800'>0.00</span>
        </div>
        <div className='flex-[1.5] border-r border-[#81a09d] p-1 flex flex-col items-center bg-[#c9e1dd]'>
          <span className='font-bold text-black text-[12px]'>Current Bill Amt</span>
          <span className='font-bold text-green-800 text-xl'>{billAmount.toFixed(2)}</span>
        </div>
        <div className='flex-1 border-r border-[#81a09d] p-1 flex flex-col items-center bg-[#fcfaf2]'>
          <span className='font-bold text-slate-700 text-[11px]'>Taxable Amt</span>
          <span className='font-bold text-[15px]'>{taxableAmt.toFixed(2)}</span>
        </div>
        <div className='flex-1 p-1 flex flex-col items-center bg-[#fcfaf2]'>
          <span className='font-bold text-slate-700 text-[11px]'>GST Amt</span>
          <span className='font-bold text-[15px]'>{gstAmt.toFixed(2)}</span>
        </div>
      </div>

      {/* Bottom Options Strip */}
      <div className='flex items-center px-2 py-1 text-[11px] gap-6 bg-[#fcfaf2]'>
        <label className='flex items-center gap-1 font-bold text-slate-800'>
          <input type="checkbox" className="w-3 h-3" /> Cust. History
        </label>
        <label className='flex items-center gap-1 font-bold text-slate-800'>
          <input type="checkbox" className="w-3 h-3" /> Brand
        </label>
        <div className='flex items-center gap-1 font-bold text-slate-800 ml-4'>
          <span>Copies</span>
          <input type="number" defaultValue={1} className='w-10 border border-slate-400 px-1 py-[1px] bg-white text-center focus:bg-[#ffffe0] focus:outline-none' />
        </div>
        <label className='flex items-center gap-1 font-bold text-slate-800'>
          <input type="checkbox" className="w-3 h-3" /> A4 Reprint
        </label>
      </div>
    </div>
  );
}
