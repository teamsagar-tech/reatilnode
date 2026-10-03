import os
import glob
import re

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/**/*.tsx'
files = glob.glob(base_dir, recursive=True)

template = """import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';

export default function {COMPONENT_NAME}() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

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
        alert('Saved Successfully!');
        setMode('list');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode]);

  const handleFieldKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) nextField.focus();
      else {
        alert('Saved Successfully!');
        setMode('list');
      }
    }
  };

  const sampleData = [
    { id: 1, name: 'Sample 1', details: 'Data A', status: 'Active' },
    { id: 2, name: 'Sample 2', details: 'Data B', status: 'Inactive' },
    { id: 3, name: 'Sample 3', details: 'Data C', status: 'Active' },
  ];

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="font-bold text-indigo-900 text-xs border-b-2 border-indigo-100 mb-4 mt-2 pb-1.5 uppercase tracking-widest bg-gradient-to-r from-indigo-50/80 to-transparent px-2 rounded-t-lg">
      {children}
    </div>
  );

  const InputRow = ({ label, id, value, onChange, nextId, width = 'w-full', type = 'text', placeholder = '', autoFocus = false }: any) => (
    <div className="flex items-center mb-1.5 hover:bg-slate-50/50 p-1 rounded-lg transition-colors group">
      <div className="w-[130px] text-slate-700 font-bold text-[11px] text-right pr-3 leading-tight tracking-wide group-hover:text-indigo-700 transition-colors">
        {label}
      </div>
      <div className="flex-1">
        <input 
          id={id}
          autoFocus={autoFocus}
          type={type} 
          className={`bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-indigo-50/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all ${width}`}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => handleFieldKeyDown(e, nextId)}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{TITLE} | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full px-2 sm:px-4'>
        <div className='flex flex-1 gap-4 overflow-hidden pt-4'>
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden'>
            <div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>
            
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-end gap-3 shrink-0">
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">{mode === 'list' ? '{PLURAL_TITLE}' : 'New {TITLE}'}</h1>
                  <span className="text-slate-300 font-light mb-1">|</span>
                  <p className="text-sm font-medium text-slate-500 mb-0.5">Configuration Master</p>
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
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Details</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row) => (
                          <tr key={row.id} className='text-xs bg-white hover:bg-indigo-50/30 cursor-pointer transition-colors group'>
                            <td className="px-4 py-3 font-semibold text-slate-500">#{row.id}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-600">{row.details}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-md font-bold ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {row.status}
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
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Master Information</SectionTitle>
                      {INPUTS_BLOCK}
                    </div>
                    <div className="flex-1" />
                    <div className="flex-1" />
                  </div>
                  
                  <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>
                    <button onClick={() => setFormData({})} className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'>
                      Reset
                    </button>
                    <button onClick={() => { alert('Saved Successfully!'); setMode('list'); }} className='bg-indigo-600 border border-indigo-600 px-8 py-2 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 text-xs'>
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

for filepath in files:
    # Skip files that have custom matrix logic or custom grids
    if "BrandMaster" in filepath or "SubCategoryMaster" in filepath or "SizeGroupMaster" in filepath:
        continue
        
    with open(filepath, 'r') as f:
        content = f.read()
    
    comp_match = re.search(r'export default function (\w+)', content)
    if not comp_match:
        continue
    comp_name = comp_match.group(1)
    
    title_match = re.search(r'<title>(.*?) Master \|', content)
    title = title_match.group(1).strip() if title_match else comp_name.replace('Master', '')
    plural_title = title + 's' if not title.endswith('s') else title
    
    inputs = re.findall(r'<InputRow label="(.*?)" id="input-(.*?)" nextId=".*?".*?value=\{formData\.(.*?)\} onChange=', content)
    if not inputs:
        print(f"Failed to find inputs for {comp_name}")
        continue
        
    input_blocks = []
    for idx, (label, id_val, field) in enumerate(inputs):
        next_id = f"input-{inputs[idx+1][1]}" if idx + 1 < len(inputs) else "btn-save"
        autofocus = "autoFocus={true} " if idx == 0 else ""
        input_blocks.append(f'<InputRow label="{label}" id="input-{id_val}" nextId="{next_id}" {autofocus}value={{formData.{field}}} onChange={{(v: string) => setFormData({{...formData, {field}: v}})}} />')
    
    inputs_block_str = "\n                      ".join(input_blocks)
    
    new_content = template.replace('{COMPONENT_NAME}', comp_name)
    new_content = new_content.replace('{TITLE}', title)
    new_content = new_content.replace('{PLURAL_TITLE}', plural_title)
    new_content = new_content.replace('{INPUTS_BLOCK}', inputs_block_str)
    
    with open(filepath, 'w') as f:
        f.write(new_content)
    
    print(f"Successfully rebuilt {comp_name}")

