import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../components/SearchableDropdown';

export default function LRList() {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter States
  const [filterTransporter, setFilterTransporter] = useState('');
  const [filterLR, setFilterLR] = useState('');
  const [filterBale, setFilterBale] = useState('');
  const [filterGRN, setFilterGRN] = useState('');
  const [filterParty, setFilterParty] = useState('');

  const [formData, setFormData] = useState<any>({});
  const [lrRows, setLrRows] = useState([{ id: 1, lr_no: '', received_bales: '', invoiced_bales: null as number | null, error: '' }]);
  const [initialData, setInitialData] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/pending-lrs`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setInitialData(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, []);

  const filteredData = React.useMemo(() => {
    return initialData.filter(item => {
      const matchTransporter = filterTransporter ? item.transporter === filterTransporter : true;
      const matchLR = filterLR ? item.lrNo === filterLR : true;
      const matchBale = filterBale ? String(item.bales) === filterBale : true;
      const matchGRN = filterGRN ? item.grn === filterGRN : true;
      const matchParty = filterParty ? item.partyName === filterParty : true;
      
      return matchTransporter && matchLR && matchBale && matchGRN && matchParty;
    }).sort((a, b) => {
      const aPending = a.status === 'LR PENDING';
      const bPending = b.status === 'LR PENDING';
      if (aPending && !bPending) return -1;
      if (!aPending && bPending) return 1;
      return 0; // retain original order for others
    });
  }, [initialData, filterTransporter, filterLR, filterBale, filterGRN, filterParty]);

  // Unique lists for dropdowns
  const uniqueTransporters = React.useMemo(() => [...new Set(initialData.map(item => item.transporter).filter(Boolean))], [initialData]);
  const uniqueLRs = React.useMemo(() => [...new Set(initialData.map(item => item.lrNo).filter(Boolean))], [initialData]);
  const uniqueBales = React.useMemo(() => [...new Set(initialData.map(item => String(item.bales)).filter(Boolean))], [initialData]);
  const uniqueGRNs = React.useMemo(() => [...new Set(initialData.map(item => item.grn).filter(Boolean))], [initialData]);
  const uniqueParties = React.useMemo(() => [...new Set(initialData.map(item => item.partyName).filter(Boolean))], [initialData]);

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
        } else if (e.altKey && (e.key.toLowerCase() === 'i' || e.code === 'KeyI' || e.key === 'ˆ')) {
          e.preventDefault();
          setMode('inward');
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

  const handleLRBlur = async (index: number, lr_no: string) => {
    if (!lr_no.trim()) return;
    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/verify-lr-bales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ lr_no })
      });
      const data = await res.json();
      
      const newRows = [...lrRows];
      if (data.success && data.expectedBales !== null) {
        newRows[index].invoiced_bales = data.expectedBales;
        newRows[index].error = '';
      } else {
        newRows[index].invoiced_bales = null;
        newRows[index].error = data.message || 'LR not found';
      }
      setLrRows(newRows);
    } catch (err) {
      console.error('Error verifying LR:', err);
    }
  };

  const handleSaveBatch = async () => {
    if (!formData.transporter_id || !formData.hundekari_id || !formData.inward_at_location_id) {
      alert("Please fill all header fields (Transporter, Hundekari, Location)");
      return;
    }

    const validRows = lrRows.filter(r => r.lr_no && r.received_bales);
    if (validRows.length === 0) {
      alert("Please enter at least one LR row");
      return;
    }

    const hasMismatches = validRows.some(r => r.invoiced_bales !== null && parseInt(r.received_bales) !== r.invoiced_bales);
    if (hasMismatches) {
      const proceed = window.confirm("Warning: One or more LRs have a mismatch between Received Bales and Invoiced Bales. Are you sure you want to save?");
      if (!proceed) return;
    }

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/bulk-unlinked-lrs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transporter_id: formData.transporter_id,
          hundekari_id: formData.hundekari_id,
          inward_at_location_id: formData.inward_at_location_id,
          lr_inward_date: formData.lr_inward_date || new Date().toISOString().split('T')[0],
          lrRows: validRows
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Batch LRs inwarded successfully!");
        setLrRows([{ id: 1, lr_no: '', received_bales: '', invoiced_bales: null, error: '' }]);
        setFormData({});
        setMode('list');
      } else {
        alert(data.message || "Failed to save");
      }
    } catch (err) {
      console.error("Error saving bulk LRs", err);
      alert("Server Error while saving");
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
                          <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>Transporter</div>
                          <SearchableDropdown 
                            id="filter-transporter"
                            className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[140px]"
                            value={filterTransporter}
                            onChange={(v) => setFilterTransporter(v)}
                            onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('filter-lr')?.focus(); }}
                            onSelect={() => setTimeout(() => document.getElementById('filter-lr')?.focus(), 10)}
                            options={uniqueTransporters}
                            placeholder="All"
                            width="200px"
                          />
                        </div>

                        <div>
                          <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>LR No</div>
                          <SearchableDropdown 
                            id="filter-lr"
                            className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[120px]"
                            value={filterLR}
                            onChange={(v) => setFilterLR(v)}
                            onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('filter-bale')?.focus(); }}
                            onSelect={() => setTimeout(() => document.getElementById('filter-bale')?.focus(), 10)}
                            options={uniqueLRs}
                            placeholder="All"
                            width="150px"
                          />
                        </div>

                        <div>
                          <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>Bale</div>
                          <SearchableDropdown 
                            id="filter-bale"
                            className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[80px]"
                            value={filterBale}
                            onChange={(v) => setFilterBale(v)}
                            onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('filter-grn')?.focus(); }}
                            onSelect={() => setTimeout(() => document.getElementById('filter-grn')?.focus(), 10)}
                            options={uniqueBales}
                            placeholder="All"
                            width="100px"
                          />
                        </div>

                        <div>
                          <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>GRN</div>
                          <SearchableDropdown 
                            id="filter-grn"
                            className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[120px]"
                            value={filterGRN}
                            onChange={(v) => setFilterGRN(v)}
                            onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('filter-party')?.focus(); }}
                            onSelect={() => setTimeout(() => document.getElementById('filter-party')?.focus(), 10)}
                            options={uniqueGRNs}
                            placeholder="All"
                            width="150px"
                          />
                        </div>
                        
                        <div>
                          <div className='text-[11px] font-bold text-slate-600 mb-[2px]'>Party Name</div>
                          <SearchableDropdown 
                            id="filter-party"
                            className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 w-[140px]"
                            value={filterParty}
                            onChange={(v) => setFilterParty(v)}
                            onKeyDown={(e) => { if (e.key === 'Enter') document.getElementById('filter-transporter')?.focus(); }}
                            onSelect={() => setTimeout(() => document.getElementById('filter-transporter')?.focus(), 10)}
                            options={uniqueParties}
                            placeholder="All"
                            width="200px"
                          />
                        </div>

                     </div>
                     <div className='flex items-center gap-2'>
                       <button 
                         onClick={() => { setMode('inward'); setTimeout(() => document.getElementById('field-0')?.focus(), 50); }}
                         className='bg-amber-600 border border-black text-white px-2 py-1 font-bold text-[12px] hover:bg-amber-700 shadow-[2px_2px_0_rgba(0,0,0,1)]'
                       >
                         LR Inwarded (Alt+I)
                       </button>
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
                           <th className='px-2 py-1 border-r border-slate-300'>Transporter</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-24'>LR No</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-16 text-center'>Bales</th>
                           <th className='px-2 py-1 border-r border-slate-300'>Party Name</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-24'>Bill No</th>
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
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.transporter}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.lrNo}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 text-center ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.bales}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.partyName}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.billNo}</td>
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
               ) : mode === 'inward' ? (
                  <div className='flex flex-col flex-1 p-2 bg-[#fcfaf2]'>
                    <div className="flex gap-12 max-w-[800px] mb-4">
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="text-[12px] font-bold text-[#1b5e58] border-b border-[#a3c3be] mb-2 pb-1">Batch Header Details</div>
                        
                        <div className="flex items-center mb-1">
                          <div className="w-[140px] text-slate-800 font-bold text-[12px] text-right pr-2">Transporter</div>
                          <SearchableDropdown 
                            className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                            value={formData.transporter_id || ''}
                            onChange={(v) => setFormData({...formData, transporter_id: v})}
                            options={['VRL Logistics', 'SafeExpress', 'TCI Freight']} // Mocked for now
                            placeholder="Select Transporter"
                          />
                        </div>

                        <div className="flex items-center mb-1">
                          <div className="w-[140px] text-slate-800 font-bold text-[12px] text-right pr-2">Hundekari</div>
                          <SearchableDropdown 
                            className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                            value={formData.hundekari_id || ''}
                            onChange={(v) => setFormData({...formData, hundekari_id: v})}
                            options={['Shreeji Transport', 'Kalyan Hundekari']}
                            placeholder="Select Hundekari"
                          />
                        </div>

                        <div className="flex items-center mb-1 mt-4">
                          <div className="w-[140px] text-slate-800 font-bold text-[12px] text-right pr-2">Inward Location</div>
                          <SearchableDropdown 
                            className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                            value={formData.inward_at_location_id || ''}
                            onChange={(v) => setFormData({...formData, inward_at_location_id: v})}
                            options={['Godown A', 'Main Store', 'Warehouse 1']}
                            placeholder="Select Location"
                          />
                        </div>

                        <div className="flex items-center mb-1">
                          <div className="w-[140px] text-slate-800 font-bold text-[12px] text-right pr-2">LR Inward Date</div>
                          <input 
                            type="date"
                            className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                            value={formData.lr_inward_date || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({...formData, lr_inward_date: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 border border-black bg-white max-w-[900px]">
                      <table className="w-full">
                        <thead className="bg-[#e8f0eb] border-b border-black">
                          <tr>
                            <th className="px-2 py-1 text-left text-[12px] font-bold text-black border-r border-slate-400 w-[50px]">S.No</th>
                            <th className="px-2 py-1 text-left text-[12px] font-bold text-black border-r border-slate-400 w-[200px]">LR No</th>
                            <th className="px-2 py-1 text-left text-[12px] font-bold text-black border-r border-slate-400 w-[120px]">Received Bales</th>
                            <th className="px-2 py-1 text-left text-[12px] font-bold text-black border-r border-slate-400 w-[120px]">Invoiced Bales</th>
                            <th className="px-2 py-1 text-left text-[12px] font-bold text-black border-r border-slate-400">Status</th>
                            <th className="px-2 py-1 text-center text-[12px] font-bold text-black w-[50px]">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lrRows.map((row, index) => (
                            <tr key={row.id} className="border-b border-slate-300 hover:bg-[#ffffe0]">
                              <td className="px-2 py-1 text-[12px] font-bold text-slate-700 border-r border-slate-400">{index + 1}</td>
                              <td className="border-r border-slate-400 p-0">
                                <input 
                                  type="text"
                                  className="w-full bg-transparent px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none"
                                  value={row.lr_no}
                                  onChange={(e) => {
                                    const newRows = [...lrRows];
                                    newRows[index].lr_no = e.target.value.toUpperCase();
                                    setLrRows(newRows);
                                  }}
                                  onBlur={() => handleLRBlur(index, row.lr_no)}
                                  placeholder="Enter LR No"
                                />
                              </td>
                              <td className="border-r border-slate-400 p-0">
                                <input 
                                  type="number"
                                  className="w-full bg-transparent px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none"
                                  value={row.received_bales}
                                  onChange={(e) => {
                                    const newRows = [...lrRows];
                                    newRows[index].received_bales = e.target.value;
                                    setLrRows(newRows);
                                  }}
                                  placeholder="0"
                                />
                              </td>
                              <td className="px-2 py-1 text-[12px] font-bold text-slate-700 border-r border-slate-400 bg-slate-100">
                                {row.invoiced_bales !== null ? row.invoiced_bales : '-'}
                              </td>
                              <td className="px-2 py-1 text-[12px] font-bold border-r border-slate-400">
                                {row.invoiced_bales !== null ? (
                                  parseInt(row.received_bales) === row.invoiced_bales ? (
                                    <span className="text-green-600 flex items-center gap-1">✅ Matched</span>
                                  ) : (
                                    <span className="text-red-600 flex items-center gap-1" title={row.error}>⚠️ Mismatch</span>
                                  )
                                ) : (
                                  <span className="text-slate-500">{row.error || 'Pending'}</span>
                                )}
                              </td>
                              <td className="px-2 py-1 text-center">
                                <button 
                                  onClick={() => {
                                    if (lrRows.length > 1) {
                                      setLrRows(lrRows.filter((_, i) => i !== index));
                                    }
                                  }}
                                  className="text-red-600 font-bold hover:text-red-800"
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="p-2 border-t border-black bg-[#f1f5f9]">
                        <button 
                          onClick={() => setLrRows([...lrRows, { id: Date.now(), lr_no: '', received_bales: '', invoiced_bales: null, error: '' }])}
                          className="text-[#1b5e58] font-bold text-[12px] hover:underline"
                        >
                          + Add Another LR
                        </button>
                      </div>
                    </div>

                    <div className="mt-8">
                       <button 
                         onClick={handleSaveBatch}
                         className='bg-[#1b5e58] border border-black text-white px-6 py-1.5 font-bold text-[12px] hover:bg-[#12423d] shadow-[2px_2px_0_rgba(0,0,0,1)]'
                       >
                         Save Bulk LR Inward (Cmd+S)
                       </button>
                    </div>
                  </div>
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
