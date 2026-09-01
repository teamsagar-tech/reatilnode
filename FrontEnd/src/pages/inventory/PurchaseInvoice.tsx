import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumVoucherTemplate from '../../components/layout/PremiumVoucherTemplate';
import SearchableDropdown from '../../components/SearchableDropdown';
import { ShoppingCart, Search, FileText, CheckCircle2 } from 'lucide-react';
import MultiAttributeModal from '../../components/inventory/MultiAttributeModal';

const ITEM_SUGGESTIONS = [
  { id: 101, name: 'Basic Cotton T-Shirt', type: 'Readymade', stock: 15, sizes: { S: 5, M: 8, L: 2, XL: 0 }, sales: 40, status: 'Reorder', brand: 'Nike', rate: 450 },
  { id: 102, name: 'Classic Denim Jeans', type: 'Readymade', stock: 120, sizes: { '28': 20, '30': 40, '32': 50, '34': 10 }, sales: 15, status: 'Sufficient', brand: 'Levi', rate: 1200 },
  { id: 103, name: 'Banarasi Silk Saree', type: 'Saree', stock: 5, sales: 50, status: 'Critical', brand: 'FabIndia', rate: 4800 },
  { id: 104, name: 'Casual Chinos', type: 'Readymade', stock: 60, sizes: { '30': 20, '32': 30, '34': 10 }, sales: 20, status: 'Sufficient', brand: 'Zara', rate: 1500 },
];

const ACTIVE_USERS = [
  { id: 1, name: 'Arjun Kapoor', role: 'Admin' },
  { id: 2, name: 'Rahul Sharma', role: 'Manager' },
  { id: 3, name: 'Priya Singh', role: 'Purchaser' },
];

const SUPPLIERS = [
  { id: 1, name: 'Apex Suppliers Ltd.', gst: '27AADCA1234F1Z9', state: 'Maharashtra', gstStatus: 'Active' },
  { id: 2, name: 'Global Textiles', gst: '24AAFCG5678G1Z2', state: 'Gujarat', gstStatus: 'Active' },
];

