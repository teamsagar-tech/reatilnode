import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ITEM_SUGGESTIONS = [
  { id: 101, name: 'Basic Cotton T-Shirt', type: 'Readymade', stock: 15, sizes: { S: 5, M: 8, L: 2, XL: 0 }, sales: 40, status: 'Reorder', brand: 'Nike', rate: 450 },
  { id: 102, name: 'Classic Denim Jeans', type: 'Readymade', stock: 120, sizes: { '28': 20, '30': 40, '32': 50, '34': 10 }, sales: 15, status: 'Sufficient', brand: 'Levi', rate: 1200 },
  { id: 103, name: 'Banarasi Silk Saree', type: 'Saree', stock: 5, sales: 50, status: 'Critical', brand: 'FabIndia', rate: 4800 },
  { id: 104, name: 'Casual Chinos', type: 'Readymade', stock: 60, sizes: { '30': 20, '32': 30, '34': 10 }, sales: 20, status: 'Sufficient', brand: 'Zara', rate: 1500 },
  { id: 105, name: 'Winter Jacket', type: 'Readymade', stock: 8, sizes: { M: 2, L: 4, XL: 2 }, sales: 2, status: 'Reorder', brand: 'H&M', rate: 3500 },
  { id: 106, name: 'Running Sneakers', type: 'Footwear', stock: 45, sizes: { '7': 5, '8': 15, '9': 15, '10': 10 }, sales: 30, status: 'Sufficient', brand: 'Adidas', rate: 2500 },
  { id: 107, name: 'Designer Wedding Saree', type: 'Saree', stock: 2, sales: 10, status: 'Critical', brand: 'Manyavar', rate: 15000 },
];

const ACTIVE_USERS = [
  { id: 1, name: 'Arjun Kapoor', role: 'Admin' },
  { id: 2, name: 'Rahul Sharma', role: 'Manager' },
  { id: 3, name: 'Priya Singh', role: 'Purchaser' },
  { id: 4, name: 'Vikram Mehta', role: 'Purchaser' },
  { id: 5, name: 'Neha Gupta', role: 'Staff' }
];

