import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const InputRow = ({ label, value, onChange, placeholder = '', type = 'text', onKeyDown }: any) => (
  <div className="flex items-center text-[12px] mb-1">
    <label className="w-[120px] font-semibold text-slate-700 shrink-0">{label}</label>
    <span className="font-bold mr-1 text-slate-400">:</span>
    <input
      type={type}
      className="flex-1 border border-slate-300 px-1 py-[2px] focus:outline-none focus:border-[#1b5e58] focus:bg-[#ffffe0] bg-white transition-colors"
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
    />
  </div>
);

export default function ManageReceivable() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [focusedRow, setFocusedRow] = useState(-1);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  
  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  
  const [editForm, setEditForm] = useState({ salePrice: '', mrp: '', discount: '' });
  const [splitForm, setSplitForm] = useState({ pieces: '2' });

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/manage-receivable/search?query=${searchQuery}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        setSelectedProducts(new Set());
        setFocusedRow(0);
      }
    } catch (err) {
      console.error('Search error', err);
    }
  };

  const toggleSelection = (idx: number) => {
    const pId = products[idx].id;
    const next = new Set(selectedProducts);
    if (next.has(pId)) next.delete(pId);
    else next.add(pId);
    setSelectedProducts(next);
  };

  const handleBulkUpdate = async () => {
    if (selectedProducts.size === 0) return alert("No products selected");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/manage-receivable/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productIds: Array.from(selectedProducts),
          updates: {
            vrp_rate: editForm.salePrice,
            mrp: editForm.mrp,
            discount: editForm.discount
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Products updated successfully");
        setShowEditModal(false);
        handleSearch(); // Refresh grid
      }
    } catch (err) {
      console.error('Update error', err);
    }
  };

  const handleSplitProduct = async () => {
    if (selectedProducts.size !== 1) return alert("Select exactly ONE product to split");
    const pId = Array.from(selectedProducts)[0];
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/manage-receivable/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: pId,
          numPieces: parseInt(splitForm.pieces, 10)
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setShowSplitModal(false);
        handleSearch();
      }
    } catch (err) {
      console.error('Split error', err);
    }
  };

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showEditModal) { setShowEditModal(false); return; }
        if (showSplitModal) { setShowSplitModal(false); return; }
        navigate(-1);
        return;
      }
      if (showEditModal || showSplitModal) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedRow(prev => Math.min(prev + 1, products.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedRow(prev => Math.max(prev - 1, 0));
      } else if (e.key === ' ') {
        e.preventDefault();
        if (focusedRow >= 0 && focusedRow < products.length) {
          toggleSelection(focusedRow);
        }
      } else if (e.key === 'F2') {
        e.preventDefault();
        if (selectedProducts.size > 0) setShowEditModal(true);
      } else if (e.key === 'F3') {
        e.preventDefault();
        if (selectedProducts.size === 1) setShowSplitModal(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [products, focusedRow, selectedProducts, showEditModal, showSplitModal]);

  return (
    <>
      <Helmet>
        <title>Manage Receivables | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Inventory Correction</div>
               <div className='text-yellow-300'>Manage Receivables</div>
            </div>
            
            <div className='p-2 shrink-0 border-b-2 border-slate-300 bg-white flex gap-12'>
              <div className="w-[400px]">
                 <InputRow 
                    label="Search Receivable" 
                    value={searchQuery} 
                    onChange={setSearchQuery} 
                    onKeyDown={(e: any) => { if (e.key === 'Enter') handleSearch(); }}
                    placeholder="Enter Barcode, Batch, or Invoice No..." 
                 />
              </div>
            </div>

            <div className='flex-1 overflow-y-auto bg-white flex flex-col'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#eef5ed] sticky top-0 border-b-2 border-[#81a09d]'>
                        <tr className='text-[#1b5e58] font-bold text-[12px]'>
                            <th className="px-2 py-1 border-r border-[#81a09d] w-[30px] text-center">✓</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] w-[50px]">S.No</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Barcode</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Item Name</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right">Sales Price</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right">MRP</th>
                            <th className="px-2 py-1 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr><td colSpan={7} className="text-center p-8 text-slate-400 font-bold">Search for products to manage...</td></tr>
                        ) : (
                            products.map((p, idx) => {
                                const isSelected = selectedProducts.has(p.id);
                                return (
                                <tr 
                                  key={p.id} 
                                  className={`text-[12px] border-b border-slate-200 cursor-pointer ${focusedRow === idx ? 'bg-[#ffffe0] font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-800'}`}
                                  onClick={() => setFocusedRow(idx)}
                                >
                                    <td className="px-2 py-1 border-r border-slate-200 text-center font-bold text-green-700">
                                        {isSelected ? '✓' : ''}
                                    </td>
                                    <td className="px-2 py-1 border-r border-slate-200">{idx + 1}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{p.barcode}</td>
                                    <td className="px-2 py-1 border-r border-slate-200">{p.product_name}</td>
                                    <td className="px-2 py-1 border-r border-slate-200 text-right">{parseFloat(p.vrp_rate).toFixed(2)}</td>
                                    <td className="px-2 py-1 border-r border-slate-200 text-right">{parseFloat(p.mrp).toFixed(2)}</td>
                                    <td className="px-2 py-1 text-center font-bold text-[#1b5e58]">
                                        {p.is_sold ? 'SOLD' : 'AVAILABLE'}
                                    </td>
                                </tr>
                            )})
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className='bg-[#eef5ed] border-t-2 border-[#81a09d] p-2 flex justify-between shrink-0 font-bold text-[12px]'>
                <div className='text-slate-700'>Selected: {selectedProducts.size} / {products.length} (Press SPACE to select)</div>
            </div>

          </div>

          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             <button onClick={() => selectedProducts.size > 0 && setShowEditModal(true)} className={`flex flex-row items-center px-2 py-1 border text-left ${selectedProducts.size > 0 ? 'bg-[#e0efeb] border-[#a3c3be] hover:bg-[#c9e1dd]' : 'bg-slate-200 border-slate-300 opacity-50'}`}>
                 <span className='font-bold text-black text-[11px] w-[35px]'>F2</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Edit Rates</span>
             </button>
             <button onClick={() => selectedProducts.size === 1 && setShowSplitModal(true)} className={`flex flex-row items-center px-2 py-1 border text-left ${selectedProducts.size === 1 ? 'bg-[#e0efeb] border-[#a3c3be] hover:bg-[#c9e1dd]' : 'bg-slate-200 border-slate-300 opacity-50'}`}>
                 <span className='font-bold text-black text-[11px] w-[35px]'>F3</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Split Pcs</span>
             </button>
             <div className='flex-1' />
             <button onClick={() => navigate('/dashboard')} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left'>
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Modals */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#fcfaf2] border-2 border-[#81a09d] w-[400px] shadow-2xl p-4">
              <h2 className="font-bold text-[#1b5e58] border-b border-[#a3c3be] mb-4 pb-1 uppercase">Batch Edit Rates</h2>
              <div className="flex flex-col gap-2">
                 <InputRow label="Sales Price" value={editForm.salePrice} onChange={(v: string) => setEditForm({...editForm, salePrice: v})} />
                 <InputRow label="MRP" value={editForm.mrp} onChange={(v: string) => setEditForm({...editForm, mrp: v})} />
                 <InputRow label="Discount %" value={editForm.discount} onChange={(v: string) => setEditForm({...editForm, discount: v})} />
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#a3c3be]">
                 <button onClick={() => setShowEditModal(false)} className="px-4 py-1 border border-slate-400 bg-white hover:bg-slate-100 font-bold text-slate-700">Cancel</button>
                 <button onClick={handleBulkUpdate} className="px-4 py-1 border border-[#144743] bg-[#1b5e58] hover:bg-[#144743] font-bold text-white">Save Changes (Enter)</button>
              </div>
            </div>
          </div>
        )}

        {showSplitModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#fcfaf2] border-2 border-[#81a09d] w-[350px] shadow-2xl p-4">
              <h2 className="font-bold text-[#1b5e58] border-b border-[#a3c3be] mb-4 pb-1 uppercase">Split Barcode</h2>
              <div className="flex flex-col gap-2">
                 <InputRow label="Number of Pieces" type="number" value={splitForm.pieces} onChange={(v: string) => setSplitForm({...splitForm, pieces: v})} />
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#a3c3be]">
                 <button onClick={() => setShowSplitModal(false)} className="px-4 py-1 border border-slate-400 bg-white hover:bg-slate-100 font-bold text-slate-700">Cancel</button>
                 <button onClick={handleSplitProduct} className="px-4 py-1 border border-[#144743] bg-[#1b5e58] hover:bg-[#144743] font-bold text-white">Split</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
