import React, { useState } from 'react';
import { PlusCircle, Search, Save, Trash2, Printer, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

// Custom Tally-style input
const InputRow = ({ label, value, onChange, type = "text", placeholder = "", className = "", required = false }: any) => (
  <div className={`flex flex-col mb-3 ${className}`}>
    <label className="text-[11px] font-bold text-[#1e3a5f] uppercase tracking-wider mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-[#81a09d] px-2 py-1.5 text-[13px] bg-white focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f] w-full shadow-sm rounded-sm"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default function PurchaseOrder() {
  const [vendor, setVendor] = useState('');
  const [poDate, setPoDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [remark, setRemark] = useState('');
  
  const [items, setItems] = useState([
    { id: 1, item_name: '', order_quantity: 1, rate: 0, tax_percent: 0, total_amount: 0 }
  ]);

  const addItem = () => {
    setItems([...items, { 
      id: items.length + 1, item_name: '', order_quantity: 1, rate: 0, tax_percent: 0, total_amount: 0 
    }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto calculate totals
    if (field === 'order_quantity' || field === 'rate' || field === 'tax_percent') {
      const qty = Number(newItems[index].order_quantity) || 0;
      const rate = Number(newItems[index].rate) || 0;
      const tax = Number(newItems[index].tax_percent) || 0;
      const base = qty * rate;
      newItems[index].total_amount = base + (base * (tax / 100));
    }
    
    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.total_amount || 0), 0);
  const totalQty = items.reduce((sum, item) => sum + (Number(item.order_quantity) || 0), 0);

  const handleSave = async () => {
      alert("Purchase Order Logic Wired! Ready for integration.");
  };

  return (
    <div className="h-full flex flex-col bg-[#f0f4f8]">
      {/* Header Form */}
      <div className="p-4 border-b border-[#81a09d] bg-white shadow-sm flex flex-col md:flex-row gap-8">
        
        <div className="flex-1 max-w-sm">
           <h2 className="text-[#1e3a5f] font-bold text-lg mb-4 flex items-center gap-2">
             <CheckCircle className="w-5 h-5 text-green-600" />
             Raise Purchase Order
           </h2>
           <InputRow label="Vendor ID / Name" value={vendor} onChange={setVendor} placeholder="Select Vendor..." required />
           <InputRow label="Delivery Remarks" value={remark} onChange={setRemark} placeholder="Instructions..." />
        </div>

        <div className="flex-1 max-w-sm">
           <div className="h-9"></div> {/* Spacer for alignment */}
           <InputRow label="PO Date" type="date" value={poDate} onChange={setPoDate} required />
           <InputRow label="Expected Delivery Date" type="date" value={deliveryDate} onChange={setDeliveryDate} />
        </div>

      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white border border-[#81a09d] shadow-sm min-h-[400px]">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-[#e2e8f0] text-[#1e3a5f] text-left">
                <th className="px-2 py-2 border-b border-r border-[#81a09d] w-12 text-center">#</th>
                <th className="px-2 py-2 border-b border-r border-[#81a09d]">Item Name / Description</th>
                <th className="px-2 py-2 border-b border-r border-[#81a09d] w-24 text-right">Order Qty</th>
                <th className="px-2 py-2 border-b border-r border-[#81a09d] w-32 text-right">Rate</th>
                <th className="px-2 py-2 border-b border-r border-[#81a09d] w-24 text-right">Tax %</th>
                <th className="px-2 py-2 border-b w-32 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                  <td className="px-2 py-1 border-r border-slate-200 text-center text-slate-500">{idx + 1}</td>
                  <td className="px-1 py-1 border-r border-slate-200">
                    <input 
                      className="w-full px-1 py-1 outline-none bg-transparent" 
                      value={item.item_name}
                      onChange={e => updateItem(idx, 'item_name', e.target.value)}
                      placeholder="Type item name..."
                    />
                  </td>
                  <td className="px-1 py-1 border-r border-slate-200">
                    <input 
                      type="number" className="w-full px-1 py-1 outline-none bg-transparent text-right" 
                      value={item.order_quantity}
                      onChange={e => updateItem(idx, 'order_quantity', e.target.value)}
                    />
                  </td>
                  <td className="px-1 py-1 border-r border-slate-200">
                    <input 
                      type="number" className="w-full px-1 py-1 outline-none bg-transparent text-right" 
                      value={item.rate || ''}
                      onChange={e => updateItem(idx, 'rate', e.target.value)}
                    />
                  </td>
                  <td className="px-1 py-1 border-r border-slate-200">
                    <input 
                      type="number" className="w-full px-1 py-1 outline-none bg-transparent text-right" 
                      value={item.tax_percent || ''}
                      onChange={e => updateItem(idx, 'tax_percent', e.target.value)}
                    />
                  </td>
                  <td className="px-2 py-1 text-right font-bold text-[#1e3a5f]">
                    {item.total_amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button 
            onClick={addItem}
            className="m-2 flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 p-1"
          >
            <PlusCircle className="w-4 h-4" /> Add Line Item
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="h-16 bg-[#1e3a5f] text-white flex items-center justify-between px-6 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="flex gap-8">
           <div className="flex flex-col">
              <span className="text-xs text-slate-300">Total Qty</span>
              <span className="font-bold text-lg">{totalQty}</span>
           </div>
           <div className="flex flex-col">
              <span className="text-xs text-slate-300">Net Amount</span>
              <span className="font-bold text-lg text-green-400">₹ {totalAmount.toFixed(2)}</span>
           </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm font-bold transition-colors">
             <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-400 text-white rounded text-sm font-bold transition-colors">
             <Save className="w-4 h-4" /> Save PO
          </button>
        </div>
      </div>
    </div>
  );
}
