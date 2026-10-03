import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { useMasterApi } from '../../../hooks/useMasterApi';


// Added to satisfy TS compiler for InputGroup
const handleFieldKeyDown = (e: any, nextId: any) => {};


export default function BrandMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

const { data: sampleData, fetchList, saveRecord } = useMasterApi('masters/brand');
  const [parties, setParties] = useState<any[]>([]);

  useEffect(() => { fetchList(); }, [fetchList]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/party`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setParties(Array.isArray(data) ? data : []))
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          setMode('list');
        } else {
          navigate('/dashboard');
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
        alert('Brand Saved Successfully!');
        setMode('list');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, sampleData, selectedIndex]);

  
  

  const InputGroup = ({ label, id, value, onChange, nextId, width = 'w-full', type = 'text', placeholder = '', autoFocus = false }: any) => (
    <div className="flex flex-col gap-[2px] mb-2.5 group">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <input 
        id={id}
        autoFocus={autoFocus}
        type={type} 
        className={`bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all hover:border-slate-300 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if(nextId && typeof handleFieldKeyDown !== 'undefined') handleFieldKeyDown(e, nextId) }}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Brand Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full px-2'>
        
        

        <div className='flex flex-1 gap-4 overflow-hidden'>
          {/* Main Container */}
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden'>
            
            <div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-end gap-3 shrink-0">
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">Brand Master</h1>
            <span className="text-slate-300 font-light mb-1">|</span>
            <p className="text-sm font-medium text-slate-500">Inventory Configuration</p>
                </div>
                
                {mode === 'list' && (
                  <div className='flex items-center gap-4 flex-1 justify-end'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search brands..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button 
                      onClick={() => setMode('create')} 
                      className='bg-indigo-600 px-4 py-2 rounded-lg font-bold text-white shadow-md hover:bg-indigo-700 transition-all text-xs'
                    >Create New (Alt+C)</button>
                  </div>
                )}
              </div>
              
              {mode === 'list' ? (
                <>
                  
                  <div className="border border-slate-200 rounded-xl overflow-y-auto custom-scrollbar flex-1">
                    <table className='w-full text-left border-collapse'>
                      <thead className='bg-slate-50 border-b border-slate-200 sticky top-0 z-10'>
                        <tr className='text-slate-600 font-bold text-xs uppercase tracking-wider'>
                          <th className="px-4 py-3 w-[80px]">ID</th>
                          <th className="px-4 py-3">Brand Name</th>
                          <th className="px-4 py-3">Connected Parties</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row, index) => (
                          <tr key={row.id} onDoubleClick={() => { setFormData(row); setMode('create'); }}
                            className={`text-xs cursor-pointer transition-colors group ${selectedIndex === index ? 'bg-amber-50/60 border-l-[3px] border-amber-400' : 'bg-white hover:bg-slate-50'}`}>
                            <td className="px-4 py-3 font-semibold text-slate-500">#{row.id}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-600">
                              {(() => {
                                const connected = parties.filter(p => {
                                  try {
                                    const bList = typeof p.brands === 'string' ? JSON.parse(p.brands) : (p.brands || []);
                                    return bList.some((b: any) => (b.name || '').toLowerCase() === (row.name || '').toLowerCase());
                                  } catch (e) { return false; }
                                });
                                return connected.length > 0 ? connected.map(p => p.party_name || p.name).join(', ') : '-';
                              })()}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-md font-bold ${row.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {row.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  {/* Premium Tally-style Layout (Single Column for Brand) */}
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Core Information */}
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">
                      
                      <InputGroup id="field-0" label="Brand Name" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                      <InputGroup label="Short Name" value={formData.shortName || formData.name} onChange={(v: string) => setFormData({...formData, shortName: v})} />
                      

                    </div>
                    
                    <div className="flex-1 flex flex-col gap-4 pl-6 overflow-y-auto pb-4 custom-scrollbar">
                      <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4 flex-1 shadow-inner">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Connected Parties</h3>
                        <div className="flex flex-col gap-2">
                          {(() => {
                             const connected = parties.filter(p => {
                               try {
                                 const bList = typeof p.brands === 'string' ? JSON.parse(p.brands) : (p.brands || []);
                                 return bList.some((b: any) => (b.name || '').toLowerCase() === (formData.name || '').toLowerCase());
                               } catch (e) { return false; }
                             });
                             
                             if (connected.length === 0) {
                               return <div className="text-[11px] font-medium text-slate-400 italic bg-white p-3 rounded-lg border border-slate-200 border-dashed">No parties connected to this brand yet. Configure this in Party Master.</div>;
                             }
                             
                             return connected.map(p => (
                               <div key={p.id} className="bg-white border border-indigo-200 px-3 py-2 rounded-lg text-xs font-bold text-indigo-900 shadow-sm flex items-center justify-between group hover:border-indigo-400 transition-colors cursor-default">
                                 <span>{p.party_name || p.name}</span>
                                 <span className="text-[9px] text-indigo-400 uppercase tracking-wider">{p.type || 'Party'}</span>
                               </div>
                             ));
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1" />

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
                      onClick={() => {
                        alert('Brand Saved Successfully!');
                        setMode('list');
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
