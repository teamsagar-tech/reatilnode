import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ id, label, value, onChange, width = 'flex-1', type = 'text', placeholder = '' }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
      {label}
    </div>
    <input 
      id={id}
      type={type} 
      className={`bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 ${width}`}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default function FirmMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  const [editId, setEditId] = useState<number | null>(null);
  const [myFirms, setMyFirms] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    mobile: '',
    settings: {
      address: '',
      gstin: '',
      state: ''
    }
  });

  const fetchFirms = () => {
    fetch('https://api.retailnode.in/api/firms/me/all', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setMyFirms(data);
      }
    })
    .catch(console.error);
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  const handleSaveFirm = async () => {
    if (!formData.name) {
      alert('Firm Name is required');
      return;
    }
    try {
      const url = editId 
        ? `https://api.retailnode.in/api/firms/me/${editId}` 
        : `https://api.retailnode.in/api/firms/me/new`;
      
      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert(editId ? 'Firm profile updated successfully!' : 'Firm created successfully!');
        setFormData({
          name: '', email: '', mobile: '', settings: { address: '', gstin: '', state: '' }
        });
        setEditId(null);
        setMode('list');
        fetchFirms();
      } else {
        let errText = 'Failed to save firm';
        try {
          const errData = await res.json();
          if (errData.error) errText = errData.error;
        } catch(e) {}
        alert(errText);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving firm');
    }
  };

  useEffect(() => {
    if (mode === 'create') {
      setTimeout(() => {
        document.getElementById('input-name')?.focus();
      }, 50);
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          setFormData({ name: '', email: '', mobile: '', settings: { address: '', gstin: '', state: '' } });
          setEditId(null);
          setMode('list');
        } else {
          navigate(-1);
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
        e.preventDefault();
        if (mode === 'list') {
          setFormData({ name: '', email: '', mobile: '', settings: { address: '', gstin: '', state: '' } });
          setEditId(null);
          setMode('create');
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        handleSaveFirm();
      } else if (mode === 'list') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, myFirms.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (myFirms[selectedIndex]) {
            const row = myFirms[selectedIndex];
            setFormData({
              name: row.name || '',
              email: row.email || '',
              mobile: row.mobile || '',
              settings: row.settings || { address: '', gstin: '', state: '' }
            });
            setEditId(row.id);
            setMode('create');
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, formData, myFirms, selectedIndex]);

  const updateSetting = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value }
    }));
  };

  return (
    <div className="flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full">
      <Helmet>
        <title>Firm Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
        {/* Main Container */}
        <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
          {/* Header */}
          <div className="bg-[#1b5e58] text-white px-4 py-1 flex justify-between items-center shrink-0">
            <h1 className="text-[14px] font-bold">FIRM MASTER</h1>
            <div className="flex space-x-4 text-[12px] text-yellow-300">
              {mode === 'create' ? <span>Save (Ctrl+A) | Back (Esc)</span> : <span>Create (Alt+C) | Back (Esc)</span>}
            </div>
          </div>

          <div className='p-2 flex-1 overflow-y-auto flex flex-col'>
            {mode === 'list' ? (
              <>
                <div className='flex justify-between items-center mb-2'>
                  <div className='font-bold text-slate-800 text-[14px] flex items-center gap-4'>
                    <span>Your Firms</span>
                    {myFirms.length > 0 && (
                      <span className='bg-[#ffe000] text-black px-2 py-0.5 text-[11px] rounded-sm'>
                        Allowed Firm Count: {myFirms.length} / {myFirms[0]?.max_firms || 1}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      setFormData({ name: '', email: '', mobile: '', settings: { address: '', gstin: '', state: '' } });
                      setEditId(null);
                      setMode('create');
                    }}
                    className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                  >
                    Create New Firm (Alt+C)
                  </button>
                </div>
                <table className='w-full text-left border-collapse border border-slate-400'>
                  <thead className='bg-[#eef5ed]'>
                    <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                      <th className="px-2 py-1 border-r border-slate-300 w-[60px]">ID</th>
                      <th className="px-2 py-1 border-r border-slate-300 min-w-[200px]">Firm Name</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-[150px]">Email</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-[120px]">Mobile</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-[150px]">GSTIN</th>
                      <th className="px-2 py-1 border-r border-slate-300 w-[100px]">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myFirms.map((row, idx) => (
                      <tr 
                        key={row.id} 
                        onClick={() => {
                          setFormData({
                            name: row.name || '',
                            email: row.email || '',
                            mobile: row.mobile || '',
                            settings: row.settings || { address: '', gstin: '', state: '' }
                          });
                          setEditId(row.id);
                          setMode('create');
                          setSelectedIndex(idx);
                        }}
                        className={`text-[12px] border-b border-slate-300 ${idx === selectedIndex ? 'bg-[#ffe000]' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')} hover:bg-[#ffffe0] cursor-pointer`}
                      >
                        <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700 text-center">{row.id}</td>
                        <td className="px-2 py-1 border-r border-slate-300 font-bold text-[#1b5e58]">{row.name}</td>
                        <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.email || '-'}</td>
                        <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.mobile || '-'}</td>
                        <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.settings?.gstin || '-'}</td>
                        <td className="px-2 py-1 border-r border-slate-300 font-bold text-slate-700 uppercase text-[10px]">{row.role}</td>
                      </tr>
                    ))}
                    {myFirms.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-2 py-4 text-center text-slate-500 font-medium">No firms found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            ) : (
              <div className="flex justify-center items-start pt-4 h-full">
                <div className="w-[600px] bg-white border border-[#a3c3be] shadow-sm p-4">
                  <SectionTitle>Basic Details</SectionTitle>
                  <InputRow id="input-name" label="Firm Name" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                  <InputRow id="input-email" label="Email" type="email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                  <InputRow id="input-mobile" label="Mobile" value={formData.mobile} onChange={(v: string) => setFormData({...formData, mobile: v})} />

                  <SectionTitle>Address & Registration</SectionTitle>
                  <InputRow id="input-address" label="Address" value={formData.settings?.address || ''} onChange={(v: string) => updateSetting('address', v)} />
                  <InputRow id="input-state" label="State" value={formData.settings?.state || ''} onChange={(v: string) => updateSetting('state', v)} />
                  <InputRow id="input-gstin" label="GSTIN" value={formData.settings?.gstin || ''} onChange={(v: string) => updateSetting('gstin', v)} />

                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-6 shrink-0'>
                    <button 
                      onClick={() => {
                        setFormData({ name: '', email: '', mobile: '', settings: { address: '', gstin: '', state: '' } });
                        setEditId(null);
                        setMode('list');
                      }}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200 uppercase text-[11px]'
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveFirm}
                      className='bg-[#1b5e58] border border-[#0d2d2a] px-6 py-1 text-white font-bold shadow-[inset_1px_1px_0_rgba(255,255,255,0.3)] hover:bg-[#12423d] focus:bg-[#12423d] outline-none uppercase text-[11px]'
                    >
                      Save Profile
                    </button>
                  </div>
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
        <div className='font-medium tracking-wide'>Firm Master</div>
      </div>
    </div>
  );
}
