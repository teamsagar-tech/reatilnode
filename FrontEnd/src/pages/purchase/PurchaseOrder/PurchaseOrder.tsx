import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PremiumVoucherTemplate from '../../../components/layout/PremiumVoucherTemplate';
import SearchableDropdown, { renderSupplierOption } from '../../../components/SearchableDropdown';
import { ShoppingCart, Plus, Trash2, MapPin, Tag } from 'lucide-react';

const SUPPLIERS = [
  { id: 1, name: 'Apex Suppliers Ltd.', gst: '27AADCA1234F1Z9', state: 'Maharashtra', gstStatus: 'Active' },
  { id: 2, name: 'Global Textiles', gst: '24AAFCG5678G1Z2', state: 'Gujarat', gstStatus: 'Active' },
  { id: 3, name: 'Metro Apparel Hub', gst: '07BBDCM9012H1Z5', state: 'Delhi', gstStatus: 'Suspended' },
  { id: 4, name: 'Southern Silks', gst: '29CCDSN3456J1Z8', state: 'Karnataka', gstStatus: 'Active' }
];

const LocationAllocationModal = ({ item, onSave, onClose }: any) => {
  const [allocs, setAllocs] = useState<any[]>(item?.allocations || []);
  const [newLoc, setNewLoc] = useState('');
  const [newQty, setNewQty] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleAdd = () => {
    if (newLoc && newQty) {
      setAllocs([...allocs, { location: newLoc, qty: newQty }]);
      setNewLoc('');
      setNewQty('');
      setTimeout(() => document.getElementById('alloc-loc')?.focus(), 10);
    }
  };

  const handleSave = () => {
    let finalAllocs = [...allocs];
    if (newLoc && newQty) {
      finalAllocs.push({ location: newLoc, qty: newQty });
    }
    const total = finalAllocs.reduce((sum, a) => sum + (parseFloat(a.qty) || 0), 0);
    onSave(finalAllocs, total.toString());
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl w-[450px] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 text-white px-5 py-4 font-black flex justify-between items-center tracking-tight">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-200" />
            <span>Location Allocation</span>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">✕</button>
        </div>
        <div className="p-5 flex flex-col gap-4">
           <div className="text-sm font-bold text-slate-700">Item: <span className="text-indigo-600">{item?.name || 'Unknown Item'}</span></div>
           
           <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
             <thead className="bg-slate-50">
               <tr>
                 <th className="px-3 py-2 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider">Location</th>
                 <th className="px-3 py-2 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider text-center w-[80px]">Qty</th>
                 <th className="px-3 py-2 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider w-[50px]"></th>
               </tr>
             </thead>
             <tbody>
               {allocs.map((a, i) => (
                 <tr key={i} className="text-sm border-b border-slate-100 hover:bg-slate-50">
                   <td className="px-3 py-2 font-bold text-slate-700">{a.location}</td>
                   <td className="px-3 py-2 font-bold text-slate-700 text-center">{a.qty}</td>
                   <td className="px-3 py-2 text-center">
                     <button onClick={() => setAllocs(allocs.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </td>
                 </tr>
               ))}
               <tr className="bg-indigo-50/30">
                 <td className="px-2 py-2">
                    <SearchableDropdown
                      id="alloc-loc"
                      autoFocus
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                      value={newLoc}
                      onChange={setNewLoc}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          document.getElementById('alloc-qty')?.focus();
                        }
                      }}
                      options={['Main Godown', 'Store Front', 'Warehouse 2']}
                      placeholder="Select location"
                      width="100%"
                    />
                 </td>
                 <td className="px-2 py-2">
                    <input id="alloc-qty" type="number" className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-sm font-bold text-center focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" value={newQty} onChange={e => setNewQty(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} placeholder="0" />
                 </td>
                 <td className="px-2 py-2 text-center">
                    <button onClick={handleAdd} className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                 </td>
               </tr>
             </tbody>
           </table>
           
           <div className="flex justify-end gap-3 mt-2">
             <button onClick={onClose} className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">Cancel</button>
             <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm">Save Allocations</button>
           </div>
        </div>
      </div>
    </div>
  )
}

