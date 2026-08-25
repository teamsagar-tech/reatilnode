import React, { useState } from 'react';

interface PointOfSalesHeaderProps {
  token: string;
  setToken: (v: string) => void;
  customer: { name: string, mobile: string };
  setCustomer: (v: { name: string, mobile: string }) => void;
  salesman: string;
  setSalesman: (v: string) => void;
  onScan: (barcode: string) => void;
}

export default function PointOfSalesHeader({ token, setToken, customer, setCustomer, salesman, setSalesman, onScan }: PointOfSalesHeaderProps) {
  
  const [barcodeInput, setBarcodeInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      e.preventDefault();
      onScan(barcodeInput.trim());
      setBarcodeInput('');
    }
  };

  return (
    <div className='bg-[#e0efeb] border-b-2 border-[#81a09d] flex flex-wrap p-2 gap-2 items-start shrink-0'>
      
      {/* Left Data Entry Group */}
      <div className='flex flex-col gap-2 flex-grow max-w-lg'>
        <div className='flex items-center gap-2'>
          <span className='w-20 font-bold text-slate-800 text-[13px]'>Token</span>
          <input 
            type="text" 
            className='w-24 bg-white border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 uppercase'
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Mobile No / Customer Name"
            className='flex-grow bg-white border border-slate-400 px-2 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800'
            value={customer.name}
            onChange={(e) => setCustomer({...customer, name: e.target.value})}
          />
        </div>
        
        <div className='flex items-center gap-2'>
          <span className='w-20 font-bold text-slate-800 text-[13px]'>Salesman</span>
          <select 
            className='flex-grow bg-white border border-slate-400 px-1 py-[2px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800'
            value={salesman}
            onChange={(e) => setSalesman(e.target.value)}
          >
            <option value="">-- Select Salesman --</option>
            <option value="SL-01">SL-01 (Rahul)</option>
            <option value="SL-02">SL-02 (Amit)</option>
          </select>
        </div>
        
        <div className='flex items-center gap-2'>
          <span className='w-20 font-bold text-slate-800 text-[13px]'>Product</span>
          <input 
            type="text" 
            placeholder="Scan Barcode & Press Enter"
            className='flex-grow bg-[#fffbe6] border border-blue-400 px-2 py-[2px] font-bold text-blue-900 focus:bg-[#ffffe0] focus:outline-none focus:border-blue-800'
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
      
      {/* Spacer */}
      <div className='flex-grow'></div>

      {/* Right Stats Group */}
      <div className='flex gap-2'>
        <div className='border-2 border-slate-400 bg-white flex flex-col min-w-[120px]'>
          <div className='bg-[#c9e1dd] border-b border-slate-400 text-center font-bold text-slate-800 text-xs py-1'>
            Next Bill No
          </div>
          <div className='flex-grow flex items-center justify-center font-bold text-lg py-1 text-slate-900'>
            BL-45012
          </div>
        </div>

        <div className='border-2 border-slate-400 bg-white flex flex-col min-w-[120px]'>
          <div className='bg-[#eef5ed] border-b border-slate-400 text-center font-bold text-slate-800 text-xs py-1'>
            Last Bill Amt
          </div>
          <div className='flex-grow flex items-center justify-center font-bold text-lg py-1 text-red-700'>
            8,450.00
          </div>
        </div>
      </div>

    </div>
  );
}
