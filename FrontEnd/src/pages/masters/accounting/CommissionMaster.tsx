import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { useMasterApi } from '../../../hooks/useMasterApi';


export default function CommissionMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

const { data: sampleData, fetchList, saveRecord } = useMasterApi('masters/generic/commissions');
  useEffect(() => { fetchList(); }, [fetchList]);

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
          setFormData(sampleData[selectedIndex]);
          setMode('create');
        }
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
  }, [navigate, mode, sampleData, selectedIndex]);

  const handleFieldKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) nextField.focus();
      else {
        saveRecord(formData).then(r => { if(r.success) { setFormData({}); setMode('list'); } });
      }
    }
  };

  
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
        <title>Commission | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-64px)] font-sans selection:bg-indigo-100 w-full bg-slate-50 sm:px-4'>
        <div className='flex flex-1 overflow-hidden pt-4'>
          <div className='flex-1 bg-white border-none flex flex-col overflow-hidden'>
            <div className='flex-1 overflow-y-auto flex flex-col flex flex-col'>
            
              <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 py-1 border-b border-slate-200 shrink-0 bg-white">
                <div className="flex items-end gap-2 shrink-0">
                  <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight">{mode === 'list' ? 'Commissions' : 'New Commission'}</h1>
                  <span className="text-slate-300 font-light mb-1">|</span>
                  <p className="text-[10px] font-bold text-slate-500 mb-0.5">Configuration Master</p>
                </div>
                
                {mode === 'list' && (
                  <div className='flex items-center gap-4 flex-1 justify-end'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-300 rounded text-[11px] font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button onClick={() => setMode('create')} className='shrink-0 bg-indigo-600 px-2 py-1 rounded bg-indigo-600 font-bold text-white shadow-none hover:bg-indigo-700 transition-all text-xs'>
                      Create New (Alt+C)
                    </button>
                  </div>
                )}
              </div>
              
              {mode === 'list' ? (
                <>
                  <div className="overflow-y-auto custom-scrollbar flex-1">
                    <table className='w-full text-left border-collapse'>
                      <thead className='bg-slate-100 border-b border-slate-200 sticky top-0 z-10'>
                        <tr className='text-slate-800 font-bold text-[10px] uppercase tracking-widest'>
                          <th className="px-2 py-1 text-[11px] w-[80px]">ID</th>
                          <th className="px-2 py-1 text-[11px]">Rule Name</th>
                          <th className="px-2 py-1 text-[11px]">Percentage</th>
                          <th className="px-2 py-1 text-[11px]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row, index) => (
                          <tr key={row.id} onDoubleClick={() => { setFormData(row); setMode('create'); }}
                            className={`text-xs cursor-pointer transition-colors group ${selectedIndex === index ? 'bg-amber-50/60 border-l-[3px] border-amber-400' : 'bg-white hover:bg-slate-50'}`}>
                            <td className="px-2 py-1 text-[11px] font-semibold text-slate-500">#{row.id}</td>
                            <td className="px-2 py-1 text-[11px] font-bold text-slate-800">{row.name}</td>
                            <td className="px-2 py-1 text-[11px] font-semibold text-slate-600">{row.description || '-'}%</td>
                            <td className="px-2 py-1 text-[11px]">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                        <InputGroup autoFocus={true} label="Rule Name" id="input-ruleName" nextId="input-percentage" value={formData.ruleName || formData.name} onChange={(v: string) => setFormData({...formData, ruleName: v})} />
                        <InputGroup label="Percentage" id="input-percentage" nextId="input-validTill" value={formData.percentage} onChange={(v: string) => setFormData({...formData, percentage: v})} type="number" />
                        <InputGroup label="Valid Till" id="input-validTill" nextId="btn-save" value={formData.validTill} onChange={(v: string) => setFormData({...formData, validTill: v})} type="date" />
                      </div>
                    </div>
                  </div>
                  
                  <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>
                    <button onClick={() => setFormData({})} tabIndex={ -1 } className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'>
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
