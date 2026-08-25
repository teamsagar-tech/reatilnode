import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown, { renderSupplierOption } from '../../../components/SearchableDropdown';

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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]">
      <div className="bg-[#fcfaf2] border border-[#1b5e58] w-[400px] shadow-2xl flex flex-col">
        <div className="bg-[#1b5e58] text-white px-2 py-1 font-bold flex justify-between items-center text-[12px]">
          <span>Location Allocation - {item?.name || 'Unknown Item'}</span>
          <button onClick={onClose} className="hover:text-red-300">✕</button>
        </div>
        <div className="p-2">
           <table className="w-full text-left border-collapse mb-2">
             <thead className="bg-[#eef5ed]">
               <tr className="border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]">
                 <th className="px-2 py-1 border-r border-slate-300">Location</th>
                 <th className="px-2 py-1 border-r border-slate-300 w-24 text-right">Qty</th>
                 <th className="px-2 py-1 w-10 text-center"></th>
               </tr>
             </thead>
             <tbody>
               {allocs.map((a, i) => (
                 <tr key={i} className="border-b border-slate-300 text-[12px]">
                   <td className="px-2 py-1 border-r border-slate-300">{a.location}</td>
                   <td className="px-2 py-1 border-r border-slate-300 font-bold text-right">{a.qty}</td>
                   <td className="px-2 py-1 text-center">
                     <button onClick={() => setAllocs(allocs.filter((_, idx) => idx !== i))} className="text-red-600 hover:text-red-800 font-bold text-[10px]">✕</button>
                   </td>
                 </tr>
               ))}
               <tr className="border-b border-slate-300 text-[12px]">
                 <td className="p-0 border-r border-slate-300">
                    <SearchableDropdown
                      id="alloc-loc"
                      autoFocus
                      className="w-[150px] bg-transparent px-2 py-1 font-bold focus:bg-[#ffffe0] focus:outline-none"
                      value={newLoc}
                      onChange={setNewLoc}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          document.getElementById('alloc-qty')?.focus();
                        }
                      }}
                      options={['Main Godown', 'Store Front']}
                      placeholder="Select location"
                      width="200px"
                    />
                 </td>
                 <td className="p-0 border-r border-slate-300">
                    <input id="alloc-qty" type="text" className="w-full bg-transparent px-2 py-1 font-bold text-right focus:bg-[#ffffe0] focus:outline-none" value={newQty} onChange={e => setNewQty(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleAdd(); }} />
                 </td>
                 <td className="p-0 text-center">
                    <button onClick={handleAdd} className="text-[#1b5e58] font-bold hover:bg-[#e0efeb] w-full h-full p-1">+</button>
                 </td>
               </tr>
             </tbody>
           </table>
           <div className="flex justify-end gap-2 mt-4">
             <button onClick={onClose} className="border border-[#1b5e58] text-[#1b5e58] px-4 py-1 font-bold text-[11px] hover:bg-slate-100 shadow-[2px_2px_0_rgba(0,0,0,0.1)]">Cancel</button>
             <button onClick={handleSave} className="bg-[#1b5e58] text-white px-4 py-1 font-bold text-[11px] hover:bg-[#12423d] shadow-[2px_2px_0_rgba(0,0,0,1)]">Save</button>
           </div>
        </div>
      </div>
    </div>
  )
}

