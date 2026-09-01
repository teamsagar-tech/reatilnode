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

export default function LocationMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  const [formData, setFormData] = useState<any>({ settings: { useMainGst: true, gstin: '' } });
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchLocations = () => {
    fetch('https://api.retailnode.in/api/masters/location', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setLocations(Array.isArray(data) ? data : []))
    .catch(console.error);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSaveLocation = async () => {
    if (!formData.name) {
      alert('Name is required');
      return;
    }
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `https://api.retailnode.in/api/masters/location/${editId}` : 'https://api.retailnode.in/api/masters/location';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: formData.name, description: formData.description, settings: formData.settings })
      });
      if (res.ok) {
        setFormData({ settings: { useMainGst: true, gstin: '' } });
        setEditId(null);
        setMode('list');
        fetchLocations();
      } else {
        let errText = 'Failed to save location';
        try {
          const errData = await res.json();
          if (errData.error) errText = errData.error;
        } catch(e) {}
        alert(errText);
      }
    } catch (err) {
      console.error(err);
      alert('Error saving location');
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
          setFormData({ settings: { useMainGst: true, gstin: '' } });
          setEditId(null);
          setMode('list');
        } else {
          navigate(-1);
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC' || e.key === 'ç') && mode === 'list') {
        e.preventDefault();
        setMode('create');
        setTimeout(() => {
          document.getElementById('field-0')?.focus();
        }, 50);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        handleSaveLocation();
      } else if (mode === 'list') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, locations.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (locations[selectedIndex]) {
            const row = locations[selectedIndex];
            setFormData({
              name: row.name,
              description: row.description || '',
              settings: row.settings || { useMainGst: true, gstin: '' }
            });
            setEditId(row.id);
            setMode('create');
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, formData, locations, selectedIndex]);

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

  // Sample data removed in favor of actual API data

  return (
    <>
      <Helmet>
        <title>Location Master | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        

        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation</div>
               <div className='text-yellow-300'>Location Master</div>
            </div>
            
            <div className='p-2 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='font-bold text-slate-800 text-[14px]'>List of Locations</div>
                    <button 
                      onClick={() => { setMode('create'); }} 
                      className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                    >Create New (Alt/Opt+C)</button>
                  </div>
                  <table className='w-full text-left border-collapse border border-slate-400'>
                    <thead className='bg-[#eef5ed]'>
                      <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                        <th className="px-2 py-1 border-r border-slate-300">ID</th><th className="px-2 py-1 border-r border-slate-300">Location Name</th><th className="px-2 py-1 border-r border-slate-300">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {locations.map((row, idx) => {
                        return (
                          <tr 
                            key={row.id} 
                            onClick={() => {
                              setFormData({
                                name: row.name,
                                description: row.description || '',
                                settings: row.settings || { useMainGst: true, gstin: '' }
                              });
                              setEditId(row.id);
                              setMode('create');
                              setSelectedIndex(idx);
                            }}
                            className={`text-[12px] border-b border-slate-300 ${idx === selectedIndex ? 'bg-[#ffe000]' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')} hover:bg-[#ffffe0] cursor-pointer`}
                          >
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.id}</td>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.name}</td>
                            <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">Active</td>
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
                    <InputRow id="input-name" label="Name" value={formData.name} onChange={(v: string) => setFormData({...formData, name: v})} />
                    <InputRow label="Description" value={formData.description} onChange={(v: string) => setFormData({...formData, description: v})} />
                    
                    <SectionTitle>Tax Details</SectionTitle>
                    <div className="flex items-center mb-[2px]">
                      <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
                        Use Main Firm GST
                      </div>
                      <select 
                        className={`bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 flex-1`}
                        value={formData.settings?.useMainGst ? 'true' : 'false'}
                        onChange={(e) => setFormData({...formData, settings: {...formData.settings, useMainGst: e.target.value === 'true'}})}
                      >
                        <option value="true">Yes</option>
                        <option value="false">No (Separate GST)</option>
                      </select>
                    </div>
                    
                    {!formData.settings?.useMainGst && (
                      <InputRow 
                        label="Location GSTIN" 
                        value={formData.settings?.gstin || ''} 
                        onChange={(v: string) => setFormData({...formData, settings: {...formData.settings, gstin: v}})} 
                        placeholder="Enter 15 digit GSTIN"
                      />
                    )}
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    <button 
                      onClick={() => {
                        setFormData({ settings: { useMainGst: true, gstin: '' } });
                        setEditId(null);
                      }}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleSaveLocation}
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
          <div className='font-medium tracking-wide'>Location Master</div>
        </div>
      </div>
    </>
  );
}
