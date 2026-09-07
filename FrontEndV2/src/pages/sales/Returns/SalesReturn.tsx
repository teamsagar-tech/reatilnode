import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const InputRow = ({ label, value, onChange, placeholder = '', type = 'text', onKeyDown, refProp }: any) => (
  <div className="flex items-center text-[12px] mb-1">
    <label className="w-[120px] font-semibold text-slate-700 shrink-0">{label}</label>
    <span className="font-bold mr-1 text-slate-400">:</span>
    <input
      ref={refProp}
      type={type}
      className="flex-1 border border-slate-300 px-1 py-[2px] focus:outline-none focus:border-[#1b5e58] focus:bg-[#ffffe0] bg-white transition-colors"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  </div>
);

export default function SalesReturn() {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [focusedRow, setFocusedRow] = useState(-1);
  const scannerRef = useRef<HTMLInputElement>(null);

  const [customer, setCustomer] = useState('Walk-in Customer');
  const [remark, setRemark] = useState('');

  const handleScan = async () => {
    if (!barcode) return;
    try {
      const searchRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/manage-receivable/search?query=${barcode}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const searchData = await searchRes.json();
      
      if (searchData.success && searchData.data.length > 0) {
        const product = searchData.data[0];
        
        if (!product.is_sold) {
          alert('Cannot return a product that is not sold!');
          setBarcode('');
          return;
        }

        setItems(prev => {
          const existingIdx = prev.findIndex(item => item.barcode === product.barcode);
          if (existingIdx >= 0) return prev; // Cannot return same barcode twice
          return [...prev, {
            product_id: product.id,
            barcode: product.barcode,
            name: product.product_name,
            qty: 1,
            refund_amount: product.mrp
          }];
        });
        setBarcode('');
        setTimeout(() => scannerRef.current?.focus(), 10);
      } else {
        alert('Product not found');
        setBarcode('');
      }
    } catch (err) {
      console.error('Scan error', err);
      alert('Failed to scan product');
    }
  };

  const handleSaveReturn = async () => {
    if (items.length === 0) return alert("Return list is empty");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/returns/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customer_id: null,
          remark: remark,
          items: items,
          total_refund_amount: items.reduce((sum, i) => sum + i.refund_amount, 0)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Sales Return Saved! Note No: ${data.data.return_no}`);
        setItems([]);
        setBarcode('');
        setRemark('');
        scannerRef.current?.focus();
      } else {
        alert(data.message || 'Failed to save return');
      }
    } catch (err) {
      console.error('Save error', err);
      alert('Failed to save return');
    }
  };

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedRow(prev => Math.min(prev + 1, items.length - 1));
        scannerRef.current?.blur();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedRow(prev => {
          const next = Math.max(prev - 1, -1);
          if (next === -1) scannerRef.current?.focus();
          return next;
        });
      } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveReturn();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [items, focusedRow]);

  const totalAmount = items.reduce((sum, i) => sum + i.refund_amount, 0);

  return (
    <>
      <Helmet>
        <title>Sales Return | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Accounting Vouchers</div>
               <div className='text-yellow-300'>Credit Note (Sales Return)</div>
            </div>
            
            <div className='p-2 shrink-0 border-b-2 border-slate-300 bg-white flex gap-12'>
              <div className="w-[300px]">
                 <InputRow label="Customer" value={customer} onChange={setCustomer} placeholder="Name or Mobile..." />
                 <InputRow label="Remark" value={remark} onChange={setRemark} placeholder="Reason for return..." />
              </div>
              <div className="w-[300px]">
                 <InputRow 
                    refProp={scannerRef}
                    label="Scan Barcode" 
                    value={barcode} 
                    onChange={setBarcode} 
                    onKeyDown={(e: any) => { if (e.key === 'Enter') handleScan(); }}
                    placeholder="Scan returned product..." 
                 />
              </div>
            </div>

            <div className='flex-1 overflow-y-auto bg-white flex flex-col'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#eef5ed] sticky top-0 border-b-2 border-[#81a09d]'>
                        <tr className='text-[#1b5e58] font-bold text-[12px]'>
                            <th className="px-2 py-1 border-r border-[#81a09d] w-[50px]">S.No</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Item Name</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Barcode</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right w-[80px]">Qty</th>
                            <th className="px-2 py-1 text-right w-[120px]">Refund Amt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-8 text-slate-400 font-bold">Scan an item to return.</td></tr>
                        ) : (
                            items.map((item, idx) => (
                                <tr 
                                  key={idx} 
                                  className={`text-[12px] border-b border-slate-200 cursor-pointer ${focusedRow === idx ? 'bg-[#ffffe0] font-bold text-red-900' : 'hover:bg-slate-50 text-slate-800'}`}
                                  onClick={() => setFocusedRow(idx)}
                                >
                                    <td className="px-2 py-1 border-r border-slate-200">{idx + 1}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{item.name}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{item.barcode}</td>
                                    <td className="px-2 py-1 border-r border-slate-200 text-right">{item.qty}</td>
                                    <td className="px-2 py-1 text-right font-bold text-red-600">- {item.refund_amount.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className='bg-[#fcebeb] border-t-2 border-[#d28b8b] p-2 flex justify-between items-center shrink-0 font-bold text-[14px]'>
                <div className='flex gap-8 text-[#903030]'>
                    <div>Return Items: <span className='text-black'>{items.length}</span></div>
                </div>
                <div className='flex items-center gap-4 text-[#903030] text-[18px]'>
                    Total Refund: <span className='text-black'>₹ {totalAmount.toFixed(2)}</span>
                </div>
            </div>

          </div>

          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             <button onClick={handleSaveReturn} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                 <span className='font-bold text-black text-[11px] w-[35px]'>^S</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Save Return</span>
             </button>
             <div className='flex-1' />
             <button onClick={() => navigate('/dashboard')} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left'>
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
          
        </div>
        
        <div className='bg-[#903030] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#541a1a]'>
          <div className='font-medium tracking-wide'>Sales Return Mode</div>
        </div>
      </div>
    </>
  );
}
