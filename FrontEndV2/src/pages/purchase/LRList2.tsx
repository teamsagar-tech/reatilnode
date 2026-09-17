import { confirmDialog } from '../../store/useConfirmStore';
import { toast } from '../../store/useToastStore';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../components/SearchableDropdown';
import HundekariModal from '../../components/inventory/HundekariModal';

export default function LRList2() {
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

  const [formData, setFormData] = useState<any>({ inward_at_location_id: localStorage.getItem('default_inward_location_id') || '' });
  const [lrRows, setLrRows] = useState([{ id: 1, lr_no: '', received_bales: '', invoiced_bales: null as number | null, error: '', status: '', vendor_id: '' as string | number }]);
  const [initialData, setInitialData] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [hundekaris, setHundekaris] = useState<any[]>([]);
  const [transporters, setTransporters] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [showHundekariModal, setShowHundekariModal] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/pending-lrs`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setInitialData(Array.isArray(data) ? data : []))
    .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/party`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      const parties = Array.isArray(data) ? data : (data.data || []);
      const mapped = parties.map((p: any) => ({ ...p, name: p.party_name || p.name }));
      setVendors(mapped.filter((p: any) => p.party_type === 'Vendor'));
    })
    .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/hundekari`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      const hData = Array.isArray(data) ? data : (data.data || []);
      setHundekaris(hData.map((h: any) => ({ ...h, name: h.hundekari_name || h.name })));
    })
    .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/logistics/transporters`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      const tData = Array.isArray(data) ? data : (data.data || []);
      setTransporters(tData.map((t: any) => ({ ...t, name: t.transporter_name || t.name })));
    })
    .catch(console.error);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/Locations`, {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token') || localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => {
      const lData = Array.isArray(data) ? data : (data.data || []);
      setLocations(lData.map((l: any) => ({ ...l, name: l.location_name || l.name })));
    })
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
    }).sort((a, b) => b.id - a.id);
  }, [initialData, filterTransporter, filterLR, filterBale, filterGRN, filterParty]);

  // Unique lists for dropdowns
  const uniqueTransportersList = React.useMemo(() => {
    const map = new Map();
    transporters.forEach(t => map.set((t.name || t.transporter_name)?.toLowerCase(), t));
    return Array.from(map.values());
  }, [transporters]);

  const uniqueHundekarisList = React.useMemo(() => {
    const map = new Map();
    hundekaris.forEach(h => map.set((h.name || h.hundekari_name)?.toLowerCase(), h));
    return Array.from(map.values());
  }, [hundekaris]);

  const selectedTransporterName = formData.transporter_name || '';
  const selectedLRsInRows = lrRows.map(r => r.lr_no?.toUpperCase()).filter(Boolean);
  const pendingLRsForTransporter = initialData.filter(lr => 
    lr.transporter?.trim().toLowerCase() === selectedTransporterName?.trim().toLowerCase() &&
    !selectedLRsInRows.includes(lr.lrNo?.toUpperCase())
  );
  const uniqueTransporters = React.useMemo(() => [...new Set(initialData.filter(item => item.transporter != null && String(item.transporter).toLowerCase() !== 'null').map(item => String(item.transporter)).filter(Boolean))], [initialData]);
  const uniqueLRs = React.useMemo(() => [...new Set(initialData.filter(item => item.lrNo != null && String(item.lrNo).toLowerCase() !== 'null').map(item => String(item.lrNo)).filter(Boolean))], [initialData]);
  const uniqueBales = React.useMemo(() => [...new Set(initialData.filter(item => item.bales != null && String(item.bales).toLowerCase() !== 'null').map(item => String(item.bales)).filter(Boolean))], [initialData]);
  const uniqueGRNs = React.useMemo(() => [...new Set(initialData.filter(item => item.grn != null && String(item.grn).toLowerCase() !== 'null').map(item => String(item.grn)).filter(Boolean))], [initialData]);
  const uniqueParties = React.useMemo(() => [...new Set(initialData.filter(item => item.partyName != null && String(item.partyName).toLowerCase() !== 'null').map(item => String(item.partyName)).filter(Boolean))], [initialData]);

  // Adjust selected index if filtering shrinks the list
  useEffect(() => {
    if (selectedIndex >= filteredData.length && filteredData.length > 0) {
      setSelectedIndex(filteredData.length - 1);
    } else if (filteredData.length === 0) {
      setSelectedIndex(0);
    }
  }, [filteredData.length, selectedIndex]);

  const getRowBgClass = (idx: number, status: string) => {
    if (selectedIndex === idx) return 'bg-[#ffe000] text-black font-bold';
    if (!status) return idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]';
    
    const s = status.toLowerCase();
    if (s.includes('pending')) return 'bg-orange-200';
    if (s.includes('delivered')) return 'bg-green-200';
    if (s.includes('printed')) return 'bg-blue-200';
    
    return idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]';
  };

  useEffect(() => {
    if (mode === 'list' && listRef.current) {
      listRef.current.focus();
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (mode === 'list') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev < filteredData.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredData[selectedIndex]?.id) {
            if ((filteredData[selectedIndex].status || '').toLowerCase().includes('delivered')) {
              navigate('/inventory/barcodes/label-print-page', { state: { lr_nos: [filteredData[selectedIndex].lrNo] } });
            } else {
              navigate('/purchase-invoice', { state: { invoiceId: filteredData[selectedIndex].id, mode: 'view' } });
            }
          }
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
  }, [navigate, mode, filteredData, selectedIndex]);

  const handleFieldKeyDown = async (e: React.KeyboardEvent, nextFieldId: string) => {
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
        newRows[index].status = data.status || 'MATCHED';
        newRows[index].error = '';
      } else if (data.success && data.status === 'NO_INVOICE') {
        newRows[index].invoiced_bales = null;
        newRows[index].status = 'NO_INVOICE';
        newRows[index].error = 'Without Invoice';
      } else {
        newRows[index].invoiced_bales = null;
        newRows[index].status = 'ERROR';
        newRows[index].error = data.message || 'LR not found';
      }
      setLrRows(newRows);
    } catch (err) {
      console.error('Error verifying LR:', err);
    }
  };

  const handleSaveBatch = async () => {
    let locId = formData.inward_at_location_id;
    if (locId && isNaN(Number(locId))) {
      const loc = locations.find(l => l.name === locId || l.location_name === locId);
      if (loc) locId = loc.id;
    }

    if (!formData.transporter_id || !formData.hundekari_id || !locId) {
      toast.warning("Please fill all header fields (Transporter, Hundekari, Location)");
      return;
    }

    const validRows = lrRows.filter(r => r.lr_no && r.received_bales && r.status !== 'ERROR');
    if (validRows.length === 0) {
      toast.warning("Please enter at least one valid LR row");
      return;
    }

    const missingVendorRows = validRows.filter(r => r.status === 'NO_INVOICE' && !r.vendor_id);
    if (missingVendorRows.length > 0) {
      toast.warning("Please select a Party (Vendor) for LRs without invoices");
      return;
    }

    const hasMismatches = validRows.some(r => r.invoiced_bales !== null && parseInt(r.received_bales) !== r.invoiced_bales);
    if (hasMismatches) {
      const proceed = await confirmDialog("Warning: One or more LRs have a mismatch between Received Bales and Invoiced Bales. Are you sure you want to save?");
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
          inward_at_location_id: locId,
          lr_inward_date: formData.lr_inward_date || new Date().toISOString().split('T')[0],
          lrRows: validRows
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Batch LRs inwarded successfully!");
        setLrRows([{ id: 1, lr_no: '', received_bales: '', invoiced_bales: null, error: '', status: '', vendor_id: '' }]);
        setFormData({ inward_at_location_id: localStorage.getItem('default_inward_location_id') || '' });
        
        // Navigate to label print with the inwarded LR numbers
        const inwardedLRs = validRows.map(r => r.lr_no).filter(Boolean);
        if (inwardedLRs.length > 0) {
          navigate('/inventory/barcodes/label-print-page', { state: { lr_nos: inwardedLRs } });
        } else {
          setMode('list');
        }
      } else {
        toast.error(data.message || "Failed to save");
      }
    } catch (err) {
      console.error("Error saving bulk LRs", err);
      toast.error("Server Error while saving");
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
                         onClick={async () => { setMode('inward'); setTimeout(() => document.getElementById('field-0')?.focus(), 50); }}
                         className='bg-amber-600 border border-black text-white px-2 py-1 font-bold text-[12px] hover:bg-amber-700 shadow-[2px_2px_0_rgba(0,0,0,1)]'
                       >
                         LR Inwarded (Alt+I)
                       </button>
                       <button 
                         onClick={async () => { setMode('create'); setTimeout(() => document.getElementById('field-0')?.focus(), 50); }}
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
                           <th className='px-2 py-1 border-r border-slate-300 w-24 text-center'>Status</th>
                           <th className='px-2 py-1 border-r border-slate-300'>Party Name</th>
                           <th className='px-2 py-1 border-r border-slate-300 w-24'>Bill No</th>
                           <th className='px-2 py-1 w-24 text-center'>Bill Date</th>
                         </tr>
                       </thead>
                       <tbody>
                         {filteredData.length > 0 ? filteredData.map((row, idx) => (
                           <tr 
                             key={row.id} 
                             onClick={async () => setSelectedIndex(idx)}
                             className={`cursor-pointer ${getRowBgClass(idx, row.status)}`}
                           >
                             <td className={`px-2 py-1 border-r border-slate-300 text-center ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.id}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.transporter}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.lrNo}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 text-center ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.bales}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 text-center font-bold ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.status}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.partyName}</td>
                             <td className={`px-2 py-1 border-r border-slate-300 ${selectedIndex === idx ? 'border-r-black' : ''}`}>{row.billNo}</td>
                             <td className='px-2 py-1 text-center'>{row.billDate}</td>
                           </tr>
                         )) : (
                           <tr>
                             <td colSpan={10} className="text-center py-4 font-bold text-slate-500 italic">
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
                          <div className="w-[140px] text-slate-800 font-bold text-[12px] text-right pr-2">Inward Location</div>
                          <SearchableDropdown 
                            className="w-[250px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                            value={locations.find(l => String(l.id) === String(formData.inward_at_location_id))?.name || formData.inward_at_location_id || ''}
                            onChange={(v) => {
                              setFormData({...formData, inward_at_location_id: v});
                            }}
                            onSelect={(opt) => {
                              setFormData({...formData, inward_at_location_id: opt.id});
                              localStorage.setItem('default_inward_location_id', String(opt.id));
                            }}
                            options={locations}
                            displayKey="name"
                            placeholder="Select Location"
                          />
                        </div>

                        <div className="flex items-center mb-1 mt-4">
                          <div className="w-[140px] text-slate-800 font-bold text-[12px] text-right pr-2">Transporter</div>
                          <SearchableDropdown 
                            className="w-[250px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                            value={formData.transporter_name || ''}
                            onChange={(v) => setFormData({...formData, transporter_name: v})}
                            onSelect={(opt) => setFormData({...formData, transporter_name: opt.name || opt.transporter_name, transporter_id: opt.id})}
                            options={uniqueTransportersList}
                            displayKey="name"
                            placeholder="Select Transporter"
                          />
                        </div>

                        <div className="flex items-center mb-1">
                          <div className="w-[140px] text-slate-800 font-bold text-[12px] text-right pr-2">Hundekari</div>
                          <SearchableDropdown 
                            className="w-[250px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                            value={formData.hundekari_name || ''}
                            onChange={(v) => setFormData({...formData, hundekari_name: v})}
                            onSelect={(opt) => setFormData({...formData, hundekari_name: opt.name || opt.hundekari_name, hundekari_id: opt.id})}
                            onKeyDown={(e) => {
                              if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
                                e.preventDefault();
                                setShowHundekariModal(true);
                              }
                            }}
                            onNotFound={() => setShowHundekariModal(true)}
                            options={uniqueHundekarisList}
                            displayKey="name"
                            placeholder="Select Hundekari"
                          />
                        </div>

                        <div className="flex items-center mb-1">
                          <div className="w-[140px] text-slate-800 font-bold text-[12px] text-right pr-2">LR Inward Date</div>
                          <input 
                            type="date"
                            className="w-[150px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
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
                            <th className="px-2 py-1 text-left text-[12px] font-bold text-black border-r border-slate-400 w-[200px]">Party (If No Invoice)</th>
                            <th className="px-2 py-1 text-center text-[12px] font-bold text-black w-[50px]">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lrRows.map((row, index) => (
                            <tr key={row.id} className="border-b border-slate-300 hover:bg-[#ffffe0]">
                              <td className="px-2 py-1 text-[12px] font-bold text-slate-700 border-r border-slate-400">{index + 1}</td>
                              <td className="border-r border-slate-400 p-0">
                                <SearchableDropdown 
                                  className="w-full bg-transparent px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none"
                                  value={row.lr_no}
                                  onChange={(v) => {
                                    const newRows = [...lrRows];
                                    newRows[index].lr_no = v.toUpperCase();
                                    setLrRows(newRows);
                                  }}
                                  onSelect={(opt) => {
                                    const newRows = [...lrRows];
                                    newRows[index].lr_no = (opt.lrNo || '').toUpperCase();
                                    newRows[index].received_bales = String(opt.bales || '');
                                    newRows[index].invoiced_bales = opt.bales || null;
                                    newRows[index].status = opt.billNo ? 'MATCHED' : 'Pending';
                                    setLrRows(newRows);
                                  }}
                                  onBlur={() => handleLRBlur(index, row.lr_no)}
                                  options={pendingLRsForTransporter}
                                  displayKey="lrNo"
                                  renderOption={(opt: any) => (
                                    <div className="flex justify-between items-center w-full">
                                      <span className="font-bold text-slate-800">{opt.lrNo}</span>
                                      <span className="text-[10px] text-slate-500 font-normal truncate max-w-[200px]">
                                        <span className="mr-2">Bales: <span className="font-bold text-slate-700">{opt.bales || 0}</span></span>
                                      </span>
                                    </div>
                                  )}
                                  placeholder="Enter LR No"
                                  width="320px"
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
                                {row.status === 'MATCHED' ? (
                                  parseInt(row.received_bales) === row.invoiced_bales ? (
                                    <span className="text-green-600 flex items-center gap-1">✅ Matched</span>
                                  ) : (
                                    <span className="text-red-600 flex items-center gap-1" title={row.error}>⚠️ Mismatch</span>
                                  )
                                ) : row.status === 'NO_INVOICE' ? (
                                  <span className="bg-yellow-200 text-yellow-800 px-1 border border-yellow-400">⚠️ Without Invoice</span>
                                ) : (
                                  <span className="text-red-600 font-bold">{row.error || 'Pending'}</span>
                                )}
                              </td>
                              <td className="border-r border-slate-400 p-0 relative">
                                {row.status === 'NO_INVOICE' ? (
                                  <SearchableDropdown
                                    className="w-full bg-[#ffffe0] border border-orange-400 px-2 py-1 text-[11px] font-bold text-black focus:outline-none"
                                    value={row.vendor_name || ''}
                                    onChange={(v) => {
                                      const newRows = [...lrRows];
                                      newRows[index].vendor_name = v;
                                      if (!vendors.find(vd => vd.name === v)) {
                                          newRows[index].vendor_id = ''; 
                                      }
                                      setLrRows(newRows);
                                    }}
                                    onSelect={(opt) => {
                                      const newRows = [...lrRows];
                                      newRows[index].vendor_name = opt.name;
                                      newRows[index].vendor_id = opt.id;
                                      setLrRows(newRows);
                                    }}
                                    options={vendors}
                                    displayKey="name"
                                    placeholder="Select Party"
                                    width="250px"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-slate-100 flex items-center px-2 text-slate-400 text-[11px]">
                                    {row.status === 'MATCHED' ? 'Auto-linked' : '-'}
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-1 text-center">
                                <button 
                                  onClick={async () => {
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
                          onClick={async () => setLrRows([...lrRows, { id: Date.now(), lr_no: '', received_bales: '', invoiced_bales: null, error: '', status: '', vendor_id: '' }])}
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
                          onClick={async () => setMode('list')}
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
               onClick={async () => mode === 'create' ? setMode('list') : navigate('/dashboard')}
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

      {showHundekariModal && (
        <HundekariModal 
          isOpen={showHundekariModal} 
          onClose={() => setShowHundekariModal(false)}
          initialName={typeof formData.hundekari_name === 'string' && !uniqueHundekarisList.find((h:any) => h.name === formData.hundekari_name) ? formData.hundekari_name : ''}
          locations={locations}
          onSave={(newHundekari: any) => {
            setHundekaris([...hundekaris, newHundekari]);
            setFormData({ ...formData, hundekari_id: newHundekari.id, hundekari_name: newHundekari.name || newHundekari.hundekari_name });
            setShowHundekariModal(false);
          }}
        />
      )}
    </>
  );
}
