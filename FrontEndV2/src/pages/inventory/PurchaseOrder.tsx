import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../components/SearchableDropdown';

// Mock Data
const ITEM_SUGGESTIONS = [
  { id: 101, name: 'Basic Cotton T-Shirt', stock: 15, brand: 'Nike', rate: 450 },
  { id: 102, name: 'Classic Denim Jeans', stock: 120, brand: 'Levi', rate: 1200 },
  { id: 103, name: 'Banarasi Silk Saree', stock: 5, brand: 'FabIndia', rate: 4800 },
];

const ACTIVE_USERS = [
  { id: 1, name: 'Arjun Kapoor', role: 'Admin' },
  { id: 2, name: 'Rahul Sharma', role: 'Manager' },
  { id: 3, name: 'Priya Singh', role: 'Purchaser' }
];

const SUPPLIERS = [
  { id: 1, name: 'Apex Suppliers Ltd.', state: 'Maharashtra' },
  { id: 2, name: 'Global Textiles', state: 'Gujarat' },
];

export default function PurchaseOrder() {
  const navigate = useNavigate();
  const [isReadOnly, setIsReadOnly] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    orderNo: '',
    orderDate: new Date().toISOString().split('T')[0],
    supplier: '',
    firm: 'TechCorp India',
    location: 'Mumbai Warehouse',
    purchaser: '',
    requireBoxPacking: false,
    taxType: 'CGST_SGST',
    discount: 0,
    charges: 0,
    narration: ''
  });

  const [products, setProducts] = useState([
    { id: 1, item: '', brand: '', qty: '', rate: '' }
  ]);

  const [activeSuggestionRow, setActiveSuggestionRow] = useState<number | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveOrder();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [navigate]);

  const handleSaveOrder = () => {
    alert('Order Saved! (Mock)');
  };

  const handleInvoiceChange = (field: string, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), item: '', brand: '', qty: '', rate: '' }]);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: string) => {
    const fields = ['item', 'brand', 'qty', 'rate'];
    const currentFieldIndex = fields.indexOf(field);

    if (field === 'item' && activeSuggestionRow === index) {
      const query = products[index].item.toLowerCase();
      const filtered = ITEM_SUGGESTIONS.filter(s => s.name.toLowerCase().includes(query));
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSuggestionIndex(prev => Math.max(prev - 1, 0));
        return;
      } else if ((e.key === 'Enter' || e.key === 'Tab' || e.key === 'ArrowRight') && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[suggestionIndex];
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], item: selected.name, brand: selected.brand || '', rate: selected.rate };
        setProducts(newProducts);
        setActiveSuggestionRow(null);
        document.getElementById(`row-${index}-qty`)?.focus();
        return;
      }
    }

    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentFieldIndex < fields.length - 1) {
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
      if (currentFieldIndex > 0) {
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

  const subtotal = products.reduce((acc, p) => acc + ((Number(p.qty) || 0) * (Number(p.rate) || 0)), 0);
  const tax = subtotal * 0.18;
  const grandTotal = subtotal - (Number(invoiceData.discount) || 0) + (Number(invoiceData.charges) || 0) + tax;

  return (
    <>
      <Helmet>
        <title>Purchase Order | RetailNode ERP</title>
      </Helmet>
      
      {/* RetailNode Main Background */}
      <div className={`flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full ${isReadOnly ? 'pointer-events-none opacity-85' : ''}`}>
        
        {/* Main Content Area */}
        <div className="flex flex-1 p-1 gap-1 overflow-hidden h-full">
          
          {/* Main Voucher Container */}
          <div className="flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative">
            
            {/* Voucher Header / Title */}
            <div className="bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0">
               <div>Purchase Order Creation</div>
               <div className="flex gap-4 items-center">
                 <button className="bg-yellow-400 text-black px-2 py-0.5 rounded text-xs hover:bg-yellow-500 transition-colors">Import (Alt+I)</button>
                 <div className="text-yellow-300">Purchase Order</div>
               </div>
            </div>

            <div className="flex flex-col flex-1 overflow-y-auto">
              
              {/* Voucher Top Form */}
              <div className="p-2 border-b-2 border-black flex gap-4">
                
                {/* Left Panel */}
                <div className="w-[35%] flex flex-col gap-1 pr-4 border-r-2 border-[#81a09d]">
                  
                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">P.O. No :</span>
                    <input type="text" id="input-orderNo" autoFocus value={invoiceData.orderNo} onChange={e => setInvoiceData({...invoiceData, orderNo: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-orderDate')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                  <div className="flex items-center">
                    <span className="w-[100px] text-slate-800 font-bold mr-2">P.O. Date :</span>
                    <input type="date" id="input-orderDate" value={invoiceData.orderDate} onChange={e => setInvoiceData({...invoiceData, orderDate: e.target.value})} onKeyDown={e => handleHeaderKeyDown(e, 'input-purchaser')} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]" />
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center flex-1 relative">
                      <span className="w-[100px] text-slate-800 font-bold mr-2">Purchaser :</span>
                      <div className="relative flex-1">
                        <SearchableDropdown
                          id="input-purchaser"
                          value={invoiceData.purchaser}
                          onChange={val => handleInvoiceChange('purchaser', val)}
                          onKeyDown={e => handleHeaderKeyDown(e, 'input-supplier')}
                          onSelect={opt => {
                            setTimeout(() => document.getElementById('input-supplier')?.focus(), 10);
                          }}
                          options={ACTIVE_USERS}
                          displayKey="name"
                          className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0]"
                          width="100%"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Panel */}
                <div className="w-[65%] flex flex-col gap-2 pl-4">
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-1 relative">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Supplier :</span>
                      <div className="relative flex-1">
                        <SearchableDropdown
                          id="input-supplier"
                          value={invoiceData.supplier}
                          onChange={val => handleInvoiceChange('supplier', val)}
                          onKeyDown={e => handleHeaderKeyDown(e, 'row-0-item')}
                          onSelect={opt => {
                            setTimeout(() => document.getElementById('row-0-item')?.focus(), 10);
                          }}
                          options={SUPPLIERS}
                          displayKey="name"
                          className="border border-slate-500 bg-white px-1 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0] font-bold"
                          width="100%"
                        />
                      </div>
                    </div>
                    <div className="flex items-center w-[250px]">
                       <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                         <input type="checkbox" checked={invoiceData.requireBoxPacking} onChange={e => handleInvoiceChange('requireBoxPacking', e.target.checked)} className="accent-[#1b5e58]" />
                         Require Box Packing
                       </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center flex-[1.5]">
                      <span className="w-[80px] text-slate-800 font-bold mr-2">Tax Type :</span>
                      <select id="input-taxType" value={invoiceData.taxType} onChange={e => setInvoiceData({...invoiceData, taxType: e.target.value as any})} className="border border-slate-500 bg-white px-1 flex-1 focus:outline-none focus:border-black focus:bg-[#ffffe0]">
                        <option value="CGST_SGST">Local (CGST/SGST)</option>
                        <option value="IGST">Inter-State (IGST)</option>
                      </select>
                    </div>
                    <div className="flex items-center flex-1">
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
                      <th className="px-1 py-1 border-r border-slate-300 w-[150px] text-center">Brand</th>
                      <th className="px-1 py-1 border-r border-slate-300 flex-1 text-center">Name of Item</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Qty</th>
                      <th className="px-1 py-1 border-r border-slate-300 w-[100px] text-center">Rate</th>
                      <th className="px-1 py-1 w-[120px] text-center border-r border-slate-300">Amount</th>
                      <th className="px-1 py-1 w-[50px] text-center">Act</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((row, index) => (
                      <tr key={row.id} className="text-[13px] border-b border-slate-300 hover:bg-yellow-50 group">
                        <td className="border-r border-slate-300 px-1 py-[2px] text-center font-bold text-slate-500">{index + 1}</td>
                        
                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input type="text" id={`row-${index}-brand`} value={row.brand} onChange={e => updateProduct(index, 'brand', e.target.value)} onKeyDown={e => handleKeyDown(e, index, 'brand')} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1" />
                        </td>

                        <td className="border-r border-slate-300 px-1 py-[2px] relative">
                          <input 
                            type="text" 
                            id={`row-${index}-item`}
                            value={row.item}
                            onChange={e => {
                              updateProduct(index, 'item', e.target.value);
                              setSuggestionIndex(0);
                            }}
                            onFocus={() => setActiveSuggestionRow(index)}
                            onBlur={() => setTimeout(() => setActiveSuggestionRow(null), 200)}
                            onKeyDown={e => handleKeyDown(e, index, 'item')}
                            className="w-full h-full px-1 bg-transparent focus:outline-none focus:bg-[#ffffe0] font-bold text-blue-900 uppercase"
                            autoComplete="off"
                          />
                          {activeSuggestionRow === index && (
                            <div className="absolute top-full left-0 mt-0.5 w-[400px] bg-white border-2 border-black shadow-2xl z-50">
                              <div className="bg-[#1b5e58] text-white text-[10px] uppercase font-bold flex px-2 py-1">
                                <div className="flex-1">Item</div>
                                <div className="w-16 text-right">Stock</div>
                              </div>
                              <div className="max-h-[200px] overflow-y-auto">
                                 {ITEM_SUGGESTIONS.filter(s => s.name.toLowerCase().includes((row.item || '').toLowerCase())).map((suggestion, sIdx) => (
                                   <div key={suggestion.id} className={`flex px-2 py-1 cursor-pointer border-b border-slate-100 ${sIdx === suggestionIndex ? 'bg-[#ffe000] text-black' : 'hover:bg-slate-100'}`} onClick={() => {
                                      const newProducts = [...products];
                                      newProducts[index] = { ...newProducts[index], item: suggestion.name, brand: suggestion.brand || '', rate: suggestion.rate.toString() };
                                      setProducts(newProducts);
                                      setActiveSuggestionRow(null);
                                      document.getElementById(`row-${index}-qty`)?.focus();
                                   }}>
                                     <div className="flex-1 font-bold">{suggestion.name}</div>
                                     <div className="w-16 text-right font-mono">{suggestion.stock}</div>
                                   </div>
                                 ))}
                              </div>
                            </div>
                          )}
                        </td>

                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input type="number" id={`row-${index}-qty`} value={row.qty} onChange={e => updateProduct(index, 'qty', e.target.value)} onKeyDown={e => handleKeyDown(e, index, 'qty')} className="w-full h-full px-1 bg-transparent focus:outline-none focus:bg-[#ffffe0] text-right font-mono font-bold text-black" />
                        </td>

                        <td className="border-r border-slate-300 px-1 py-[2px]">
                          <input type="number" id={`row-${index}-rate`} value={row.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={e => handleKeyDown(e, index, 'rate')} className="w-full h-full px-1 bg-transparent focus:outline-none focus:bg-[#ffffe0] text-right font-mono font-bold text-black" />
                        </td>

                        <td className="border-r border-slate-300 px-1 py-[2px] bg-slate-100/50 flex items-center justify-end font-mono font-bold text-slate-800">
                          {((Number(row.qty) || 0) * (Number(row.rate) || 0)).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}
                        </td>

                        <td className="w-[50px] flex items-center justify-center py-[2px]">
                          <button onClick={() => removeProduct(index)} className="text-red-500 font-bold opacity-0 group-hover:opacity-100 hover:text-red-700">X</button>
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
                      value={invoiceData.narration} 
                      onChange={e => handleInvoiceChange('narration', e.target.value)} 
                      className="border border-slate-500 bg-white px-1 py-0.5 w-full focus:outline-none focus:border-black focus:bg-[#ffffe0] italic resize-none text-[11px]" 
                      rows={2}
                    ></textarea>
                  </div>
                </div>

                {/* Right Part: Totals Table */}
                <div className="w-[40%] flex flex-col font-bold text-[11px] text-slate-800 leading-tight">
                  
                  {/* Taxable Amount */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Subtotal</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{subtotal.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  </div>

                  {/* Discount */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Less: Discount</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0"></div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.discount} onChange={e => handleInvoiceChange('discount', e.target.value)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* Charges */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">Add: Charges</div>
                    <div className="w-[20%] border-r border-slate-300 px-0 py-0"></div>
                    <div className="w-[35%] px-0 py-0">
                      <input type="number" value={invoiceData.charges} onChange={e => handleInvoiceChange('charges', e.target.value)} className="w-full bg-transparent focus:bg-[#ffffe0] focus:outline-none px-1 text-right" />
                    </div>
                  </div>

                  {/* GST */}
                  <div className="flex border-b border-slate-300 bg-white">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 bg-[#fcfaf2]">GST (18%)</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right">{tax.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  </div>

                  {/* Grand Total */}
                  <div className="flex bg-[#eef5ed] text-[13px] text-blue-900 border-t border-slate-400">
                    <div className="w-[45%] border-r border-slate-300 px-1 py-0 font-black uppercase tracking-wider">Final Amount</div>
                    <div className="w-[20%] border-r border-slate-300 px-1 py-0 text-center">—</div>
                    <div className="w-[35%] px-1 py-0 text-right font-black font-mono">₹ {grandTotal.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar (F-Keys) */}
          <div className="w-[120px] bg-[#e0efeb] flex flex-col gap-[2px] overflow-y-auto">
             <button className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left">
                 <span className="font-bold text-black text-[11px] w-[35px]">F1</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Help</span>
             </button>
             <button className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left">
                 <span className="font-bold text-black text-[11px] w-[35px]">F2</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Date</span>
             </button>
             <button className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left">
                 <span className="font-bold text-black text-[11px] w-[35px]">F3</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Company</span>
             </button>
             <button className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left">
                 <span className="font-bold text-black text-[11px] w-[35px]">F4</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Contra</span>
             </button>
             <button className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left">
                 <span className="font-bold text-black text-[11px] w-[35px]">F5</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Payment</span>
             </button>
             <button className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left">
                 <span className="font-bold text-black text-[11px] w-[35px]">F6</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Receipt</span>
             </button>
             <button className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left">
                 <span className="font-bold text-black text-[11px] w-[35px]">F7</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Journal</span>
             </button>
             <button className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left">
                 <span className="font-bold text-black text-[11px] w-[35px]">F8</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Sales</span>
             </button>
             <button className="flex flex-row items-center px-2 py-1 bg-[#b4e6d3] border border-[#1b5e58] hover:bg-[#99d7c0] text-left shadow-inner">
                 <span className="font-bold text-black text-[11px] w-[35px]">F9</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#1b5e58] pl-1 ml-1">Purchase</span>
             </button>

             <div className="flex-1" />

             {/* RetailNode branding side panel bottom */}
             <div className="flex flex-col items-center justify-center p-2 mb-2 bg-[#d1e6e0] border border-[#a3c3be] mx-1 rounded">
                <div className="w-12 h-12 bg-[#1b5e58] text-white rounded-full flex items-center justify-center text-xl font-black tracking-tighter mb-1 shadow-sm">RN.</div>
                <span className="text-[10px] font-bold text-[#1b5e58] uppercase tracking-widest">RetailNode</span>
             </div>

             <button onClick={handleSaveOrder} className="flex flex-row items-center px-2 py-1 bg-yellow-400 border border-yellow-600 hover:bg-yellow-500 text-left shadow-sm">
                 <span className="font-bold text-black text-[11px] w-[35px] underline decoration-2 underline-offset-2">S</span>
                 <span className="text-black text-[11px] font-medium border-l border-yellow-600 pl-1 ml-1">Save</span>
             </button>
             <button onClick={() => navigate(-1)} className="flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left mt-1">
                 <span className="font-bold text-black text-[11px] w-[35px] underline decoration-2 underline-offset-2">Q</span>
                 <span className="text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1">Quit</span>
             </button>
          </div>

        </div>

        {/* Bottom Status Bar */}
        <div className="bg-[#1b5e58] text-white flex justify-between items-center p-1 px-2 text-[10px] shrink-0 border-t-2 border-[#0f3d39]">
           <div className="flex items-center gap-4">
              <span className="font-bold text-yellow-300 tracking-wider">Purchase Order Voucher</span>
              <span className="text-slate-300">Shortcuts: <strong>Option+S</strong> (Save) | <strong>Option+I</strong> (Import)</span>
           </div>
           <div className="flex items-center gap-4 text-slate-300">
              <span>Firm: <strong className="text-white">{invoiceData.firm}</strong></span>
              <span>Location: <strong className="text-white">{invoiceData.location}</strong></span>
              <span>Version: 1.0</span>
           </div>
        </div>

      </div>
    </>
  );
}
