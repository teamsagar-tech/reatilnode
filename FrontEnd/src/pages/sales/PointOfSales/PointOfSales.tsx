import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumVoucherTemplate from '../../../components/layout/PremiumVoucherTemplate';
import { MonitorPlay, Search, ShoppingBag, CreditCard, Banknote, User } from 'lucide-react';

export default function PointOfSales() {
  const navigate = useNavigate();

  // State
  const [cart, setCart] = useState<any[]>([]);
  const [customer, setCustomer] = useState({ name: '', mobile: '' });
  const [token, setToken] = useState('');
  const [salesman, setSalesman] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F-Keys
      if (e.key === 'F1') {
        e.preventDefault();
        alert('F1: Cash Payment Processed');
      }
      if (e.key === 'F3') {
        e.preventDefault();
        alert('F3: Card / UPI Payment Processed');
      }
      if (e.key === 'F9') {
        e.preventDefault();
        console.log('F9: Advance');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleBarcodeScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      e.preventDefault();
      
      const barcode = barcodeInput.trim();
      const mockProduct: any = {
        id: Date.now(),
        sr: cart.length + 1,
        barcode: barcode,
        category: 'SAREE',
        size: 'FREE',
        gst: 5,
        itemName: 'Sample Product ' + barcode,
        qty: 1,
        mrp: 1500,
        saleRate: 1200,
        stock: 10,
      };

      mockProduct.amount = mockProduct.qty * mockProduct.saleRate;
      setCart([...cart, mockProduct]);
      setBarcodeInput('');
    }
  };

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
    <PremiumVoucherTemplate
      title="Point of Sales"
      subtitle="Cash Memo / Walk-in Billing"
      icon={<MonitorPlay className="w-6 h-6" />}
      onSave={() => alert('Saved Cash Memo!')}
      maxWidth="max-w-[1500px]"
    >
      <div className="flex flex-col lg:flex-row gap-4 h-full">
         
         {/* Left Main Form Area */}
         <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-4">
            
            {/* Top Filter Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-5 shrink-0">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 items-end">
                  
                  {/* Token */}
                  <div className="col-span-12 md:col-span-2">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Token No</label>
                     <input type="text" value={token} onChange={e => setToken(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none uppercase" placeholder="TKN-..." />
                  </div>
                  
                  {/* Customer */}
                  <div className="col-span-12 md:col-span-4 relative">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex justify-between">Customer / Mobile</label>
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={customer.name} 
                          onChange={e => setCustomer({...customer, name: e.target.value})} 
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                          placeholder="Walk-in Customer" 
                        />
                     </div>
                  </div>

                  {/* Salesman */}
                  <div className="col-span-12 md:col-span-3">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Salesperson</label>
                     <select value={salesman} onChange={e => setSalesman(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none">
                        <option value="">-- Select --</option>
                        <option value="SL-01">SL-01 (Rahul)</option>
                        <option value="SL-02">SL-02 (Amit)</option>
                     </select>
                  </div>

                  {/* Scan Barcode */}
                  <div className="col-span-12 md:col-span-3">
                     <label className="block text-xs font-bold text-indigo-700 mb-1.5 uppercase tracking-wider">Scan Product</label>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                        <input 
                          type="text" 
                          value={barcodeInput} 
                          onChange={e => setBarcodeInput(e.target.value)}
                          onKeyDown={handleBarcodeScan}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder:text-indigo-300" 
                          placeholder="Scan Barcode & Enter..." 
                          autoFocus
                        />
                     </div>
                  </div>

               </div>
            </div>

            {/* Data Grid Card */}
            <div className="flex-1 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col min-h-0 relative">
               <div className="overflow-auto flex-1">
                  <table className='w-full text-left border-collapse whitespace-nowrap min-w-[800px]'>
                     <thead className='bg-slate-50/90 backdrop-blur-md sticky top-0 z-10'>
                        <tr className='border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider'>
                           <th className='px-4 py-3.5 text-center'>#</th>
                           <th className='px-4 py-3.5'>Barcode</th>
                           <th className='px-4 py-3.5'>Category</th>
                           <th className='px-4 py-3.5 w-[30%]'>Item Name</th>
                           <th className='px-4 py-3.5'>Size</th>
                           <th className='px-4 py-3.5 text-right'>Qty</th>
                           <th className='px-4 py-3.5 text-right'>MRP</th>
                           <th className='px-4 py-3.5 text-right'>Rate</th>
                           <th className='px-4 py-3.5 text-right pr-6'>Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {cart.length === 0 ? (
                          <tr>
                            <td colSpan={9}>
                              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                 <ShoppingBag className="w-12 h-12 mb-4 text-slate-300" />
                                 <p className="text-lg font-bold text-slate-500">Cart is Empty</p>
                                 <p className="text-sm">Scan a barcode to add products</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          cart.map((item, index) => (
                            <tr key={item.id} className="text-[13px] hover:bg-slate-50/50 transition-colors">
                               <td className="px-4 py-2.5 text-center font-bold text-slate-400">{index + 1}</td>
                               <td className="px-4 py-2.5 font-bold text-slate-700">{item.barcode}</td>
                               <td className="px-4 py-2.5 text-slate-600">{item.category}</td>
                               <td className="px-4 py-2.5 font-semibold text-slate-800">{item.itemName}</td>
                               <td className="px-4 py-2.5 text-slate-600">{item.size}</td>
                               <td className="px-4 py-2.5 text-right font-black text-indigo-600">{item.qty}</td>
                               <td className="px-4 py-2.5 text-right text-slate-500 line-through">₹{Number(item.mrp).toFixed(2)}</td>
                               <td className="px-4 py-2.5 text-right font-bold text-slate-700">₹{Number(item.saleRate).toFixed(2)}</td>
                               <td className="px-4 py-2.5 pr-6 text-right">
                                  <span className="font-black text-slate-900 text-base">₹{Number(item.amount).toFixed(2)}</span>
                               </td>
                            </tr>
                          ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>

         </div>

         {/* Right Sidebar Financial Summary */}
         <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-4">
            
            {/* Payment Quick Actions */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
               <button className="bg-emerald-500 hover:bg-emerald-600 transition-colors text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm border border-emerald-600">
                  <Banknote className="w-6 h-6" />
                  <div className="text-center">
                     <p className="font-black text-sm">CASH PAY</p>
                     <p className="text-[10px] text-emerald-100 font-bold tracking-wider">PRESS F1</p>
                  </div>
               </button>
               <button className="bg-indigo-500 hover:bg-indigo-600 transition-colors text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm border border-indigo-600">
                  <CreditCard className="w-6 h-6" />
                  <div className="text-center">
                     <p className="font-black text-sm">CARD / UPI</p>
                     <p className="text-[10px] text-indigo-100 font-bold tracking-wider">PRESS F3</p>
                  </div>
               </button>
            </div>

            {/* Bill Summary Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
               <div className="bg-slate-800 text-white p-4 shrink-0 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/30 rounded-full blur-xl"></div>
                  <h3 className="font-black text-lg tracking-tight relative z-10 flex items-center gap-2">
                     <ShoppingBag className="w-5 h-5 text-blue-400" />
                     Bill Summary
                  </h3>
               </div>
               
               <div className="p-5 flex-1 flex flex-col gap-4 overflow-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                     <span className="text-sm font-bold text-slate-500">Total Items (Pcs)</span>
                     <span className="text-base font-black text-slate-800">{pcs}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                     <span className="text-sm font-bold text-slate-500">MRP Total</span>
                     <span className="text-base font-bold text-slate-600">₹{mrpTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                     <span className="text-sm font-bold text-slate-500">Discount Applied</span>
                     <span className="text-base font-bold text-emerald-600">- ₹{(mrpTotal - billAmount).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-500">Taxable Amount</span>
                     <span className="text-sm font-bold text-slate-600">₹{taxableAmt.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3">
                     <span className="text-sm font-bold text-slate-500">GST Amount</span>
                     <span className="text-sm font-bold text-slate-600">₹{gstAmt.toFixed(2)}</span>
                  </div>
               </div>

               {/* Grand Total Area */}
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 shrink-0 text-white">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 text-right">Net Payable Amount</p>
                  <p className="text-4xl font-black text-right tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">₹{billAmount.toFixed(2)}</p>
               </div>
            </div>
         </div>
      </div>
    </PremiumVoucherTemplate>
  );
}
