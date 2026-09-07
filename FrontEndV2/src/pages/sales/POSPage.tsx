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

export default function POSPage() {
  const navigate = useNavigate();
  const [barcode, setBarcode] = useState('');
  const [payments, setPayments] = useState({ cash: 0, upi: 0, card: 0, credit: 0 });
  const [couponCode, setCouponCode] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [focusedRow, setFocusedRow] = useState(-1);
  const scannerRef = useRef<HTMLInputElement>(null);

  const [customer, setCustomer] = useState('Walk-in Customer');
  const [salesman, setSalesman] = useState('');

  const handleScan = async () => {
    if (!barcode) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sales/scan/${barcode}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        const product = data.data;
        setItems(prev => {
          const existingIdx = prev.findIndex(item => item.barcode === product.barcode);
          if (existingIdx >= 0) {
            const newItems = [...prev];
            newItems[existingIdx].qty += 1;
            newItems[existingIdx].final_amount = newItems[existingIdx].qty * newItems[existingIdx].sale_rate;
            return newItems;
          } else {
            return [...prev, {
              product_id: product.product_id,
              barcode: product.barcode,
              name: product.product_name,
              qty: 1,
              vrp_rate: product.vrp_rate,
              sale_rate: product.mrp, 
              final_amount: product.mrp
            }];
          }
        });
        setBarcode('');
        // Keep focus on scanner
        setTimeout(() => scannerRef.current?.focus(), 10);
      } else {
        alert(data.message || 'Product not found');
        setBarcode('');
      }
    } catch (err) {
      console.error('Scan error', err);
      alert('Failed to scan product');
    }
  };

  const handleSaveBill = async () => {
    if (items.length === 0) return alert("Cart is empty");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sales/bill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customer_id: null, // mock
          salesman_id: null, // mock
          items: items,
          coupon: couponCode,
          loyalty: loyaltyPoints,
          totals: {
            qty: items.reduce((sum, i) => sum + i.qty, 0),
            mrp: items.reduce((sum, i) => sum + (i.sale_rate * i.qty), 0),
            final: items.reduce((sum, i) => sum + i.final_amount, 0)
          },
          payments: payments
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Bill Saved Successfully! Bill No: ${data.data.bill_no}`);
        setItems([]);
        setBarcode('');
        scannerRef.current?.focus();
      } else {
        alert(data.message || 'Failed to save bill');
      }
    } catch (err) {
      console.error('Save bill error', err);
      alert('Failed to save bill');
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
        handleSaveBill();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [items, focusedRow]);

  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.final_amount, 0);

  return (
    <>
      <Helmet>
        <title>POS Terminal | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Accounting Vouchers</div>
               <div className='text-yellow-300'>Sales Invoice (POS)</div>
            </div>
            
            {/* Header Form */}
            <div className='p-2 shrink-0 border-b-2 border-slate-300 bg-white flex gap-12'>
              <div className="w-[300px]">
                 <div className="flex gap-2 mb-2">
                    <InputRow label="Cash" type="number" value={payments.cash || ''} onChange={v => setPayments({...payments, cash: Number(v)})} />
                    <InputRow label="UPI" type="number" value={payments.upi || ''} onChange={v => setPayments({...payments, upi: Number(v)})} />
                 </div>
                 <div className="flex gap-2 mb-2">
                    <InputRow label="Card" type="number" value={payments.card || ''} onChange={v => setPayments({...payments, card: Number(v)})} />
                    <InputRow label="Credit (Udhaar)" type="number" value={payments.credit || ''} onChange={v => setPayments({...payments, credit: Number(v)})} />
                 </div>
                 <div className="flex gap-2">
                    <InputRow label="Coupon" value={couponCode} onChange={setCouponCode} placeholder="CODE..." />
                    <InputRow label="Loyalty Used" type="number" value={loyaltyPoints || ''} onChange={setLoyaltyPoints} />
                 </div>
              </div>
              <div className="w-[300px]">
                 <InputRow label="Customer" value={customer} onChange={setCustomer} placeholder="Name or Mobile..." />
                 <InputRow label="Salesman" value={salesman} onChange={setSalesman} placeholder="Salesman ID..." />
                 <InputRow 
                    refProp={scannerRef}
                    label="Scan Barcode" 
                    value={barcode} 
                    onChange={setBarcode} 
                    onKeyDown={(e: any) => { if (e.key === 'Enter') handleScan(); }}
                    placeholder="Scan product barcode..." 
                 />
              </div>
            </div>

            {/* Grid Section */}
            <div className='flex-1 overflow-y-auto bg-white flex flex-col'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#eef5ed] sticky top-0 border-b-2 border-[#81a09d]'>
                        <tr className='text-[#1b5e58] font-bold text-[12px]'>
                            <th className="px-2 py-1 border-r border-[#81a09d] w-[50px]">S.No</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Item Name</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Barcode</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right w-[80px]">Qty</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right">Tax</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right">Comm</th>
                            <th className="px-2 py-1 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={7} className="text-center p-8 text-slate-400 font-bold">Cart is empty. Scan an item to begin.</td></tr>
                        ) : (
                            items.map((item, idx) => (
                                <tr 
                                  key={idx} 
                                  className={`text-[12px] border-b border-slate-200 cursor-pointer ${focusedRow === idx ? 'bg-[#ffffe0] font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-800'}`}
                                  onClick={() => setFocusedRow(idx)}
                                >
                                    <td className="px-2 py-1 border-r border-slate-200">{idx + 1}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{item.name}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{item.barcode}</td>
                                    <td className="px-2 py-1 border-r border-slate-200 text-right">{item.qty}</td>
                                    <td className="px-2 py-1 border-r border-slate-200 text-right">{item.tax || 0}</td>
                                    <td className="px-2 py-1 border-r border-slate-200 text-right">{(item.commission_amount || 0).toFixed(2)}</td>
                                    <td className="px-2 py-1 text-right font-bold text-red-600">{item.final_amount.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Summary */}
            <div className='bg-[#eef5ed] border-t-2 border-[#81a09d] p-2 flex justify-between items-center shrink-0 font-bold text-[14px]'>
                <div className='flex gap-8 text-[#1b5e58]'>
                    <div>Total Qty: <span className='text-black'>{totalQty}</span></div>
                    <div>Item Count: <span className='text-black'>{items.length}</span></div>
                </div>
                <div className='flex items-center gap-4 text-[#1b5e58] text-[18px]'>
                    Net Amount: <span className='text-black'>₹ {totalAmount.toFixed(2)}</span>
                </div>
            </div>

          </div>

          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             <button onClick={handleSaveBill} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                 <span className='font-bold text-black text-[11px] w-[35px]'>^S</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Save Bill</span>
             </button>
             <button className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                 <span className='font-bold text-black text-[11px] w-[35px]'>F4</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Cash</span>
             </button>
             <button className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                 <span className='font-bold text-black text-[11px] w-[35px]'>F5</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>UPI</span>
             </button>
             <div className='flex-1' />
             <button onClick={() => navigate('/dashboard')} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left'>
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
          
        </div>
        
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>POS Active</div>
        </div>
      </div>
    </>
  );
}