export default function PurchaseOrder() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firm: '',
    location: '',
    party: '',
    orderNo: 'PO-26-001',
    date: new Date().toISOString().split('T')[0],
    orderBy: '',
  });
  
  const [items, setItems] = useState<any[]>([
    { id: 1, designNo: '', articleNo: '', name: '', size: '', color: '', qty: '', rate: '', amount: '0.00', allocations: [] }
  ]);

  const [allocModal, setAllocModal] = useState<{ open: boolean, rowIndex: number }>({ open: false, rowIndex: 0 });
  const [showItemDetails, setShowItemDetails] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        alert('Purchase Order Saved Successfully!');
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleFieldKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    }
  };

  const calculateAmount = (qty: string, rate: string) => {
    const q = parseFloat(qty) || 0;
    const r = parseFloat(rate) || 0;
    return (q * r).toFixed(2);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'qty' || field === 'rate') {
      newItems[index].amount = calculateAmount(newItems[index].qty, newItems[index].rate);
    }
    
    setItems(newItems);
  };

  const saveAllocations = (index: number, allocs: any[], totalQty: string) => {
    const newItems = [...items];
    newItems[index] = { 
      ...newItems[index], 
      allocations: allocs,
      qty: totalQty,
      amount: calculateAmount(totalQty, newItems[index].rate)
    };
    setItems(newItems);
    setAllocModal({ open: false, rowIndex: 0 });
    setTimeout(() => { document.getElementById(`item-${index}-rate`)?.focus(); }, 10);
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number, field: string) => {
    if (field === 'qty' && (e.key === 'F3' || (e.ctrlKey && e.key.toLowerCase() === 'l'))) {
      e.preventDefault();
      setAllocModal({ open: true, rowIndex: index });
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'designNo') document.getElementById(`item-${index}-articleNo`)?.focus();
      else if (field === 'articleNo') document.getElementById(`item-${index}-name`)?.focus();
      else if (field === 'name') {
        if (showItemDetails) document.getElementById(`item-${index}-size`)?.focus();
        else document.getElementById(`item-${index}-qty`)?.focus();
      }
      else if (field === 'size') document.getElementById(`item-${index}-color`)?.focus();
      else if (field === 'color') document.getElementById(`item-${index}-qty`)?.focus();
      else if (field === 'qty') document.getElementById(`item-${index}-rate`)?.focus();
      else if (field === 'rate') {
        if (index === items.length - 1 && (items[index].name || items[index].designNo)) {
          setItems([...items, { id: Date.now(), designNo: '', articleNo: '', name: '', size: '', color: '', qty: '', rate: '', amount: '0.00', allocations: [] }]);
          setTimeout(() => {
            if (showItemDetails) document.getElementById(`item-${index + 1}-designNo`)?.focus();
            else document.getElementById(`item-${index + 1}-name`)?.focus();
          }, 0);
        } else if (index < items.length - 1) {
          if (showItemDetails) document.getElementById(`item-${index + 1}-designNo`)?.focus();
          else document.getElementById(`item-${index + 1}-name`)?.focus();
        }
      }
    }
  };

  const removeRow = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const totalQty = items.reduce((sum, item) => sum + (parseFloat(item.qty) || 0), 0);

  return (
    <>
      <PremiumVoucherTemplate
        title="Purchase Order"
        subtitle="Create & Manage Purchase Orders"
        icon={<ShoppingCart className="w-6 h-6" />}
        onSave={() => alert('Saved Purchase Order!')}
        maxWidth="max-w-[1500px]"
      >
        <div className="flex flex-col gap-4 h-full">
           
           {/* Top Filter Card */}
           <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-5 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4">
                 
                 {/* Firm */}
                 <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Firm</label>
                    <SearchableDropdown
                      id="field-firm"
                      autoFocus
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      value={formData.firm}
                      onChange={(val) => setFormData({...formData, firm: val})}
                      onKeyDown={(e) => handleFieldKeyDown(e as any, 'field-location')}
                      options={['RetailNode Default Firm', 'Branch Office 1']}
                      placeholder="Select Firm"
                      width="100%"
                    />
                 </div>

                 {/* Location */}
                 <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Location</label>
                    <SearchableDropdown
                      id="field-location"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      value={formData.location}
                      onChange={(val) => setFormData({...formData, location: val})}
                      onKeyDown={(e) => handleFieldKeyDown(e as any, 'field-party')}
                      options={['Main Godown', 'Store Front']}
                      placeholder="Select Location"
                      width="100%"
                    />
                 </div>

                 {/* Party A/c */}
                 <div className="col-span-12 md:col-span-6 relative">
                    <label className="block text-xs font-bold text-indigo-700 mb-1.5 uppercase tracking-wider">Party A/c (Supplier)</label>
                    <SearchableDropdown
                      id="field-party"
                      className="w-full px-3 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none placeholder:text-indigo-300"
                      value={formData.party}
                      onChange={(val) => setFormData({...formData, party: val})}
                      onKeyDown={(e) => handleFieldKeyDown(e as any, 'field-orderBy')}
                      options={SUPPLIERS}
                      displayKey="name"
                      renderOption={renderSupplierOption}
                      placeholder="Search Supplier Name / GSTIN..."
                      width="100%"
                    />
                 </div>

                 {/* Order By */}
                 <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Order By</label>
                    <SearchableDropdown
                      id="field-orderBy"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      value={formData.orderBy}
                      onChange={(val) => setFormData({...formData, orderBy: val})}
                      onKeyDown={(e) => handleFieldKeyDown(e as any, 'field-orderNo')}
                      options={['Arjun Kapoor', 'Rahul Sharma', 'Priya Singh', 'Vikram Mehta']}
                      placeholder="Select User"
                      width="100%"
                    />
                 </div>

                 {/* Order No */}
                 <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Order No.</label>
                    <input 
                      type="text"
                      id="field-orderNo"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      value={formData.orderNo}
                      onChange={(e) => setFormData({...formData, orderNo: e.target.value})}
                      onKeyDown={(e) => handleFieldKeyDown(e, 'field-date')}
                    />
                 </div>

                 {/* Date */}
                 <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Date</label>
                    <input 
                      type="date"
                      id="field-date"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      onKeyDown={(e) => handleFieldKeyDown(e, showItemDetails ? 'item-0-designNo' : 'item-0-name')}
                    />
                 </div>

                 {/* Details Toggle */}
                 <div className="col-span-12 md:col-span-3 flex items-center justify-end">
                    <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        checked={showItemDetails}
                        onChange={(e) => setShowItemDetails(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Item Details (Size, Color)</span>
                    </label>
                 </div>

              </div>
           </div>

           {/* Data Grid Card */}
           <div className="flex-1 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm flex flex-col min-h-0 relative">
              <div className="overflow-auto flex-1">
                 <table className='w-full text-left border-collapse whitespace-nowrap min-w-[800px]'>
                    <thead className='bg-slate-50/90 backdrop-blur-md sticky top-0 z-10'>
                       <tr className='border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider'>
                          <th className='px-4 py-3.5 text-center w-12'>#</th>
                          {showItemDetails && <th className='px-4 py-3.5 w-32'>Design No.</th>}
                          {showItemDetails && <th className='px-4 py-3.5 w-32'>Article No.</th>}
                          <th className='px-4 py-3.5 w-[30%]'>Name of Item</th>
                          {showItemDetails && <th className='px-4 py-3.5 text-center w-24'>Size</th>}
                          {showItemDetails && <th className='px-4 py-3.5 w-24'>Color</th>}
                          <th className='px-4 py-3.5 text-center w-32'>Quantity</th>
                          <th className='px-4 py-3.5 text-right w-32'>Rate</th>
                          <th className='px-4 py-3.5 text-right w-32'>Amount (₹)</th>
                          <th className='px-2 py-3.5 w-10'></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {items.map((row, idx) => (
                         <tr key={row.id} className="text-[13px] hover:bg-slate-50/50 transition-colors group">
                            <td className="px-4 py-2.5 text-center font-bold text-slate-400">{idx + 1}</td>
                            
                            {showItemDetails && (
                              <td className="px-2 py-1">
                                 <input 
                                   id={`item-${idx}-designNo`}
                                   type="text" 
                                   className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-bold text-slate-700 uppercase"
                                   value={row.designNo}
                                   onChange={(e) => updateItem(idx, 'designNo', e.target.value)}
                                   onKeyDown={(e) => handleItemKeyDown(e, idx, 'designNo')}
                                 />
                              </td>
                            )}

                            {showItemDetails && (
                              <td className="px-2 py-1">
                                 <input 
                                   id={`item-${idx}-articleNo`}
                                   type="text" 
                                   className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-bold text-slate-700 uppercase"
                                   value={row.articleNo}
                                   onChange={(e) => updateItem(idx, 'articleNo', e.target.value)}
                                   onKeyDown={(e) => handleItemKeyDown(e, idx, 'articleNo')}
                                 />
                              </td>
                            )}

                            <td className="px-2 py-1">
                               <input 
                                 id={`item-${idx}-name`}
                                 type="text" 
                                 className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-bold text-slate-800"
                                 value={row.name}
                                 onChange={(e) => updateItem(idx, 'name', e.target.value)}
                                 onKeyDown={(e) => handleItemKeyDown(e, idx, 'name')}
                               />
                            </td>

                            {showItemDetails && (
                              <td className="px-2 py-1">
                                 <input 
                                   id={`item-${idx}-size`}
                                   type="text" 
                                   className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-bold text-slate-700 text-center uppercase"
                                   value={row.size}
                                   onChange={(e) => updateItem(idx, 'size', e.target.value)}
                                   onKeyDown={(e) => handleItemKeyDown(e, idx, 'size')}
                                 />
                              </td>
                            )}

                            {showItemDetails && (
                              <td className="px-2 py-1">
                                 <input 
                                   id={`item-${idx}-color`}
                                   type="text" 
                                   className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-bold text-slate-700 capitalize"
                                   value={row.color}
                                   onChange={(e) => updateItem(idx, 'color', e.target.value)}
                                   onKeyDown={(e) => handleItemKeyDown(e, idx, 'color')}
                                 />
                              </td>
                            )}

                            <td className="px-2 py-1">
                               <div className="relative group/qty">
                                 <input 
                                   id={`item-${idx}-qty`}
                                   type="text" 
                                   className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-black text-indigo-600 text-center"
                                   value={row.qty}
                                   onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                                   onKeyDown={(e) => handleItemKeyDown(e, idx, 'qty')}
                                 />
                                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-2 rounded opacity-0 group-hover/qty:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                   Press F3 to Allocate
                                 </div>
                               </div>
                            </td>

                            <td className="px-2 py-1">
                               <input 
                                 id={`item-${idx}-rate`}
                                 type="text" 
                                 className="w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-bold text-slate-700 text-right"
                                 value={row.rate}
                                 onChange={(e) => updateItem(idx, 'rate', e.target.value)}
                                 onKeyDown={(e) => handleItemKeyDown(e, idx, 'rate')}
                               />
                            </td>

                            <td className="px-4 py-2.5 text-right font-black text-slate-900 text-base">
                              ₹{parseFloat(row.amount || '0').toFixed(2)}
                            </td>

                            <td className="px-2 py-1 text-center">
                              <button 
                                onClick={() => removeRow(idx)}
                                className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                tabIndex={-1}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
              
              {/* Grand Total Area */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 shrink-0 flex justify-between items-center rounded-b-2xl">
                 <div className="flex items-center gap-6">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Items</span>
                      <span className="text-lg font-black text-slate-800">{items.length}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total Qty</span>
                      <span className="text-lg font-black text-indigo-600">{totalQty}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Net Payable Amount</span>
                      <span className="text-3xl font-black tracking-tight text-emerald-600">₹{totalAmount.toFixed(2)}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {allocModal.open && (
          <LocationAllocationModal
            item={items[allocModal.rowIndex]}
            onSave={(allocs: any[], tq: string) => saveAllocations(allocModal.rowIndex, allocs, tq)}
            onClose={() => setAllocModal({ open: false, rowIndex: 0 })}
          />
        )}
      </PremiumVoucherTemplate>
    </>
  );
}
