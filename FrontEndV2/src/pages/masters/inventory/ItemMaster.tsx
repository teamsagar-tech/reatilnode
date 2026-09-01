import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MasterCreationModal from '../../../components/inventory/MasterCreationModal';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
      {children}
    </div>
  );

  const InputRow = ({ label, value, onChange, width = 'flex-1', type = 'text', placeholder = '', id, onBlur, onKeyDown, onFocus, children }: any) => (
    <div className="flex items-center mb-[2px] relative">
      <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
        {label}
      </div>
      <input 
        id={id}
        type={type} 
        className={`bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {children}
    </div>
  );

export default function ItemMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categorySuggestionIndex, setCategorySuggestionIndex] = useState(0);
  const [brandSuggestionIndex, setBrandSuggestionIndex] = useState(0);
  const [masterModal, setMasterModal] = useState<{ type: 'brand' | 'hsn', initialValue: string, nextFocusId: string } | null>(null);

  const [items, setItems] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchItems = () => {
    fetch('https://api.retailnode.in/api/items', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setItems(Array.isArray(data) ? data : []))
    .catch(console.error);
  };

  useEffect(() => {
    fetch('https://api.retailnode.in/api/masters/brand', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setBrands(Array.isArray(data) ? data : []))
    .catch(console.error);

    fetchItems();
  }, []);

  useEffect(() => {
    if (mode === 'create') {
      setTimeout(() => {
        document.getElementById('input-itemName')?.focus();
      }, 50);
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (masterModal !== null) {
          setMasterModal(null);
          return;
        }
        if (mode === 'create') {
          setFormData({});
          setEditId(null);
          setMode('list');
        } else {
          navigate(-1);
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC' || e.key === 'ç') && mode === 'list') {
        e.preventDefault();
        setMode('create');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        handleSaveItem();
      } else if (mode === 'list') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (items[selectedIndex]) {
            const row = items[selectedIndex];
            setFormData({
              itemName: row.name,
              brandName: brands.find(b => b.id === row.brand_id)?.name || '',
              hsnsacCode: row.hsn_code || '',
              gstPercent: row.tax_percent || ''
            });
            setEditId(row.id);
            setMode('create');
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, formData, brands, masterModal, items, selectedIndex]); // added dependencies

  const handleSaveItem = async () => {
    if (!formData.itemName) {
      alert("Item Name is required");
      return;
    }

    const foundBrand = brands.find(b => b.name === formData.brandName);
    let finalBrandId = foundBrand?.id || null;
    
    const foundCategory = categories.find(c => c.name === formData.categoryName);
    let finalCategoryId = foundCategory?.id || null;
    
    // Prevent Date.now() large INT from crashing MySQL
    if (finalBrandId && finalBrandId > 2147483647) {
      finalBrandId = null; 
    }

    try {
      const url = editId ? `https://api.retailnode.in/api/items/${editId}` : 'https://api.retailnode.in/api/items';
      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.itemName,
          brand_id: finalBrandId,
          category_id: finalCategoryId,
          hsn_code: formData.hsnsacCode,
          tax_percent: parseFloat(formData.gstPercent) || 0,
        })
      });

      if (response.ok) {
        setFormData({});
        setEditId(null);
        setMode('list');
        fetchItems();
      } else {
        alert('Failed to save item: ' + await response.text());
      }
    } catch (err: any) {
      alert('Error saving item: ' + err.message);
    }
  };

  const handleFieldKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    }
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    const val = formData.categoryName || '';
    const filtered = categories.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 8);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCategorySuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCategorySuggestionIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (showCategoryDropdown && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[categorySuggestionIndex];
        setFormData({ 
          ...formData, 
          categoryName: selected.name,
          hsnsacCode: selected.hsn_code || formData.hsnsacCode,
          gstPercent: selected.tax_percent || formData.gstPercent
        });
        setShowCategoryDropdown(false);
        document.getElementById('input-brandName')?.focus();
        return;
      }
      e.preventDefault();
      setShowCategoryDropdown(false);
      document.getElementById('input-brandName')?.focus();
    }
  };

  const handleBrandKeyDown = (e: React.KeyboardEvent) => {
    const val = formData.brandName || '';
    const filtered = brands.filter(b => b.name.toLowerCase().includes(val.toLowerCase())).slice(0, 8);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setBrandSuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
      setShowBrandDropdown(true);
      return;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setBrandSuggestionIndex(prev => Math.max(prev - 1, 0));
      return;
    } else if (e.key === 'Escape') {
      setShowBrandDropdown(false);
      return;
    }

    if (e.key === 'Enter' || e.key === 'Tab') {
      if (showBrandDropdown && filtered.length > 0 && e.key === 'Enter') {
        e.preventDefault();
        setFormData({ ...formData, brandName: filtered[brandSuggestionIndex].name });
        setShowBrandDropdown(false);
        document.getElementById('input-hsnsacCode')?.focus();
        return;
      }

      if (val && !brands.find(b => b.name.toLowerCase() === val.toLowerCase())) {
        e.preventDefault();
        setMasterModal({ type: 'brand', initialValue: val, nextFocusId: 'input-hsnsacCode' });
        setShowBrandDropdown(false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        setShowBrandDropdown(false);
        document.getElementById('input-hsnsacCode')?.focus();
      }
    }
  };

  // sampleData replaced with actual state
  return (
    <>
      <Helmet>
        <title>Item Master | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        

        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation</div>
               <div className='text-yellow-300'>Item Master</div>
            </div>
            
            <div className='p-2 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='font-bold text-slate-800 text-[14px]'>List of Items</div>
                    <button 
                      onClick={() => { setMode('create'); }} 
                      className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                    >Create New (Alt/Opt+C)</button>
                  </div>
                  <table className='w-full text-left border-collapse border border-slate-400'>
                    <thead className='bg-[#eef5ed]'>
                      <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                        <th className="px-2 py-1 border-r border-slate-300">ID</th><th className="px-2 py-1 border-r border-slate-300">Item Name</th><th className="px-2 py-1 border-r border-slate-300">Brand</th><th className="px-2 py-1 border-r border-slate-300">Stock</th><th className="px-2 py-1 border-r border-slate-300">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row, idx) => (
                        <tr 
                          key={row.id} 
                          onClick={() => {
                            setFormData({
                              itemName: row.name,
                              brandName: brands.find(b => b.id === row.brand_id)?.name || '',
                              hsnsacCode: row.hsn_code || '',
                              gstPercent: row.tax_percent || ''
                            });
                            setEditId(row.id);
                            setMode('create');
                            setSelectedIndex(idx);
                          }}
                          className={`border-b border-slate-300 hover:bg-[#ffffe0] cursor-pointer ${idx === selectedIndex ? 'bg-[#ffe000]' : ''}`}
                        >
                          <td className="px-2 py-1 border-r border-slate-300 text-slate-800">{row.id}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-slate-800">{row.name}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-slate-800">{brands.find(b => b.id === row.brand_id)?.name || '-'}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-slate-800">{row.stock || '0'}</td>
                          <td className="px-2 py-1 border-r border-slate-300 text-slate-800">{row.status || 'Active'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Master Details */}
                    <div className="w-[40%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Master Information</SectionTitle>
                    <InputRow id="input-itemName" label="Item Name" value={formData.itemName} onChange={(v: string) => setFormData({...formData, itemName: v})} onKeyDown={(e: any) => handleFieldKeyDown(e, 'input-marathiName')} />
                    <InputRow id="input-marathiName" label="Marathi Name" value={formData.marathiName} onChange={(v: string) => setFormData({...formData, marathiName: v})} onKeyDown={(e: any) => handleFieldKeyDown(e, 'input-categoryName')} />
                    
                    <InputRow id="input-categoryName" label="Category" value={formData.categoryName} 
                      onChange={(v: string) => { setFormData({...formData, categoryName: v}); setCategorySuggestionIndex(0); setShowCategoryDropdown(true); }} 
                      onFocus={() => setShowCategoryDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                      onKeyDown={handleCategoryKeyDown}>
                      {showCategoryDropdown && categories.filter(c => c.name.toLowerCase().includes((formData.categoryName || '').toLowerCase())).length > 0 && (
                        <div className="absolute top-full left-[110px] right-[4px] mt-0 bg-white border-2 border-black z-50 shadow-md max-h-[150px] overflow-y-auto">
                          {categories.filter(c => c.name.toLowerCase().includes((formData.categoryName || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (
                            <div key={suggestion.id} className={`px-2 py-1 flex flex-col cursor-pointer ${sIdx === categorySuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} 
                              onClick={() => {
                                setFormData({ 
                                  ...formData, 
                                  categoryName: suggestion.name,
                                  hsnsacCode: suggestion.hsn_code || formData.hsnsacCode,
                                  gstPercent: suggestion.tax_percent || formData.gstPercent 
                                });
                                setShowCategoryDropdown(false);
                                document.getElementById('input-brandName')?.focus();
                              }}>
                              <span>{suggestion.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </InputRow>

                    <InputRow id="input-brandName" label="Brand Name" value={formData.brandName} 
                      onChange={(v: string) => { setFormData({...formData, brandName: v}); setBrandSuggestionIndex(0); setShowBrandDropdown(true); }} 
                      onFocus={() => setShowBrandDropdown(true)}
                      onBlur={() => setTimeout(() => setShowBrandDropdown(false), 200)}
                      onKeyDown={handleBrandKeyDown}>
                      {showBrandDropdown && brands.filter(b => b.name.toLowerCase().includes((formData.brandName || '').toLowerCase())).length > 0 && (
                        <div className="absolute top-full left-[110px] right-[4px] mt-0 bg-white border-2 border-black z-50 shadow-md max-h-[150px] overflow-y-auto">
                          {brands.filter(b => b.name.toLowerCase().includes((formData.brandName || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (
                            <div key={suggestion.id} className={`px-2 py-1 flex flex-col cursor-pointer ${sIdx === brandSuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} 
                              onClick={() => {
                                setFormData({ ...formData, brandName: suggestion.name });
                                setShowBrandDropdown(false);
                                document.getElementById('input-hsnsacCode')?.focus();
                              }}>
                              <span>{suggestion.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </InputRow>
                    <InputRow id="input-hsnsacCode" label="Hsnsac Code" value={formData.hsnsacCode} onChange={(v: string) => setFormData({...formData, hsnsacCode: v})} onKeyDown={(e: any) => handleFieldKeyDown(e, 'input-gstPercent')} />
                    <InputRow id="input-gstPercent" label="Gst Percent" value={formData.gstPercent} onChange={(v: string) => setFormData({...formData, gstPercent: v})} onKeyDown={(e: any) => handleFieldKeyDown(e, 'input-defaultUnitType')} />
                    <InputRow id="input-defaultUnitType" label="Default Unit Type" value={formData.defaultUnitType} onChange={(v: string) => setFormData({...formData, defaultUnitType: v})} />
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    <button 
                      onClick={() => {
                        setFormData({});
                        setEditId(null);
                      }}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => {
                        handleSaveItem();
                      }}
                      className='bg-[#1b5e58] border border-[#1b5e58] px-6 py-1 text-white font-bold hover:bg-[#144743] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] outline-none focus:bg-[#0f3632]'
                    >
                      Save (Ctrl+A)
                    </button>
                  </div>                </div>
              )}
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
               onClick={() => mode === 'create' ? setMode('list') : navigate('/dashboard')}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Item Master</div>
        </div>
      </div>
      
      <MasterCreationModal 
        isOpen={masterModal !== null}
        onClose={() => setMasterModal(null)}
        masterType={masterModal?.type || null}
        initialValue={masterModal?.initialValue || ''}
        onSave={(type, data) => {
          if (type === 'brand') {
            fetch('https://api.retailnode.in/api/masters/brand', {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            .then(res => res.json())
            .then(data => setBrands(Array.isArray(data) ? data : []))
            .catch(console.error);

            setFormData({ ...formData, brandName: data.name });
          }
          const nextFocus = masterModal?.nextFocusId;
          setMasterModal(null);
          if (nextFocus) {
            setTimeout(() => document.getElementById(nextFocus)?.focus(), 100);
          }
        }}
      />
    </>
  );
}
