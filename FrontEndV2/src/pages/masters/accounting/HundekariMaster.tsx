import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ConfirmModal from '../../../components/ui/ConfirmModal';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ label, value, onChange, placeholder = '' }: any) => (
  <div className="flex items-center text-[12px] mb-1">
    <label className="w-[120px] font-semibold text-slate-700 shrink-0">{label}</label>
    <span className="font-bold mr-1 text-slate-400">:</span>
    <input
      type="text"
      className="flex-1 border border-slate-300 px-1 py-[2px] focus:outline-none focus:border-[#1b5e58] focus:bg-[#ffffe0] bg-white transition-colors"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default function HundekariMaster() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [hundekaris, setHundekaris] = useState<any[]>([]);
  const [formData, setFormData] = useState({ hundekari_name: '', mobile: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchHundekaris = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/hundekari`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        setHundekaris(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch hundekaris', err);
    }
  };

  useEffect(() => {
    if (mode === 'list') {
      fetchHundekaris();
    }
  }, [mode]);

  const handleSave = async () => {
    if (!formData.hundekari_name) {
      setError('Hundekari Name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/hundekari`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setMode('list');
        setFormData({ hundekari_name: '', mobile: '', email: '' });
      } else {
        setError(data.message || 'Failed to save');
      }
    } catch (err: any) {
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Hundekari Master | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation</div>
               <div className='text-yellow-300'>Hundekari Master</div>
            </div>
            
            <div className='p-2 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='font-bold text-slate-800 text-[14px]'>List of Hundekaris</div>
                    <button 
                      onClick={() => setMode('create')} 
                      className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                    >Create New (Alt/Opt+C)</button>
                  </div>
                  <table className='w-full text-left border-collapse border border-slate-400'>
                    <thead className='bg-[#eef5ed]'>
                      <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                        <th className="px-2 py-1 border-r border-slate-300">ID</th>
                        <th className="px-2 py-1 border-r border-slate-300">Hundekari Name</th>
                        <th className="px-2 py-1 border-r border-slate-300">Mobile</th>
                        <th className="px-2 py-1 border-r border-slate-300">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hundekaris.length === 0 ? (
                        <tr><td colSpan={4} className="text-center p-4 text-slate-500">No hundekaris found</td></tr>
                      ) : (
                        hundekaris.map((row, idx) => (
                          <tr key={row.id} className={'text-[12px] border-b border-slate-300 ' + (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]') + ' hover:bg-[#ffffe0] cursor-pointer'}>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.id}</td>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.hundekari_name}</td>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.mobile || '-'}</td>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.email || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    {/* Column 1: Master Details */}
                    <div className="w-[40%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Master Information</SectionTitle>
                      {error && <div className="text-red-600 font-bold mb-2">{error}</div>}
                      <InputRow label="Hundekari Name" value={formData.hundekari_name} onChange={(v: string) => setFormData({...formData, hundekari_name: v})} />
                      <InputRow label="Mobile" value={formData.mobile} onChange={(v: string) => setFormData({...formData, mobile: v})} />
                      <InputRow label="Email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    <button 
                      type="button"
                      onClick={() => setShowResetConfirm(true)} 
                      tabIndex={-1}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      className='bg-[#1b5e58] border border-[#1b5e58] px-6 py-1 text-white font-bold hover:bg-[#144743] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] outline-none focus:bg-[#0f3632]'
                    >
                      {loading ? 'Saving...' : 'Save (Ctrl+A)'}
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
          <div className='font-medium tracking-wide'>Hundekari Master</div>
        </div>
      
        <ConfirmModal
          isOpen={showResetConfirm}
          title="Reset Form?"
          message="Are you sure you want to clear all data? This cannot be undone."
          type="warning"
          onConfirm={() => {
            const resetFn = () => setFormData({ hundekari_name: '', mobile: '', email: '' });
            resetFn();
            setShowResetConfirm(false);
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
        </div>
    </>
  );
}
