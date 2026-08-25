import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';

export default function ItemMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        setTimeout(() => {
          document.getElementById('field-0')?.focus();
        }, 50);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        setMode('list');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode]);

  const sampleData = [
    { id: 1, name: 'Sample Item 1', category: 'Electronics', stock: 100, status: 'Active' },
    { id: 2, name: 'Sample Item 2', category: 'Clothing', stock: 50, status: 'Inactive' },
    { id: 3, name: 'Sample Item 3', category: 'Food', stock: 200, status: 'Active' },
  ];

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="font-bold text-indigo-900 text-xs border-b-2 border-indigo-100 mb-4 mt-2 pb-1.5 uppercase tracking-widest bg-gradient-to-r from-indigo-50/80 to-transparent px-2 rounded-t-lg">
      {children}
    </div>
  );

  const InputRow = ({ label, value, onChange, width = 'w-full', type = 'text', placeholder = '', id = '' }: any) => (
    <div className="flex items-center mb-1.5 hover:bg-slate-50/50 p-1 rounded-lg transition-colors group">
      <div className="w-[130px] text-slate-700 font-bold text-[11px] text-right pr-3 leading-tight tracking-wide group-hover:text-indigo-700 transition-colors">
        {label}
      </div>
      <div className="flex-1">
        <input 
          id={id}
          type={type} 
          className={`bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-indigo-50/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all ${width}`}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Item Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full max-w-[1400px] mx-auto'>
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Item Master</h1>
            <p className="text-sm font-medium text-slate-500">Inventory Configuration</p>
          </div>
          
          <div className="flex gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
              <span className="text-slate-400">ESC</span> Back
            </kbd>
            {mode === 'list' ? (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 shadow-sm">
                <span className="text-indigo-400">ALT+C</span> Create New
              </kbd>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-600 shadow-sm">
                <span className="text-emerald-400">CTRL+A</span> Save
              </kbd>
            )}
          </div>
        </div>

        <div className='flex flex-1 gap-4 overflow-hidden'>
          {/* Main Container */}
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden'>
            
            <div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-4'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search items..." 
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
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden flex-1">
                    <table className='w-full text-left border-collapse'>
                      <thead className='bg-slate-50 border-b border-slate-200'>
                        <tr className='text-slate-600 font-bold text-xs uppercase tracking-wider'>
                          <th className="px-4 py-3">ID</th>
                          <th className="px-4 py-3">Item Name</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Stock</th>
                          <th className="px-4 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row) => (
                          <tr key={row.id} className='text-xs bg-white hover:bg-indigo-50/30 cursor-pointer transition-colors group'>
                            <td className="px-4 py-3 font-semibold text-slate-500">#{row.id}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-600">{row.category}</td>
                            <td className="px-4 py-3 font-bold text-slate-700">{row.stock}</td>
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
                  {/* Premium Tally-style 3 Column Layout */}
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Core Information */}
                    <div className="flex-1 flex flex-col gap-1 border-r border-slate-100 pr-6 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Core Information</SectionTitle>
                      <InputRow id="field-0" label="Item Name" value={formData.itemName} onChange={(v: string) => setFormData({...formData, itemName: v})} />
                      <InputRow label="Marathi Name" value={formData.marathiName} onChange={(v: string) => setFormData({...formData, marathiName: v})} />
                      <InputRow label="Brand Id" value={formData.brandId} onChange={(v: string) => setFormData({...formData, brandId: v})} />
                    </div>

                    {/* Column 2: Financials & Tax */}
                    <div className="flex-1 flex flex-col gap-1 border-r border-slate-100 pr-6 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Financials & Tax</SectionTitle>
                      <InputRow label="HSN/SAC Code" value={formData.hsnsacCode} onChange={(v: string) => setFormData({...formData, hsnsacCode: v})} />
                      <InputRow label="GST Percent (%)" type="number" value={formData.gstPercent} onChange={(v: string) => setFormData({...formData, gstPercent: v})} />
                    </div>

                    {/* Column 3: Configuration */}
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Configuration</SectionTitle>
                      <InputRow label="Default Unit Type" value={formData.defaultUnitType} onChange={(v: string) => setFormData({...formData, defaultUnitType: v})} />
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>
                    <button 
                      onClick={() => setFormData({})}
                      className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => {
                        alert('Saved Successfully!');
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
