import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  ShoppingCart, Search, User, CreditCard, Banknote, MapPin, 
  Trash2, Plus, ArrowRight, ScanLine, Tag, Wallet, Clock, Printer
} from 'lucide-react';

const MOCK_PRODUCTS = [
  { barcode: '10001', name: 'Premium Cotton Shirt', size: 'L', brand: 'Arrow', rate: 1299, tax: 12, stock: 45 },
  { barcode: '10002', name: 'Slim Fit Denim', size: '32', brand: 'Levi', rate: 2499, tax: 12, stock: 12 },
  { barcode: '10003', name: 'Silk Saree with Zari', size: 'Free', brand: 'Kanchi', rate: 5999, tax: 5, stock: 4 },
  { barcode: '10004', name: 'Sports T-Shirt', size: 'M', brand: 'Nike', rate: 999, tax: 12, stock: 120 },
  { barcode: '10005', name: 'Woolen Jacket', size: 'XL', brand: 'Zara', rate: 4500, tax: 12, stock: 8 },
];

const MOCK_CUSTOMERS = [
  { phone: '9876543210', name: 'Rahul Sharma', points: 1250, lastPurchase: 4599, lastPurchaseDate: '12 Aug 2026' },
  { phone: '9988776655', name: 'Priya Desai', points: 450, lastPurchase: 1250, lastPurchaseDate: '05 Aug 2026' },
  { phone: '9123456789', name: 'Amit Kumar', points: 0, lastPurchase: 0, lastPurchaseDate: '-' },
];

const MOCK_SALESMEN = ['Ravi', 'Amit', 'Suresh', 'Neha'];