const SUPPLIERS = [
  { id: 1, name: 'Apex Suppliers Ltd.', gst: '27AADCA1234F1Z9', state: 'Maharashtra', gstStatus: 'Active' },
  { id: 2, name: 'Global Textiles', gst: '24AAFCG5678G1Z2', state: 'Gujarat', gstStatus: 'Active' },
  { id: 3, name: 'Metro Apparel Hub', gst: '07BBDCM9012H1Z5', state: 'Delhi', gstStatus: 'Suspended' },
  { id: 4, name: 'Southern Silks', gst: '29CCDSN3456J1Z8', state: 'Karnataka', gstStatus: 'Active' },
  { id: 5, name: 'Eastern Garments', gst: '19EEFTE7890K1Z1', state: 'West Bengal', gstStatus: 'Cancelled' }
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

  useEffect(() => {
    // Auto-focus first field
    setTimeout(() => {
      document.getElementById('input-orderNo')?.focus();
    }, 100);

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showSupplierDropdown) setShowSupplierDropdown(false);
        else if (showPurchaserDropdown) setShowPurchaserDropdown(false);
        else if (activeSuggestionRow !== null) setActiveSuggestionRow(null);
        else navigate('/dashboard');
      }
      
      if (e.altKey) {
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          console.log('Submit Order');
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          console.log('Save Draft');
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          setInvoiceData(prev => ({ ...prev, requireBoxPacking: !prev.requireBoxPacking }));
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

  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById(nextFieldId)?.focus();
    }
  };

  const handleSupplierKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const query = (invoiceData.supplier || '').toLowerCase();
    const filtered = SUPPLIERS.filter(s => s.name.toLowerCase().includes(query) || s.gst.toLowerCase().includes(query));

    if (showSupplierDropdown) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSupplierIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSupplierIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[supplierIndex];
        handleInvoiceChange('supplier', selected.name);
        if (selected.state !== 'Maharashtra') {
          handleInvoiceChange('taxType', 'IGST');
        } else {
          handleInvoiceChange('taxType', 'CGST_SGST');
        }
        setShowSupplierDropdown(false);
        document.getElementById('input-billNo')?.focus();
        return;
      }
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('input-billNo')?.focus();
    }
  };

  const handlePurchaserKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const query = (invoiceData.purchaser || '').toLowerCase();
    const filtered = ACTIVE_USERS.filter(u => u.name.toLowerCase().includes(query));

    if (showPurchaserDropdown) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPurchaserIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPurchaserIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        handleInvoiceChange('purchaser', filtered[purchaserIndex].name);
        setShowPurchaserDropdown(false);
        document.getElementById('input-transporter')?.focus();
        return;
      }
    }
    
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('input-transporter')?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: string) => {
    const fields = ['item', 'brand', 'qty', 'rate', 'disc', 'mrp'];
    const currentFieldIndex = fields.indexOf(field);

    if (field === 'item' && activeSuggestionRow === index) {
      const query = products[index].item.toLowerCase();
      const filtered = ITEM_SUGGESTIONS.filter(s => s.name.toLowerCase().includes(query)).slice(0, 8);
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[suggestionIndex];
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], item: selected.name, brand: selected.brand, rate: selected.rate };
        setProducts(newProducts);
        setActiveSuggestionRow(null);
        document.getElementById(`row-${index}-qty`)?.focus();
        return;
      }
    }

    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentFieldIndex < fields.length - 1 && document.getElementById(`row-${index}-${fields[currentFieldIndex + 1]}`)) {
        document.getElementById(`row-${index}-${fields[currentFieldIndex + 1]}`)?.focus();
      } else {
        if (index === products.length - 1) {
          addProduct();
          setTimeout(() => {
            document.getElementById(`row-${index + 1}-item`)?.focus();
          }, 10);
        } else {
          document.getElementById(`row-${index + 1}-item`)?.focus();
        }
      }
    } else if (e.key === 'ArrowLeft') {
      if (currentFieldIndex > 0 && document.getElementById(`row-${index}-${fields[currentFieldIndex - 1]}`)) {
        e.preventDefault();
        document.getElementById(`row-${index}-${fields[currentFieldIndex - 1]}`)?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (index > 0) {
        e.preventDefault();
        document.getElementById(`row-${index - 1}-${field}`)?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      if (index < products.length - 1) {
        e.preventDefault();
        document.getElementById(`row-${index + 1}-${field}`)?.focus();
      }
    }
  };

  const handleItemFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    e.target.select();
    setActiveSuggestionRow(index);
    setSuggestionIndex(0);
  };

  const handleItemBlur = () => {
    setTimeout(() => setActiveSuggestionRow(null), 200);
  };

  const subtotal = products.reduce((acc, p) => acc + ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100)), 0);
  const totalQty = products.reduce((acc, p) => acc + (parseFloat(p.qty) || 0), 0);
  
  const taxableAmount = subtotal;
  
  // Discount
  const calcDiscount = invoiceData.discountPercent > 0 
    ? (taxableAmount * invoiceData.discountPercent / 100) 
    : invoiceData.discountAmount;
  const afterDiscount = taxableAmount - calcDiscount;

  // Commission
  const calcCommission = invoiceData.commissionPercent > 0
    ? (afterDiscount * invoiceData.commissionPercent / 100)
    : invoiceData.commissionAmount;
  const afterCommission = afterDiscount - calcCommission;

  // Tax
  let tax = 0;
  if (invoiceData.gstOn === 'items') {
    tax = products.reduce((acc, p) => {
      const lineAmount = (p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100);
      return acc + (lineAmount * (p.gst || 0) / 100);
    }, 0);
  } else {
    tax = afterCommission * (invoiceData.taxPercent || 0) / 100;
  }

  const priceAfterTax = afterCommission + tax;
  const finalAmount = priceAfterTax + (invoiceData.charges || 0) + (invoiceData.roundOff || 0);

  return (
    <>
      <Helmet>
        <title>Purchase Voucher | RetailNode ERP</title>
      </Helmet>
      
      {/* RetailNode Main Background */}
      <div className="flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">
        
        

        {/* Main Content Area */}
        <div className="flex flex-1 p-1 gap-1 overflow-hidden h-full">
          
          {/* Main Voucher Container */}
          <div className="flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative">
            
            {/* Voucher Header / Title */}
            <div className="bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0">
               <div>Accounting Voucher Creation</div>
               <div className="text-yellow-300">Purchase</div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
              
              {/* Voucher Top Form */}
              <div className="p-2 border-b-2 border-black flex gap-4">
                
                {/* Left Panel */}
                <div className="w-[35%] flex flex-col gap-1 pr-4 border-r-2 border-[#81a09d]">
                  
                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">P.O. No :</span>
                    <input type="text" id="input-orderNo" value={invoiceData.orderNo} onChange={e => setInvoiceData({...invoiceData, orderNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-purchaser')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">Order By :</span>
                    <div className="relative flex-1">
                      <input type="text" id="input-purchaser" value={invoiceData.purchaser} onChange={e => { handleInvoiceChange('purchaser', e.target.value); setPurchaserIndex(0); }} onFocus={(e) => { e.target.select(); setShowPurchaserDropdown(true); }} onBlur={() => setTimeout(() => setShowPurchaserDropdown(false), 200)} onKeyDown={handlePurchaserKeyDown} className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0]" autoComplete="off" />
                      {showPurchaserDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-0 bg-white border-2 border-black z-50 max-h-[150px] overflow-y-auto shadow-md">
                          {ACTIVE_USERS.filter(u => u.name.toLowerCase().includes((invoiceData.purchaser || '').toLowerCase())).map((user, uIdx) => (
                            <div key={user.id} className={`px-2 py-1 text-xs cursor-pointer ${uIdx === purchaserIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => { handleInvoiceChange('purchaser', user.name); document.getElementById('input-transporter')?.focus(); }}>
                              {user.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">Transporter :</span>
                    <input type="text" id="input-transporter" value={invoiceData.transporter} onChange={e => setInvoiceData({...invoiceData, transporter: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-lrNo')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">L R No :</span>
                    <input type="text" id="input-lrNo" value={invoiceData.lrNo} onChange={e => setInvoiceData({...invoiceData, lrNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-bale')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">Bale :</span>
                    <input type="text" id="input-bale" value={invoiceData.bale} onChange={e => setInvoiceData({...invoiceData, bale: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-supplier')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                </div>

                {/* Right Panel */}
                <div className="w-[65%] flex flex-col gap-2">
                  
                  {/* Row 1: Party */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1 relative">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Party :</span>
                      <div className="relative flex-1">
                        <input type="text" id="input-supplier" value={invoiceData.supplier} onChange={e => { handleInvoiceChange('supplier', e.target.value); setSupplierIndex(0); }} onFocus={(e) => { e.target.select(); setShowSupplierDropdown(true); }} onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 200)} onKeyDown={handleSupplierKeyDown} className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0] font-bold" autoComplete="off" />
                        {showSupplierDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-0 bg-white border-2 border-black z-50 max-h-[150px] overflow-y-auto shadow-md">
                            {SUPPLIERS.filter(s => s.name.toLowerCase().includes((invoiceData.supplier || '').toLowerCase())).map((supplier, sIdx) => (
                              <div key={supplier.id} className={`px-2 py-1 text-xs cursor-pointer ${sIdx === supplierIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => { handleInvoiceChange('supplier', supplier.name); document.getElementById('input-billNo')?.focus(); }}>
                                {supplier.name} <span className="font-normal text-[10px] ml-2">({supplier.gst})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center w-[250px]">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Party GSTIN:</span>
                      <input type="text" value="27AADCA1234F1Z9" readOnly className="border border-slate-300 bg-slate-100 px-1 flex-1 focus:outline-none font-mono text-slate-600" />
                    </div>
                  </div>

                  {/* Row 2: Bill No, Date, Receive Date */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Bill No :</span>
                      <input type="text" id="input-billNo" value={invoiceData.billNo} onChange={e => setInvoiceData({...invoiceData, billNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-billDate')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Bill Date :</span>
                      <input type="date" id="input-billDate" value={invoiceData.billDate} onChange={e => setInvoiceData({...invoiceData, billDate: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-receiveDate')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[100px] text-slate-800 font-bold mr-2">Receive Date :</span>
                      <input type="date" id="input-receiveDate" value={invoiceData.receiveDate} onChange={e => setInvoiceData({...invoiceData, receiveDate: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-totalQty')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                  </div>

                  {/* Row 3: Total Qty, Amount, GST On */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Total Qty :</span>
                      <input type="number" id="input-totalQty" value={invoiceData.totalQuantity} onChange={e => setInvoiceData({...invoiceData, totalQuantity: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-billAmount')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Bill Amount :</span>
                      <input type="number" id="input-billAmount" value={invoiceData.billAmount} onChange={e => setInvoiceData({...invoiceData, billAmount: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-gstOn')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                    </div>
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[100px] text-slate-800 font-bold mr-2">GST On :</span>
                      <select id="input-gstOn" value={invoiceData.gstOn} onChange={e => setInvoiceData({...invoiceData, gstOn: e.target.value as any})} onKeyDown={e => handleHeaderKeyDown(e, 'row-0-item')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]">
                        <option value="total">Entire Invoice</option>
                        <option value="items">Individual Line Items</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Toggles and Firm/Location */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-300">
                    <div className="flex items-center gap-4 text-[11px] font-bold">
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.designNo} onChange={e => setInvoiceData({...invoiceData, designNo: e.target.checked})} className="accent-[#1b5e58]" /> Design No
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.colourNo} onChange={e => setInvoiceData({...invoiceData, colourNo: e.target.checked})} className="accent-[#1b5e58]" /> Colour No
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.showSize} onChange={e => setInvoiceData({...invoiceData, showSize: e.target.checked})} className="accent-[#1b5e58]" /> Size
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.showPurchaseDiscount} onChange={e => setInvoiceData({...invoiceData, showPurchaseDiscount: e.target.checked})} className="accent-[#1b5e58]" /> Discount %
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.showMarkdown} onChange={e => setInvoiceData({...invoiceData, showMarkdown: e.target.checked})} className="accent-[#1b5e58]" /> MRP Markdown
                      </label>
                    </div>

                    <div className="flex items-center gap-3">
                      <select value={invoiceData.firm} onChange={e => handleInvoiceChange('firm', e.target.value)} className="border border-slate-500 bg-white px-1 text-xs font-bold focus:outline-none focus:border-black focus:bg-[#ffffe0]">
                        <option>TechCorp India</option>
                        <option>RetailNode Global</option>
                      </select>
                      <select value={invoiceData.location} onChange={e => handleInvoiceChange('location', e.target.value)} className="border border-slate-500 bg-white px-1 text-xs font-bold focus:outline-none focus:border-black focus:bg-[#ffffe0]">
                        <option>Mumbai Warehouse</option>
                        <option>Delhi Hub</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              {/* Items Table */}
              <div className="flex-1 border-b-2 border-black flex flex-col bg-[#fcfaf2]">
                <table className="w-full text-left border-collapse relative">
                  <thead className="sticky top-0 bg-[#eef5ed] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
                    <tr className="border-b-2 border-black text-slate-900 font-bold text-[12px]">
                      <th className="px-1 py-1 border-r border-slate-300 w-8 text-center">#</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Brand</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[200px] text-center">Name of Item</th>
                      {invoiceData.designNo && <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Design</th>}
                      {invoiceData.colourNo && <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Colour</th>}
                      {invoiceData.showSize && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Size</th>}
                      <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">Quantity</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[80px] text-center">Rate</th>
                      {invoiceData.showPurchaseDiscount && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">Disc%</th>}
                      {invoiceData.showMarkdown && <th className="px-1 py-1 border-r border-slate-300 w-[70px] text-center">MRP</th>}
                      {invoiceData.gstOn === 'items' && <th className="px-1 py-1 border-r border-slate-300 w-[60px] text-center">GST%</th>}
                      <th className="px-1 py-1 w-[100px] text-center">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item, index) => (
                      <tr key={item.id} className="text-[13px] border-b border-slate-300">
                        <td className="border-r border-slate-300 px-1 py-[2px] text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input id={`row-${index}-brand`} type="text" value={item.brand} onChange={e => updateProduct(index, 'brand', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'brand')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" />
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input id={`row-${index}-item`} type="text" value={item.item} onChange={e => { updateProduct(index, 'item', e.target.value); setSuggestionIndex(0); }} onFocus={(e) => handleItemFocus(e, index)} onBlur={handleItemBlur} onKeyDown={(e) => handleKeyDown(e, index, 'item')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" autoComplete="off" />
                          {activeSuggestionRow === index && (
                            <div className="absolute top-full left-0 mt-0 bg-white border-2 border-black z-50 w-[300px] shadow-md max-h-[150px] overflow-y-auto">
                              {ITEM_SUGGESTIONS.filter(s => s.name.toLowerCase().includes(item.item.toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (
                                <div key={suggestion.id} className={`px-2 py-1 text-xs cursor-pointer ${sIdx === suggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} onClick={() => { updateProduct(index, 'item', suggestion.name); updateProduct(index, 'brand', suggestion.brand); updateProduct(index, 'rate', suggestion.rate); setActiveSuggestionRow(null); document.getElementById(`row-${index}-qty`)?.focus(); }}>
                                  {suggestion.name} - <span className="font-normal text-[10px]">{suggestion.brand}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        {invoiceData.designNo && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-design`} type="text" value={item.design} onChange={e => updateProduct(index, 'design', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'design')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" />
                          </td>
                        )}
                        {invoiceData.colourNo && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-colour`} type="text" value={item.colour} onChange={e => updateProduct(index, 'colour', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'colour')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" />
                          </td>
                        )}
                        {invoiceData.showSize && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-size`} type="text" value={item.size} onChange={e => updateProduct(index, 'size', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'size')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 font-bold text-center" />
                          </td>
                        )}
                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input id={`row-${index}-qty`} type="number" value={item.qty} onChange={e => updateProduct(index, 'qty', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'qty')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                        </td>
                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input id={`row-${index}-rate`} type="number" value={item.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={(e) => handleKeyDown(e, index, 'rate')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                        </td>
                        {invoiceData.showPurchaseDiscount && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-disc`} type="number" value={item.disc || ''} onChange={e => updateProduct(index, 'disc', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'disc')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.showMarkdown && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-mrp`} type="number" value={item.mrp || ''} onChange={e => updateProduct(index, 'mrp', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'mrp')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        {invoiceData.gstOn === 'items' && (
                          <td className="border-r border-slate-300 px-1 py-[2px]">
                            <input id={`row-${index}-gst`} type="number" value={item.gst || ''} onChange={e => updateProduct(index, 'gst', parseFloat(e.target.value) || 0)} onKeyDown={(e) => handleKeyDown(e, index, 'gst')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right font-bold" />
                          </td>
                        )}
                        <td className="px-1 py-[2px]">
                          <input type="text" value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (item.disc || 0)/100)).toFixed(2)} readOnly className="w-full bg-transparent focus:outline-none px-1 text-right font-bold" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Two-Part Footer: Narration (Left) and Detailed Totals (Right) */}
              <div className="flex border-b-2 border-black bg-[#fcfaf2] shrink-0">
                
                {/* Left Part: Narration */}
                <div className="w-[60%] border-r-2 border-[#81a09d] p-2 flex flex-col justify-end">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-800 font-bold text-[11px]">Narration:</span>
                    <textarea 
                      className="border border-slate-500 bg-white px-1 py-0.5 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0] italic resize-none text-[11px]" 
                      rows={2}
                    ></textarea>
                  </div>
                </div>

                {/* Right Part: Totals Table */}
                <div className="w-[40%] flex flex-col font-bold text-[11px] text-slate-800 leading-tight">
                  
                  {/* Taxable Amount */}
                  <div className="flex border-b border-slate-300">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0">Taxable Amount</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{taxableAmount.toFixed(2)}</div>
                  </div>

                  {/* Discount */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Discount %</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                      <input type="number" value={invoiceData.discountPercent || ''} onChange={e => handleInvoiceChange('discountPercent', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                    </div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.discountAmount || ''} onChange={e => handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* After Discount */}
                  <div className="flex border-b border-slate-300">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0">After Discount</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{afterDiscount.toFixed(2)}</div>
                  </div>

                  {/* Commission */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Commission %</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                      <input type="number" value={invoiceData.commissionPercent || ''} onChange={e => handleInvoiceChange('commissionPercent', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                    </div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.commissionAmount || ''} onChange={e => handleInvoiceChange('commissionAmount', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* After Commission */}
                  <div className="flex border-b border-slate-300">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0">After Commission</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{afterCommission.toFixed(2)}</div>
                  </div>

                  {/* IGST / CGST / SGST */}
                  {invoiceData.taxType === 'IGST' ? (
                    <div className="flex border-b border-slate-300 bg-white">
                      <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">IGST %</div>
                      <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                        {invoiceData.gstOn === 'total' ? (
                          <input type="number" value={invoiceData.taxPercent || ''} onChange={e => handleInvoiceChange('taxPercent', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-center" />
                        ) : (
                          <div className="text-center text-slate-500 font-normal">Auto</div>
                        )}
                      </div>
                      <div className="w-[35%] px-1 py-0 text-right bg-[#fcfaf2]">{tax.toFixed(2)}</div>
                    </div>
                  ) : (
                    <>
                      <div className="flex border-b border-slate-300 bg-white">
                        <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">CGST %</div>
                        <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                          {invoiceData.gstOn === 'total' ? (
                            <input type="number" value={(invoiceData.taxPercent || 0)/2} readOnly className="w-full bg-transparent px-1 text-center text-slate-500 font-normal outline-none" />
                          ) : (
                            <div className="text-center text-slate-500 font-normal">Auto</div>
                          )}
                        </div>
                        <div className="w-[35%] px-1 py-0 text-right bg-[#fcfaf2]">{(tax/2).toFixed(2)}</div>
                      </div>
                      <div className="flex border-b border-slate-300 bg-white">
                        <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">SGST %</div>
                        <div className="w-[20%] border-r border-slate-300 px-0 py-0">
                          {invoiceData.gstOn === 'total' ? (
                            <input type="number" value={(invoiceData.taxPercent || 0)/2} readOnly className="w-full bg-transparent px-1 text-center text-slate-500 font-normal outline-none" />
                          ) : (
                            <div className="text-center text-slate-500 font-normal">Auto</div>
                          )}
                        </div>
                        <div className="w-[35%] px-1 py-0 text-right bg-[#fcfaf2]">{(tax/2).toFixed(2)}</div>
                      </div>
                    </>
                  )}

                  {/* Price After Tax */}
                  <div className="flex border-b border-slate-300">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0">Price After Tax</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{priceAfterTax.toFixed(2)}</div>
                  </div>

                  {/* Other Charges */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Other Charges</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center text-blue-600 bg-[#fcfaf2]">—</div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.charges || ''} onChange={e => handleInvoiceChange('charges', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* Round Off */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Round Off</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0"></div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.roundOff || ''} onChange={e => handleInvoiceChange('roundOff', parseFloat(e.target.value) || 0)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* Final Amount */}
                  <div className="flex bg-[#ffffe0] border-t border-black">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-[2px]">Total Qty: {totalQty.toFixed(2)}</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-[2px]">Final Amount</div>
                    <div className="w-[35%] px-1 py-[2px] text-right text-[12px]">{finalAmount.toFixed(2)}</div>
                  </div>

                </div>
              </div>
              
            </div>
          </div>

          {/* Right Action Sidebar (F-keys) */}
          <div className="w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]">
             {[
               { key: "F1", label: "Help" },
               { key: "F2", label: "Date" },
               { key: "F3", label: "Company" },
               { key: "F4", label: "Contra" },
               { key: "F5", label: "Payment" },
               { key: "F6", label: "Receipt" },
               { key: "F7", label: "Journal" },
               { key: "F8", label: "Sales" },
               { key: "F9", label: "Purchase" },
             ].map((f) => (
               <button 
                 key={f.key} 
                 className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
               >
                 <span className="font-bold text-black text-[11px] w-[25px]">{f.key}</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">{f.label}</span>
               </button>
             ))}
             <div className="flex-1" />
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
               onClick={() => navigate('/dashboard')}
               className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
             >
                 <span className="font-bold text-black text-[11px] w-[25px] underline">Q</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Quit</span>
             </button>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]">
          <div className="font-medium tracking-wide">Purchase Voucher</div>
          <div className="flex gap-6">
            <span>Version: 1.0</span>
          </div>
        </div>
      </div>
    </>
  );
}
