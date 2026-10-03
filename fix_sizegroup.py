import os

filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/SizeGroupMaster.tsx'

content = """import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { useMasterApi } from '../../../hooks/useMasterApi';

// Added to satisfy TS compiler for InputGroup
const handleFieldKeyDown = (e: any, nextId: any) => {};

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

export default function SizeGroupMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

  const { data: sampleData, fetchList, saveRecord } = useMasterApi('masters/sizesets');
  useEffect(() => { fetchList(); }, [fetchList]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') setMode('list');
        else navigate('/dashboard');
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {
        e.preventDefault();
        setMode('create');
        setTimeout(() => {
          const firstInput = document.querySelector('input[type="text"]') as HTMLElement;
          if (firstInput) firstInput.focus();
        }, 50);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        saveRecord(formData).then(r => { if(r.success) { setFormData({}); setMode('list'); } });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, formData, saveRecord]);

  return (
    <>
      <Helmet>
        <title>Size Group Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full px-2 sm:px-4'>
        <div className='flex flex-1 gap-4 overflow-hidden pt-4'>
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden'>
            <div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>
            
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-end gap-3 shrink-0">
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">{mode === 'list' ? 'Size Groups' : 'New Size Group'}</h1>
                  <span className="text-slate-300 font-light mb-1">|</span>
                  <p className="text-sm font-medium text-slate-500 mb-0.5">Inventory Configuration</p>
                </div>
                
                {mode === 'list' && (
                  <div className='flex items-center gap-4 flex-1 justify-end'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button onClick={() => setMode('create')} className='shrink-0 bg-indigo-600 px-4 py-2 rounded-lg font-bold text-white shadow-md hover:bg-indigo-700 transition-all text-xs'>
                      Create New (Alt+C)
                    </button>
                  </div>
                )}
              </div>
              
              {mode === 'list' ? (
                <>
                  <div className="border border-slate-200 rounded-xl overflow-hidden flex-1">
                    <table className='w-full text-left border-collapse'>
                      <thead className='bg-slate-50 border-b border-slate-200'>
                        <tr className='text-slate-600 font-bold text-xs uppercase tracking-wider'>
                          <th className="px-4 py-3 w-[80px]">ID</th>
                          <th className="px-4 py-3">Group Name</th>
                          <th className="px-4 py-3">Size Scale</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row) => (
                          <tr key={row.id} className='text-xs bg-white hover:bg-indigo-50/30 cursor-pointer transition-colors group'>
                            <td className="px-4 py-3 font-semibold text-slate-500">#{row.id}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-600">{row.size_scale || '-'}</td>
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
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar pr-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 max-w-2xl">
                        <InputGroup autoFocus={true} label="Size Group Name" id="input-name" nextId="input-scale" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                        <InputGroup label="Size Scale (e.g. S-XL)" id="input-scale" nextId="btn-save" value={formData.size_scale} onChange={(v: string) => setFormData({...formData, size_scale: v})} />
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>
                    <button onClick={() => setFormData({})} className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'>
                      Reset
                    </button>
                    <button id="btn-save" onClick={async () => { const res = await saveRecord(formData); if(res.success) { setFormData({}); setMode('list'); } }} className='bg-indigo-600 border border-indigo-600 px-8 py-2 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 text-xs'>
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
"""
with open(filepath, 'w') as f:
    f.write(content)
print("Rewrote SizeGroupMaster.tsx")
