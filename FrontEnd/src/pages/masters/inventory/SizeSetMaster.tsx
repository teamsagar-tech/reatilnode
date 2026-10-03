import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { useMasterApi } from '../../../hooks/useMasterApi';

export default function SizeSetMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<any>({ sizes_list: [] });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: sampleData, fetchList, saveRecord } = useMasterApi('masters/generic/sizesets');
  
  const [allSizes, setAllSizes] = useState<any[]>([]);

  useEffect(() => { 
    fetchList(searchQuery); 
  }, [fetchList, searchQuery]);

  useEffect(() => {
    const fetchAllSizes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          const sortedData = Array.isArray(data) ? [...data].sort((a: any, b: any) => {
              const groupA = a.size_group || 'Uncategorized';
              const groupB = b.size_group || 'Uncategorized';
              if (groupA !== groupB) return groupA.localeCompare(groupB);
              
              const standardSizes = ['ES', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];
              const idxA = standardSizes.indexOf(a.name.toUpperCase());
              const idxB = standardSizes.indexOf(b.name.toUpperCase());
              if (idxA !== -1 && idxB !== -1) return idxA - idxB;
              if (idxA !== -1) return -1;
              if (idxB !== -1) return 1;
              return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
          }) : [];
          setAllSizes(sortedData);
        }
      } catch (err) {
        console.error('Failed to fetch sizes', err);
      }
    };
    fetchAllSizes();
  }, []);

  // Auto-focus on mode change
  useEffect(() => {
    if (mode === 'create') {
      setTimeout(() => {
        const firstInput = (document.querySelector('input[autofocus]') || document.getElementById('field-0') || document.querySelector('input[type="text"]')) as any;
        if (firstInput && typeof firstInput.focus === 'function') {
          firstInput.focus();
        }
      }, 50);
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') setMode('list');
        else navigate('/dashboard');
      } else if (mode === 'list' && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(s => Math.min(s + 1, (sampleData?.length || 1) - 1));
      } else if (mode === 'list' && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(s => Math.max(s - 1, 0));
      } else if (mode === 'list' && e.key === 'Enter') {
        e.preventDefault();
        if (sampleData && sampleData[selectedIndex]) {
          const row = sampleData[selectedIndex];
          setFormData({
            ...row,
            sizes_list: typeof row.sizes_list === 'string' ? JSON.parse(row.sizes_list) : (row.sizes_list || [])
          });
          setMode('create');
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {
        e.preventDefault();
        setMode('create');
        setFormData({ sizes_list: [] });
        setTimeout(() => {
          const firstInput = document.querySelector('input[type="text"]') as HTMLElement;
          if (firstInput) firstInput.focus();
        }, 50);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        saveRecord(formData).then(r => { if(r.success) { setFormData({ sizes_list: [] }); setMode('list'); } });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, sampleData, selectedIndex, formData, saveRecord]);

  const toggleSizeSelection = (sizeName: string, groupName: string) => {
    setFormData((prev: any) => {
      const currentList = prev.sizes_list || [];
      const isSelected = currentList.includes(sizeName);
      const newList = isSelected 
        ? currentList.filter((s: string) => s !== sizeName)
        : [...currentList, sizeName];
      return { ...prev, sizes_list: newList };
    });
  };

  const InputGroup = ({ label, id, value, onChange, width = 'w-full', type = 'text', placeholder = '', autoFocus = false }: any) => (
    <div className="flex flex-col gap-[2px] mb-2.5 group">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <input 
        id={id}
        autoFocus={autoFocus}
        type={type} 
        className={`bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all hover:border-slate-300 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  const SelectGroup = ({ label, id, value, onChange, options, width = 'w-full' }: any) => (
    <div className="flex flex-col gap-[2px] mb-2.5 group">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <select 
        id={id}
        className={`bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all hover:border-slate-300 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );

  const groupedAllSizes = allSizes.reduce((acc: any, size: any) => {
    const group = size.size_group || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(size);
    return acc;
  }, {});

  const groupedSets = sampleData.reduce((acc: any, set: any) => {
    const group = set.size_scale || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(set);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Size Sets Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-64px)] font-sans selection:bg-indigo-100 w-full bg-slate-50 sm:px-4'>
        <div className='flex flex-1 overflow-hidden pt-4'>
          <div className='flex-1 bg-white border-none flex flex-col overflow-hidden'>
            <div className='flex-1 overflow-y-auto flex flex-col flex flex-col'>
            
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-end gap-2 shrink-0">
                  <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">{mode === 'list' ? 'Size Sets' : 'New Size Set'}</h1>
                  <span className="text-slate-300 font-light mb-1">|</span>
                  <p className="text-[10px] font-bold text-slate-500 mb-0.5">Configuration Master</p>
                </div>
                
                {mode === 'list' && (
                  <div className='flex items-center gap-4 flex-1 justify-end'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" placeholder="Search Size Sets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-300 rounded text-[11px] font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button onClick={() => { setMode('create'); setFormData({ sizes_list: [] }); }} className='shrink-0 bg-indigo-600 px-2 py-1 rounded bg-indigo-600 font-bold text-white shadow-none hover:bg-indigo-700 transition-all text-xs'>
                      Create New (Alt+C)
                    </button>
                  </div>
                )}
              </div>
              
              {mode === 'list' ? (
                <>
                  <div className="overflow-y-auto custom-scrollbar flex-1">
                    {Object.keys(groupedSets).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {Object.entries(groupedSets).map(([scale, sets]: any) => (
                          <div key={scale} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
                            <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider bg-slate-50 px-4 py-2 border-b border-slate-200">
                              Scale: {scale}
                            </div>
                            <div className="p-0">
                              <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50">
                                  <tr className="border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                                    <th className="px-4 py-2 w-[40%]">Group Name</th>
                                    <th className="px-4 py-2">Sizes in Set</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {sets.map((set: any) => {
                                    const sizesArr = typeof set.sizes_list === 'string' ? JSON.parse(set.sizes_list) : (set.sizes_list || []);
                                    return (
                                      <tr 
                                        key={set.id} 
                                        className="hover:bg-indigo-50/30 cursor-pointer transition-colors"
                                        onDoubleClick={() => {
                                          setFormData({
                                            ...set,
                                            sizes_list: sizesArr
                                          });
                                          setMode('create');
                                        }}
                                      >
                                        <td className="px-4 py-2.5 font-bold text-slate-800 text-xs">{set.name}</td>
                                        <td className="px-4 py-2.5 text-slate-600 font-semibold text-[11px] break-words">
                                          {Array.isArray(sizesArr) ? sizesArr.join(', ') : '-'}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 font-medium">No size sets found. Create one to get started!</div>
                    )}
                  </div>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-8 overflow-hidden'>
                    <div className="w-[30%] flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">
                      <div className="font-bold text-indigo-800 text-[12px] border-b border-indigo-100 mb-4 pb-2 uppercase tracking-wider">Set Information</div>
                      
                      <SelectGroup label="Size Scale" id="input-scale" value={formData.size_scale} onChange={(v: string) => setFormData({...formData, size_scale: v})} options={['Inch', 'Size', 'CM', 'Number', 'Other']} />
                      <InputGroup autoFocus={true} label="Group/Set Name" id="input-name" placeholder="e.g. 1-16" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                    </div>
                    
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto px-2 pb-2 custom-scrollbar pr-2">
                      <div className="font-bold text-indigo-800 text-[12px] border-b border-indigo-100 mb-4 pb-2 uppercase tracking-wider">Select Sizes for this Set</div>
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl shadow-inner flex-1 overflow-y-auto custom-scrollbar">
                        {Object.keys(groupedAllSizes).length > 0 ? (
                          Object.entries(groupedAllSizes).filter(([groupName]) => {
                             if (!formData.size_scale) return true;
                             return groupName.toLowerCase() === formData.size_scale.toLowerCase();
                          }).map(([groupName, groupSizes]: any) => (
                            <div key={groupName} className="mb-6 last:mb-0">
                              <div className="font-bold text-slate-500 text-[11px] border-b border-slate-200 mb-3 pb-1 uppercase tracking-widest">
                                {groupName}
                              </div>
                              <div className="flex flex-wrap gap-2.5">
                                {groupSizes.map((size: any) => {
                                  const isSelected = (formData.sizes_list || []).includes(size.name);
                                  return (
                                    <div 
                                      key={size.id} 
                                      onClick={() => toggleSizeSelection(size.name, groupName)}
                                      className={`px-3 py-1.5 font-bold text-[12px] rounded-lg border cursor-pointer transition-all shadow-sm select-none
                                        ${isSelected 
                                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-indigo-200 hover:bg-indigo-700' 
                                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'}`}
                                    >
                                      {size.name}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500 text-sm font-medium">No sizes available. Create them in Size Master first.</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>
                    <button onClick={() => setFormData({ sizes_list: [] })} tabIndex={ -1 } className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'>
                      Reset
                    </button>
                    <button onClick={async () => { const res = await saveRecord(formData); if(res.success) { setFormData({ sizes_list: [] }); setMode('list'); } }} className='bg-indigo-600 border border-indigo-600 px-8 py-2 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 text-xs'>
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