export default function PurchaseInvoice() {
  const navigate = useNavigate();

  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: new Date().toISOString().split('T')[0],
    supplier: 'Apex Suppliers Ltd.',
    firm: 'TechCorp India',
    location: 'Mumbai Warehouse',
    purchaser: 'Arjun Kapoor',
    requireBoxPacking: false,
    taxType: 'CGST_SGST' as 'IGST' | 'CGST_SGST',
    discountPercent: 0,
    discountAmount: 0,
    commissionPercent: 0,
    commissionAmount: 0,
    taxPercent: 18,
    charges: 0,
    roundOff: 0,
    orderNo: '',
    transporter: '',
    lrNo: '',
    bale: '',
    billNo: '',
    billDate: new Date().toISOString().split('T')[0],
    receiveDate: new Date().toISOString().split('T')[0],
    totalQuantity: '',
    billAmount: '',
    gstOn: 'items' as 'items' | 'total',
    designNo: false,
    colourNo: false,
    showSize: false,
    showPurchaseDiscount: false,
    showMarkdown: false
  });

  const [products, setProducts] = useState<any[]>([
    { id: 1, item: '', brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 },
  ]);

  const [activeSuggestionRow, setActiveSuggestionRow] = useState<number | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);
  const [showPurchaserDropdown, setShowPurchaserDropdown] = useState(false);
  const [purchaserIndex, setPurchaserIndex] = useState(0);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [supplierIndex, setSupplierIndex] = useState(0);

  // Multi-Attribute Modal State
  const [activeModalRow, setActiveModalRow] = useState<number | null>(null);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showSupplierDropdown) setShowSupplierDropdown(false);
        else if (showPurchaserDropdown) setShowPurchaserDropdown(false);
        else if (activeSuggestionRow !== null) setActiveSuggestionRow(null);
        else navigate(-1);
      }
      
      if (e.altKey) {
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          alert('Purchase Invoice Saved');
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          console.log('Save Draft');
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showSupplierDropdown, showPurchaserDropdown, activeSuggestionRow, navigate]);

  const handleInvoiceChange = (field: string, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    setProducts(prev => {
      const newProducts = [...prev];
      newProducts[index] = { ...newProducts[index], [field]: value };
      return newProducts;
    });
  };

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), item: '', brand: '', qty: '', rate: '', disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 }]);
  };

  const subtotal = products.reduce((acc, p) => acc + ((parseFloat(p.qty) || 0) * (parseFloat(p.rate) || 0) * (1 - (p.disc || 0) / 100)), 0);
  const totalQty = products.reduce((acc, p) => acc + (parseFloat(p.qty) || 0), 0);
  
  const taxableAmount = subtotal;
  const calcDiscount = invoiceData.discountPercent > 0 ? (taxableAmount * invoiceData.discountPercent / 100) : invoiceData.discountAmount;
  const afterDiscount = taxableAmount - calcDiscount;
  const calcCommission = invoiceData.commissionPercent > 0 ? (afterDiscount * invoiceData.commissionPercent / 100) : invoiceData.commissionAmount;
  const afterCommission = afterDiscount - calcCommission;

  let tax = 0;
  if (invoiceData.gstOn === 'items') {
    tax = products.reduce((acc, p) => {
      const lineAmount = (parseFloat(p.qty) || 0) * (parseFloat(p.rate) || 0) * (1 - (p.disc || 0) / 100);
      return acc + (lineAmount * (parseFloat(p.gst) || 0) / 100);
    }, 0);
  } else {
    tax = afterCommission * (invoiceData.taxPercent || 0) / 100;
  }

  const priceAfterTax = afterCommission + tax;
  const finalAmount = priceAfterTax + (invoiceData.charges || 0) + (invoiceData.roundOff || 0);

  const [vendors, setVendors] = useState<any[]>([]);
  const [purchasers, setPurchasers] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Vendors
    fetch('https://api.retailnode.in/api/vendors', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setVendors(Array.isArray(data) ? data : []))
    .catch(console.error);

    // Fetch Purchasers
    fetch('https://api.retailnode.in/api/users/purchasers', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setPurchasers(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent, nextId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById(nextId)?.focus();
    }
  };

  return (
    <PremiumVoucherTemplate
      title="Purchase Invoice"
      subtitle="Accounting Voucher Creation"
      icon={<ShoppingCart className="w-6 h-6" />}
      onSave={() => alert('Purchase Invoice Saved Successfully!')}
      maxWidth="max-w-[1500px]"
    >
      <div className="flex flex-col lg:flex-row gap-4 h-full">
         
         {/* Left Main Form Area */}
         <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-4">
            
            {/* Top Filter Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-5 shrink-0">
               <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4">
                  
                  {/* P.O. No */}
                  <div className="col-span-12 md:col-span-3">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">P.O. No</label>
                     <input id="po_no" type="text" value={invoiceData.orderNo} onChange={e => handleInvoiceChange('orderNo', e.target.value)} onKeyDown={e => handleKeyDown(e, 'supplier')} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none uppercase" placeholder="Enter P.O." />
                  </div>
                  
                  {/* Party */}
                  <div className="col-span-12 md:col-span-6 relative">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex justify-between">
                        Party / Supplier
                        <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 rounded">{invoiceData.supplier === 'Apex Suppliers Ltd.' ? '27AADCA1234F1Z9' : ''}</span>
                     </label>
                     <SearchableDropdown
                       id="supplier"
                       value={invoiceData.supplier}
                       onChange={val => handleInvoiceChange('supplier', val)}
                       onKeyDown={e => handleKeyDown(e, 'purchaser')}
                       options={vendors.length > 0 ? vendors : SUPPLIERS}
                       displayKey="name"
                       placeholder="Select Supplier..."
                       className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                     />
                  </div>

                  {/* Firm */}
                  <div className="col-span-12 md:col-span-3">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Firm / Location</label>
                     <select id="firm" value={invoiceData.firm} onChange={e => handleInvoiceChange('firm', e.target.value)} onKeyDown={e => handleKeyDown(e, 'purchaser')} className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none mb-2">
                        <option>TechCorp India</option>
                        <option>RetailNode Global</option>
                     </select>
                  </div>

                  <div className="col-span-12 border-t border-slate-100 my-1"></div>

                  {/* Order By */}
                  <div className="col-span-12 md:col-span-3">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Order By</label>
                     <SearchableDropdown
                       id="purchaser"
                       value={invoiceData.purchaser}
                       onChange={val => handleInvoiceChange('purchaser', val)}
                       onKeyDown={e => handleKeyDown(e, 'bill_no')}
                       options={purchasers.length > 0 ? purchasers : ACTIVE_USERS}
                       displayKey="name"
                       placeholder="Purchaser Name"
                       className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                     />
                  </div>

                  {/* Bill No & Date */}
                  <div className="col-span-12 md:col-span-3">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Bill No</label>
                     <input id="bill_no" type="text" value={invoiceData.billNo} onChange={e => handleInvoiceChange('billNo', e.target.value)} onKeyDown={e => handleKeyDown(e, 'bill_date')} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" placeholder="Invoice Number" />
                  </div>

                  <div className="col-span-12 md:col-span-3">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Bill Date</label>
                     <input id="bill_date" type="date" value={invoiceData.billDate} onChange={e => handleInvoiceChange('billDate', e.target.value)} onKeyDown={e => handleKeyDown(e, 'receive_date')} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                  </div>

                  {/* Receive Date */}
                  <div className="col-span-12 md:col-span-3">
                     <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Receive Date</label>
                     <input id="receive_date" type="date" value={invoiceData.receiveDate} onChange={e => handleInvoiceChange('receiveDate', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" />
                  </div>

                  <div className="col-span-12 border-t border-slate-100 my-1"></div>
                  
                  {/* Display Settings Toggles */}
                  <div className="col-span-12 flex items-center justify-between">
                     <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <div className="relative flex items-center justify-center w-5 h-5">
                              <input type="checkbox" checked={invoiceData.designNo} onChange={e => handleInvoiceChange('designNo', e.target.checked)} className="peer sr-only" />
                              <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                              <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Design No</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <div className="relative flex items-center justify-center w-5 h-5">
                              <input type="checkbox" checked={invoiceData.colourNo} onChange={e => handleInvoiceChange('colourNo', e.target.checked)} className="peer sr-only" />
                              <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                              <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Colour</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <div className="relative flex items-center justify-center w-5 h-5">
                              <input type="checkbox" checked={invoiceData.showSize} onChange={e => handleInvoiceChange('showSize', e.target.checked)} className="peer sr-only" />
                              <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                              <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Size</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                           <div className="relative flex items-center justify-center w-5 h-5">
                              <input type="checkbox" checked={invoiceData.showPurchaseDiscount} onChange={e => handleInvoiceChange('showPurchaseDiscount', e.target.checked)} className="peer sr-only" />
                              <div className="w-5 h-5 rounded border border-slate-300 bg-white peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-colors"></div>
                              <CheckCircle2 className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                           </div>
                           <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Discount %</span>
                        </label>
                     </div>
                     <div className="flex gap-2 items-center">
                        <span className="text-xs font-bold text-slate-600">GST On:</span>
                        <select value={invoiceData.gstOn} onChange={e => handleInvoiceChange('gstOn', e.target.value)} className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none">
                           <option value="items">Line Items</option>
                           <option value="total">Entire Bill</option>
                        </select>
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
                           <th className='px-4 py-3.5'>Brand</th>
                           <th className='px-4 py-3.5 w-[30%]'>Name of Item</th>
                           {invoiceData.designNo && <th className='px-4 py-3.5'>Design</th>}
                           {invoiceData.colourNo && <th className='px-4 py-3.5'>Colour</th>}
                           {invoiceData.showSize && <th className='px-4 py-3.5'>Size</th>}
                           <th className='px-4 py-3.5 text-right'>Qty</th>
                           <th className='px-4 py-3.5 text-right'>Rate</th>
                           {invoiceData.showPurchaseDiscount && <th className='px-4 py-3.5 text-right'>Disc%</th>}
                           {invoiceData.gstOn === 'items' && <th className='px-4 py-3.5 text-right'>GST%</th>}
                           <th className='px-4 py-3.5 text-right pr-6'>Amount</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {products.map((item, index) => (
                          <tr key={item.id} className="text-[13px] hover:bg-slate-50/50 transition-colors">
                             <td className="px-4 py-2.5 text-center font-bold text-slate-400">{index + 1}</td>
                             <td className="px-4 py-2.5">
                                <input type="text" value={item.brand} onChange={e => updateProduct(index, 'brand', e.target.value)} className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-semibold text-slate-700" placeholder="Brand..." />
                             </td>
                             <td className="px-4 py-2.5">
                                <input type="text" value={item.item} onChange={e => updateProduct(index, 'item', e.target.value)} className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-semibold text-slate-700" placeholder="Type item name..." />
                             </td>
                             {invoiceData.designNo && (
                                <td className="px-4 py-2.5">
                                   <input type="text" value={item.design} onChange={e => updateProduct(index, 'design', e.target.value)} className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 text-slate-700" />
                                </td>
                             )}
                             {invoiceData.colourNo && (
                                <td className="px-4 py-2.5">
                                   <input type="text" value={item.colour} onChange={e => updateProduct(index, 'colour', e.target.value)} className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 text-slate-700" />
                                </td>
                             )}
                             {invoiceData.showSize && (
                                <td className="px-4 py-2.5">
                                   <input type="text" value={item.size} onChange={e => updateProduct(index, 'size', e.target.value)} className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 text-slate-700" />
                                </td>
                             )}
                             <td className="px-4 py-2.5 text-right">
                                <input 
                                  type="number" 
                                  value={item.qty} 
                                  onChange={e => updateProduct(index, 'qty', e.target.value)} 
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      if (invoiceData.showSize || invoiceData.designNo || invoiceData.colourNo) {
                                        setActiveModalRow(index);
                                      }
                                    }
                                  }}
                                  className="w-20 bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-black text-slate-800 text-right" 
                                  placeholder="0" 
                                />
                             </td>
                             <td className="px-4 py-2.5 text-right">
                                <input type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} className="w-20 bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-black text-slate-800 text-right" placeholder="0.00" />
                             </td>
                             {invoiceData.showPurchaseDiscount && (
                                <td className="px-4 py-2.5 text-right">
                                   <input type="number" value={item.disc || ''} onChange={e => updateProduct(index, 'disc', e.target.value)} className="w-16 bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 text-right" />
                                </td>
                             )}
                             {invoiceData.gstOn === 'items' && (
                                <td className="px-4 py-2.5 text-right">
                                   <input type="number" value={item.gst || ''} onChange={e => updateProduct(index, 'gst', e.target.value)} className="w-16 bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 text-right" />
                                </td>
                             )}
                             <td className="px-4 py-2.5 pr-6 text-right">
                                <span className="font-black text-slate-800 text-base">₹{((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (parseFloat(item.disc) || 0)/100)).toFixed(2)}</span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               {/* Actions Footer inside Data Grid (Add Row) */}
               <div className="bg-slate-50 border-t border-slate-200 p-3 flex justify-center">
                  <button onClick={addProduct} className="px-4 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors border border-indigo-200">
                     + Add Another Item
                  </button>
               </div>
            </div>

         </div>

         {/* Right Sidebar Financial Summary */}
         <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-4">
            
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
               <div className="bg-slate-800 text-white p-4 shrink-0 relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/30 rounded-full blur-xl"></div>
                  <h3 className="font-black text-lg tracking-tight relative z-10 flex items-center gap-2">
                     <FileText className="w-5 h-5 text-indigo-400" />
                     Invoice Summary
                  </h3>
               </div>
               
               <div className="p-5 flex-1 flex flex-col gap-4 overflow-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                     <span className="text-sm font-bold text-slate-500">Total Quantity</span>
                     <span className="text-base font-black text-slate-800">{totalQty.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                     <span className="text-sm font-bold text-slate-500">Subtotal</span>
                     <span className="text-base font-black text-slate-800">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="space-y-3 pb-3 border-b border-slate-100">
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500 flex-1">Discount</span>
                        <div className="flex items-center gap-1 w-20">
                           <input type="number" value={invoiceData.discountPercent || ''} onChange={e => handleInvoiceChange('discountPercent', parseFloat(e.target.value) || 0)} className="w-10 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-bold text-center outline-none focus:border-indigo-500" placeholder="%" />
                           <span className="text-xs font-bold text-slate-400">%</span>
                        </div>
                        <input type="number" value={invoiceData.discountAmount || ''} onChange={e => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)} className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-bold text-right outline-none focus:border-indigo-500" placeholder="₹" />
                     </div>
                  </div>

                  <div className="space-y-3 pb-3 border-b border-slate-100">
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500 flex-1">Commission</span>
                        <div className="flex items-center gap-1 w-20">
                           <input type="number" value={invoiceData.commissionPercent || ''} onChange={e => handleInvoiceChange('commissionPercent', parseFloat(e.target.value) || 0)} className="w-10 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-bold text-center outline-none focus:border-indigo-500" placeholder="%" />
                           <span className="text-xs font-bold text-slate-400">%</span>
                        </div>
                        <input type="number" value={invoiceData.commissionAmount || ''} onChange={e => handleInvoiceChange('commissionAmount', parseFloat(e.target.value) || 0)} className="w-20 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-xs font-bold text-right outline-none focus:border-indigo-500" placeholder="₹" />
                     </div>
                  </div>

                  {invoiceData.taxType === 'IGST' ? (
                     <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                        <span className="text-sm font-bold text-slate-500">IGST</span>
                        <span className="text-sm font-black text-slate-800">₹{tax.toFixed(2)}</span>
                     </div>
                  ) : (
                     <>
                        <div className="flex justify-between items-center">
                           <span className="text-sm font-bold text-slate-500">CGST</span>
                           <span className="text-sm font-black text-slate-800">₹{(tax/2).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                           <span className="text-sm font-bold text-slate-500">SGST</span>
                           <span className="text-sm font-black text-slate-800">₹{(tax/2).toFixed(2)}</span>
                        </div>
                     </>
                  )}

                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                     <span className="text-sm font-bold text-slate-500">Other Charges</span>
                     <input type="number" value={invoiceData.charges || ''} onChange={e => handleInvoiceChange('charges', parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-sm font-bold text-right outline-none focus:border-indigo-500" placeholder="₹0.00" />
                  </div>

                  <div className="flex justify-between items-center pb-3">
                     <span className="text-sm font-bold text-slate-500">Round Off</span>
                     <input type="number" value={invoiceData.roundOff || ''} onChange={e => handleInvoiceChange('roundOff', parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1 rounded bg-slate-50 border border-slate-200 text-sm font-bold text-right outline-none focus:border-indigo-500" placeholder="₹0.00" />
                  </div>
               </div>

               {/* Grand Total Area */}
               <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 shrink-0 text-white">
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1 text-right">Net Payable</p>
                  <p className="text-4xl font-black text-right tracking-tight">₹{finalAmount.toFixed(2)}</p>
               </div>
            </div>
         </div>
      </div>

      <MultiAttributeModal 
        isOpen={activeModalRow !== null}
        onClose={() => setActiveModalRow(null)}
        item={activeModalRow !== null ? products[activeModalRow] : null}
        showSize={invoiceData.showSize}
        showColour={invoiceData.colourNo}
        showDesign={invoiceData.designNo}
        onSave={(attributes, totalQty) => {
          if (activeModalRow !== null) {
            updateProduct(activeModalRow, 'qty', totalQty);
            updateProduct(activeModalRow, 'attributes', attributes);
          }
          setActiveModalRow(null);
        }}
      />
    </PremiumVoucherTemplate>
  );
}