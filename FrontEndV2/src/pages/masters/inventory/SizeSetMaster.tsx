import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import SearchableDropdown from '../../../components/SearchableDropdown';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ label, value, onChange, width = 'flex-1', type = 'text', placeholder = '' }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
      {label}
    </div>
    <input 
      type={type} 
      className={`bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 ${width}`}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const SelectRow = ({ label, value, onChange, options, width = 'flex-1', autoFocus = false }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
      {label}
    </div>
    <div className={`flex ${width}`}>
      <SearchableDropdown
        value={value || ''}
        onChange={onChange}
        options={options}
        placeholder="Select..."
        className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
        width="100%"
        autoFocus={autoFocus}
      />
    </div>
  </div>
);

export default function SizeSetMaster() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode || 'list'); // 'list' or 'create'
  
  const getInitialFormData = () => {
    if (location.state?.editData) {
      const data = location.state.editData;
      return {
        id: data.id,
        name: data.name || '',
        size_scale: data.size_scale || '',
        sizes_list: typeof data.sizes_list === 'string' ? JSON.parse(data.sizes_list) : (data.sizes_list || [])
      };
    }
    return { sizes_list: [] };
  };

  const [formData, setFormData] = useState<any>(getInitialFormData());
  const [sizeSets, setSizeSets] = useState<any[]>([]);
  const [allSizes, setAllSizes] = useState<any[]>([]);

  const fetchSizeSets = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSizeSets(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch size sets', err);
    }
  };

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

  useEffect(() => {
    fetchSizeSets();
    fetchAllSizes();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          // If we came directly to create mode from another page (e.g. Size Master), go back instead of showing list
          if (location.state?.mode === 'create') {
            navigate(-1);
          } else {
            setMode('list');
          }
        } else {
          navigate('/dashboard');
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC' || e.key === 'ç') && mode === 'list') {
        e.preventDefault();
        setMode('create');
        setFormData({ sizes_list: [] });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode]);

  const handleSave = async () => {
    if (!formData.name) {
      alert('Set Name is required');
      return;
    }
    try {
      const url = formData.id 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets/${formData.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets`;
      
      const res = await fetch(url, {
        method: formData.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: formData.name,
          size_scale: formData.size_scale || '',
          sizes_list: formData.sizes_list || []
        })
      });
      if (res.ok) {
        alert('Saved Successfully!');
        setFormData({ size_scale: formData.size_scale, sizes_list: [] });
        fetchSizeSets();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save size set');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    if (!window.confirm('Are you sure you want to delete this size set?')) return;
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets/${formData.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        alert('Deleted Successfully!');
        setFormData({ sizes_list: [] });
        if (location.state?.mode === 'create') {
          navigate(-1);
        } else {
          setMode('list');
          fetchSizeSets();
        }
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete size set');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    }
  };

  const toggleSizeSelection = (sizeName: string, sizeGroup: string) => {
    const currentList = formData.sizes_list || [];
    let newList = [];
    if (currentList.includes(sizeName)) {
      newList = currentList.filter((s: string) => s !== sizeName);
    } else {
      newList = [...currentList, sizeName];
    }
    
    const sortedList = newList.sort((a: string, b: string) => {
       const idxA = allSizes.findIndex(s => s.name === a);
       const idxB = allSizes.findIndex(s => s.name === b);
       return idxA - idxB;
    });

    let autoName = formData.name;
    let autoScale = formData.size_scale;

    if (sortedList.length > 0) {
       const allMatchGroup = sortedList.every((sn: string) => {
           const sizeObj = allSizes.find(s => s.name === sn);
           return sizeObj && (sizeObj.size_group || 'Uncategorized') === sizeGroup;
       });

       if (allMatchGroup) {
           let scaleMap: Record<string, string> = {
               'inch': 'Inch',
               'size': 'Size',
               'cm': 'CM',
               'number': 'Number'
           };
           autoScale = scaleMap[sizeGroup.toLowerCase()] || 'Other';
       }

       if (sortedList.length === 1) {
           autoName = sortedList[0];
       } else {
           // Check if the selection is contiguous
           let isContiguous = true;
           for (let i = 0; i < sortedList.length - 1; i++) {
               const idxCurrent = allSizes.findIndex(s => s.name === sortedList[i]);
               const idxNext = allSizes.findIndex(s => s.name === sortedList[i+1]);
               if (idxNext - idxCurrent !== 1) {
                   isContiguous = false;
                   break;
               }
           }
           
           if (isContiguous) {
               autoName = `${sortedList[0]}-${sortedList[sortedList.length - 1]}`;
           } else {
               autoName = sortedList.join(', ');
           }
       }
    } else {
       autoName = '';
       autoScale = '';
    }

    setFormData({ ...formData, sizes_list: sortedList, name: autoName, size_scale: autoScale });
  };

  const handleNameChange = (v: string) => {
    let newSizesList = formData.sizes_list || [];
    let newScale = formData.size_scale;

    if (v.includes('-')) {
      const parts = v.split('-');
      if (parts.length === 2) {
        const startStr = parts[0].trim();
        const endStr = parts[1].trim();

        if (startStr && endStr) {
          const targetGroup = newScale || null;

          const searchSizes = targetGroup 
              ? allSizes.filter(s => (s.size_group || 'Uncategorized').toLowerCase() === targetGroup.toLowerCase())
              : allSizes;

          const startIdx = searchSizes.findIndex(s => s.name.toLowerCase() === startStr.toLowerCase());
          const endIdx = searchSizes.findIndex(s => s.name.toLowerCase() === endStr.toLowerCase());

          if (startIdx !== -1 && endIdx !== -1) {
            const minIdx = Math.min(startIdx, endIdx);
            const maxIdx = Math.max(startIdx, endIdx);

            const startGroup = searchSizes[startIdx].size_group || 'Uncategorized';
            const endGroup = searchSizes[endIdx].size_group || 'Uncategorized';
            
            if (startGroup === endGroup) {
               const rangeSizes = searchSizes.slice(minIdx, maxIdx + 1).map(s => s.name);
               newSizesList = rangeSizes;

               let scaleMap: Record<string, string> = {
                   'inch': 'Inch',
                   'size': 'Size',
                   'cm': 'CM',
                   'number': 'Number'
               };
               newScale = scaleMap[startGroup.toLowerCase()] || 'Other';
            }
          }
        }
      }
    } else if (v.includes('/')) {
      const parts = v.split('/').map(p => p.trim()).filter(Boolean);
      if (parts.length > 0) {
        const targetGroup = newScale || null;
        const searchSizes = targetGroup 
            ? allSizes.filter(s => (s.size_group || 'Uncategorized').toLowerCase() === targetGroup.toLowerCase())
            : allSizes;

        let validSizes: string[] = [];
        let commonGroup: string | null = null;
        let allValid = true;

        for (const p of parts) {
          const sizeObj = searchSizes.find(s => s.name.toLowerCase() === p.toLowerCase());
          if (sizeObj) {
            validSizes.push(sizeObj.name);
            if (!commonGroup) commonGroup = sizeObj.size_group || 'Uncategorized';
            else if (commonGroup !== (sizeObj.size_group || 'Uncategorized')) {
              allValid = false;
            }
          } else {
            allValid = false;
          }
        }

        if (allValid && validSizes.length === parts.length && validSizes.length > 0) {
          newSizesList = validSizes;
          let scaleMap: Record<string, string> = {
              'inch': 'Inch',
              'size': 'Size',
              'cm': 'CM',
              'number': 'Number'
          };
          newScale = scaleMap[commonGroup?.toLowerCase() || ''] || 'Other';
        }
      }
    }

    setFormData({ ...formData, name: v, sizes_list: newSizesList, size_scale: newScale });
  };

  // Group size sets for display
  const groupedSets = sizeSets.reduce((acc: any, set: any) => {
    const group = set.size_scale || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(set);
    return acc;
  }, {});

  // Group all sizes for selection UI
  const groupedAllSizes = allSizes.reduce((acc: any, size: any) => {
    const group = size.size_group || 'Uncategorized';
    if (!acc[group]) acc[group] = [];
    acc[group].push(size);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Size Sets Master | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation</div>
               <div className='text-yellow-300'>Size Sets Master</div>
            </div>
            
            <div className='p-2 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='font-bold text-slate-800 text-[14px]'>List of Size Sets</div>
                    <button 
                      onClick={() => { setMode("create"); setFormData({}); }} 
                      className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                    >Create New (Alt/Opt+C)</button>
                  </div>

                  <div className="flex-1 overflow-y-auto bg-white p-4 custom-scrollbar border border-slate-400">
                    {Object.keys(groupedSets).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {Object.entries(groupedSets).map(([scale, sets]: any) => (
                          <div key={scale} className="border border-[#a3c3be] rounded overflow-hidden shadow-sm w-full">
                            <div className="font-bold text-white text-[13px] uppercase tracking-wider bg-[#1b5e58] px-3 py-1">
                              Scale: {scale}
                            </div>
                            <div className="p-3 bg-[#fcfaf2]">
                            <table className="w-full text-left border-collapse bg-white border border-slate-300">
                              <thead className="bg-[#eef5ed]">
                                <tr className="border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]">
                                  <th className="px-3 py-2 border-r border-slate-300 w-[150px]">Group Name</th>
                                  <th className="px-3 py-2 border-r border-slate-300">Sizes in Set</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sets.map((set: any) => {
                                  const sizesArr = typeof set.sizes_list === 'string' ? JSON.parse(set.sizes_list) : (set.sizes_list || []);
                                  return (
                                    <tr 
                                      key={set.id} 
                                      className="border-b border-slate-300 hover:bg-[#ffffe0] cursor-pointer outline-none focus:bg-[#ffffe0]"
                                      tabIndex={0}
                                      onDoubleClick={() => {
                                        setFormData({
                                          id: set.id,
                                          name: set.name,
                                          size_scale: set.size_scale,
                                          sizes_list: sizesArr
                                        });
                                        setMode('create');
                                      }}
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                          setFormData({
                                            id: set.id,
                                            name: set.name,
                                            size_scale: set.size_scale,
                                            sizes_list: sizesArr
                                          });
                                          setMode('create');
                                        }
                                      }}
                                    >
                                      <td className="px-3 py-2 border-r border-slate-300 font-bold text-slate-800">{set.name}</td>
                                      <td className="px-3 py-2 text-slate-600 font-medium break-words">
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
                      <div className="text-center py-4 text-slate-500">No size sets found</div>
                    )}
                  </div>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Master Details */}
                    <div className="w-[30%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Set Information</SectionTitle>
                      <SelectRow autoFocus={true} label="Size Scale" value={formData.size_scale} onChange={(v: string) => setFormData({...formData, size_scale: v})} options={['Inch', 'Size', 'CM', 'Number', 'Other']} />
                      <InputRow label="Group/Set Name" value={formData.name} onChange={handleNameChange} placeholder="e.g. 1-16" />
                    </div>

                    {/* Column 2: Size Selection */}
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar pr-2">
                      <SectionTitle>Select Sizes for this Set</SectionTitle>
                      <div className="bg-white border border-slate-300 p-4 rounded shadow-inner flex-1 overflow-y-auto">
                        {Object.keys(groupedAllSizes).length > 0 ? (
                          Object.entries(groupedAllSizes).filter(([groupName]) => {
                             if (!formData.size_scale) return true;
                             return groupName.toLowerCase() === formData.size_scale.toLowerCase();
                          }).map(([groupName, groupSizes]: any) => (
                            <div key={groupName} className="mb-4">
                              <div className="font-bold text-[#1b5e58] text-[12px] border-b border-slate-300 mb-2 pb-1 uppercase">
                                {groupName}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {groupSizes.map((size: any) => {
                                  const isSelected = (formData.sizes_list || []).includes(size.name);
                                  return (
                                    <div 
                                      key={size.id} 
                                      onClick={() => toggleSizeSelection(size.name, groupName)}
                                      className={`px-3 py-1 font-bold text-[12px] rounded border cursor-pointer transition-colors shadow-sm select-none
                                        ${isSelected 
                                          ? 'bg-[#1b5e58] text-white border-[#12423d]' 
                                          : 'bg-[#fcfaf2] text-slate-700 border-slate-300 hover:bg-[#eef5ed] hover:border-[#1b5e58]'}`}
                                    >
                                      {size.name}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-500">No sizes available. Create them in Size Master first.</div>
                        )}
                      </div>
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    {formData.id && (
                      <button 
                        onClick={handleDelete}
                        tabIndex={-1}
                        className='bg-red-500 border border-red-600 px-6 py-1 text-white font-bold hover:bg-red-600 shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] outline-none focus:bg-red-700 mr-auto'
                      >
                        Delete
                      </button>
                    )}
                      <button 
                        onClick={() => setShowResetConfirm(true)}
                        tabIndex={-1}
                        className='bg-[#fcfaf2] border border-[#a3c3be] px-6 py-1 text-black font-bold hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                      >
                        Reset
                      </button>
                    <button 
                      onClick={handleSave}
                      className='bg-[#1b5e58] border border-[#1b5e58] px-6 py-1 text-white font-bold hover:bg-[#144743] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] outline-none focus:bg-[#0f3632]'
                    >
                      Save (Ctrl+A)
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
          <div className='font-medium tracking-wide'>Size Sets Master</div>
        </div>
      
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Form?"
        message="Are you sure you want to clear all data? This cannot be undone."
        type="warning"
        onConfirm={() => {
          const resetFn = () => {
                          if (window.confirm('Are you sure you want to reset?')) {
                            setFormData({ sizes_list: [] });
                          }
                        };
          resetFn();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
      </div>
    </>
  );
}
