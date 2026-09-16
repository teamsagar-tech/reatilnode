import React, { useState, useEffect } from 'react';

type TransactionItem = {
  ItemName: string;
  HSN: string;
  Quantity: number;
  Rate: number;
  Amount: number;
  CGSTLedger: string;
  CGSTAmount: number;
  SGSTLedger: string;
  SGSTAmount: number;
  IGSTLedger: string;
  IGSTAmount: number;
};

function App() {
  const [firmId, setFirmId] = useState('101');
  const [firmGSTIN, setFirmGSTIN] = useState('29AABCD1234E1Z5');
  const [date, setDate] = useState('2026-08-25');
  
  const [voucherType, setVoucherType] = useState('Sales');
  const [action, setAction] = useState('Create');
  const [referenceId, setReferenceId] = useState('GRN-1001');
  const [partyLedger, setPartyLedger] = useState('Cash');
  const [partyGSTIN, setPartyGSTIN] = useState('29XYABC1234F1Z5');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [items, setItems] = useState<TransactionItem[]>([
    {
      ItemName: 'Premium T-Shirt',
      HSN: '61091000',
      Quantity: 2,
      Rate: 750.00,
      Amount: 1500.00,
      CGSTLedger: 'CGST @ 2.5%',
      CGSTAmount: 37.50,
      SGSTLedger: 'SGST @ 2.5%',
      SGSTAmount: 37.50,
      IGSTLedger: 'IGST @ 5%',
      IGSTAmount: 0
    }
  ]);
  
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  
  const totalAmount = items.reduce((sum, item) => sum + (Number(item.Amount) || 0) + (Number(item.CGSTAmount) || 0) + (Number(item.SGSTAmount) || 0) + (Number(item.IGSTAmount) || 0), 0);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/tally/api/sandbox/entry');
      const data = await res.json();
      if (data.success) {
        setEntries(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEntries();
    setDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Auto-calculate GST based on GSTINs
  useEffect(() => {
    const pState = partyGSTIN.substring(0, 2);
    const fState = firmGSTIN.substring(0, 2);
    const isInterState = (pState.length === 2 && fState.length === 2 && pState !== fState);

    setItems(currentItems => currentItems.map(item => {
      const amt = item.Amount;
      return {
        ...item,
        CGSTAmount: isInterState ? 0 : amt * 0.025,
        SGSTAmount: isInterState ? 0 : amt * 0.025,
        IGSTAmount: isInterState ? amt * 0.05 : 0
      };
    }));
  }, [partyGSTIN, firmGSTIN]);

  const handleEdit = (entry: any) => {
    setEditingId(entry.id);
    setFirmId(entry.firm_id);
    setDate(entry.date);
    setVoucherType(entry.transaction.VoucherType);
    setAction(entry.transaction.Action);
    setReferenceId(entry.transaction.ReferenceID);
    setPartyLedger(entry.transaction.PartyLedger);
    setPartyGSTIN(entry.transaction.PartyGSTIN || '');
    setItems(entry.transaction.Items || []);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setReferenceId(`REF-${Math.floor(Math.random()*10000)}`);
    setItems([{ ItemName: '', HSN: '', Quantity: 1, Rate: 0, Amount: 0, CGSTLedger: 'CGST @ 2.5%', CGSTAmount: 0, SGSTLedger: 'SGST @ 2.5%', SGSTAmount: 0, IGSTLedger: 'IGST @ 5%', IGSTAmount: 0 }]);
  };

  const handleAddItem = () => {
    setItems([...items, { ItemName: '', HSN: '', Quantity: 1, Rate: 0, Amount: 0, CGSTLedger: 'CGST @ 2.5%', CGSTAmount: 0, SGSTLedger: 'SGST @ 2.5%', SGSTAmount: 0, IGSTLedger: 'IGST @ 5%', IGSTAmount: 0 }]);
  };

  const handleItemChange = (index: number, field: keyof TransactionItem, value: any) => {
    const newItems = [...items];
    const item: any = { ...newItems[index], [field]: value };
    
    if (field === 'Quantity' || field === 'Rate') {
      const amt = (Number(item.Quantity) || 0) * (Number(item.Rate) || 0);
      item.Amount = amt;
      
      const pState = partyGSTIN.substring(0, 2);
      const fState = firmGSTIN.substring(0, 2);
      const isInterState = (pState.length === 2 && fState.length === 2 && pState !== fState);
      
      item.CGSTAmount = isInterState ? 0 : amt * 0.025;
      item.SGSTAmount = isInterState ? 0 : amt * 0.025;
      item.IGSTAmount = isInterState ? amt * 0.05 : 0;
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        firm_id: firmId,
        date: date,
        transaction: {
          VoucherType: voucherType,
          Action: action,
          ReferenceID: referenceId,
          FirmGSTIN: firmGSTIN,
          PartyLedger: partyLedger,
          PartyGSTIN: partyGSTIN,
          TotalAmount: totalAmount,
          Items: items
        }
      };

      const url = editingId ? `/tally/api/sandbox/entry/${editingId}` : '/tally/api/sandbox/entry';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert(`Entry ${editingId ? 'updated' : 'saved'} successfully!`);
        fetchEntries();
        handleCancelEdit();
      } else {
        alert('Failed to save entry');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-teal-900">RetailNode Tally Sandbox</h1>
            <p className="text-sm text-slate-500 mt-1">Generate mock Day-End payloads for Tally integration testing.</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">API Endpoint Ready</p>
            <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded mt-2 block">
              /v1/tally/export/day-end
            </code>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-teal-900 px-6 py-4 border-b border-teal-800 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Mock Transaction' : 'Create Mock Transaction'}</h2>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="text-xs text-teal-200 hover:text-white font-bold">
                    Cancel Edit
                  </button>
                )}
              </div>
              
              <div className="p-6 space-y-6">
                {/* Meta Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Firm ID</label>
                    <input type="text" value={firmId} onChange={e => setFirmId(e.target.value)} required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Firm GSTIN (For State Calc)</label>
                    <input type="text" value={firmGSTIN} onChange={e => setFirmGSTIN(e.target.value)} required placeholder="e.g. 29ABCDE1234F1Z5" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Voucher</label>
                    <select value={voucherType} onChange={e => setVoucherType(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                      <option value="Sales">Sales</option>
                      <option value="Purchase">Purchase</option>
                      <option value="Receipt">Receipt</option>
                      <option value="Payment">Payment</option>
                      <option value="Journal">Journal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Action</label>
                    <select value={action} onChange={e => setAction(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                      <option value="Create">Create (New)</option>
                      <option value="Alter">Alter (Update)</option>
                    </select>
                  </div>
                </div>

                {/* Primary Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reference ID</label>
                    <input type="text" value={referenceId} onChange={e => setReferenceId(e.target.value)} required placeholder="e.g. PUR-1001" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Party Ledger</label>
                    <input type="text" value={partyLedger} onChange={e => setPartyLedger(e.target.value)} required placeholder="e.g. Cash or Supplier Name" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Party GSTIN</label>
                    <input type="text" value={partyGSTIN} onChange={e => setPartyGSTIN(e.target.value)} placeholder="e.g. 29ABCDE1234F1Z5" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase" />
                  </div>
                </div>

                {/* Items */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800">Transaction Items</h3>
                    <button type="button" onClick={handleAddItem} className="text-xs font-bold text-teal-600 hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg transition-colors">
                      + Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {items.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                        {items.length > 1 && (
                          <button type="button" onClick={() => handleRemoveItem(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            &times;
                          </button>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Item Name</label>
                            <input type="text" value={item.ItemName} onChange={e => handleItemChange(idx, 'ItemName', e.target.value)} required className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">HSN</label>
                            <input type="text" value={item.HSN} onChange={e => handleItemChange(idx, 'HSN', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Qty</label>
                            <input type="number" value={item.Quantity} onChange={e => handleItemChange(idx, 'Quantity', Number(e.target.value))} required min="1" className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Rate</label>
                            <input type="number" value={item.Rate} onChange={e => handleItemChange(idx, 'Rate', Number(e.target.value))} required min="0" step="0.01" className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Amount</label>
                            <input type="number" value={item.Amount} readOnly className="w-full px-2 py-1.5 bg-slate-200 border border-slate-300 rounded text-sm text-slate-600 font-bold" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-3 pt-3 border-t border-slate-200/60">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CGST Ledger</label>
                            <input type="text" value={item.CGSTLedger} onChange={e => handleItemChange(idx, 'CGSTLedger', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-[11px] focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CGST Amt</label>
                            <input type="number" value={item.CGSTAmount} onChange={e => handleItemChange(idx, 'CGSTAmount', Number(e.target.value))} step="0.01" className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SGST Ledger</label>
                            <input type="text" value={item.SGSTLedger} onChange={e => handleItemChange(idx, 'SGSTLedger', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-[11px] focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">SGST Amt</label>
                            <input type="number" value={item.SGSTAmount} onChange={e => handleItemChange(idx, 'SGSTAmount', Number(e.target.value))} step="0.01" className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">IGST Ledger</label>
                            <input type="text" value={item.IGSTLedger} onChange={e => handleItemChange(idx, 'IGSTLedger', e.target.value)} className="w-full px-2 py-1.5 border border-slate-300 rounded text-[11px] focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">IGST Amt</label>
                            <input type="number" value={item.IGSTAmount} onChange={e => handleItemChange(idx, 'IGSTAmount', Number(e.target.value))} step="0.01" className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-teal-500 outline-none" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-slate-50 p-6 border-t border-slate-200 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-500 uppercase">Grand Total</span>
                  <span className="text-2xl font-black text-teal-900">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex gap-4">
                  {editingId && (
                    <button type="button" onClick={handleCancelEdit} disabled={saving} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70">
                      Cancel
                    </button>
                  )}
                  <button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-teal-500/20 transition-all disabled:opacity-70">
                    {saving ? 'Saving to DB...' : (editingId ? 'Update Entry' : 'Save Mock Entry')}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
                Tally Team Instructions
              </h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Provide this exact URL to the Tally developers for testing. It will output all transactions saved for the given firm and date in the exact requested JSON format.
              </p>
              
              <div className="bg-slate-900 rounded-lg p-3 overflow-hidden relative">
                <code className="text-[10px] text-green-400 font-mono break-all leading-tight">
                  GET https://vrp.retailnode.in/tally/api/v1/tally/export/day-end?firm_id={firmId}&date={date}&api_key=TEST1234
                </code>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Saved Entries Today ({entries.filter(e => e.date === date && e.firm_id === firmId).length})</h3>
              
              {entries.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No entries saved yet.</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {entries
                    .filter(e => e.date === date && e.firm_id === firmId)
                    .map(entry => (
                    <div key={entry.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${entry.transaction.Action === 'Create' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {entry.transaction.Action}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-600">{entry.transaction.ReferenceID}</span>
                          <button type="button" onClick={() => handleEdit(entry)} className="text-[10px] text-teal-600 hover:text-teal-800 font-bold bg-teal-50 px-2 py-1 rounded">
                            Edit
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-800">{entry.transaction.VoucherType}</p>
                      <p className="text-xs text-slate-500 mt-1">{entry.transaction.PartyLedger}</p>
                      <div className="mt-2 pt-2 border-t border-slate-200 text-right">
                        <span className="text-sm font-bold text-teal-700">₹{entry.transaction.TotalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