export default function POS() {
  const [cart, setCart] = useState<any[]>([
    { id: Date.now() + 1, barcode: '10001', name: 'Premium Cotton Shirt', size: 'L', qty: 2, rate: 1299, disc: 0, tax: 12, salesman: 'Ravi' },
    { id: Date.now() + 2, barcode: '10003', name: 'Silk Saree with Zari', size: 'Free', qty: 1, rate: 5999, disc: 5, tax: 5, salesman: 'Amit' },
    { id: Date.now() + 3, barcode: '10002', name: 'Slim Fit Denim', size: '32', qty: 1, rate: 2499, disc: 0, tax: 12, salesman: 'Ravi' }
  ]);
  const [barcodeInput, setBarcodeInput] = useState('');
  
  const [customerPhone, setCustomerPhone] = useState('');
  const [activeCustomer, setActiveCustomer] = useState<{name: string, points: number, lastPurchase: number, lastPurchaseDate?: string} | null>(null);

  const [paymentMode, setPaymentMode] = useState<'CASH' | 'CARD' | 'UPI' | 'ADVANCE' | 'CREDIT'>('UPI');

  const isMac = typeof window !== 'undefined' && navigator.userAgent.includes('Mac');
  const getShortcutText = (key: string) => isMac ? `⌥${key}` : `Alt+${key}`;

  // Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          handleCheckout();
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          document.getElementById('customer-search')?.focus();
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          document.getElementById('barcode-input')?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [cart]);

  const handleBarcodeEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && barcodeInput.trim()) {
      const product = MOCK_PRODUCTS.find(p => p.barcode === barcodeInput || p.name.toLowerCase().includes(barcodeInput.toLowerCase()));
      if (product) {
        const existing = cart.find(c => c.barcode === product.barcode);
        if (existing) {
          setCart(cart.map(c => c.barcode === product.barcode ? { ...c, qty: c.qty + 1 } : c));
        } else {
          setCart([{ id: Date.now(), barcode: product.barcode, name: product.name, size: product.size, qty: 1, rate: product.rate, disc: 0, tax: product.tax, salesman: 'Ravi' }, ...cart]);
        }
        setBarcodeInput('');
      } else {
        alert('Product not found!');
      }
    }
  };

  const handleCustomerEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customerPhone.trim()) {
      const cust = MOCK_CUSTOMERS.find(c => c.phone === customerPhone);
      if (cust) {
        setActiveCustomer({ name: cust.name, points: cust.points, lastPurchase: cust.lastPurchase, lastPurchaseDate: cust.lastPurchaseDate });
      } else {
        // Create new
        setActiveCustomer({ name: 'New Customer', points: 0, lastPurchase: 0, lastPurchaseDate: '-' });
      }
    }
  };

  const updateCart = (index: number, field: string, value: any) => {
    const newCart = [...cart];
    newCart[index] = { ...newCart[index], [field]: value };
    setCart(newCart);
  };

  const removeRow = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert('Cart is empty!');
    alert(`Payment of ₹${grandTotal.toLocaleString('en-IN')} received via ${paymentMode}. Bill generated successfully!`);
    setCart([]);
    setCustomerPhone('');
    setActiveCustomer(null);
    document.getElementById('barcode-input')?.focus();
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const totalDisc = cart.reduce((acc, item) => acc + (item.qty * item.rate * (item.disc / 100)), 0);
  const taxableAmount = subtotal - totalDisc;
  
  // Tax breakdown (approximate for demo)
  const totalTax = cart.reduce((acc, item) => {
    const itemSub = item.qty * item.rate * (1 - item.disc/100);
    return acc + (itemSub * (item.tax / 100));
  }, 0);
  
  const grandTotal = taxableAmount + totalTax;

  // Offer Logic
  const denimInCart = cart.find(c => c.barcode === '10002');
  const showDenimOffer = denimInCart && denimInCart.qty === 1;

  const handleAddOfferItem = (barcode: string) => {
    setCart(cart.map(c => c.barcode === barcode ? { ...c, qty: c.qty + 1 } : c));
  };

  return (
    <div className="w-full flex flex-col flex-1 min-h-0 overflow-hidden bg-slate-50 rounded-xl shadow-sm border border-slate-200">
      <Helmet>
        <title>POS Terminal | RetailNode</title>
      </Helmet>

      {/* Main POS Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden flex-col lg:flex-row">
        
        {/* Left: Cart Table & Header */}
        <div className="flex-1 flex flex-col min-h-0 border-r border-slate-200 bg-white">
          {/* POS Header (Moved to Left Side) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-white border-b border-slate-200 shrink-0 gap-4">
            
            {/* Logo & POS Details */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-sky-100 text-sky-700 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div className="flex flex-col mt-0.5">
                <h1 className="text-xl font-black text-slate-900 leading-none tracking-tight">Point of Sale</h1>
                <div className="text-xs font-bold text-slate-500 flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Storefront 1</span>
                  <span className="text-slate-300">|</span>
                  <span>Register: #01</span>
                </div>
              </div>
            </div>

            {/* Barcode & Actions */}
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <div className="relative flex-1">
                <ScanLine className="w-4 h-4 absolute left-3 top-2 text-slate-400" />
                <input
                  id="barcode-input"
                  type="text"
                  autoFocus
                  placeholder={`Scan Barcode (${getShortcutText('B')})`}
                  value={barcodeInput}
                  onChange={e => setBarcodeInput(e.target.value)}
                  onKeyDown={handleBarcodeEnter}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                  autoComplete="off"
                />
              </div>
              <button className="bg-slate-800 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-slate-700 transition-colors shrink-0">
                Hold Bill
              </button>
            </div>

            {/* Cashier & Last Bill */}
            <div className="hidden xl:flex items-center gap-5 shrink-0 border-l border-slate-200 pl-4">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 leading-tight">Cashier</span>
                <span className="font-bold text-slate-700 text-xs">Arjun Kapoor</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 leading-tight">Last Bill</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700 text-xs">#INV-10042 <span className="text-slate-400">(₹4,599)</span></span>
                  <button className="text-sky-600 hover:text-sky-700 transition-colors p-0.5 rounded hover:bg-sky-50" title="Re-Print Last Bill">
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            
          </div>
          <div className="flex-1 overflow-y-auto relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-100 z-10 shadow-sm">
                <tr className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="px-3 py-2 w-12 text-center border-r border-slate-200">#</th>
                  <th className="px-3 py-2 border-r border-slate-200">Item Description</th>
                  <th className="px-2 py-2 w-16 text-center border-r border-slate-200">Size</th>
                  <th className="px-2 py-2 w-24 text-center border-r border-slate-200">Salesman</th>
                  <th className="px-2 py-2 w-20 text-right border-r border-slate-200">Qty</th>
                  <th className="px-2 py-2 w-28 text-right border-r border-slate-200">Rate (₹)</th>
                  <th className="px-2 py-2 w-20 text-right border-r border-slate-200">Disc %</th>
                  <th className="px-3 py-2 w-32 text-right border-r border-slate-200">Amount (₹)</th>
                  <th className="px-2 py-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cart.map((item, index) => {
                  const amount = (item.qty * item.rate) * (1 - item.disc / 100);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-3 py-1.5 text-center text-xs font-semibold text-slate-400 border-r border-slate-100">
                        {index + 1}
                      </td>
                      <td className="px-3 py-1.5 border-r border-slate-100">
                        <div className="font-bold text-slate-800 text-sm">{item.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{item.barcode}</div>
                      </td>
                      <td className="px-2 py-1.5 text-center border-r border-slate-100">
                        <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.size}</span>
                      </td>
                      <td className="px-1 py-1.5 border-r border-slate-100">
                        <select
                          value={item.salesman || ''}
                          onChange={e => updateCart(index, 'salesman', e.target.value)}
                          className="w-full text-center px-1 py-1 bg-transparent border border-transparent rounded hover:border-slate-200 focus:bg-white focus:border-sky-400 focus:ring-1 focus:ring-sky-400 text-[10px] font-bold text-slate-700 outline-none cursor-pointer appearance-none text-center"
                        >
                          {MOCK_SALESMEN.map(sm => (
                            <option key={sm} value={sm}>{sm}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-1 py-1.5 border-r border-slate-100">
                        <input
                          type="number"
                          min="1"
                          value={item.qty || ''}
                          onChange={e => updateCart(index, 'qty', parseInt(e.target.value) || 0)}
                          onFocus={e => e.target.select()}
                          className="w-full text-right px-1 py-1 bg-transparent border border-transparent rounded hover:border-slate-200 focus:bg-white focus:border-sky-400 focus:ring-1 focus:ring-sky-400 text-sm font-bold text-slate-800 outline-none"
                        />
                      </td>
                      <td className="px-1 py-1.5 border-r border-slate-100">
                        <input
                          type="number"
                          min="0"
                          value={item.rate || ''}
                          onChange={e => updateCart(index, 'rate', parseFloat(e.target.value) || 0)}
                          onFocus={e => e.target.select()}
                          className="w-full text-right px-1 py-1 bg-transparent border border-transparent rounded hover:border-slate-200 focus:bg-white focus:border-sky-400 focus:ring-1 focus:ring-sky-400 text-sm font-bold text-slate-800 outline-none"
                        />
                      </td>
                      <td className="px-1 py-1.5 border-r border-slate-100">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.disc || ''}
                          onChange={e => updateCart(index, 'disc', parseFloat(e.target.value) || 0)}
                          onFocus={e => e.target.select()}
                          className="w-full text-right px-1 py-1 bg-transparent border border-transparent rounded hover:border-slate-200 focus:bg-white focus:border-sky-400 focus:ring-1 focus:ring-sky-400 text-sm font-bold text-rose-600 outline-none"
                        />
                      </td>
                      <td className="px-3 py-1.5 text-right font-black text-slate-800 text-sm border-r border-slate-100">
                        {amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-1 py-1.5 text-center">
                        <button 
                          onClick={() => removeRow(index)}
                          className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                          tabIndex={-1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-400 text-sm font-medium">
                      <ShoppingCart className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                      Scan items or search to add to cart
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Smart Offers Notification */}
          {showDenimOffer && (
            <div className="shrink-0 bg-gradient-to-r from-rose-500 to-red-600 p-3 flex items-center justify-between text-white shadow-[0_-4px_20px_rgba(225,29,72,0.15)] z-20 relative">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-rose-100 mb-0.5">Smart Suggestion Unlocked</div>
                  <div className="text-xs font-semibold text-white/90">Add <span className="font-black text-white">1 more Slim Fit Denim</span> and get <span className="font-black text-yellow-300">1 QTY FREE!</span></div>
                </div>
              </div>
              <button 
                onClick={() => handleAddOfferItem('10002')}
                className="px-4 py-2 bg-white text-rose-600 hover:bg-rose-50 text-[10px] font-black rounded-lg shadow-sm transition-colors uppercase tracking-widest flex items-center gap-1.5"
              >
                Add & Claim <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Customer & Checkout Panel */}
        <div className="w-full lg:w-80 flex flex-col bg-slate-50 shrink-0 border-l border-slate-200">
          
          {/* Customer Section */}
          <div className="p-4 bg-white border-b border-slate-200 flex-1 min-h-0 flex flex-col">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1 shrink-0"><User className="w-3.5 h-3.5" /> Customer Details</h3>
            
            {activeCustomer ? (
              <div className="flex flex-col bg-sky-50 border border-sky-100 p-2.5 rounded-lg relative shrink-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-sky-900 text-sm">{activeCustomer.name}</div>
                    <div className="text-[10px] font-semibold text-sky-600 mt-0.5">{customerPhone}</div>
                  </div>
                  <button 
                    onClick={() => { setActiveCustomer(null); setCustomerPhone(''); }}
                    className="p-1 text-sky-400 hover:text-sky-700 -mt-1 -mr-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-200/50">
                  <div>
                    <div className="text-[9px] text-sky-600/70 font-bold uppercase tracking-wider">Reward Points</div>
                    <div className="font-black text-sky-700 text-xs mt-0.5">{activeCustomer.points}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-sky-600/70 font-bold uppercase tracking-wider">Last Purchase</div>
                    <div className="font-bold text-sky-700 text-xs mt-0.5">₹{activeCustomer.lastPurchase.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="relative shrink-0">
                  <Search className="w-4 h-4 absolute left-2.5 top-2 text-slate-400" />
                  <input
                    id="customer-search"
                    type="text"
                    placeholder={`Phone Number (${getShortcutText('C')})`}
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    onKeyDown={handleCustomerEnter}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm font-semibold focus:bg-white focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none transition-all"
                    autoComplete="off"
                  />
                </div>
                
                {/* Recent Customers List */}
                <div className="mt-3 flex-1 overflow-y-auto pr-1 min-h-0">
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 shrink-0">Recent Customers</div>
                  <div className="flex flex-col gap-2">
                    {MOCK_CUSTOMERS.map(cust => (
                      <div 
                        key={cust.phone} 
                        className="p-2 border border-slate-200 bg-slate-50 rounded-lg hover:bg-white hover:border-sky-200 hover:shadow-sm cursor-pointer transition-all group"
                        onClick={() => {
                          setCustomerPhone(cust.phone);
                          setActiveCustomer({ 
                            name: cust.name, 
                            points: cust.points, 
                            lastPurchase: cust.lastPurchase, 
                            lastPurchaseDate: cust.lastPurchaseDate 
                          });
                          document.getElementById('barcode-input')?.focus();
                        }}
                      >
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="font-bold text-slate-800 text-xs group-hover:text-sky-700 transition-colors">{cust.name}</div>
                          <div className="text-[10px] font-semibold text-slate-500">{cust.phone}</div>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-amber-600 font-bold bg-amber-100/50 border border-amber-200/50 px-1.5 py-0.5 rounded text-[9px]">{cust.points} Pts</span>
                          <span className="text-slate-500 font-medium">Last: <span className="font-bold text-slate-700">₹{cust.lastPurchase.toLocaleString('en-IN')}</span> <span className="text-slate-400">({cust.lastPurchaseDate})</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Totals Section */}
          <div className="shrink-0 p-4 flex flex-col justify-end gap-2 bg-slate-50">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-600">Subtotal</span>
              <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-rose-600">
              <span className="font-semibold">Discount</span>
              <span className="font-bold">-₹{totalDisc.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-slate-600">Taxable Value</span>
              <span className="font-bold text-slate-800">₹{taxableAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            <div className="border-t border-slate-200 my-1"></div>

            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-500">CGST</span>
              <span className="font-semibold text-slate-700">₹{(totalTax/2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-500">SGST</span>
              <span className="font-semibold text-slate-700">₹{(totalTax/2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Checkout Footer */}
          <div className="shrink-0 p-4 bg-slate-900 text-white">
            <div className="flex justify-between items-end mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Grand Total</span>
              <span className="text-3xl font-black text-emerald-400 tracking-tight">
                ₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-4">
              <button 
                onClick={() => setPaymentMode('UPI')}
                className={`col-span-2 py-2 rounded flex flex-col items-center justify-center gap-1 transition-colors border ${paymentMode === 'UPI' ? 'bg-sky-500/20 border-sky-400 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
              >
                <ScanLine className="w-4 h-4" />
                <span className="text-[10px] font-bold">UPI</span>
              </button>
              <button 
                onClick={() => setPaymentMode('CARD')}
                className={`col-span-2 py-2 rounded flex flex-col items-center justify-center gap-1 transition-colors border ${paymentMode === 'CARD' ? 'bg-sky-500/20 border-sky-400 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-bold">CARD</span>
              </button>
              <button 
                onClick={() => setPaymentMode('CASH')}
                className={`col-span-2 py-2 rounded flex flex-col items-center justify-center gap-1 transition-colors border ${paymentMode === 'CASH' ? 'bg-sky-500/20 border-sky-400 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
              >
                <Banknote className="w-4 h-4" />
                <span className="text-[10px] font-bold">CASH</span>
              </button>
              <button 
                onClick={() => setPaymentMode('ADVANCE')}
                className={`col-span-3 py-2 rounded flex flex-col items-center justify-center gap-1 transition-colors border ${paymentMode === 'ADVANCE' ? 'bg-sky-500/20 border-sky-400 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
              >
                <Wallet className="w-4 h-4" />
                <span className="text-[10px] font-bold">ADVANCE</span>
              </button>
              <button 
                onClick={() => setPaymentMode('CREDIT')}
                className={`col-span-3 py-2 rounded flex flex-col items-center justify-center gap-1 transition-colors border ${paymentMode === 'CREDIT' ? 'bg-sky-500/20 border-sky-400 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-bold">CREDIT</span>
              </button>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-black text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Pay Now {getShortcutText('P')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
