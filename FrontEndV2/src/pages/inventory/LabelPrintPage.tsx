import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchableDropdown from '../../components/SearchableDropdown';
import CutAllocationModal from '../../components/inventory/CutAllocationModal';
import { toast } from "../../store/useToastStore";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ label, value, onChange, placeholder = '', type = 'text', onKeyDown, readOnly=false }: any) => (
  <div className="flex items-center text-[12px] mb-1 gap-1">
    <label className="w-[100px] font-semibold text-slate-700 shrink-0 text-right">{label}</label>
    <span className="font-bold mr-1 text-slate-400">:</span>
    <input
      type={type}
      className={`flex-1 border px-1 py-[2px] focus:outline-none transition-colors ${readOnly ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-white border-slate-300 focus:border-[#1b5e58] focus:bg-[#ffffe0]'}`}
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </div>
);

export default function LabelPrintPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const lrsQuery = searchParams.get('lrs');
  const lr_nos = location.state?.lr_nos || (lrsQuery ? lrsQuery.split(',') : []);

  const [items, setItems] = useState<any[]>([]);
  const [focusedRow, setFocusedRow] = useState(0);
  const [generatedProducts, setGeneratedProducts] = useState<any[]>([]);
  
  // Masters Data
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [styles, setStyles] = useState<any[]>([]);
  const [subStyles, setSubStyles] = useState<any[]>([]);

  // Current Active Item State (Middle Form)
  const [activeItem, setActiveItem] = useState<any>({});
  
  // Modals
  const [showCutModal, setShowCutModal] = useState(false);

  useEffect(() => {
    fetchMasters();
    if (lr_nos.length > 0) {
      fetchInvoiceItems();
    } else {
      // For testing if no LR passed
      // toast.warning("No LR Numbers provided to Label Print Page.");
    }
  }, []);

  const fetchMasters = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const [catRes, subCatRes, matRes, colRes, depRes, styleRes, subStyleRes] = await Promise.all([
        fetch(`${baseUrl}/api/masters/category`, { headers }),
        fetch(`${baseUrl}/api/masters/generic/subcategories`, { headers }),
        fetch(`${baseUrl}/api/masters/generic/materials`, { headers }),
        fetch(`${baseUrl}/api/masters/generic/colors`, { headers }),
        fetch(`${baseUrl}/api/masters/generic/departments`, { headers }),
        fetch(`${baseUrl}/api/masters/generic/styles`, { headers }),
        fetch(`${baseUrl}/api/masters/generic/substyles`, { headers })
      ]);
      
      if (catRes.ok) setCategories(await catRes.json());
      if (subCatRes.ok) setSubCategories(await subCatRes.json());
      if (matRes.ok) setMaterials(await matRes.json());
      if (colRes.ok) setColors(await colRes.json());
      if (depRes.ok) setDepartments(await depRes.json());
      if (styleRes.ok) setStyles(await styleRes.json());
      if (subStyleRes.ok) setSubStyles(await subStyleRes.json());
    } catch (e) {
      console.error("Failed to fetch masters", e);
    }
  };

  const fetchInvoiceItems = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/label-print/invoice-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ lr_nos })
      });
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setItems(data.data);
        setActiveItem({ ...data.data[0], recv_qty: data.data[0].invoiced_qty, disc_percent: 0 });
        setFocusedRow(0);
        fetchGeneratedBarcodes(data.data[0].invoice_product_id);
      }
    } catch (err) {
      console.error('Failed to fetch invoice items', err);
    }
  };

  const fetchGeneratedBarcodes = async (invoice_product_id: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/label-print/generated-barcodes/${invoice_product_id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) setGeneratedProducts(data.data);
    } catch (err) {
      console.error('Failed to fetch generated barcodes', err);
    }
  };

  // Keyboard navigation for the top grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showCutModal) {
        e.preventDefault();
        navigate(-1);
      } else if (e.key === 'ArrowDown' && e.altKey) {
        e.preventDefault();
        setFocusedRow(prev => {
          const next = Math.min(prev + 1, items.length - 1);
          if (next !== prev) {
            setActiveItem({ ...items[next], recv_qty: items[next].invoiced_qty, disc_percent: 0 });
            fetchGeneratedBarcodes(items[next].invoice_product_id);
          }
          return next;
        });
      } else if (e.key === 'ArrowUp' && e.altKey) {
        e.preventDefault();
        setFocusedRow(prev => {
          const next = Math.max(prev - 1, 0);
          if (next !== prev) {
            setActiveItem({ ...items[next], recv_qty: items[next].invoiced_qty, disc_percent: 0 });
            fetchGeneratedBarcodes(items[next].invoice_product_id);
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, showCutModal]);

  const handleRowClick = (idx: number) => {
    setFocusedRow(idx);
    setActiveItem({ ...items[idx], recv_qty: items[idx].invoiced_qty, disc_percent: 0 });
    fetchGeneratedBarcodes(items[idx].invoice_product_id);
  };

  const handleGenerate = async () => {
    if (!activeItem.invoice_product_id) return toast.warning("No item selected");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/label-print/generate-barcodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ products: [activeItem] })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Barcodes Generated!");
        fetchGeneratedBarcodes(activeItem.invoice_product_id);
      } else {
        toast.error("Error: " + data.message);
      }
    } catch (err) {
      console.error("Generate error", err);
    }
  };

  const updateActive = (key: string, val: any) => {
    setActiveItem((prev: any) => ({ ...prev, [key]: val }));
  };

  const filteredCategories = activeItem.department_id 
    ? categories.filter(c => String(c.department_id) === String(activeItem.department_id))
    : categories;

  const filteredSubCategories = activeItem.category_id 
    ? subCategories.filter(c => String(c.category_id) === String(activeItem.category_id))
    : subCategories;

  const filteredSubStyles = activeItem.style_id 
    ? subStyles.filter(s => String(s.style_id) === String(activeItem.style_id))
    : subStyles;

  return (
    <>
      <Helmet>
        <title>Label Print | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        
        {/* Header */}
        <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0 border-b-2 border-[#12423d]'>
            <div className="flex gap-4">
              <span>LR INWARD BARCODE GENERATION</span>
              {lr_nos.length > 0 && <span className="text-yellow-300">LRs: {lr_nos.join(', ')}</span>}
            </div>
            <div className='text-yellow-300'>Alt+Up/Down to navigate rows</div>
        </div>

        <div className='flex flex-row flex-1 overflow-hidden'>
          <div className='flex flex-col flex-1 overflow-hidden p-1 gap-1'>
            
            {/* TOP SECTION: Invoice Items Grid */}
          <div className='bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col shadow-inner h-[30%] relative'>
            <div className='bg-[#eef5ed] border-b-2 border-[#81a09d] px-2 py-1 font-bold text-[#1b5e58] text-[11px]'>
              1. PENDING INVOICE ITEMS
            </div>
            <div className='flex-1 overflow-y-auto bg-white'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#f8faf8] sticky top-0 border-b border-slate-300 shadow-sm'>
                        <tr className='text-[#1b5e58] font-bold text-[11px]'>
                            <th className="px-2 py-1 w-[40px]">Sr</th>
                            <th className="px-2 py-1">Item Name</th>
                            <th className="px-2 py-1">GRN</th>
                            <th className="px-2 py-1">Party Name</th>
                            <th className="px-2 py-1 text-right">Qty</th>
                            <th className="px-2 py-1 text-right">Pur.Rate</th>
                            <th className="px-2 py-1 text-right">SaleRate</th>
                            <th className="px-2 py-1 text-right">MRP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr><td colSpan={8} className="text-center p-4 text-slate-400 font-bold">No pending items found for these LRs</td></tr>
                        ) : items.map((p, idx) => (
                            <tr 
                              key={p.invoice_product_id} 
                              className={`text-[11px] border-b border-slate-200 cursor-pointer transition-colors ${focusedRow === idx ? 'bg-[#ffffe0] font-bold text-blue-900 border-[#81a09d]' : 'hover:bg-slate-50 text-slate-800'}`}
                              onClick={() => handleRowClick(idx)}
                            >
                                <td className="px-2 py-[3px] border-r border-slate-200">{idx + 1}</td>
                                <td className="px-2 py-[3px] border-r border-slate-200">{p.item_name}</td>
                                <td className="px-2 py-[3px] border-r border-slate-200">{p.grn}</td>
                                <td className="px-2 py-[3px] border-r border-slate-200 truncate max-w-[150px]">{p.party_name}</td>
                                <td className="px-2 py-[3px] border-r border-slate-200 text-right">{p.invoiced_qty}</td>
                                <td className="px-2 py-[3px] border-r border-slate-200 text-right">{parseFloat(p.purchase_rate).toFixed(2)}</td>
                                <td className="px-2 py-[3px] border-r border-slate-200 text-right">{parseFloat(p.sale_rate || 0).toFixed(2)}</td>
                                <td className="px-2 py-[3px] text-right">{parseFloat(p.mrp || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* MIDDLE SECTION: Enrichment Form */}
          <div className='bg-white border-2 border-[#81a09d] flex flex-col shadow-inner shrink-0'>
            <div className='bg-[#eef5ed] border-b-2 border-[#81a09d] px-2 py-1 font-bold text-[#1b5e58] text-[11px] flex justify-between'>
              <span>2. ENRICH ITEM & SET PRICING</span>
              <button className="bg-yellow-100 text-yellow-800 px-2 rounded border border-yellow-400 text-[10px]" onClick={() => setShowCutModal(true)}>
                [F3] Suit/Shirt Cutting
              </button>
            </div>
            
            <div className="p-2 flex gap-4 bg-[#fcfaf2]">
              {/* Taxonomy Col */}
              <div className="flex-1 flex flex-col gap-1 border-r border-slate-300 pr-4">
                 <div className="flex gap-2 mt-1">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Department</div>
                      <SearchableDropdown options={departments.map(d=>({id: d.id, name: d.name}))} value={activeItem.department_id || ''} onChange={(v)=>updateActive('department_id', v)} placeholder="Dept..." className="w-full text-[12px] py-[2px] border-slate-300 bg-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Category</div>
                      <SearchableDropdown options={filteredCategories.map(c=>({id: c.id, name: c.name}))} value={activeItem.category_id || ''} onChange={(v)=>updateActive('category_id', v)} placeholder="Category..." className="w-full text-[12px] py-[2px] border-slate-300 bg-white" />
                    </div>
                 </div>
                 
                 <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Sub Category</div>
                      <SearchableDropdown options={filteredSubCategories.map(c=>({id: c.id, name: c.name}))} value={activeItem.sub_category_id || ''} onChange={(v)=>updateActive('sub_category_id', v)} placeholder="Sub Cat..." className="w-full text-[12px] py-[2px] border-slate-300 bg-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Material/Fabric</div>
                      <SearchableDropdown options={materials.map(m=>({id: m.id, name: m.name}))} value={activeItem.material_id || ''} onChange={(v)=>updateActive('material_id', v)} placeholder="Material..." className="w-full text-[12px] py-[2px] border-slate-300 bg-white" />
                    </div>
                 </div>

                 <div className="flex gap-2 mt-1">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Style</div>
                      <SearchableDropdown options={styles.map(s=>({id: s.id, name: s.name}))} value={activeItem.style_id || ''} onChange={(v)=>updateActive('style_id', v)} placeholder="Style..." className="w-full text-[12px] py-[2px] border-slate-300 bg-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Sub Style</div>
                      <SearchableDropdown options={filteredSubStyles.map(s=>({id: s.id, name: s.name}))} value={activeItem.sub_style_id || ''} onChange={(v)=>updateActive('sub_style_id', v)} placeholder="Sub Style..." className="w-full text-[12px] py-[2px] border-slate-300 bg-white" />
                    </div>
                 </div>

                 <div className="flex gap-2 mt-1">
                   <div className="flex-1">
                     <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Item Name</div>
                     <input type="text" className="w-full border border-slate-300 px-1 py-[2px] text-[12px] focus:bg-[#ffffe0]" value={activeItem.item_name || ''} onChange={e => updateActive('item_name', e.target.value)} />
                   </div>
                   <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Colour</div>
                      <SearchableDropdown options={colors.map(c=>({id: c.id, name: c.name}))} value={activeItem.color_id || ''} onChange={(v)=>updateActive('color_id', v)} placeholder="Colour..." className="w-full text-[12px] py-[2px] border-slate-300 bg-white" />
                   </div>
                 </div>
              </div>

              {/* Pricing Col */}
              <div className="flex-1 flex flex-col justify-between pl-2">
                <div>
                  <div className="flex gap-2">
                     <div className="w-[80px]">
                       <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Recv. Qty</div>
                       <input type="number" className="w-full border border-slate-300 px-1 py-[2px] text-[12px] focus:bg-[#ffffe0] font-bold text-blue-800 text-center" value={activeItem.recv_qty || ''} onChange={e => updateActive('recv_qty', e.target.value)} />
                     </div>
                     <div className="w-[100px]">
                       <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Purchase Rate</div>
                       <input type="number" className="w-full border border-slate-300 px-1 py-[2px] text-[12px] bg-slate-100 text-slate-600 text-right" value={parseFloat(activeItem.purchase_rate||0).toFixed(2)} readOnly />
                     </div>
                     <div className="w-[80px]">
                       <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Disc %</div>
                       <input type="number" className="w-full border border-slate-300 px-1 py-[2px] text-[12px] focus:bg-[#ffffe0] text-right" value={activeItem.disc_percent || ''} onChange={e => updateActive('disc_percent', e.target.value)} />
                     </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                     <div className="flex-1">
                       <div className="text-[10px] font-bold text-slate-500 mb-[2px]">Sale Rate (VRP)</div>
                       <input type="number" className="w-full border border-slate-300 px-1 py-[2px] text-[12px] focus:bg-[#ffffe0] font-bold text-green-700 text-right text-lg" value={activeItem.vrp || ''} onChange={e => updateActive('vrp', e.target.value)} />
                     </div>
                     <div className="flex-1">
                       <div className="text-[10px] font-bold text-slate-500 mb-[2px]">MRP</div>
                       <input type="number" className="w-full border border-slate-300 px-1 py-[2px] text-[12px] focus:bg-[#ffffe0] font-bold text-green-900 text-right text-lg" value={activeItem.mrp || ''} onChange={e => updateActive('mrp', e.target.value)} />
                     </div>
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                   <button onClick={handleGenerate} className="bg-[#1b5e58] text-white font-bold px-6 py-2 border border-[#12423d] shadow-sm hover:bg-[#144743] flex items-center gap-2">
                     GENERATE BARCODES
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Generated Barcodes Grid */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col shadow-inner relative'>
            <div className='bg-[#eef5ed] border-b-2 border-[#81a09d] px-2 py-1 font-bold text-[#1b5e58] text-[11px] flex justify-between'>
              <span>3. GENERATED BARCODES</span>
              <span className="text-slate-600 font-normal">Total Generated: {generatedProducts.length}</span>
            </div>
            <div className='flex-1 overflow-y-auto bg-white'>
                <table className='w-full text-left border-collapse'>
                    <thead className='bg-[#f8faf8] sticky top-0 border-b border-slate-300 shadow-sm'>
                        <tr className='text-[#1b5e58] font-bold text-[11px]'>
                            <th className="px-2 py-1">Barcode</th>
                            <th className="px-2 py-1">Category</th>
                            <th className="px-2 py-1">Date</th>
                            <th className="px-2 py-1">GRN</th>
                            <th className="px-2 py-1 text-right">Purch.Rate</th>
                            <th className="px-2 py-1 text-right">Sale Rate</th>
                            <th className="px-2 py-1 text-right">MRP</th>
                            <th className="px-2 py-1 text-center">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {generatedProducts.length === 0 ? (
                            <tr><td colSpan={8} className="text-center p-8 text-slate-400 font-bold">No barcodes generated yet for this item</td></tr>
                        ) : generatedProducts.map((p, idx) => (
                            <tr key={p.id} className="text-[11px] border-b border-slate-100 hover:bg-slate-50 text-slate-700">
                                <td className="px-2 py-[3px] font-bold text-slate-800">{p.barcode}</td>
                                <td className="px-2 py-[3px]">{p.category}</td>
                                <td className="px-2 py-[3px]">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="px-2 py-[3px]">{p.grn}</td>
                                <td className="px-2 py-[3px] text-right">{parseFloat(p.purchase_rate).toFixed(2)}</td>
                                <td className="px-2 py-[3px] text-right font-bold text-green-700">{parseFloat(p.sale_rate).toFixed(2)}</td>
                                <td className="px-2 py-[3px] text-right">{parseFloat(p.mrp).toFixed(2)}</td>
                                <td className="px-2 py-[3px] text-center">{p.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='bg-[#eef5ed] border-t-2 border-[#81a09d] p-1 flex justify-end shrink-0'>
                <button className='bg-slate-700 text-white px-6 py-1 font-bold text-[11px] hover:bg-slate-800 shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)]'>
                    Print These Labels
                </button>
            </div>
          </div>
          
        </div>

        {/* Right Sidebar */}
        <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
           {[
             { key: 'F1', label: 'Help' },
             { key: 'F2', label: 'Date' },
             { key: 'F3', label: 'Company' },
             { key: 'F4', label: 'Edit' },
             { key: 'F5', label: 'Delete' },
           ].map((f) => (
             <button 
               key={f.key} 
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
               <span className='font-bold text-black text-[11px] w-[25px]'>{f.key}</span>
               <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
             </button>
           ))}
           <div className='flex-1' />
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
             className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
           >
               <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
               <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
           </button>
        </div>
      </div>
      
      {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-[2px] flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Tally-Style Inventory Label Print Console</div>
        </div>

        {/* Modals */}
        <CutAllocationModal 
          isOpen={showCutModal}
          onClose={() => setShowCutModal(false)}
          onSave={(cuts) => {
            toast.warning(`Allocated ${cuts.length} cuts.`);
            setShowCutModal(false);
          }}
          categoryName={categories.find(c => c.id === activeItem.category_id)?.name || 'Fabric'}
        />

      </div>
    </>
  );
}
