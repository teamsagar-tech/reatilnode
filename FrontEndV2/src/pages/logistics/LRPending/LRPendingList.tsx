import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ label, value, onChange, placeholder = '', type = 'text', as = 'input', options = [] }: any) => (
  <div className="flex items-center text-[12px] mb-1">
    <label className="w-[120px] font-semibold text-slate-700 shrink-0">{label}</label>
    <span className="font-bold mr-1 text-slate-400">:</span>
    {as === 'select' ? (
      <select
        className="flex-1 border border-slate-300 px-1 py-[2px] focus:outline-none focus:border-[#1b5e58] focus:bg-[#ffffe0] bg-white transition-colors font-semibold text-slate-800"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((opt: any) => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        className="flex-1 border border-slate-300 px-1 py-[2px] focus:outline-none focus:border-[#1b5e58] focus:bg-[#ffffe0] bg-white transition-colors font-semibold text-slate-800"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default function LRPendingList() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [lrs, setLrs] = useState<any[]>([]);
  
  const [transporters, setTransporters] = useState<any[]>([]);
  const [hundekaris, setHundekaris] = useState<any[]>([]);
  const locations = [{ id: 1, name: 'Main Warehouse' }, { id: 2, name: 'Store 1' }];

  const [formData, setFormData] = useState({ 
    transporter_id: '', 
    hundekari_id: '', 
    lr_no: '', 
    bale: '', 
    inward_at_location_id: '1', 
    lr_inward_date: new Date().toISOString().split('T')[0] 
  });
  
  const [focusedRow, setFocusedRow] = useState(0);

  const fetchUnlinkedLRs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/unlinked-lrs`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) setLrs(data.data);
    } catch (err) {
      console.error('Failed to fetch LRs', err);
    }
  };

  const fetchMasters = async () => {
    try {
      const [transRes, hundRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/transporters`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/hundekari`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      const transData = await transRes.json();
      const hundData = await hundRes.json();
      
      if (transData.success) {
        setTransporters(transData.data.map((t: any) => ({ id: t.id, name: t.transporter_name })));
      }
      if (hundData.success) {
        setHundekaris(hundData.data.map((h: any) => ({ id: h.id, name: h.hundekari_name })));
      }
    } catch (err) {
      console.error('Failed to fetch masters', err);
    }
  };

  useEffect(() => {
    if (mode === 'list') {
      fetchUnlinkedLRs();
    } else {
      fetchMasters();
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'list') {
        if (e.key === 'ArrowDown') {
          setFocusedRow(prev => Math.min(prev + 1, lrs.length - 1));
        } else if (e.key === 'ArrowUp') {
          setFocusedRow(prev => Math.max(prev - 1, 0));
        } else if (e.altKey && e.key.toLowerCase() === 'c') {
          setMode('create');
        }
      } else {
        if (e.key === 'Escape') setMode('list');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, lrs]);

  return (
    <>
      <Helmet>
        <title>LR Inward Register | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Logistics Management</div>
               <div className='text-yellow-300'>Lorry Receipt Register (Unlinked)</div>
            </div>
            
            {mode === 'list' ? (
               <div className='flex-1 flex flex-col overflow-hidden bg-white'>
                  {/* Grid Header */}
                  <div className='bg-[#eef5ed] border-b-2 border-[#81a09d] p-1 flex justify-between items-center px-4'>
                      <div className='font-bold text-slate-800 text-[14px] uppercase tracking-wider'>LR Inward List</div>
                      <div className='text-[11px] font-bold text-slate-500'>Press (Alt+C) to create new</div>
                  </div>
                  
                  {/* Grid Table */}
                  <div className='flex-1 overflow-y-auto'>
                      <table className='w-full text-left border-collapse'>
                        <thead className='bg-slate-100 sticky top-0 border-b-2 border-[#81a09d] shadow-sm'>
                          <tr className='text-[#1b5e58] font-bold text-[12px]'>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Date</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">LR Number</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Transporter</th>
                            <th className="px-2 py-1 border-r border-[#81a09d]">Hundekari</th>
                            <th className="px-2 py-1 border-r border-[#81a09d] text-right">Bale</th>
                            <th className="px-2 py-1 text-right">Received</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lrs.length === 0 ? (
                            <tr><td colSpan={6} className="text-center p-8 text-slate-400 font-bold">No LR Records Found</td></tr>
                          ) : (
                            lrs.map((row, idx) => (
                              <tr 
                                key={row.id} 
                                className={`text-[12px] border-b border-slate-200 cursor-pointer ${focusedRow === idx ? 'bg-[#ffffe0] font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-800'}`}
                                onClick={() => setFocusedRow(idx)}
                              >
                                <td className="px-2 py-1 border-r border-slate-200">{new Date(row.lr_inward_date).toLocaleDateString()}</td>
                                <td className="px-2 py-1 border-r border-slate-200">{row.lr_no}</td>
                                <td className="px-2 py-1 border-r border-slate-200">{row.transporter_name}</td>
                                <td className="px-2 py-1 border-r border-slate-200">{row.hundekari_name}</td>
                                <td className="px-2 py-1 border-r border-slate-200 text-right">{row.bale}</td>
                                <td className="px-2 py-1 text-right text-green-700">{row.received_bale}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                  </div>

                  {/* Grid Footer */}
                  <div className='bg-[#eef5ed] border-t-2 border-[#81a09d] p-1 px-4 flex justify-between shrink-0 font-bold text-[12px]'>
                      <div className='text-slate-700'>Total Records: {lrs.length}</div>
                      <div className='flex gap-4'>
                          <div className='text-slate-700'>Total Bale: {lrs.reduce((sum, r) => sum + (r.bale || 0), 0)}</div>
                      </div>
                  </div>
               </div>
            ) : (
               <div className='flex-1 flex flex-col overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden p-2'>
                    {/* Master Form Detail Container */}
                    <div className="w-[50%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Inward Lorry Receipt Entry</SectionTitle>
                      
                      <InputRow label="LR Number" value={formData.lr_no} onChange={(v: string) => setFormData({...formData, lr_no: v})} />
                      <InputRow label="Inward Date" type="date" value={formData.lr_inward_date} onChange={(v: string) => setFormData({...formData, lr_inward_date: v})} />
                      
                      <InputRow 
                        label="Transporter" 
                        as="select" 
                        options={transporters}
                        value={formData.transporter_id} 
                        onChange={(v: string) => setFormData({...formData, transporter_id: v})} 
                      />
                      
                      <InputRow 
                        label="Hundekari" 
                        as="select" 
                        options={hundekaris}
                        value={formData.hundekari_id} 
                        onChange={(v: string) => setFormData({...formData, hundekari_id: v})} 
                      />
                      
                      <InputRow label="Bale Count" type="number" value={formData.bale} onChange={(v: string) => setFormData({...formData, bale: v})} />
                      
                      <InputRow 
                        label="Inward Location" 
                        as="select" 
                        options={locations}
                        value={formData.inward_at_location_id} 
                        onChange={(v: string) => setFormData({...formData, inward_at_location_id: v})} 
                      />
                    </div>
                  </div>
               </div>
            )}
          </div>

          {/* Right Sidebar Keybindings */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]'>
             {mode === 'list' ? (
                <>
                 <button onClick={() => setMode('create')} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                   <span className='font-bold text-black text-[11px] w-[25px] underline'>C</span>
                   <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Create</span>
                 </button>
                 <button className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                   <span className='font-bold text-black text-[11px] w-[25px] underline'>P</span>
                   <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Print List</span>
                 </button>
                </>
             ) : (
                <>
                 <button className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                   <span className='font-bold text-black text-[11px] w-[25px] underline'>S</span>
                   <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Save</span>
                 </button>
                 <button onClick={() => setMode('list')} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                   <span className='font-bold text-black text-[11px] w-[25px]'>Esc</span>
                   <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Cancel</span>
                 </button>
                </>
             )}
             <div className='flex-1' />
             <button onClick={() => navigate('/dashboard')} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd]'>
                 <span className='font-bold text-black text-[11px] w-[25px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>LR Inward Tracker</div>
        </div>
      </div>
    </>
  );
}
