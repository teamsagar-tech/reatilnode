import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function SubStyleMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          setMode('list');
        } else {
          navigate('/dashboard');
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC' || e.key === 'ç') && mode === 'list') {
        e.preventDefault();
        setMode('create');
        setTimeout(() => {
          document.getElementById('field-0')?.focus();
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
      if (nextField) {
        nextField.focus();
      } else {
        // End of form, simulate save
        setMode('list');
      }
    }
  };

  const sampleData = [
    { id: 1, col1: 'Sample 1', col2: 'Data A', col3: 'Active', col4: '100' },
    { id: 2, col1: 'Sample 2', col2: 'Data B', col3: 'Inactive', col4: '50' },
    { id: 3, col1: 'Sample 3', col2: 'Data C', col3: 'Active', col4: '200' },
  ];

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
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <>
      <Helmet>
        <title>SubStyle Master | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        

        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation</div>
               <div className='text-yellow-300'>SubStyle Master</div>
            </div>
            
            <div className='p-2 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='font-bold text-slate-800 text-[14px]'>List of SubStyles</div>
                    <button 
                      onClick={() => { setMode('create'); }} 
                      className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                    >Create New (Alt/Opt+C)</button>
                  </div>
                  <table className='w-full text-left border-collapse border border-slate-400'>
                    <thead className='bg-[#eef5ed]'>
                      <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                        <th className="px-2 py-1 border-r border-slate-300">ID</th><th className="px-2 py-1 border-r border-slate-300">Sub Style Code</th><th className="px-2 py-1 border-r border-slate-300">Parent Style</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.map((row, idx) => {
                        const renderCell = (i: number) => i === 0 ? row.id : (row as any)['col'+i] || '-';
                        return (
                          <tr key={row.id} className={'text-[12px] border-b border-slate-300 ' + (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]') + ' hover:bg-[#ffffe0] cursor-pointer'}>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{renderCell(0)}</td><td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{renderCell(1)}</td><td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{renderCell(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Master Details */}
                    <div className="w-[40%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Master Information</SectionTitle>
                    <InputRow label="Sub Style Name" value={formData.subStyleName} onChange={(v: string) => setFormData({...formData, subStyleName: v})} />
                    <InputRow label="Style" value={formData.style} onChange={(v: string) => setFormData({...formData, style: v})} />
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    <button 
                      onClick={() => setFormData({})}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => {
                        alert('Saved Successfully!');
                        setMode('list');
                      }}
                      className='bg-[#1b5e58] border border-[#1b5e58] px-6 py-1 text-white font-bold hover:bg-[#144743] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] outline-none focus:bg-[#0f3632]'
                    >
                      Save (Ctrl+A)
                    </button>
                  </div>                </div>
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
          <div className='font-medium tracking-wide'>SubStyle Master</div>
        </div>
      </div>
    </>
  );
}
