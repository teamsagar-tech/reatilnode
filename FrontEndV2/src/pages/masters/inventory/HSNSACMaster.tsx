import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ id, label, value, onChange, width = 'flex-1', type = 'text', placeholder = '', onKeyDown }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
      {label}
    </div>
    <input 
      id={id}
      type={type} 
      className={`bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 ${width}`}
      value={value !== undefined && value !== null ? value : ''}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoComplete="off"
    />
  </div>
);

export default function HSNSACMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  const [formData, setFormData] = useState<any>({});
  const [data, setData] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const suggestionListRef = useRef<HTMLDivElement>(null);
  
  // Autofill debounce ref
  const autofillTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (focusedIndex >= 0 && suggestionListRef.current) {
      const activeEl = suggestionListRef.current.children[focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusedIndex]);

  const fetchData = useCallback(async (search = '') => {
    try {
      const url = search 
        ? `https://api.retailnode.in/api/masters/generic/hsnsacs?search=${encodeURIComponent(search)}`
        : `https://api.retailnode.in/api/masters/generic/hsnsacs`;
        
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (mode === 'list') {
      fetchData(searchQuery);
    }
  }, [mode, searchQuery, fetchData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          setMode('list');
          setEditId(null);
          setFormData({});
        } else {
          navigate(-1);
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {
        e.preventDefault();
        setEditId(null);
        setFormData({});
        setMode('create');
        setTimeout(() => {
          document.getElementById('name')?.focus();
        }, 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode]);

  const handleSave = async () => {
    if (!formData.name) return alert('HSN/SAC Code is required');
    try {
      const url = editId ? `https://api.retailnode.in/api/masters/generic/hsnsacs/${editId}` : 'https://api.retailnode.in/api/masters/generic/hsnsacs';
      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          tax_percent: formData.tax_percent,
          is_active: formData.is_active !== undefined ? formData.is_active : true
        })
      });
      if (res.ok) {
        alert(editId ? 'HSN Updated Successfully!' : 'HSN Saved Successfully!');
        setMode('list');
        setEditId(null);
        setFormData({});
        fetchData(searchQuery);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving HSN');
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditId(item.id);
    setMode('create');
    setTimeout(() => {
      document.getElementById('name')?.focus();
    }, 50);
  };
  
  // Auto-fill logic
  const handleNameChange = (val: string) => {
    setFormData(prev => ({ ...prev, name: val }));
    setFocusedIndex(-1);
    
    if (autofillTimeoutRef.current) {
      clearTimeout(autofillTimeoutRef.current);
    }
    
    // Only search if user types at least 2 chars
    if (val.length >= 2) {
      autofillTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`https://api.retailnode.in/api/gst/search-hsn-catalog?query=${encodeURIComponent(val)}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });
          if (res.ok) {
            const matches = await res.json();
            setSuggestions(matches);
            // If there's an exact match or closely starting match, auto-fill if description is currently empty
            const exactMatch = matches.find((m: any) => m.code === val);
            if (exactMatch) {
              setFormData((prev: any) => ({
                ...prev,
                description: prev.description ? prev.description : exactMatch.description,
                tax_percent: prev.tax_percent !== undefined && prev.tax_percent !== "" ? prev.tax_percent : exactMatch.tax_percent
              }));
            }
          }
        } catch (err) {
          console.error('Error auto-fetching HSN details', err);
        }
      }, 500); // 500ms debounce
    } else {
      setSuggestions([]);
      setFocusedIndex(-1);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
          const s = suggestions[focusedIndex];
          setFormData((prev: any) => ({
            ...prev,
            name: s.code,
            description: s.description,
            tax_percent: s.tax_percent
          }));
          setSuggestions([]);
          setFocusedIndex(-1);
        }
      } else if (e.key === 'Escape') {
        setSuggestions([]);
        setFocusedIndex(-1);
      }
    }
  };


  return (
    <>
      <Helmet>
        <title>HSNSAC Master | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation</div>
               <div className='text-yellow-300'>HSNSAC Master</div>
            </div>
            
            <div className='p-2 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='font-bold text-slate-800 text-[14px] flex items-center gap-4'>
                      List of HSNSACs
                      <input 
                        type="text" 
                        placeholder="Search HSN/SAC Code..." 
                        className="bg-white border border-slate-400 px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={() => { setMode('create'); setFormData({}); setEditId(null); }} 
                      className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                    >Create New (Alt/Opt+C)</button>
                  </div>
                  
                  <div className="overflow-y-auto flex-1 border border-slate-400">
                    <table className='w-full text-left border-collapse'>
                      <thead className='bg-[#eef5ed] sticky top-0 shadow-sm'>
                        <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                          <th className="px-2 py-1 border-r border-slate-300 w-16">ID</th>
                          <th className="px-2 py-1 border-r border-slate-300 w-32">HSN/SAC Code</th>
                          <th className="px-2 py-1 border-r border-slate-300 w-32">Tax %</th>
                          <th className="px-2 py-1 border-r border-slate-300">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, idx) => (
                          <tr key={row.id} onClick={() => handleEdit(row)} className={'text-[12px] border-b border-slate-300 ' + (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]') + ' hover:bg-[#ffffe0] cursor-pointer'}>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.id}</td>
                            <td className="px-2 py-1 border-r border-slate-300 font-bold text-[#1b5e58]">{row.name}</td>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.tax_percent !== null ? `${row.tax_percent}%` : '-'}</td>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700 truncate max-w-lg">{row.description || '-'}</td>
                          </tr>
                        ))}
                        {data.length === 0 && (
                          <tr><td colSpan={4} className="px-2 py-4 text-center text-slate-500 italic">No HSN codes saved in your master yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    <div className="w-[40%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>HSNSAC Information</SectionTitle>
                      <div className="relative">
                        <InputRow id="name" label="HSN/SAC Code" value={formData.name} onChange={handleNameChange} onKeyDown={handleNameKeyDown} />
                        {suggestions.length > 0 && (
                          <div ref={suggestionListRef} className="absolute left-[118px] top-[100%] z-50 w-[calc(100%-118px)] bg-white border border-slate-400 shadow-lg max-h-48 overflow-y-auto">
                            {suggestions.map((s, idx) => (
                              <div 
                                key={idx} 
                                className={`px-2 py-1 text-[11px] cursor-pointer border-b border-slate-200 ${focusedIndex === idx ? 'bg-[#ffffe0]' : 'hover:bg-[#ffffe0]'}`}
                                onClick={() => {
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    name: s.code,
                                    description: s.description,
                                    tax_percent: s.tax_percent
                                  }));
                                  setSuggestions([]);
                                  setFocusedIndex(-1);
                                }}
                              >
                                <span className="font-bold text-[#1b5e58]">{s.code}</span> - {s.description} ({s.tax_percent}%)
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <InputRow id="tax_percent" label="Tax Percent (%)" type="number" value={formData.tax_percent} onChange={(v: string) => setFormData({...formData, tax_percent: v})} />
                      <InputRow id="description" label="Description" value={formData.description} onChange={(v: string) => setFormData({...formData, description: v})} />
                    </div>
                  </div>
                  
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    <button 
                      onClick={() => setFormData({})}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleSave}
                      className='bg-[#1b5e58] border border-[#1b5e58] px-6 py-1 text-white font-bold hover:bg-[#144743] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] outline-none focus:bg-[#0f3632]'
                    >
                      {editId ? 'Update (Ctrl+A)' : 'Save (Ctrl+A)'}
                    </button>
                  </div>
                </div>
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
               onClick={() => mode === 'create' ? setMode('list') : navigate(-1)}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>HSNSAC Master</div>
        </div>
      </div>
    </>
  );
}
