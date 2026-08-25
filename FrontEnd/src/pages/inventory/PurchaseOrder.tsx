import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Package, Calendar, Building2, MapPin, User, Truck, 
  Plus, Trash2, Save, FileText, Calculator, AlertCircle, CheckCircle2 
} from 'lucide-react';

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

export default function PurchaseOrder() {
  const [invoiceData, setInvoiceData] = useState({
    orderDate: new Date().toISOString().split('T')[0],
    supplier: 'Apex Suppliers Ltd.',
    firm: 'TechCorp India',
    location: 'Mumbai Warehouse',
    purchaser: 'Arjun Kapoor',
    requireBoxPacking: false,
    taxType: 'CGST_SGST' as 'IGST' | 'CGST_SGST',
    discount: 0,
    charges: 0
  });

  const [products, setProducts] = useState([
    { id: 1, item: 'Basic Cotton T-Shirt', brand: 'Nike', qty: 100, rate: 450 },
    { id: 2, item: 'Classic Denim Jeans', brand: 'Levi', qty: 50, rate: 1200 },
  ]);

  const [activeSuggestionRow, setActiveSuggestionRow] = useState<number | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(0);

  const [showPurchaserDropdown, setShowPurchaserDropdown] = useState(false);
  const [purchaserIndex, setPurchaserIndex] = useState(0);

  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [supplierIndex, setSupplierIndex] = useState(0);

  const isMac = typeof window !== 'undefined' && navigator.userAgent.includes('Mac');
  const getShortcutText = (key: string) => isMac ? `⌥${key}` : `Alt+${key}`;

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          // Trigger submit order
          console.log('Submit Order');
        } else if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          // Trigger save draft
          console.log('Save Draft');
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          setInvoiceData(prev => ({ ...prev, requireBoxPacking: !prev.requireBoxPacking }));
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleInvoiceChange = (field: string, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), item: '', brand: '', qty: 1, rate: 0 }]);
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
        
        // Auto-switch to IGST if it's an out-of-state supplier (assuming base state is Maharashtra for demo)
        if (selected.state !== 'Maharashtra') {
          handleInvoiceChange('taxType', 'IGST');
        } else {
          handleInvoiceChange('taxType', 'CGST_SGST');
        }

        setShowSupplierDropdown(false);
        document.getElementById('input-purchaser')?.focus();
        return;
      }
    }
    
    // Fallback if no dropdown or empty enter
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('input-purchaser')?.focus();
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
        document.getElementById('row-0-item')?.focus();
        return;
      }
    }
    
    // Fallback if no dropdown or empty enter
    if (e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('row-0-item')?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: string) => {
    const fields = ['item', 'brand', 'qty', 'rate'];
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
        document.getElementById(`row-${index}-qty`)?.focus(); // Jump to qty after selection
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

  const handleItemFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    e.target.select();
    setActiveSuggestionRow(index);
    setSuggestionIndex(0);
  };

  const handleItemBlur = () => {
    setTimeout(() => setActiveSuggestionRow(null), 200);
  };

  const subtotal = products.reduce((acc, p) => acc + (p.qty * p.rate || 0), 0);
  const tax = subtotal * 0.18;
  const grandTotal = subtotal - (invoiceData.discount || 0) + (invoiceData.charges || 0) + tax;

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col h-full overflow-hidden">
      <Helmet>
        <title>New Purchase Order | RetailNode</title>
      </Helmet>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            New Purchase Order
          </h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <select 
              id="input-firm"
              autoFocus
              value={invoiceData.firm}
              onChange={(e) => handleInvoiceChange('firm', e.target.value)}
              onKeyDown={(e) => handleHeaderKeyDown(e, 'input-location')}
              className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option>TechCorp India</option>
              <option>RetailNode Global</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select 
              id="input-location"
              value={invoiceData.location}
              onChange={(e) => handleInvoiceChange('location', e.target.value)}
              onKeyDown={(e) => handleHeaderKeyDown(e, 'input-date')}
              className="bg-transparent text-sm font-semibold text-slate-700 focus:outline-none focus:ring-0 cursor-pointer"
            >
              <option>Mumbai Warehouse</option>
              <option>Delhi Hub</option>
              <option>Storefront 1</option>
            </select>
          </div>
        </div>
      </div>

      {/* Header Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-2 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date
            </label>
            <input 
              id="input-date"
              type="date" 
              value={invoiceData.orderDate}
              onChange={(e) => handleInvoiceChange('orderDate', e.target.value)}
              onKeyDown={(e) => handleHeaderKeyDown(e, 'input-supplier')}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
              <Truck className="w-3 h-3" /> Supplier
            </label>
            <input 
              id="input-supplier"
              type="text" 
              value={invoiceData.supplier}
              onChange={(e) => {
                handleInvoiceChange('supplier', e.target.value);
                setSupplierIndex(0);
              }}
              onKeyDown={handleSupplierKeyDown}
              onFocus={(e) => {
                e.target.select();
                setShowSupplierDropdown(true);
                setSupplierIndex(0);
              }}
              onBlur={() => setTimeout(() => setShowSupplierDropdown(false), 200)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
              placeholder="Search Supplier..."
              autoComplete="off"
            />
            {showSupplierDropdown && (
              <div className="absolute top-full left-0 mt-1 w-[350px] bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="max-h-[200px] overflow-y-auto">
                  {SUPPLIERS.filter(s => s.name.toLowerCase().includes((invoiceData.supplier || '').toLowerCase()) || s.gst.toLowerCase().includes((invoiceData.supplier || '').toLowerCase())).map((supplier, sIdx) => {
                    const isSelected = sIdx === supplierIndex;
                    return (
                      <div 
                        key={supplier.id}
                        className={`px-3 py-2 text-xs cursor-pointer border-b border-slate-50 last:border-0 transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          handleInvoiceChange('supplier', supplier.name);
                          if (supplier.state !== 'Maharashtra') {
                            handleInvoiceChange('taxType', 'IGST');
                          } else {
                            handleInvoiceChange('taxType', 'CGST_SGST');
                          }
                          document.getElementById('input-purchaser')?.focus();
                        }}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-800">{supplier.name}</span>
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 rounded border border-slate-200">{supplier.state}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="text-[10px] text-slate-500">
                            GST: <span className="font-mono text-slate-700">{supplier.gst}</span>
                          </div>
                          {supplier.gstStatus === 'Active' ? (
                            <span className="flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded text-[8px]"><CheckCircle2 className="w-2.5 h-2.5" /> ACTIVE</span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-red-600 font-bold bg-red-50 border border-red-100 px-1 py-0.5 rounded text-[8px]"><AlertCircle className="w-2.5 h-2.5" /> {supplier.gstStatus.toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {SUPPLIERS.filter(s => s.name.toLowerCase().includes((invoiceData.supplier || '').toLowerCase()) || s.gst.toLowerCase().includes((invoiceData.supplier || '').toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-xs text-slate-500 text-center italic">No matching suppliers</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label className="text-[10px] font-semibold text-slate-600 flex items-center gap-1">
              <User className="w-3 h-3" /> Purchaser
            </label>
            <input 
              id="input-purchaser"
              type="text" 
              value={invoiceData.purchaser}
              onChange={(e) => {
                handleInvoiceChange('purchaser', e.target.value);
                setPurchaserIndex(0);
              }}
              onKeyDown={handlePurchaserKeyDown}
              onFocus={(e) => {
                e.target.select();
                setShowPurchaserDropdown(true);
                setPurchaserIndex(0);
              }}
              onBlur={() => setTimeout(() => setShowPurchaserDropdown(false), 200)}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
              autoComplete="off"
            />
            {showPurchaserDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="max-h-[200px] overflow-y-auto">
                  {ACTIVE_USERS.filter(u => u.name.toLowerCase().includes((invoiceData.purchaser || '').toLowerCase())).map((user, uIdx) => {
                    const isSelected = uIdx === purchaserIndex;
                    return (
                      <div 
                        key={user.id}
                        className={`flex items-center justify-between px-3 py-2 text-xs cursor-pointer border-b border-slate-50 last:border-0 transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-slate-50'}`}
                        onClick={() => {
                          handleInvoiceChange('purchaser', user.name);
                          document.getElementById('row-0-item')?.focus();
                        }}
                      >
                        <span className="font-semibold text-slate-800">{user.name}</span>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 rounded">{user.role}</span>
                      </div>
                    );
                  })}
                  {ACTIVE_USERS.filter(u => u.name.toLowerCase().includes((invoiceData.purchaser || '').toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-xs text-slate-500 text-center italic">No active users found</div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex-1 min-h-0 flex flex-col overflow-hidden mb-2">
        <div className="overflow-y-auto flex-1 relative">
          <table className="w-full text-left border-collapse relative">
            <thead className="sticky top-0 bg-slate-50 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-slate-50">
                <th className="px-2 py-1.5 w-10 text-center">#</th>
                <th className="px-2 py-1.5 min-w-[200px]">Item Description</th>
                <th className="px-2 py-1.5 min-w-[150px]">Brand</th>
                <th className="px-2 py-1.5 w-24 text-right">Qty</th>
                <th className="px-2 py-1.5 w-32 text-right">Rate (₹)</th>
                <th className="px-2 py-1.5 w-32 text-right">Amount (₹)</th>
                <th className="px-2 py-1.5 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product, index) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-2 py-0.5 text-center text-xs font-semibold text-slate-400">
                    {index + 1}
                  </td>
                  <td className="px-1 py-0.5 relative">
                    <input 
                      id={`row-${index}-item`}
                      type="text" 
                      value={product.item}
                      onChange={(e) => {
                        updateProduct(index, 'item', e.target.value);
                        setSuggestionIndex(0);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, index, 'item')}
                      onFocus={(e) => handleItemFocus(e, index)}
                      onBlur={handleItemBlur}
                      placeholder="Item name..."
                      className="w-full px-2 py-1 bg-transparent border-0 rounded hover:bg-white focus:bg-white focus:ring-1 focus:ring-primary text-xs font-medium transition-all"
                      autoComplete="off"
                    />
                    
                    {/* Compact Item Suggestions Dropdown */}
                    {activeSuggestionRow === index && (
                      <div className="absolute top-full left-0 mt-1 w-[450px] bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="flex bg-slate-100 text-[9px] font-bold text-slate-500 uppercase px-2 py-1 border-b border-slate-200">
                          <div className="flex-1">Item Suggestion</div>
                          <div className="w-16 text-right">Stock</div>
                          <div className="w-16 text-right">7D Sales</div>
                          <div className="w-20 text-center">Status</div>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto">
                          {ITEM_SUGGESTIONS.filter(s => s.name.toLowerCase().includes((product.item || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => {
                            const isSelected = sIdx === suggestionIndex;
                            return (
                              <div 
                                key={suggestion.id}
                                className={`flex items-start px-2 py-1.5 text-xs cursor-pointer border-b border-slate-50 last:border-0 transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-slate-50'}`}
                                onClick={() => {
                                  const newProducts = [...products];
                                  newProducts[index] = { ...newProducts[index], item: suggestion.name, brand: suggestion.brand, rate: suggestion.rate };
                                  setProducts(newProducts);
                                  document.getElementById(`row-${index}-qty`)?.focus();
                                }}
                              >
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-800">
                                    {suggestion.name} <span className="text-slate-400 font-normal ml-1">({suggestion.brand})</span>
                                  </div>
                                  {suggestion.sizes && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {Object.entries(suggestion.sizes).map(([size, qty]) => (
                                        <span key={size} className={`text-[9px] px-1 rounded flex items-center gap-0.5 ${qty === 0 ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                                          <strong className="text-slate-700">{size}:</strong> {qty}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="w-16 text-right font-medium text-slate-700 mt-0.5">{suggestion.stock}</div>
                                <div className="w-16 text-right font-medium text-slate-700 mt-0.5">{suggestion.sales}</div>
                                <div className="w-20 flex justify-center mt-0.5">
                                  {suggestion.status === 'Critical' ? (
                                    <span className="flex items-center gap-1 text-[9px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded-full"><AlertCircle className="w-2.5 h-2.5" /> Order</span>
                                  ) : suggestion.status === 'Reorder' ? (
                                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full"><AlertCircle className="w-2.5 h-2.5" /> Low</span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full"><CheckCircle2 className="w-2.5 h-2.5" /> OK</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {ITEM_SUGGESTIONS.filter(s => s.name.toLowerCase().includes((product.item || '').toLowerCase())).length === 0 && (
                            <div className="px-3 py-2 text-xs text-slate-500 text-center italic">No matching items found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-1 py-0.5">
                    <input 
                      id={`row-${index}-brand`}
                      type="text" 
                      value={product.brand}
                      onChange={(e) => updateProduct(index, 'brand', e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index, 'brand')}
                      onFocus={(e) => e.target.select()}
                      placeholder="Brand"
                      className="w-full px-2 py-1 bg-transparent border-0 rounded hover:bg-white focus:bg-white focus:ring-1 focus:ring-primary text-xs transition-all"
                    />
                  </td>
                  <td className="px-1 py-0.5">
                    <input 
                      id={`row-${index}-qty`}
                      type="number" 
                      min="1"
                      value={product.qty || ''}
                      onChange={(e) => updateProduct(index, 'qty', parseInt(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, index, 'qty')}
                      onFocus={(e) => e.target.select()}
                      className="w-full px-2 py-1 bg-transparent border-0 rounded hover:bg-white focus:bg-white focus:ring-1 focus:ring-primary text-xs text-right font-semibold transition-all"
                    />
                  </td>
                  <td className="px-1 py-0.5">
                    <input 
                      id={`row-${index}-rate`}
                      type="number" 
                      min="0"
                      value={product.rate || ''}
                      onChange={(e) => updateProduct(index, 'rate', parseFloat(e.target.value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, index, 'rate')}
                      onFocus={(e) => e.target.select()}
                      className="w-full px-2 py-1 bg-transparent border-0 rounded hover:bg-white focus:bg-white focus:ring-1 focus:ring-primary text-xs text-right font-semibold transition-all"
                    />
                  </td>
                  <td className="px-2 py-1 text-right text-xs font-bold text-slate-700">
                    {((product.qty || 0) * (product.rate || 0)).toLocaleString('en-IN')}
                  </td>
                  <td className="px-1 py-0.5 text-center">
                    <button 
                      onClick={() => removeProduct(index)}
                      className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                      title="Remove Row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-1 border-t border-slate-100 shrink-0 bg-white">
          <button 
            onClick={addProduct}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-primary hover:bg-primary/10 rounded transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
      </div>

      {/* Footer Actions & Summary */}
      <div className="flex justify-between items-center shrink-0">
        
        <div className="flex items-center gap-4 xl:gap-6 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 hidden sm:flex">
            <span className="font-medium uppercase tracking-wider text-[10px]">Subtotal</span>
            <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-slate-600 hidden md:flex">
            <span className="font-medium uppercase tracking-wider text-[10px]">Discount (-)</span>
            <input 
              type="number"
              value={invoiceData.discount || ''}
              onChange={e => handleInvoiceChange('discount', parseFloat(e.target.value) || 0)}
              onFocus={e => e.target.select()}
              className="w-16 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary text-right"
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 hidden md:flex">
            <span className="font-medium uppercase tracking-wider text-[10px]">Charges (+)</span>
            <input 
              type="number"
              value={invoiceData.charges || ''}
              onChange={e => handleInvoiceChange('charges', parseFloat(e.target.value) || 0)}
              onFocus={e => e.target.select()}
              className="w-16 px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary text-right"
              placeholder="0"
            />
          </div>

          {invoiceData.taxType === 'IGST' ? (
            <div 
              className="flex items-center gap-1.5 text-slate-600 hidden sm:flex cursor-pointer group"
              onClick={() => handleInvoiceChange('taxType', 'CGST_SGST')}
              title="Click to switch to CGST/SGST"
            >
              <span className="font-medium uppercase tracking-wider text-[10px] group-hover:text-primary transition-colors border-b border-dashed border-slate-300 group-hover:border-primary">IGST (18%)</span>
              <span className="font-bold text-slate-800">₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          ) : (
            <div 
              className="flex items-center gap-4 text-slate-600 hidden sm:flex cursor-pointer group"
              onClick={() => handleInvoiceChange('taxType', 'IGST')}
              title="Click to switch to IGST"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-medium uppercase tracking-wider text-[10px] group-hover:text-primary transition-colors border-b border-dashed border-slate-300 group-hover:border-primary">CGST (9%)</span>
                <span className="font-bold text-slate-800">₹{(tax / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium uppercase tracking-wider text-[10px] group-hover:text-primary transition-colors border-b border-dashed border-slate-300 group-hover:border-primary">SGST (9%)</span>
                <span className="font-bold text-slate-800">₹{(tax / 2).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-900 sm:border-l sm:border-slate-200 sm:pl-6">
            <span className="font-bold uppercase tracking-wider text-[10px]">Grand Total</span>
            <span className="text-base font-black text-primary">₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 py-1.5 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 border-r border-slate-200 pr-4 py-0.5">
            <label 
              className="flex items-center gap-2 cursor-pointer group"
              title={`Toggle Box Packing (${getShortcutText('B')})`}
            >
              <div className="relative flex items-center justify-center">
                <input 
                  id="input-requireBoxPacking"
                  type="checkbox" 
                  checked={invoiceData.requireBoxPacking}
                  onChange={(e) => handleInvoiceChange('requireBoxPacking', e.target.checked)}
                  onKeyDown={(e) => handleHeaderKeyDown(e, 'row-0-item')}
                  className="peer sr-only"
                />
                <div className="w-4 h-4 bg-slate-100 border border-slate-300 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1"></div>
                <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">Require Box Packing</span>
            </label>
            
            {invoiceData.requireBoxPacking && (
              <button className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors">
                <Package className="w-3 h-3" />
                Configure Boxes
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded text-xs font-bold shadow-sm hover:bg-slate-100 transition-colors"
              title={`Save Draft (${getShortcutText('D')})`}
            >
              Save Draft
            </button>
            <button 
              className="px-4 py-1.5 bg-primary text-white rounded text-xs font-bold shadow-sm hover:bg-primary-hover flex items-center justify-center gap-1.5 transition-colors"
              title={`Submit Order (${getShortcutText('S')})`}
            >
              <Save className="w-3.5 h-3.5" />
              Submit Order
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
