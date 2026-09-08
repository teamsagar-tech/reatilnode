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
      
      <div className={`flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full ${isReadOnly ? 'pointer-events-none opacity-85' : ''}`}>
        
        {/* TOP HEADER */}
        <div className="bg-[#1b5e58] text-white px-4 py-1.5 flex justify-between items-center shadow-md z-30 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-black tracking-wider uppercase text-yellow-400 drop-shadow-sm">Purchase Order</h1>
            <div className="flex items-center gap-2 text-[11px] font-bold bg-black/20 px-2 py-0.5 rounded border border-white/10">
              <span className="text-white/70">FIRM:</span>
              <span className="text-yellow-300">{invoiceData.firm}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold bg-black/20 px-2 py-0.5 rounded border border-white/10">
              <span className="text-white/70">LOC:</span>
              <span className="text-yellow-300">{invoiceData.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <button onClick={handleSaveOrder} className="bg-yellow-500 text-[#1b5e58] px-3 py-1 uppercase tracking-widest hover:bg-yellow-400 shadow-[2px_2px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all">Save [Ctrl+S]</button>
            <button onClick={() => navigate(-1)} className="bg-slate-700 text-white px-3 py-1 uppercase tracking-widest hover:bg-slate-600 shadow-[2px_2px_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all">Exit [Esc]</button>
          </div>
        </div>

        {/* INFO PANEL */}
        <div className="bg-[#e0efeb] p-2 pb-0 z-20 shrink-0 border-b-2 border-[#81a09d]">
          <div className="bg-slate-200 border-2 border-slate-400 p-2 shadow-inner flex">
            
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
            </div>

          </div>
        </div>

        {/* MAIN GRID */}
        <div className="flex-1 overflow-auto bg-[#e0efeb] p-2 z-10">
          <div className="min-w-[1000px] border-2 border-slate-500 bg-white shadow-xl h-full flex flex-col">
            <div className="flex bg-[#1b5e58] text-white font-bold text-[11px] uppercase tracking-wider border-b-2 border-slate-500 shrink-0">
              <div className="w-10 p-1 text-center border-r border-slate-400">S.N.</div>
              <div className="flex-[2] p-1 border-r border-slate-400">Name of Item</div>
              <div className="flex-1 p-1 border-r border-slate-400">Brand</div>
              <div className="w-24 p-1 text-right border-r border-slate-400">Qty</div>
              <div className="w-24 p-1 text-right border-r border-slate-400">Rate (₹)</div>
              <div className="w-32 p-1 text-right border-r border-slate-400">Amount</div>
              <div className="w-10 p-1 text-center">Act</div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-50">
              {products.map((row, index) => (
                <div key={row.id} className="flex border-b border-slate-200 hover:bg-yellow-50 text-[12px] font-semibold text-slate-800 group relative">
                  <div className="w-10 p-1 text-center border-r border-slate-300 bg-slate-200/50 text-slate-500">{index + 1}</div>
                  
                  <div className="flex-[2] border-r border-slate-300 relative">
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
                      <div className="absolute top-full left-0 mt-0.5 w-[400px] bg-white border-2 border-slate-500 shadow-2xl z-50">
                        <div className="bg-[#1b5e58] text-white text-[10px] uppercase font-bold flex px-2 py-1">
                          <div className="flex-1">Item</div>
                          <div className="w-16 text-right">Stock</div>
                        </div>
                        <div className="max-h-[200px] overflow-y-auto">
                           {ITEM_SUGGESTIONS.filter(s => s.name.toLowerCase().includes((row.item || '').toLowerCase())).map((suggestion, sIdx) => (
                             <div key={suggestion.id} className={`flex px-2 py-1 cursor-pointer border-b border-slate-100 ${sIdx === suggestionIndex ? 'bg-yellow-200' : 'hover:bg-slate-100'}`} onClick={() => {
                                const newProducts = [...products];
                                newProducts[index] = { ...newProducts[index], item: suggestion.name, brand: suggestion.brand || '', rate: suggestion.rate };
                                setProducts(newProducts);
                                document.getElementById(`row-${index}-qty`)?.focus();
                             }}>
                               <div className="flex-1 font-bold">{suggestion.name}</div>
                               <div className="w-16 text-right font-mono">{suggestion.stock}</div>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 border-r border-slate-300">
                    <input type="text" id={`row-${index}-brand`} value={row.brand} onChange={e => updateProduct(index, 'brand', e.target.value)} onKeyDown={e => handleKeyDown(e, index, 'brand')} className="w-full h-full px-1 bg-transparent focus:outline-none focus:bg-[#ffffe0] text-center" />
                  </div>

                  <div className="w-24 border-r border-slate-300">
                    <input type="number" id={`row-${index}-qty`} value={row.qty} onChange={e => updateProduct(index, 'qty', e.target.value)} onKeyDown={e => handleKeyDown(e, index, 'qty')} className="w-full h-full px-1 bg-transparent focus:outline-none focus:bg-[#ffffe0] text-right font-mono font-bold text-black" />
                  </div>

                  <div className="w-24 border-r border-slate-300">
                    <input type="number" id={`row-${index}-rate`} value={row.rate} onChange={e => updateProduct(index, 'rate', e.target.value)} onKeyDown={e => handleKeyDown(e, index, 'rate')} className="w-full h-full px-1 bg-transparent focus:outline-none focus:bg-[#ffffe0] text-right font-mono font-bold text-black" />
                  </div>

                  <div className="w-32 border-r border-slate-300 bg-slate-100/50 flex items-center justify-end px-1 font-mono font-bold text-slate-800">
                    {((Number(row.qty) || 0) * (Number(row.rate) || 0)).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}
                  </div>

                  <div className="w-10 flex items-center justify-center">
                    <button onClick={() => removeProduct(index)} className="text-red-500 font-bold opacity-0 group-hover:opacity-100 hover:text-red-700">X</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-200 border-t-2 border-slate-500 flex text-[12px] font-bold text-slate-800 shrink-0">
              <div className="flex-[3] p-1 text-right border-r border-slate-400">TOTAL:</div>
              <div className="flex-1 p-1 border-r border-slate-400"></div>
              <div className="w-24 p-1 text-right border-r border-slate-400">{products.reduce((acc, p) => acc + (Number(p.qty) || 0), 0)}</div>
              <div className="w-24 p-1 border-r border-slate-400"></div>
              <div className="w-32 p-1 text-right border-r border-slate-400">{subtotal.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
              <div className="w-10 p-1"></div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-[#1b5e58] text-white p-2 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between z-20">
          <div className="w-[40%] flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-yellow-300 tracking-wider">Narration :</span>
            <textarea 
              value={invoiceData.narration} 
              onChange={e => handleInvoiceChange('narration', e.target.value)} 
              className="w-full bg-white text-black p-1 text-xs font-semibold focus:outline-none focus:bg-[#ffffe0] border-2 border-[#81a09d]" 
              rows={3} 
            />
          </div>
          <div className="w-[45%] bg-slate-100 text-black border-2 border-slate-400 p-2 flex flex-col gap-1 text-[12px] font-bold shadow-inner relative">
            <div className="absolute -top-3 -left-2 bg-yellow-400 text-[#1b5e58] px-2 text-[10px] uppercase tracking-wider font-black shadow-sm">Summary</div>
            <div className="flex justify-between border-b border-slate-300 pb-1 mt-1">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-mono text-slate-900">{subtotal.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </div>
            <div className="flex justify-between border-b border-slate-300 pb-1">
              <span className="text-slate-600">Less: Discount:</span>
              <input type="number" value={invoiceData.discount} onChange={e => handleInvoiceChange('discount', e.target.value)} className="w-24 text-right bg-white border border-slate-400 focus:bg-[#ffffe0] focus:outline-none px-1" />
            </div>
            <div className="flex justify-between border-b border-slate-300 pb-1">
              <span className="text-slate-600">Add: Charges:</span>
              <input type="number" value={invoiceData.charges} onChange={e => handleInvoiceChange('charges', e.target.value)} className="w-24 text-right bg-white border border-slate-400 focus:bg-[#ffffe0] focus:outline-none px-1" />
            </div>
            <div className="flex justify-between border-b border-slate-300 pb-1">
              <span className="text-slate-600">GST (18%):</span>
              <span className="font-mono text-slate-900">{tax.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-[14px] text-blue-900 font-black uppercase tracking-wider">Grand Total:</span>
              <span className="text-[16px] font-black font-mono text-blue-900">₹ {grandTotal.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
