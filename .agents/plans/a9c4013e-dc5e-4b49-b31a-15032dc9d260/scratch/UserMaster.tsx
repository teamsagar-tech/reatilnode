import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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

export default function UserMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // 'list', 'create_user', 'edit_user', 'create_series', 'edit_series'
  const [users, setUsers] = useState<any[]>([]);
  const [seriesList, setSeriesList] = useState<any[]>([]);
  
  const [userForm, setUserForm] = useState({ id: null as any, name: '', email: '', mobile_no: '', password: '', employee_id: '' });
  const [seriesForm, setSeriesForm] = useState({ id: null as any, series_name: '', start_num: '', end_num: '' });

  const fetchData = async () => {
    try {
      const [usersRes, seriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user-series`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (seriesRes.ok) setSeriesList(await seriesRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode !== 'list') setMode('list');
        else navigate(-1);
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {
        e.preventDefault();
        setMode('create_user');
        setUserForm({ id: null, name: '', email: '', mobile_no: '', password: '', employee_id: '' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode]);

  const handleSaveUser = async () => {
    if (!userForm.name || !userForm.email || (mode === 'create_user' && !userForm.password)) {
      alert('Name, Email, and Password are required');
      return;
    }
    try {
      const method = mode === 'edit_user' ? 'PUT' : 'POST';
      const url = mode === 'edit_user' 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/${userForm.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users`;
        
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        alert('User Saved Successfully!');
        setUserForm({ id: null, name: '', email: '', mobile_no: '', password: '', employee_id: '' });
        setMode('list');
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save user');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleSaveSeries = async () => {
    if (!seriesForm.series_name || !seriesForm.start_num || !seriesForm.end_num) {
      alert('All fields are required');
      return;
    }
    try {
      const method = mode === 'edit_series' ? 'PUT' : 'POST';
      const url = mode === 'edit_series' 
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user-series/${seriesForm.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/user-series`;
        
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(seriesForm)
      });
      if (res.ok) {
        alert('Series Saved Successfully!');
        setSeriesForm({ id: null, series_name: '', start_num: '', end_num: '' });
        setMode('list');
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save series');
      }
    } catch (err) {
      alert('Network error');
    }
  };



  return (
    <>
      <Helmet><title>User Master | RetailNode ERP</title></Helmet>
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>{mode === 'list' ? 'List of Users & Series' : 'Master Creation / Edit'}</div>
               <div className='text-yellow-300'>User Master</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-y-auto'>
              {mode === 'list' ? (
                <>
                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-[#1b5e58]">
                    <span className="font-bold text-[#1b5e58] text-[14px]">List of Users</span>
                    <button onClick={() => { setMode('create_user'); setUserForm({ id: null, name: '', email: '', mobile_no: '', password: '', employee_id: '' }); }} className="bg-[#eef5ed] border border-[#a3c3be] px-3 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] text-[12px]">Create New User (Alt+C)</button>
                  </div>
                  <table className="w-full text-left border-collapse bg-white border border-slate-300 mb-8">
                    <thead className="bg-[#eef5ed]">
                      <tr className="border-b-2 border-[#1b5e58] text-slate-900 font-bold text-[12px]">
                        <th className="px-2 py-1 border-r border-slate-300">Name</th>
                        <th className="px-2 py-1 border-r border-slate-300">Email</th>
                        <th className="px-2 py-1 border-r border-slate-300">Role</th>
                        <th className="px-2 py-1">Employee ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr 
                          key={u.id} 
                          tabIndex={0}
                          className="border-b border-slate-300 hover:bg-[#ffffe0] focus:bg-[#ffffe0] focus:outline-none cursor-pointer"
                          onClick={() => {
                            setUserForm({ ...u, password: '' });
                            setMode('edit_user');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              setUserForm({ ...u, password: '' });
                              setMode('edit_user');
                            }
                          }}
                        >
                          <td className="px-2 py-1 border-r border-slate-300">{u.name}</td>
                          <td className="px-2 py-1 border-r border-slate-300">{u.email}</td>
                          <td className="px-2 py-1 border-r border-slate-300 uppercase">{u.role}</td>
                          <td className="px-2 py-1 font-bold text-slate-800">{u.employee_id || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-[#1b5e58]">
                    <span className="font-bold text-[#1b5e58] text-[14px]">Employee ID Series</span>
                    <button onClick={() => { setMode('create_series'); setSeriesForm({ id: null, series_name: '', start_num: '', end_num: '' }); }} className="bg-[#eef5ed] border border-[#a3c3be] px-3 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] text-[12px]">Create New Series</button>
                  </div>
                  <table className="w-full text-left border-collapse bg-white border border-slate-300 w-1/2 min-w-[400px]">
                    <thead className="bg-[#eef5ed]">
                      <tr className="border-b-2 border-[#1b5e58] text-slate-900 font-bold text-[12px]">
                        <th className="px-2 py-1 border-r border-slate-300">Series Name</th>
                        <th className="px-2 py-1 border-r border-slate-300">Range</th>
                        <th className="px-2 py-1">Current Num</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seriesList.map(s => (
                        <tr 
                          key={s.id} 
                          tabIndex={0}
                          className="border-b border-slate-300 hover:bg-[#ffffe0] focus:bg-[#ffffe0] focus:outline-none cursor-pointer"
                          onClick={() => {
                            setSeriesForm({ ...s });
                            setMode('edit_series');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              setSeriesForm({ ...s });
                              setMode('edit_series');
                            }
                          }}
                        >
                          <td className="px-2 py-1 border-r border-slate-300 font-bold">{s.series_name}</td>
                          <td className="px-2 py-1 border-r border-slate-300">{s.start_num} - {s.end_num}</td>
                          <td className="px-2 py-1 text-slate-600">{s.current_num}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : mode === 'create_user' || mode === 'edit_user' ? (
                <div className="w-[500px]">
                  <SectionTitle>{mode === 'edit_user' ? 'Edit Employee / User Details' : 'New Employee / User Details'}</SectionTitle>
                  <InputRow label="Name:" value={userForm.name} onChange={(v: string) => setUserForm({...userForm, name: v})} />
                  <InputRow label="Email:" type="email" value={userForm.email} onChange={(v: string) => setUserForm({...userForm, email: v})} />
                  <InputRow label="Mobile No:" value={userForm.mobile_no} onChange={(v: string) => setUserForm({...userForm, mobile_no: v})} />
                  {mode === 'create_user' && (
                    <InputRow label="Password:" type="password" value={userForm.password} onChange={(v: string) => setUserForm({...userForm, password: v})} />
                  )}
                  <InputRow label="Employee ID:" placeholder="e.g. 7, 101" value={userForm.employee_id} onChange={(v: string) => setUserForm({...userForm, employee_id: v})} />
                  <div className="mt-4 ml-[110px]">
                    <button onClick={handleSaveUser} className="bg-yellow-400 px-4 py-1 font-bold text-black border border-yellow-600 hover:bg-yellow-500 shadow-sm text-xs">Save User</button>
                  </div>
                </div>
              ) : (
                <div className="w-[400px]">
                  <SectionTitle>{mode === 'edit_series' ? 'Edit ID Series' : 'New ID Series'}</SectionTitle>
                  <InputRow label="Series Name:" placeholder="e.g. Admin, First Floor" value={seriesForm.series_name} onChange={(v: string) => setSeriesForm({...seriesForm, series_name: v})} />
                  <InputRow label="Start Number:" type="number" value={seriesForm.start_num} onChange={(v: string) => setSeriesForm({...seriesForm, start_num: v})} />
                  <InputRow label="End Number:" type="number" value={seriesForm.end_num} onChange={(v: string) => setSeriesForm({...seriesForm, end_num: v})} />
                  <div className="mt-4 ml-[110px]">
                    <button onClick={handleSaveSeries} className="bg-yellow-400 px-4 py-1 font-bold text-black border border-yellow-600 hover:bg-yellow-500 shadow-sm text-xs">Save Series</button>
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
               { key: 'Alt+C', label: 'Create' },
             ].map((f) => (
               <button key={f.key} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'>
                 <span className='font-bold text-black text-[11px] w-[35px]'>{f.key}</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
               </button>
             ))}
             <div className='flex-1' />
             <div className="flex flex-col items-center justify-center p-2 mb-2 border-t border-[#a3c3be] mx-2 pt-4">
               <svg width="64" height="64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="100" cy="100" r="86" fill="transparent" stroke="#1b5e58" strokeWidth="14" />
                 <text x="100" y="100" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="72" textAnchor="middle" dominantBaseline="central">
                   <tspan fill="#12423d">RN</tspan><tspan fill="#1b5e58">.</tspan>
                 </text>
               </svg>
             </div>
             <button onClick={() => mode !== 'list' ? setMode('list') : navigate(-1)} className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] text-left'>
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>User Master</div>
        </div>
      </div>
    </>
  );
}
