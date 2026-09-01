import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, Truck } from 'lucide-react';
import { SectionTitle, InputRow } from '../../../components/layout/PremiumMasterComponents';

export default function TransporterMaster() {
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
          navigate(-1);
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
    { id: 1, name: 'VRL Logistics', contact: '9876543210', type: 'Heavy Truck' },
    { id: 2, name: 'Gati Express', contact: '8765432109', type: 'Mini Tempo' },
    { id: 3, name: 'Local Transport Co', contact: '7654321098', type: 'Van' },
  ];

  return (
    <>
      <Helmet>
        <title>Transporter Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full max-w-[1400px] mx-auto'>
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Transporter Master</h1>
            <p className="text-sm font-medium text-slate-500">Accounting / Logistics Configuration</p>
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
                        placeholder="Search transporters..." 
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
                          <th className="px-4 py-3 w-[80px]">ID</th>
                          <th className="px-4 py-3">Transporter Name</th>
                          <th className="px-4 py-3">Contact No</th>
                          <th className="px-4 py-3">Vehicle Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row) => (
                          <tr key={row.id} className='text-xs bg-white hover:bg-indigo-50/30 cursor-pointer transition-colors group'>
                            <td className="px-4 py-3 font-semibold text-slate-500">#{row.id}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-600">{row.contact}</td>
                            <td className="px-4 py-3 font-bold text-slate-700">{row.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  {/* Premium Master Layout */}
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Core Information */}
                    <div className="flex-1 max-w-lg flex flex-col gap-1 border-r border-slate-100 pr-6 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle icon={Truck}>Master Information</SectionTitle>
                      <InputRow id="field-0" label="Transporter Name" value={formData.transporterName} onChange={(v: string) => setFormData({...formData, transporterName: v})} />
                      <InputRow label="Mobile / Contact No" value={formData.mobile} onChange={(v: string) => setFormData({...formData, mobile: v})} />
                      <InputRow label="Email Address" type="email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
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