export default function PurchaseOrder() {
  const navigate = useNavigate();
  
  const [colWidths, setColWidths] = useState({
    sr: 40,
    designNo: 90,
    articleNo: 90,
    item: 200,
    size: 70,
    color: 80,
    qty: 90,
    rate: 100,
    amount: 120
  });

  const handleResize = (col: keyof typeof colWidths, newWidth: number) => {
    setColWidths(prev => ({ ...prev, [col]: newWidth }));
  };

  const ResizableHeader = ({ colId, title, className, minWidth = 50 }: { colId: keyof typeof colWidths, title: string, className?: string, minWidth?: number }) => {
    const handleMouseDown = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = colWidths[colId];

      const onMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(minWidth, startWidth + (moveEvent.clientX - startX));
        handleResize(colId, newWidth);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = 'default';
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'col-resize';
    };

    return (
      <th 
        className={`relative px-2 py-1 border-r border-slate-300 select-none ${className}`} 
        style={{ width: colWidths[colId], minWidth: colWidths[colId], maxWidth: colWidths[colId] }}
      >
        {title}
        <div 
          className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-[#1b5e58] z-10 opacity-50"
          onMouseDown={handleMouseDown}
        />
      </th>
    );
  };
  
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
        // Submit logic
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
    // Refocus rate field
    setTimeout(() => {
      document.getElementById(`item-${index}-rate`)?.focus();
    }, 10);
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
        // If last item and has data, add new row
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

  const totalAmount = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  return (
    <>
      <Helmet>
        <title>Purchase Order | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Purchase Order</div>
               <div className='text-yellow-300'>Voucher Creation</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               
               {/* Form Header */}
               <div className='flex flex-row flex-wrap items-center gap-3 mb-4 bg-white border border-slate-400 p-2 shadow-sm'>
                  
                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Firm</div>
                    <SearchableDropdown
                      id="field-firm"
                      autoFocus
                      className="w-[100px] bg-[#e0efeb] border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.firm}
                      onChange={(val) => setFormData({...formData, firm: val})}
                      onKeyDown={(e) => handleFieldKeyDown(e as any, 'field-location')}
                      options={['RetailNode Default Firm', 'Branch Office 1']}
                      placeholder="Firm"
                      width="200px"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Location</div>
                    <SearchableDropdown
                      id="field-location"
                      className="w-[100px] bg-[#e0efeb] border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.location}
                      onChange={(val) => setFormData({...formData, location: val})}
                      onKeyDown={(e) => handleFieldKeyDown(e as any, 'field-party')}
                      options={['Main Godown', 'Store Front']}
                      placeholder="Location"
                      width="200px"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Party A/c</div>
                    <SearchableDropdown
                      id="field-party"
                      className="w-[180px] bg-[#e0efeb] border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.party}
                      onChange={(val) => setFormData({...formData, party: val})}
                      onKeyDown={(e) => handleFieldKeyDown(e as any, 'field-orderBy')}
                      options={SUPPLIERS}
                      displayKey="name"
                      renderOption={renderSupplierOption}
                      placeholder="Type party"
                      width="350px"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Order By</div>
                    <SearchableDropdown
                      id="field-orderBy"
                      className="w-[120px] bg-[#e0efeb] border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.orderBy}
                      onChange={(val) => setFormData({...formData, orderBy: val})}
                      onKeyDown={(e) => handleFieldKeyDown(e as any, 'field-orderNo')}
                      options={['Arjun Kapoor', 'Rahul Sharma', 'Priya Singh', 'Vikram Mehta']}
                      placeholder="User"
                      width="200px"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Order No.</div>
                    <input 
                      type="text"
                      id="field-orderNo"
                      className="w-[90px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.orderNo}
                      onChange={(e) => setFormData({...formData, orderNo: e.target.value})}
                      onKeyDown={(e) => handleFieldKeyDown(e, 'field-date')}
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="text-slate-800 font-bold text-[11px] text-right pr-1">Date</div>
                    <input 
                      type="date"
                      id="field-date"
                      className="w-[110px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      onKeyDown={(e) => handleFieldKeyDown(e, showItemDetails ? 'item-0-designNo' : 'item-0-name')}
                    />
                  </div>

                  <div className="flex items-center gap-1 pl-4 border-l border-slate-300 ml-2">
                    <input 
                      type="checkbox" 
                      id="toggle-details" 
                      checked={showItemDetails}
                      onChange={(e) => setShowItemDetails(e.target.checked)}
                      className="cursor-pointer"
                    />
                    <label htmlFor="toggle-details" className="text-[11px] font-bold text-slate-800 cursor-pointer">
                      Item Details (Size, Color, etc.)
                    </label>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto border border-slate-400 bg-white">
                  <table className='w-full text-left border-collapse' style={{ tableLayout: 'fixed' }}>
                    <thead className='bg-[#eef5ed] sticky top-0 shadow-sm z-20'>
                      <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                        <ResizableHeader colId="sr" title="Sr" className="text-center" />
                        {showItemDetails && <ResizableHeader colId="designNo" title="Design No." />}
                        {showItemDetails && <ResizableHeader colId="articleNo" title="Article No." />}
                        <ResizableHeader colId="item" title="Name of Item" />
                        {showItemDetails && <ResizableHeader colId="size" title="Size" className="text-center" />}
                        {showItemDetails && <ResizableHeader colId="color" title="Color" />}
                        <ResizableHeader colId="qty" title="Quantity" className="text-center" />
                        <ResizableHeader colId="rate" title="Rate" className="text-right" />
                        <ResizableHeader colId="amount" title="Amount (₹)" className="text-right" />
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row, idx) => (
                        <tr key={row.id} className={'text-[12px] border-b border-slate-300 ' + (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')}>
                          <td className="px-2 py-1 border-r border-slate-300 text-center font-medium text-slate-500">{idx + 1}</td>
                          {showItemDetails && (
                            <td className="p-0 border-r border-slate-300">
                               <input 
                                 id={`item-${idx}-designNo`}
                                 type="text" 
                                 className="w-full bg-transparent px-2 py-1 font-bold text-black focus:bg-[#ffffe0] focus:outline-none uppercase"
                                 value={row.designNo}
                                 onChange={(e) => updateItem(idx, 'designNo', e.target.value)}
                                 onKeyDown={(e) => handleItemKeyDown(e, idx, 'designNo')}
                               />
                            </td>
                          )}
                          {showItemDetails && (
                            <td className="p-0 border-r border-slate-300">
                               <input 
                                 id={`item-${idx}-articleNo`}
                                 type="text" 
                                 className="w-full bg-transparent px-2 py-1 font-bold text-black focus:bg-[#ffffe0] focus:outline-none uppercase"
                                 value={row.articleNo}
                                 onChange={(e) => updateItem(idx, 'articleNo', e.target.value)}
                                 onKeyDown={(e) => handleItemKeyDown(e, idx, 'articleNo')}
                               />
                            </td>
                          )}
                          <td className="p-0 border-r border-slate-300">
                             <input 
                               id={`item-${idx}-name`}
                               type="text" 
                               className="w-full bg-transparent px-2 py-1 font-bold text-black focus:bg-[#ffffe0] focus:outline-none"
                               value={row.name}
                               onChange={(e) => updateItem(idx, 'name', e.target.value)}
                               onKeyDown={(e) => handleItemKeyDown(e, idx, 'name')}
                             />
                          </td>
                          {showItemDetails && (
                            <td className="p-0 border-r border-slate-300">
                               <input 
                                 id={`item-${idx}-size`}
                                 type="text" 
                                 className="w-full bg-transparent px-2 py-1 font-bold text-black focus:bg-[#ffffe0] focus:outline-none text-center uppercase"
                                 value={row.size}
                                 onChange={(e) => updateItem(idx, 'size', e.target.value)}
                                 onKeyDown={(e) => handleItemKeyDown(e, idx, 'size')}
                               />
                            </td>
                          )}
                          {showItemDetails && (
                            <td className="p-0 border-r border-slate-300">
                               <input 
                                 id={`item-${idx}-color`}
                                 type="text" 
                                 className="w-full bg-transparent px-2 py-1 font-bold text-black focus:bg-[#ffffe0] focus:outline-none capitalize"
                                 value={row.color}
                                 onChange={(e) => updateItem(idx, 'color', e.target.value)}
                                 onKeyDown={(e) => handleItemKeyDown(e, idx, 'color')}
                               />
                            </td>
                          )}
                          <td className="p-0 border-r border-slate-300 group relative">
                             <input 
                               id={`item-${idx}-qty`}
                               type="text" 
                               className="w-full bg-transparent px-2 py-1 font-bold text-black focus:bg-[#ffffe0] focus:outline-none text-center"
                               value={row.qty}
                               onChange={(e) => updateItem(idx, 'qty', e.target.value)}
                               onKeyDown={(e) => handleItemKeyDown(e, idx, 'qty')}
                             />
                          </td>
                          <td className="p-0 border-r border-slate-300">
                             <input 
                               id={`item-${idx}-rate`}
                               type="text" 
                               className="w-full bg-transparent px-2 py-1 font-bold text-black focus:bg-[#ffffe0] focus:outline-none text-right"
                               value={row.rate}
                               onChange={(e) => updateItem(idx, 'rate', e.target.value)}
                               onKeyDown={(e) => handleItemKeyDown(e, idx, 'rate')}
                             />
                          </td>
                          <td className="px-2 py-1 text-right font-bold">{row.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
               
               <div className="flex justify-between items-center mt-4 p-2 bg-[#eef5ed] border border-[#a3c3be]">
                  <div className="font-bold text-slate-800">
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="font-bold text-[14px]">Total Amount: ₹ {totalAmount.toFixed(2)}</div>
                  </div>
               </div>

               <div className="mt-2 text-right">
                    <button 
                      onClick={() => navigate(-1)}
                      className='bg-[#1b5e58] border border-black text-white px-4 py-1 font-bold text-[12px] hover:bg-[#12423d] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                    >
                      Accept (Cmd/Ctrl+A)
                    </button>
               </div>

            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {[
               { key: 'F1', label: 'Help' },
               { key: 'F2', label: 'Date' },
             ].map((f) => (
               <button 
                 key={f.key} 
                 className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
               >
                 <span className='font-bold text-black text-[11px] w-[35px]'>{f.key}</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
               </button>
             ))}
             <div className='flex-1' />
             <button 
               onClick={() => navigate(-1)}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Purchase Order Entry</div>
        </div>
      </div>

      {allocModal.open && (
        <LocationAllocationModal
           item={items[allocModal.rowIndex]}
           onSave={(allocs: any, totalQty: string) => saveAllocations(allocModal.rowIndex, allocs, totalQty)}
           onClose={() => setAllocModal({ open: false, rowIndex: 0 })}
        />
      )}
    </>
  );
}
