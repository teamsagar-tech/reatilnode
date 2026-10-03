import os
import re

files_to_convert = [
    'src/pages/masters/inventory/DepartmentMaster.tsx',
    'src/pages/masters/inventory/SectionMaster.tsx',
    'src/pages/masters/inventory/StyleMaster.tsx',
    'src/pages/masters/inventory/SubStyleMaster.tsx',
    'src/pages/masters/inventory/DesignMaster.tsx',
    'src/pages/masters/inventory/SizeMaster.tsx',
    'src/pages/masters/inventory/SizeGroupMaster.tsx',
    'src/pages/masters/inventory/ColorMaster.tsx',
    'src/pages/masters/inventory/MaterialMaster.tsx',
    'src/pages/masters/inventory/HSNSACMaster.tsx'
]

template = """import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Plus, Save, RotateCcw } from 'lucide-react';

export default function {COMPONENT_NAME}() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list');
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
    { id: 1, col1: 'Sample 1', col2: 'Data A', col3: 'Active', col4: '100' },
    { id: 2, col1: 'Sample 2', col2: 'Data B', col3: 'Inactive', col4: '50' },
  ];

  const InputGroup = ({ label, id, value, onChange, nextId, autoFocus = false }: any) => (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        id={id} autoFocus={autoFocus} type="text"
        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        value={value || ''} onChange={e => onChange(e.target.value)} onKeyDown={e => handleFieldKeyDown(e, nextId)}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  return (
    <>
      <Helmet><title>{TITLE} | RetailNode</title></Helmet>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-6">
        <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{mode === 'list' ? '{PLURAL_TITLE}' : 'New {TITLE}'}</h1>
            <p className="text-sm text-slate-500 mt-1">{mode === 'list' ? 'Manage and view all your records' : 'Press ESC to go back to the list'}</p>
          </div>
          {mode === 'list' && (
            <button onClick={() => setMode('create')} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
              <Plus size={16} /> Create New <span className="opacity-70 text-xs ml-1">(Alt+C)</span>
            </button>
          )}
        </div>
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {mode === 'list' ? (
            <div className="flex flex-col">
              <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Details</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sampleData.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.id}</td>
                        <td className="px-6 py-4 text-sm font-bold text-blue-700">{row.col1}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{row.col2}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.col3 === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>{row.col3}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="max-w-xl">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2">Master Information</h3>
                {INPUTS_BLOCK}
                <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                  <button onClick={() => { alert('Saved Successfully!'); setMode('list'); }} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm focus:ring-4 focus:ring-blue-100 transition-all">
                    <Save size={16} /> Save Master
                  </button>
                  <button onClick={() => setFormData({})} className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-all">
                    <RotateCcw size={16} className="text-slate-400" /> Reset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
"""

base_dir = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd'

for filepath in files_to_convert:
    full_path = os.path.join(base_dir, filepath)
    if not os.path.exists(full_path):
        print(f"Skipping {filepath} (Not found)")
        continue
    
    with open(full_path, 'r') as f:
        content = f.read()
    
    # 1. Extract component name
    comp_match = re.search(r'export default function (\w+)', content)
    if not comp_match:
        continue
    comp_name = comp_match.group(1)
    
    # 2. Extract Title from helmet
    title_match = re.search(r'<title>(.*?) Master \|', content)
    title = title_match.group(1).strip() if title_match else comp_name.replace('Master', '')
    
    plural_title = title + 's' if not title.endswith('s') else title
    
    # 3. Fix the Regex from before - remove escaped dots since they were literal strings!
    inputs = re.findall(r'<InputGroup label="(.*?)" .*? value=\{formData.(.*?)\} onChange=\{\(v: string\) => setFormData\(\{\\\.\\\.\\\.formData, \2: v\}\)\} />', content)
    
    # Wait, the files were ALREADY converted to broken TS syntax in the previous run.
    # Let me fallback to pulling from git, but wait, there is no git.
    # The regex I should use to extract the corrupted fields is:
    inputs = re.findall(r'<InputGroup label="(.*?)" id="input-.*?" nextId=".*?".*? value=\{formData\.(.*?)\} onChange=', content)
    
    # If the file hasn't been corrupted yet, it uses InputRow
    if not inputs:
        inputs = re.findall(r'<InputRow label="(.*?)" value=\{formData.(.*?)\} onChange=', content)
    
    input_blocks = []
    for idx, (label, field) in enumerate(inputs):
        next_id = f"input-{inputs[idx+1][1]}" if idx + 1 < len(inputs) else "btn-save"
        autofocus = "autoFocus={true} " if idx == 0 else ""
        # The correct syntax here!
        input_blocks.append(f'<InputGroup label="{label}" id="input-{field}" nextId="{next_id}" {autofocus}value={{formData.{field}}} onChange={{(v: string) => setFormData({{...formData, {field}: v}})}} />')
    
    inputs_block_str = "\n                ".join(input_blocks)
    
    new_content = template.replace('{COMPONENT_NAME}', comp_name)
    new_content = new_content.replace('{TITLE}', title)
    new_content = new_content.replace('{PLURAL_TITLE}', plural_title)
    new_content = new_content.replace('{INPUTS_BLOCK}', inputs_block_str)
    
    with open(full_path, 'w') as f:
        f.write(new_content)
    
    print(f"Converted {comp_name}")
