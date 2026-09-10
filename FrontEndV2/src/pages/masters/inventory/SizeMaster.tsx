import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useGlobalKeyboard } from '../../../hooks/useGlobalKeyboard';
import { useToastStore } from '../../../store/useToastStore';
import SearchableDropdown from '../../../components/SearchableDropdown';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ label, value, onChange, onKeyDown, width = 'flex-1', type = 'text', placeholder = '', id = '' }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
      {label}
    </div>
    <input 
      id={id}
      type={type} 
      className={`bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 ${width}`}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      autoComplete="off"
    />
  </div>
);

const SelectRow = ({ label, value, onChange, onKeyDown, options, width = 'flex-1', id = '' }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
      {label}
    </div>
    <div className={`flex ${width}`}>
      <SearchableDropdown
        id={id}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        options={options}
        placeholder="Select..."
        className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
        width="100%"
      />
    </div>
  </div>
);

export default function SizeMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<any>({ name: '', description: '', size_group: '' });
  
  // Modals
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Data
  const [sizeGroups, setSizeGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Size Groups for the List View
  const fetchSizeGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSizeGroups(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching size groups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizeGroups();
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent interference if a modal is open
      if (showResetConfirm || showDeleteConfirm) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          setMode('list');
        } else {
          navigate('/dashboard');
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {
        e.preventDefault();
        setMode('create');
        setFormData({ name: '', description: '', size_group: '' });
        setTimeout(() => {
          document.getElementById('field-scale')?.focus();
        }, 50);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, formData, showResetConfirm, showDeleteConfirm]);

  const handleFieldKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      } else {
        document.getElementById('save-btn')?.focus();
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      useToastStore.getState().addToast('error', 'Size Name is required');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        useToastStore.getState().addToast('success', 'Size Master Saved Successfully!');
        setMode('list');
        // If we needed to refetch individual sizes, we'd do it here.
      } else {
        useToastStore.getState().addToast('error', 'Failed to save size');
      }
    } catch (err) {
      console.error(err);
      useToastStore.getState().addToast('error', 'Failed to save size');
    }
  };

  // Parse arrays safely
  const parseSizes = (sizesList: any) => {
    if (Array.isArray(sizesList)) return sizesList;
    if (typeof sizesList === 'string') {
      try {
        return JSON.parse(sizesList);
      } catch {
        return sizesList.split(',').map(s => s.trim()).filter(s => s !== '');
      }
    }
    return [];
  };

  // Group sorting for the beautiful UI
  const primaryScales = ['inch', 'size', 'cm', 'number'];
  const primaryGroups = sizeGroups.filter(g => primaryScales.includes((g.name || '').toLowerCase()));
  const otherGroups = sizeGroups.filter(g => !primaryScales.includes((g.name || '').toLowerCase()));

  const groupedOtherSets = otherGroups.reduce((acc: any, set: any) => {
    const scale = set.size_scale || 'Uncategorized';
    if (!acc[scale]) acc[scale] = [];
    acc[scale].push(set);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Size Master | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation</div>
               <div className='text-yellow-300'>Size Master</div>
            </div>
            
            <div className='p-3 flex-1 overflow-y-auto flex flex-col custom-scrollbar'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-4'>
                    <div className='font-bold text-slate-800 text-[14px] uppercase tracking-wider border-b-2 border-slate-300 pb-1 flex-1'>List of Sizes</div>
                    <button 
                      onClick={() => { setMode('create'); }} 
                      className='ml-4 bg-[#eef5ed] border border-[#a3c3be] px-3 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px] flex-shrink-0'
                    >
                      Create New (Alt/Opt+C)
                    </button>
                  </div>
                  
                  {/* The Primary Scales (INCH, SIZE, CM) Display Block */}
                  <div className="flex flex-col gap-4 mb-8">
                    {loading ? (
                      <div className="text-slate-500 font-bold p-4">Loading sizes...</div>
                    ) : primaryGroups.length > 0 ? (
                      primaryGroups.map(group => {
                        const sizesArr = parseSizes(group.sizes_list);
                        return (
                          <div key={group.id} className="flex items-start gap-4">
                            {/* Group Name Badge */}
                            <div className="w-[80px] bg-[#e6f3eb] border border-[#a3c3be] rounded flex items-center justify-center py-1.5 shadow-sm shrink-0">
                              <span className="text-[#1b5e58] font-black text-[11px] uppercase tracking-wider">{group.name}</span>
                            </div>
                            {/* Sizes Badges */}
                            <div className="flex flex-wrap gap-2 flex-1">
                              {sizesArr.map((sz: string, idx: number) => (
                                <div key={idx} className="bg-white border border-slate-300 rounded px-2.5 py-1 min-w-[36px] flex justify-center shadow-sm">
                                  <span className="text-slate-800 font-bold text-[11px]">{sz}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-slate-500 font-medium italic p-2">No primary scales (INCH, SIZE, CM) found.</div>
                    )}
                  </div>
                  
                  {/* The Sets Section */}
                  <div className='flex justify-between items-center mb-2 mt-4'>
                    <div className='font-bold text-slate-800 text-[14px]'>List of Size Sets</div>
                    <button 
                      onClick={() => navigate('/masters/sizeset')} 
                      className='bg-white border border-emerald-600 px-3 py-1 font-bold text-emerald-800 hover:bg-emerald-50 focus:bg-emerald-50 outline-none text-[12px] rounded-sm'
                    >
                      Manage Size Sets
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {Object.keys(groupedOtherSets).length > 0 ? (
                      Object.entries(groupedOtherSets).map(([scale, sets]: any) => (
                        <div key={scale} className="border border-[#a3c3be] bg-white shadow-sm rounded-sm overflow-hidden w-full">
                          <table className='w-full text-left border-collapse'>
                            <thead className='bg-[#1b5e58]'>
                              <tr>
                                <th colSpan={2} className="px-2 py-1.5 text-white font-bold text-[11px] uppercase tracking-wider">
                                  SCALE: {scale}
                                </th>
                              </tr>
                              <tr className='bg-[#eef5ed] border-b border-[#a3c3be] text-[#1b5e58] font-bold text-[11px]'>
                                <th className="px-2 py-1.5 border-r border-[#a3c3be] w-[150px]">Group Name</th>
                                <th className="px-2 py-1.5">Sizes in Set</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sets.map((group: any, idx: number) => {
                                const sizesArr = parseSizes(group.sizes_list);
                                return (
                                  <tr key={group.id} className={'text-[12px] border-b border-slate-200 ' + (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]') + ' hover:bg-[#ffffe0]'}>
                                    <td className="px-2 py-1.5 border-r border-slate-200 font-bold text-slate-800">{group.name}</td>
                                    <td className="px-2 py-1.5 font-medium text-slate-600">{sizesArr.join(', ')}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic p-2">No additional size sets found.</div>
                    )}
                  </div>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    {/* Column 1: Master Details */}
                    <div className="w-[40%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Size Information</SectionTitle>
                      <SelectRow 
                        id="field-scale" 
                        label="Size Scale" 
                        value={formData.size_group} 
                        onChange={(v: string) => setFormData({...formData, size_group: v})} 
                        onKeyDown={(e: any) => handleFieldKeyDown(e, 'field-0')}
                        options={['CM', 'Inch', 'Size', 'Number', 'Other']}
                      />
                      <InputRow 
                        id="field-0" 
                        label="Size Code / Name" 
                        value={formData.name} 
                        onChange={(v: string) => setFormData({...formData, name: v})} 
                        onKeyDown={(e: any) => handleFieldKeyDown(e, 'field-1')}
                        placeholder="e.g. 32B or XS"
                      />
                      <InputRow 
                        id="field-1" 
                        label="Description (Opt)" 
                        value={formData.description} 
                        onChange={(v: string) => setFormData({...formData, description: v})} 
                        onKeyDown={(e: any) => handleFieldKeyDown(e, 'save-btn')}
                      />
                      
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 font-medium">
                        <strong>Note:</strong> Individual sizes created here will not automatically appear in the scales (INCH, CM) unless they are added to a Size Set. Click "Manage Size Sets" on the previous screen to group your sizes.
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    <button 
                      onClick={() => setShowResetConfirm(true)}
                      tabIndex={-1}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'
                    >
                      Reset
                    </button>
                    <button 
                      id="save-btn"
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
          <div className='font-medium tracking-wide'>Size Master</div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset Form?"
        message="Are you sure you want to clear all data? This cannot be undone."
        type="warning"
        onConfirm={() => {
          setFormData({ name: '', description: '', size_group: '' });
          setShowResetConfirm(false);
          setTimeout(() => document.getElementById('field-scale')?.focus(), 50);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </>
  );
}
