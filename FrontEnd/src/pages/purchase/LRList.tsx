import React from "react";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../components/SearchableDropdown';

export default function LRList() {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter States
  const [filterStatus, setFilterStatus] = useState('');
  const [filterParty, setFilterParty] = useState('');
  const [filterTransporter, setFilterTransporter] = useState('');
  const [filterLR, setFilterLR] = useState('');
  const [filterGRN, setFilterGRN] = useState('');
  const [filterBillNo, setFilterBillNo] = useState('');

  const [formData, setFormData] = useState<any>({});

  const initialData = React.useMemo(() => [
    { id: 1, lrNo: 'LR-1001', grn: 'GRN-001', status: 'In Transit', partyName: 'Alpha Logistics', transporter: 'VRL Logistics', bales: '50', billNo: 'INV-26-101', billDate: '2026-08-20' },
    { id: 2, lrNo: 'LR-1002', grn: 'GRN-002', status: 'Delivered', partyName: 'Beta Synthetics', transporter: 'Navata Transport', bales: '120', billNo: 'INV-26-102', billDate: '2026-08-21' },
    { id: 3, lrNo: 'LR-1003', grn: 'GRN-003', status: 'By Hand', partyName: 'Gamma Cottons', transporter: 'Self', bales: '10', billNo: 'INV-26-103', billDate: '2026-08-19' },
  ], []);

  const filteredData = React.useMemo(() => {
    return initialData.filter(item => {
      const matchStatus = filterStatus ? item.status === filterStatus : true;
      const matchParty = filterParty ? item.partyName === filterParty : true;
      const matchTransporter = filterTransporter ? item.transporter === filterTransporter : true;
      const matchLR = filterLR ? item.lrNo === filterLR : true;
      const matchGRN = filterGRN ? item.grn === filterGRN : true;
      const matchBillNo = filterBillNo ? item.billNo === filterBillNo : true;
      return matchStatus && matchParty && matchTransporter && matchLR && matchGRN && matchBillNo;
    });
  }, [initialData, filterStatus, filterParty, filterTransporter, filterLR, filterGRN, filterBillNo]);

  // Unique lists for dropdowns
  const uniqueLRs = Array.from(new Set(initialData.map(i => i.lrNo)));
  const uniqueGRNs = Array.from(new Set(initialData.map(i => i.grn)));
  const uniqueStatuses = Array.from(new Set(initialData.map(i => i.status)));
  const uniqueParties = Array.from(new Set(initialData.map(i => i.partyName)));
  const uniqueTransporters = Array.from(new Set(initialData.map(i => i.transporter)));
  const uniqueBillNos = Array.from(new Set(initialData.map(i => i.billNo)));

  // Adjust selected index if filtering shrinks the list
  useEffect(() => {
    if (selectedIndex >= filteredData.length && filteredData.length > 0) {
      setSelectedIndex(filteredData.length - 1);
    } else if (filteredData.length === 0) {
      setSelectedIndex(0);
    }
  }, [filteredData.length, selectedIndex]);

  useEffect(() => {
    if (mode === 'list' && listRef.current) {
      listRef.current.focus();
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'list') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev < filteredData.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Escape') {
          e.preventDefault();
          navigate('/dashboard');
        } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC' || e.key === 'ç')) {
          e.preventDefault();
          setMode('create');
          setTimeout(() => document.getElementById('field-0')?.focus(), 50);
        }
      } else {
        // Create Mode
        if (e.key === 'Escape') {
          e.preventDefault();
          setMode('list');
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
          e.preventDefault();
          setMode('list');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, filteredData.length]);

  const handleFieldKeyDown = (e: React.KeyboardEvent, nextFieldId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>LR (Lorry Receipts) | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>{mode === 'list' ? 'LR List' : 'LR Creation'}</div>
               <div className='text-yellow-300'>Lorry Receipts</div>
            </div>
            
            <div className='p-2 flex-1 flex flex-col overflow-hidden'>
               
               {mode === 'list' ? (
                 <>
                   {/* Filters / Header Info */}
                   <div className='flex justify-between items-end mb-2'>
                     <div className='flex gap-4 items-center flex-wrap'>
                       
                       <div>
                         <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>Status</div>
                         <SearchableDropdown 
                           className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[120px]"
                           value={filterStatus}
                           onChange={(v) => setFilterStatus(v)}
                           options={uniqueStatuses}
                           placeholder="All"
                           width="150px"
                         />
                       </div>

                       <div>
                         <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>LR No</div>
                         <SearchableDropdown 
                           className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[120px]"
                           value={filterLR}
                           onChange={(v) => setFilterLR(v)}
                           options={uniqueLRs}
                           placeholder="All"
                           width="150px"
                         />
                       </div>

                       <div>
                         <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>GRN</div>
                         <SearchableDropdown 
                           className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[120px]"
                           value={filterGRN}
                           onChange={(v) => setFilterGRN(v)}
                           options={uniqueGRNs}
                           placeholder="All"
                           width="150px"
                         />
                       </div>

                       <div>
                         <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>Party Name</div>
                         <SearchableDropdown 
                           className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[140px]"
                           value={filterParty}
                           onChange={(v) => setFilterParty(v)}
                           options={uniqueParties}
                           placeholder="All"
                           width="200px"
                         />
                       </div>
                       
                       <div>
                         <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>Bill No</div>
                         <SearchableDropdown 
                           className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[120px]"
                           value={filterBillNo}
                           onChange={(v) => setFilterBillNo(v)}
                           options={uniqueBillNos}
                           placeholder="All"
                           width="150px"
                         />
                       </div>

                       <div>
                         <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>Transporter</div>
                         <SearchableDropdown 
                           className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[140px]"
                           value={filterTransporter}
                           onChange={(v) => setFilterTransporter(v)}
                           options={uniqueTransporters}
                           placeholder="All"
                           width="200px"
                         />
                       </div>

                     </div>
                     <div className='flex items-center gap-2'>
                       <button 
                         onClick={() => { setMode('create'); setTimeout(() => document.getElementById('field-0')?.focus(), 50); }}
                         className='bg-[#1b5e58] border border-black text-white px-2 py-1 font-bold text-[12px] hover:bg-[#12423d] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                       >
                         Create New (Alt+C)
                       </button>
                     </div>
                   </div>

                   {/* Table Area */}
                   <div 
                     className='flex-1 border border-slate-400 bg-white overflow-y-auto outline-none'
                     tabIndex={0}
                     ref={listRef}
                   >
                     <table className='w-full text-left border-collapse'>
                       <thead className='bg-[#eef5ed] sticky top-0 shadow-sm'>
                         <tr className='border-b-2 border-slate-400 text-slate-900 font-bold'>
                           <th className='px-2 py-1 border-r border-slate-300 w-12 text-center'>ID</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-24'>LR No</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-24'>GRN</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-28'>Status</th>
                           <th className='px-2 py-1 border-r border-slate-300'>Party Name</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-24'>Bill No</th>
                           <th className='px-2 py-1 border-r border-slate-300'>Transporter</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-16 text-center'>Bales</th>
                           <th className='px-2 py-1 w-24 text-center'>Bill Date</th>
                         </tr>
                       </thead>
                       <tbody>
                         {filteredData.length > 0 ? filteredData.map((row, idx) => (
                           <tr 
                             key={row.id} 
                             onClick={() => setSelectedIndex(idx)}
                             className={`cursor-pointer ${selectedIndex === idx ? 'bg-[#ffe000] text-black font-bold' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')}`}
                           >
                             <td className={`px-2 py-1 border-r border-slate-300 text-center ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.id}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.lrNo}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.grn}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.status}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.partyName}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.billNo}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.transporter}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 text-center ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.bales}</td>
                             <td className='px-2 py-1 text-center'>{row.billDate}</td>
                           </tr>
                         )) : (
                           <tr>
                             <td colSpan={9} className="text-center py-4 font-bold text-slate-500 italic">
                               No LRs found for selected filters
                             </td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                 </>
               ) : (
                 <div className='flex flex-col mt-4'>
                   <div className='flex flex-col mb-4 bg-white border border-slate-400 p-4 shadow-sm max-w-[600px]'>
                     {['LR No', 'GRN', 'Status', 'Party Name', 'Bill No', 'Transporter', 'Bales', 'Bill Date'].map((label, i, arr) => (
                       <div key={label} className="flex items-center mb-1">
                         <div className="w-[120px] text-slate-800 font-bold text-[12px] text-right pr-2">
                           {label}
                         </div>
                         <div className="flex-1">
                           <input 
                             type={label === 'Bill Date' ? 'date' : 'text'}
                             id={`field-${i}`}
                             className="w-[300px] bg-[#e0efeb] border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                             value={formData[label] || ''}
                             onChange={(e) => setFormData({...formData, [label]: e.target.value})}
                             onKeyDown={(e) => handleFieldKeyDown(e, i === arr.length - 1 ? 'btn-save' : `field-${i+1}`)}
                           />
                         </div>
                       </div>
                     ))}

                     <div className="mt-6 text-right w-[420px]">
                        <button 
                          id="btn-save"
                          onClick={() => setMode('list')}
                          className='bg-[#1b5e58] border border-black text-white px-4 py-1 font-bold text-[12px] hover:bg-[#12423d] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                        >
                          Save (Cmd/Ctrl+A)
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
          <div className='font-medium tracking-wide'>LR Management</div>
        </div>
      </div>
    </>
  );
}
