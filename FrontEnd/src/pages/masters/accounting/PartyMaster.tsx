import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { useMasterApi } from '../../../hooks/useMasterApi';

const handleFieldKeyDown = (e: any, nextId: any) => {};

export default function PartyMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  
  const [formData, setFormData] = useState<any>({
    gstin: '', panNumber: '', state: 'Maharashtra', stateCode: '27',
    partyName: '', shortName: '', type: 'Single Brand',
    line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
    contactPerson: '', mobileNumber: '', email: '',
    contactNumber2: '', mobileNumber2: '', contactNumber3: '', mobileNumber3: '',
    accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings'
  });

  const [categories, setCategories] = useState<{cat: string, sub: string}[]>([]);
  const [tempCat, setTempCat] = useState('');
  const [tempSub, setTempSub] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [brandsList, setBrandsList] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  // GST Captcha State
  const [captchaBase64, setCaptchaBase64] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [fetchingGST, setFetchingGST] = useState(false);

  const { data: sampleData, fetchList, saveRecord } = useMasterApi('masters/party');
  useEffect(() => { fetchList(); }, [fetchList]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/brand`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(data => setBrandsList(Array.isArray(data) ? data : []));

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/category`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.json()).then(data => setCategoriesList(Array.isArray(data) ? data : []));
  }, []);

  const handlePincodeBlur = () => {
    if (formData.pincode?.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            setFormData((prev: any) => ({
              ...prev,
              city: postOffice.Block !== 'NA' ? postOffice.Block : prev.city,
              district: postOffice.District !== 'NA' ? postOffice.District : prev.district,
              state: postOffice.State !== 'NA' ? postOffice.State : prev.state
            }));
          }
        })
        .catch(err => console.error("Error fetching pincode data:", err));
    }
  };

  const handleIFSCBlur = () => {
    if (formData.ifsc?.length === 11) {
      fetch(`https://ifsc.razorpay.com/${formData.ifsc}`)
        .then(res => res.json())
        .then(data => {
          setFormData((prev: any) => ({
            ...prev,
            bankName: data.BANK || prev.bankName,
            branch: data.BRANCH || prev.branch
          }));
        })
        .catch(err => console.error("Error fetching IFSC data:", err));
    }
  };

  const fetchGSTCaptcha = async () => {
    try {
      setFetchingGST(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gst/captcha`);
      const data = await res.json();
      if (data.success) {
        setCaptchaBase64(data.captchaBase64);
        setCaptchaInput('');
      } else {
        alert("Failed to fetch GST captcha");
      }
    } catch (e) {
      alert("Network error while fetching GST captcha");
    } finally {
      setFetchingGST(false);
    }
  };

  const fetchGSTDetails = async () => {
    if (!formData.gstin || formData.gstin.length !== 15) {
      alert("Please enter a valid 15-digit GSTIN.");
      return;
    }
    try {
      setFetchingGST(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gst/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gstin: formData.gstin, captchaText: captchaInput })
      });
      const data = await res.json();
      if (data.success && data.details) {
        const d = data.details;
        alert("GST details fetched successfully!");
        setFormData((prev: any) => ({
          ...prev,
          partyName: d.tradeName || d.legalName || prev.partyName,
          panNumber: formData.gstin.substring(2, 12),
          stateCode: formData.gstin.substring(0, 2),
          line1: d.pradr?.addr?.bno || prev.line1,
          line2: d.pradr?.addr?.st || prev.line2,
          line3: d.pradr?.addr?.loc || prev.line3,
          pincode: d.pradr?.addr?.pncd || prev.pincode,
          city: d.pradr?.addr?.dst || prev.city,
          state: d.pradr?.addr?.stcd || prev.state
        }));
        setCaptchaBase64('');
      } else {
        alert(data.message || "Failed to fetch details");
        fetchGSTCaptcha();
      }
    } catch (e) {
      alert("Network error while fetching GST details");
    } finally {
      setFetchingGST(false);
    }
  };

  useEffect(() => {
    if (mode === 'create') {
      setTimeout(() => {
        const firstInput = (document.querySelector('input[autofocus]') || document.getElementById('field-0') || document.querySelector('input[type="text"]')) as any;
        if (firstInput && typeof firstInput.focus === 'function') firstInput.focus();
      }, 50);
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          setMode('list');
        } else {
          navigate('/dashboard');
        }
      } else if (mode === 'list' && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(s => Math.min(s + 1, (sampleData?.length || 1) - 1));
      } else if (mode === 'list' && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(s => Math.max(s - 1, 0));
      } else if (mode === 'list' && e.key === 'Enter') {
        e.preventDefault();
        if (sampleData && sampleData[selectedIndex]) {
          const row = sampleData[selectedIndex];
          setFormData(row);
          try { setSelectedBrands(typeof row.brands === 'string' ? JSON.parse(row.brands) : (row.brands || [])); } catch(e){}
          try { setSelectedCategories(typeof row.categories === 'string' ? JSON.parse(row.categories) : (row.categories || [])); } catch(e){}
          setMode('create');
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {
        e.preventDefault();
        setMode('create');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        saveRecord({ ...formData, categories, brands: JSON.stringify(selectedBrands), category_mappings: JSON.stringify(selectedCategories) }).then(r => { if(r.success) setMode('list'); });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, sampleData, selectedIndex, formData, categories, selectedBrands, selectedCategories]);

  const InputGroup = ({ label, id, value, onChange, onBlur, nextId, width = 'w-full', type = 'text', placeholder = '', autoFocus = false }: any) => (
    <div className="flex flex-col gap-[2px] mb-2.5 group">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <input 
        id={id}
        autoFocus={autoFocus}
        type={type} 
        className={`bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all hover:border-slate-300 ${width}`}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={e => { if(nextId && typeof handleFieldKeyDown !== 'undefined') handleFieldKeyDown(e, nextId) }}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Party Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full px-2'>
        <div className='flex flex-1 gap-4 overflow-hidden'>
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden'>
            <div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-end gap-3 shrink-0">
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight">Party Master</h1>
                  <span className="text-slate-300 font-light mb-1">|</span>
                  <p className="text-sm font-medium text-slate-500">Ledger Configuration</p>
                </div>
                
                {mode === 'list' && (
                  <div className='flex items-center gap-4 flex-1 justify-end'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" placeholder="Search parties..." 
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button onClick={() => { setFormData({}); setSelectedBrands([]); setSelectedCategories([]); setMode('create'); }} className='bg-indigo-600 px-4 py-2 rounded-lg font-bold text-white shadow-md hover:bg-indigo-700 transition-all text-xs'>Create New (Alt+C)</button>
                  </div>
                )}
              </div>
              
              {mode === 'list' ? (
                <div className="border border-slate-200 rounded-xl overflow-y-auto custom-scrollbar flex-1">
                  <table className='w-full text-left border-collapse'>
                    <thead className='bg-slate-50 border-b border-slate-200 sticky top-0 z-10'>
                      <tr className='text-slate-600 font-bold text-xs uppercase tracking-wider'>
                        <th className="px-4 py-3 w-[60px]">ID</th>
                        <th className="px-4 py-3">Party Name</th>
                        <th className="px-4 py-3 w-[160px]">GSTIN</th>
                        <th className="px-4 py-3 w-[140px]">State</th>
                        <th className="px-4 py-3 w-[140px] text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sampleData.map((row, index) => (
                        <tr key={row.id} onDoubleClick={() => { 
                            setFormData(row); 
                            try { setSelectedBrands(typeof row.brands === 'string' ? JSON.parse(row.brands) : (row.brands || [])); } catch(e){}
                            try { setSelectedCategories(typeof row.categories === 'string' ? JSON.parse(row.categories) : (row.categories || [])); } catch(e){}
                            setMode('create'); 
                          }}
                          className={`text-xs cursor-pointer transition-colors group ${selectedIndex === index ? 'bg-amber-50/60 border-l-[3px] border-amber-400' : 'bg-white hover:bg-slate-50'}`}>
                          <td className="px-4 py-3 font-semibold text-slate-500">#{row.id}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{row.party_name}</td>
                          <td className="px-4 py-3 font-semibold text-slate-600">{row.gstin}</td>
                          <td className="px-4 py-3 font-semibold text-slate-600">{row.state}</td>
                          <td className="px-4 py-3 font-bold text-slate-900 text-right">{row.balance || "0"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1 */}
                    <div className="flex-1 flex flex-col gap-1 border-r border-slate-100 pr-6 overflow-y-auto pb-4 custom-scrollbar">
                      
                      <div className="mb-4 p-3 border border-indigo-100 bg-indigo-50/30 rounded-xl">
                        <InputGroup id="field-0" label="GSTIN" value={formData.gstin} onChange={(v: string) => setFormData({...formData, gstin: v.toUpperCase()})} placeholder="15-digit GSTIN" />
                        <div className="flex flex-col gap-2 mt-2">
                          {!captchaBase64 ? (
                            <button onClick={fetchGSTCaptcha} disabled={fetchingGST} className="bg-white border border-indigo-200 text-indigo-700 font-bold text-[10px] uppercase tracking-wider py-1.5 px-3 rounded shadow-sm hover:bg-indigo-50 transition-colors self-start">
                              {fetchingGST ? "Loading..." : "Verify via GST Portal"}
                            </button>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <img src={`data:image/jpeg;base64,${captchaBase64}`} alt="Captcha" className="h-10 object-contain self-start border border-slate-200 rounded" />
                              <div className="flex gap-2">
                                <input type="text" placeholder="Enter Captcha" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)} className="bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm w-32" />
                                <button onClick={fetchGSTDetails} disabled={fetchingGST || !captchaInput} className="bg-indigo-600 text-white font-bold text-[10px] uppercase px-3 rounded shadow-sm hover:bg-indigo-700">Submit</button>
                                <button onClick={() => setCaptchaBase64('')} className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase px-3 rounded shadow-sm hover:bg-slate-200">Cancel</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <InputGroup label="PAN Number" value={formData.panNumber} onChange={(v: string) => setFormData({...formData, panNumber: v.toUpperCase()})} />
                      <InputGroup label="State" value={formData.state} onChange={(v: string) => setFormData({...formData, state: v})} />
                      <InputGroup label="State Code" value={formData.stateCode} onChange={(v: string) => setFormData({...formData, stateCode: v})} width="w-[80px]" />
                      <InputGroup label="Party Name" value={formData.partyName} onChange={(v: string) => setFormData({...formData, partyName: v})} />
                      <InputGroup label="Short Name" value={formData.shortName || formData.name} onChange={(v: string) => setFormData({...formData, shortName: v})} />
                      
                      <div className="flex items-center mb-1.5 hover:bg-slate-50/50 p-1 rounded-lg transition-colors group">
                        <div className="w-[130px] text-slate-700 font-bold text-[11px] text-right pr-3 leading-tight tracking-wide group-hover:text-indigo-700 transition-colors">Type</div>
                        <select className="flex-1 bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:outline-none focus:border-indigo-400"
                          value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option>Single Brand</option><option>Multi Brand</option>
                        </select>
                      </div>

                      <InputGroup label="Pincode" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} onBlur={handlePincodeBlur} width="w-[100px]" />
                      <InputGroup label="Address Line 1" value={formData.line1} onChange={(v: string) => setFormData({...formData, line1: v})} />
                      <InputGroup label="Address Line 2" value={formData.line2} onChange={(v: string) => setFormData({...formData, line2: v})} />
                      <InputGroup label="City" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} />
                      <InputGroup label="District" value={formData.district} onChange={(v: string) => setFormData({...formData, district: v})} />
                    </div>

                    {/* Column 2 */}
                    <div className="flex-1 flex flex-col gap-1 border-r border-slate-100 pr-6 overflow-y-auto pb-4 custom-scrollbar">
                      <InputGroup label="Mobile Number" value={formData.mobileNumber} onChange={(v: string) => setFormData({...formData, mobileNumber: v})} />
                      <InputGroup label="Email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                      <InputGroup label="Contact Person" value={formData.contactPerson} onChange={(v: string) => setFormData({...formData, contactPerson: v})} />
                      
                      <div className="mt-4 border-t border-slate-100 pt-4" />
                      
                      <InputGroup label="IFSC Code" value={formData.ifsc} onChange={(v: string) => setFormData({...formData, ifsc: v.toUpperCase()})} onBlur={handleIFSCBlur} />
                      <InputGroup label="Bank Name" value={formData.bankName} onChange={(v: string) => setFormData({...formData, bankName: v})} />
                      <InputGroup label="Account Number" value={formData.accountNumber} onChange={(v: string) => setFormData({...formData, accountNumber: v})} />
                      <InputGroup label="Branch" value={formData.branch} onChange={(v: string) => setFormData({...formData, branch: v})} />
                      
                      <div className="flex items-center mb-1.5 hover:bg-slate-50/50 p-1 rounded-lg transition-colors group">
                        <div className="w-[130px] text-slate-700 font-bold text-[11px] text-right pr-3 leading-tight tracking-wide group-hover:text-indigo-700 transition-colors">Account Type</div>
                        <select className="flex-1 bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:outline-none focus:border-indigo-400"
                          value={formData.bankAccountType} onChange={e => setFormData({...formData, bankAccountType: e.target.value})}>
                          <option>Savings</option><option>Current</option>
                        </select>
                      </div>
                    </div>

                    {/* Column 3 */}
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4 custom-scrollbar">
                      
                      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Connected Brands</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedBrands.map((b, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-bold text-[10px]">
                              {b.name} <button onClick={() => setSelectedBrands(s => s.filter((_, idx) => idx !== i))} className="hover:text-rose-500">✕</button>
                            </span>
                          ))}
                        </div>
                        <select 
                          className="w-full bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md"
                          onChange={e => {
                            if(e.target.value && !selectedBrands.find(b => b.id.toString() === e.target.value)) {
                              const brand = brandsList.find(b => b.id.toString() === e.target.value);
                              if(brand) setSelectedBrands([...selectedBrands, {id: brand.id, name: brand.name}]);
                            }
                            e.target.value = "";
                          }}
                        >
                          <option value="">Select Brand...</option>
                          {brandsList.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                      </div>

                      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Connected Categories</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedCategories.map((c, i) => (
                            <span key={i} className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold text-[10px]">
                              {c.name} <button onClick={() => setSelectedCategories(s => s.filter((_, idx) => idx !== i))} className="hover:text-rose-500">✕</button>
                            </span>
                          ))}
                        </div>
                        <select 
                          className="w-full bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md"
                          onChange={e => {
                            if(e.target.value && !selectedCategories.find(c => c.id.toString() === e.target.value)) {
                              const cat = categoriesList.find(c => c.id.toString() === e.target.value);
                              if(cat) setSelectedCategories([...selectedCategories, {id: cat.id, name: cat.name}]);
                            }
                            e.target.value = "";
                          }}
                        >
                          <option value="">Select Category...</option>
                          {categoriesList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>

                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>
                    <button onClick={() => { setFormData({}); setSelectedBrands([]); setSelectedCategories([]); }} tabIndex={-1} className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'>Reset</button>
                    <button onClick={async () => {
                      const payload = { ...formData, brands: JSON.stringify(selectedBrands), category_mappings: JSON.stringify(selectedCategories) };
                      const res = await saveRecord(payload);
                      if (res.success) setMode('list');
                    }} className='bg-indigo-600 border border-indigo-600 px-8 py-2 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 text-xs'>Save (Ctrl+A)</button>
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
