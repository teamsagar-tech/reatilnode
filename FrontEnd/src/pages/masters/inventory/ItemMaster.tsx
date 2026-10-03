import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMasterApi } from '../../../hooks/useMasterApi';
import { useConfirmStore } from '../../../store/useConfirmStore';
import { Helmet } from 'react-helmet-async';
import { Search, Box, Banknote, Settings } from 'lucide-react';

// Added to satisfy TS compiler for InputGroup
const handleFieldKeyDown = (e: any, nextId: any) => {};


export default function ItemMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data: sampleData, fetchList, saveRecord } = useMasterApi('masters/item');
  const { showConfirm, isOpen } = useConfirmStore();
  
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => { fetchList(); }, [fetchList]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/brand`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setBrands(Array.isArray(data) ? data : []))
    .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setCategories(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, []);

  // Auto-focus on mode change
  useEffect(() => {
    if (mode === 'create') {
      setTimeout(() => {
        // Try to find the input with autoFocus=true or id="field-0" or just the first input
        const firstInput = (document.querySelector('input[autofocus]') || document.getElementById('field-0') || document.querySelector('input[type="text"]')) as any;
        if (firstInput && typeof firstInput.focus === 'function') {
          firstInput.focus();
        }
      }, 50);
    }
  }, [mode]);


  useEffect(() => {
    if (isOpen) return; // Do not trigger keyboard shortcuts if confirm dialog is open
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        
        const hasUnsavedData = mode === 'create' && Object.keys(formData).length > 0 && Object.values(formData).some(v => v !== '');
        
        if (hasUnsavedData) {
          showConfirm('Quit without saving?', 'You have unsaved changes. Are you sure you want to quit?', () => {
            setMode('list');
            setFormData({});
          });
        } else {
          if (mode === 'create') {
            setMode('list');
            setFormData({});
          } else {
            navigate('/dashboard');
          }
        }
      } else if (mode === 'list' && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(s => Math.min(s + 1, (sampleData?.length || 1) - 1));
      } else if (mode === 'list' && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(s => Math.max(s - 1, 0));
      } else if (mode === 'list' && e.key === 'Enter') {
        e.preventDefault();
        if (sampleData && sampleData[selectedIndex]) {
          setFormData(sampleData[selectedIndex]);
          setMode('create');
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {
        e.preventDefault();
        setMode('create');
        setTimeout(() => {
          document.getElementById('field-0')?.focus();
        }, 50);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        setMode('list');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, sampleData, selectedIndex, formData, showConfirm, isOpen]);


  const SectionTitle = ({ children, icon: Icon }: any) => (
    <div className="flex items-center gap-2 font-extrabold text-slate-700 text-[11px] mb-3 pb-1 border-b-2 border-slate-100 uppercase tracking-widest mt-2">
      {Icon && (
        <div className="p-1 bg-indigo-50 text-indigo-600 rounded-md">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      {children}
    </div>
  );

  const InputGroup = ({ label, id, value, onChange, nextId, width = 'w-full', type = 'text', placeholder = '', autoFocus = false, datalistId, options }: any) => (
    <div className="flex flex-col gap-[2px] mb-2.5 group relative">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <input 
        id={id}
        autoFocus={autoFocus}
        type={type} 
        list={datalistId}
        className={`bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all hover:border-slate-300 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if(nextId && typeof handleFieldKeyDown !== 'undefined') handleFieldKeyDown(e, nextId) }}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
      {datalistId && options && (
        <datalist id={datalistId}>
          {options.map((opt: any) => (
            <option key={opt.id || opt.name} value={opt.name} />
          ))}
        </datalist>
      )}
    </div>
  );

  const SelectGroup = ({ label, id, value, onChange, options, nextId, width = 'w-full', autoFocus = false }: any) => (
    <div className="flex flex-col gap-[2px] mb-2.5 group">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <select 
        id={id}
        autoFocus={autoFocus}
        className={`bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all hover:border-slate-300 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if(nextId && typeof handleFieldKeyDown !== 'undefined') handleFieldKeyDown(e, nextId) }}
      >
        <option value=""></option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Item Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-64px)] font-sans selection:bg-indigo-100 w-full bg-slate-50'>
        
        

        <div className='flex flex-1 overflow-hidden'>
          {/* Main Container */}
          <div className='flex-1 bg-white border-none flex flex-col overflow-hidden'>
            
            <div className='flex-1 overflow-y-auto flex flex-col flex flex-col'>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 py-1 border-b border-slate-200 shrink-0 bg-white">
                <div className="flex items-end gap-2 shrink-0">
                  <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">Item Master</h1>
            <span className="text-slate-300 font-light mb-1">|</span>
            <p className="text-[10px] font-bold text-slate-500">Inventory Configuration</p>
                </div>
                
                {mode === 'list' && (
                  <div className='flex items-center gap-4 flex-1 justify-end'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search items..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-300 rounded text-[11px] font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button 
                      onClick={() => setMode('create')} 
                      className='bg-indigo-600 px-2 py-1 rounded bg-indigo-600 font-bold text-white shadow-none hover:bg-indigo-700 transition-all text-xs'
                    >Create New (Alt+C)</button>
                  </div>
                )}
              </div>
              
              {mode === 'list' ? (
                <>
                  
                  <div className="overflow-y-auto custom-scrollbar flex-1">
                    <table className='w-full text-left border-collapse'>
                      <thead className='bg-slate-100 border-b border-slate-200 sticky top-0 z-10'>
                        <tr className='text-slate-800 font-bold text-[10px] uppercase tracking-widest'>
                          <th className="px-2 py-1 text-[11px]">ID</th>
                          <th className="px-2 py-1 text-[11px]">Item Name</th>
                          <th className="px-2 py-1 text-[11px]">Brand</th>
                          <th className="px-2 py-1 text-[11px]">Stock</th>
                          <th className="px-2 py-1 text-[11px]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row, index) => {
                          const status = row.status || (row.is_active !== false ? 'Active' : 'Inactive');
                          const brandName = brands.find(b => b.id === row.brand_id)?.name || row.brand || '-';
                          return (
                          <tr key={row.id} onDoubleClick={() => { 
                              setFormData({
                                ...row,
                                itemName: row.name || row.item_name,
                                brandName: brands.find(b => b.id === row.brand_id)?.name || '',
                                categoryName: categories.find(c => c.id === row.category_id)?.name || '',
                                hsnsacCode: row.hsn_code || row.hsnsacCode || '',
                                gstPercent: row.tax_percent || row.gstPercent || ''
                              }); 
                              setMode('create'); 
                            }}
                            className={`text-xs cursor-pointer transition-colors group ${selectedIndex === index ? 'bg-amber-50/60 border-l-[3px] border-amber-400' : 'bg-white hover:bg-slate-50'}`}>
                            <td className="px-2 py-1 text-[11px] font-semibold text-slate-500">#{row.id}</td>
                            <td className="px-2 py-1 text-[11px] font-bold text-slate-800">{row.name || row.item_name}</td>
                            <td className="px-2 py-1 text-[11px] font-semibold text-slate-600">{brandName}</td>
                            <td className="px-2 py-1 text-[11px] font-bold text-slate-700">{row.stock || row.current_stock || '0'}</td>
                            <td className="px-2 py-1 text-[11px]">
                              <span className={`px-2 py-1 rounded-md font-bold ${status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  {/* Premium Tally-style 3 Column Layout */}
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Core Information */}
                    <div className="flex-1 flex flex-col gap-1 border-r border-slate-200 px-2 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle icon={Box}>Core Information</SectionTitle>
                      <InputGroup id="field-0" label="Item Name" value={formData.itemName || formData.name} onChange={(v: string) => setFormData({...formData, itemName: v})} />
                      <InputGroup label="Marathi Name" value={formData.marathiName} onChange={(v: string) => setFormData({...formData, marathiName: v})} />
                      <InputGroup label="Category Name" value={formData.categoryName} onChange={(v: string) => setFormData({...formData, categoryName: v})} datalistId="categories-list" options={categories} />
                      <InputGroup label="Brand Name" value={formData.brandName} onChange={(v: string) => setFormData({...formData, brandName: v})} datalistId="brands-list" options={brands} />
                    </div>

                    {/* Column 2: Financials & Tax */}
                    <div className="flex-1 flex flex-col gap-1 border-r border-slate-200 px-2 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle icon={Banknote}>Financials & Tax</SectionTitle>
                      <InputGroup label="HSN/SAC Code" value={formData.hsnsacCode} onChange={(v: string) => setFormData({...formData, hsnsacCode: v})} />
                      <InputGroup label="GST Percent (%)" type="number" value={formData.gstPercent} onChange={(v: string) => setFormData({...formData, gstPercent: v})} />
                    </div>

                    {/* Column 3: Configuration */}
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto px-2 pb-2 custom-scrollbar">
                      <SectionTitle icon={Settings}>Configuration</SectionTitle>
                      <SelectGroup 
                        id="defaultUnitType" 
                        label="Default Unit Type" 
                        value={formData.defaultUnitType} 
                        onChange={(v: string) => setFormData({...formData, defaultUnitType: v})} 
                        options={['nos', 'pcs', 'box', 'dozon', 'mtr']}
                      />
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>
                    <button 
                      onClick={() => setFormData({})}
                      tabIndex={ -1 } className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={async () => {
                        const foundBrand = brands.find(b => b.name === formData.brandName);
                        const foundCategory = categories.find(c => c.name === formData.categoryName);
                        
                        let finalBrandId = foundBrand?.id || null;
                        if (finalBrandId && finalBrandId > 2147483647) finalBrandId = null;

                        const payload = {
                          ...formData,
                          brand_id: finalBrandId,
                          category_id: foundCategory?.id || null,
                          name: formData.itemName,
                          hsn_code: formData.hsnsacCode,
                          tax_percent: parseFloat(formData.gstPercent) || 0,
                        };

                        const res = await saveRecord(payload);
                        if(res.success) { setFormData({}); setMode('list'); }
                      }}
                      className='bg-indigo-600 border border-indigo-600 px-8 py-2 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 text-xs'
                    >
                      Save (Ctrl+A)
                    </button>
                  </div>                
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
