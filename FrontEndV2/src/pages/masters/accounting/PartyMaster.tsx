import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MasterCreationModal from '../../../components/inventory/MasterCreationModal';
import SearchableDropdown from '../../../components/SearchableDropdown';


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

export default function PartyMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  const [editId, setEditId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    gstin: '', panNumber: '', state: 'Maharashtra', stateCode: '27',
    partyName: '', shortName: '', type: 'Sundry Debtor (Customer)',
    line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
    contactPerson: '', mobileNumber: '', email: '',
    contactNumber2: '', mobileNumber2: '', contactNumber3: '', mobileNumber3: '',
    accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings',
    gstRawData: null as any
  });

  const [categories, setCategories] = useState<{cat: string, sub: string}[]>([]);
  const [tempCat, setTempCat] = useState('');
  const [tempSub, setTempSub] = useState('');

  const addCategory = () => {
    if (tempCat.trim() || tempSub.trim()) {
      setCategories([...categories, { cat: tempCat.trim(), sub: tempSub.trim() }]);
      setTempCat('');
      setTempSub('');
    }
  };

  const removeCategory = (idx: number) => {
    setCategories(categories.filter((_, i) => i !== idx));
  };

  const [brands, setBrands] = useState<{name: string}[]>([]);
  const [tempBrand, setTempBrand] = useState('');
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [focusedBrandIndex, setFocusedBrandIndex] = useState(-1);
  const [masterModal, setMasterModal] = useState<{type: 'brand', initialValue: string} | null>(null);

  useEffect(() => {
    fetch('https://api.retailnode.in/api/masters/brand', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableBrands(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, [masterModal]);

  const addBrand = (name: string) => {
    if (name && !brands.some(b => b.name === name)) {
      setBrands([...brands, { name }]);
    }
    setTempBrand('');
    setShowBrandSuggestions(false);
    setFocusedBrandIndex(-1);
  };

  const removeBrand = (idx: number) => {
    setBrands(brands.filter((_, i) => i !== idx));
  };

  const [fetchingGST, setFetchingGST] = useState(false);
  const [captchaData, setCaptchaData] = useState<{sessionId: string, image: string} | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [gstStatusError, setGstStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (formData.pincode && formData.pincode.length === 6) {
      fetch(`https://api.postalpincode.in/pincode/${formData.pincode}`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].Status === "Success") {
            const po = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: prev.city || po.District,
              taluka: prev.taluka || po.Block || po.Division,
              district: prev.district || po.District
            }));
          }
        })
        .catch(err => console.error("Error fetching pincode data:", err));
    }
  }, [formData.pincode]);

  useEffect(() => {
    if (formData.ifsc && formData.ifsc.length === 11) {
      fetch(`https://ifsc.razorpay.com/${formData.ifsc}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.BANK) {
            setFormData(prev => ({
              ...prev,
              bankName: prev.bankName || data.BANK,
              branch: prev.branch || data.BRANCH
            }));
          }
        })
        .catch(err => console.error("Error fetching IFSC data:", err));
    }
  }, [formData.ifsc]);

  const fetchGSTCaptcha = async () => {
    setFetchingGST(true);
    try {
      const res = await fetch('https://api.retailnode.in/api/gst/captcha');
      const data = await res.json();
      if (data.sessionId && data.image) {
        setCaptchaData(data);
        setCaptchaInput('');
      } else {
        alert("Failed to fetch GST captcha");
      }
    } catch (e) {
      console.error(e);
      alert("Network error while fetching GST captcha");
    } finally {
      setFetchingGST(false);
    }
  };

  const applyGstData = (data: any, gstin: string) => {
    if (data.sts && data.sts !== "Active") {
      alert(`Cannot add this Party. GST Status is: ${data.sts}`);
      setGstStatusError(data.sts);
      return false;
    }

    setGstStatusError(null);
    const partyName = data.tradeNam || data.lgnm || '';
    const pan = gstin.substring(2, 12);
    const stateCode = gstin.substring(0, 2);
    
    const generateShortName = (name: string): string => {
      if (!name) return '';
      let s = name.toUpperCase();
      
      const suffixes = [
        { match: /\bPRIVATE LIMITED\b/g, replace: 'PVT LTD' },
        { match: /\bPVT\.?\s*LTD\.?\b/g, replace: 'PVT LTD' },
        { match: /\bLIMITED\b/g, replace: 'LTD' },
        { match: /\bLTD\.?\b/g, replace: 'LTD' },
        { match: /\bLLP\b/g, replace: 'LLP' },
        { match: /\bCOMPANY\b/g, replace: 'CO' },
        { match: /\bCORPORATION\b/g, replace: 'CORP' },
        { match: /\bENTERPRISES\b/g, replace: 'ENT' }
      ];

      let foundSuffix = '';
      for (const suf of suffixes) {
        if (s.match(suf.match)) {
          foundSuffix = ' ' + suf.replace;
          s = s.replace(suf.match, '').trim();
          break; 
        }
      }

      const words = s.split(/[\s,.-]+/);
      let acronym = '';
      for (const w of words) {
        if (w.length > 0 && !['AND', '&', 'OF', 'THE'].includes(w)) {
          acronym += w[0];
        }
      }

      return (acronym + foundSuffix).trim();
    };

    const shortName = generateShortName(partyName);

    const stateMap: {[key: string]: string} = {
      '01': 'Jammu and Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab', '04': 'Chandigarh',
      '05': 'Uttarakhand', '06': 'Haryana', '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
      '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh', '13': 'Nagaland', '14': 'Manipur',
      '15': 'Mizoram', '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam', '19': 'West Bengal',
      '20': 'Jharkhand', '21': 'Odisha', '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
      '25': 'Daman and Diu', '26': 'Dadra and Nagar Haveli', '27': 'Maharashtra', '29': 'Karnataka',
      '30': 'Goa', '31': 'Lakshadweep', '32': 'Kerala', '33': 'Tamil Nadu', '34': 'Puducherry',
      '35': 'Andaman and Nicobar Islands', '36': 'Telangana', '37': 'Andhra Pradesh', '38': 'Ladakh'
    };
    const stateName = stateMap[stateCode] || '';

    let address1 = '';
    let pin = '';
    let city = '';

    if (data.pradr && data.pradr.adr) {
      let adr = data.pradr.adr;
      
      const pinMatch = adr.match(/\b\d{6}\b/);
      if (pinMatch) {
        pin = pinMatch[0];
        adr = adr.replace(pin, '');
      }

      if (stateName) {
        adr = adr.replace(new RegExp(`\\b${stateName}\\b`, 'i'), '');
      }

      adr = adr.replace(/,\s*,/g, ',').replace(/,\s*$/, '').trim();
      if (adr.endsWith(',')) adr = adr.slice(0, -1);
      
      address1 = adr;

      const parts = adr.split(',').map((p: string) => p.trim());
      if (parts.length > 1) {
        city = parts[parts.length - 1];
      }
    }

    setFormData(prev => ({
      ...prev,
      partyName: partyName,
      shortName: shortName,
      panNumber: pan,
      stateCode: stateCode,
      state: stateName,
      line1: address1,
      line2: '',
      city: city,
      pincode: pin,
      gstRawData: data
    }));
    return true;
  };

  useEffect(() => {
    if (formData.gstin.length === 15 && !formData.gstRawData) {
      fetch(`https://api.retailnode.in/api/gst/cache/${formData.gstin}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Not in cache");
        })
        .then(data => {
          if (data) {
            applyGstData(data, formData.gstin);
          }
        })
        .catch(() => {
        });
    }
  }, [formData.gstin]);

  const submitCaptcha = async () => {
    if (!captchaData || !captchaInput || formData.gstin.length < 15) return;
    setFetchingGST(true);
    try {
      const res = await fetch('https://api.retailnode.in/api/gst/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: captchaData.sessionId,
          GSTIN: formData.gstin.toUpperCase(),
          captcha: captchaInput
        })
      });
      const data = await res.json();
      
      if (data.error || data.errorCode) {
        alert(data.error || data.message || "Invalid Captcha or GSTIN");
        setCaptchaData(null);
      } else if (data.sts !== "Active") {
        alert(`Cannot add this Party. GST Status is: ${data.sts}`);
        setGstStatusError(data.sts);
        setCaptchaData(null);
      } else {
        if (applyGstData(data, formData.gstin)) {
           setCaptchaData(null);
        }
        setCaptchaData(null);
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting GST Captcha");
      setCaptchaData(null);
    } finally {
      setFetchingGST(false);
    }
  };

  const [parties, setParties] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchParties = async () => {
    try {
      const res = await fetch('https://api.retailnode.in/api/masters/party', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setParties(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchParties();
  }, []);

  const handleSaveParty = async () => {
    if (gstStatusError) {
      return alert(`Cannot save this Party. The GSTIN status is: ${gstStatusError}`);
    }
    if (!formData.partyName) {
      alert('Party Name is required');
      return;
    }
    try {
      const url = editId ? `https://api.retailnode.in/api/masters/party/${editId}` : 'https://api.retailnode.in/api/masters/party';
      const res = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({...formData, categories, brands})
      });
      if (res.ok) {
        setFormData({
          gstin: '', panNumber: '', state: 'Maharashtra', stateCode: '27',
          partyName: '', shortName: '', type: 'Sundry Debtor (Customer)',
          line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
          contactPerson: '', mobileNumber: '', email: '',
          contactNumber2: '', mobileNumber2: '', contactNumber3: '', mobileNumber3: '',
          accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings',
          gstRawData: null
        });
        setCategories([]);
        setBrands([]);
        setGstStatusError(null);
        setEditId(null);
        setMode('list');
        fetchParties();
      } else {
        alert('Failed to save party');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving party');
    }
  };

  useEffect(() => {
    if (mode === 'create') {
      setTimeout(() => {
        document.getElementById('input-gstin')?.focus();
      }, 50);
    }
  }, [mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          setFormData({
            gstin: '', panNumber: '', state: 'Maharashtra', stateCode: '27',
            partyName: '', shortName: '', type: 'Sundry Debtor (Customer)',
            line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
            contactPerson: '', mobileNumber: '', email: '',
            contactNumber2: '', mobileNumber2: '', contactNumber3: '', mobileNumber3: '',
            accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings',
            gstRawData: null
          });
          setCategories([]);
          setBrands([]);
          setGstStatusError(null);
          setEditId(null);
          setMode('list');
        } else {
          navigate(-1);
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
        e.preventDefault();
        if (mode === 'list') setMode('create');
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        handleSaveParty();
      } else if (mode === 'list') {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, parties.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (parties[selectedIndex]) {
            const row = parties[selectedIndex];
            setFormData({
              gstin: row.gstin || '', panNumber: row.pan_number || '', state: row.state || 'Maharashtra', stateCode: row.state_code || '27',
              partyName: row.party_name || '', shortName: row.short_name || '', type: row.party_type || 'Sundry Debtor (Customer)',
              line1: row.line1 || '', line2: row.line2 || '', line3: row.line3 || '', pincode: row.pincode || '', city: row.city || '', taluka: row.taluka || '', district: row.district || '',
              contactPerson: row.contact_person || '', mobileNumber: row.mobile_number1 || '', email: row.email || '',
              contactNumber2: row.contact_number2 || '', mobileNumber2: row.mobile_number2 || '', contactNumber3: row.contact_number3 || '', mobileNumber3: row.mobile_number3 || '',
              accountName: row.account_name || '', bankName: row.bank_name || '', accountNumber: row.account_number || '', ifsc: row.ifsc || '', branch: row.branch || '', bankAccountType: row.bank_account_type || 'Savings',
              gstRawData: row.gst_raw_data && typeof row.gst_raw_data === 'string' && row.gst_raw_data.trim().startsWith('{') ? JSON.parse(row.gst_raw_data) : null
            });
            setCategories(row.categories ? (typeof row.categories === 'string' ? JSON.parse(row.categories) : row.categories) : []);
            setBrands(row.brands ? (typeof row.brands === 'string' ? JSON.parse(row.brands) : row.brands) : []);
            setEditId(row.id);
            setMode('create');
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode, formData, parties, selectedIndex]);

  return (
    <>
      <Helmet>
        <title>Party Master | RetailNode ERP</title>
      </Helmet>
      
      <div className='flex flex-col h-screen font-sans text-[13px] selection:bg-transparent overflow-hidden bg-[#e0efeb] w-full'>
        <div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>
          
          {/* Main Container */}
          <div className='flex-1 bg-[#fcfaf2] border-2 border-[#81a09d] flex flex-col overflow-hidden shadow-inner relative'>
            <div className='bg-[#1b5e58] text-white font-bold px-2 py-1 flex justify-between shrink-0'>
               <div>Master Creation</div>
               <div className='text-yellow-300'>Party Master (Ledger)</div>
            </div>
            
            <div className='p-2 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-2'>
                    <div className='font-bold text-slate-800 text-[14px]'>List of Parties (Ledgers)</div>
                    <button 
                      onClick={() => setMode('create')} 
                      className='bg-[#eef5ed] border border-[#a3c3be] px-2 py-1 font-bold text-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] hover:bg-[#ffe000] focus:bg-[#ffe000] outline-none text-[12px]'
                    >Create New (Alt/Opt+C)</button>
                  </div>
                  <table className='w-full text-left border-collapse border border-slate-400'>
                    <thead className='bg-[#eef5ed]'>
                      <tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-[12px]'>
                        <th className="px-2 py-1 border-r border-slate-300 w-[40px]">ID</th>
                        <th className="px-2 py-1 border-r border-slate-300 min-w-[150px]">Party Name</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[130px]">GSTIN</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[100px]">State</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[100px]">City</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[120px]">Contact Person</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[100px]">Mobile</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[120px]">Email</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[100px] text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parties.map((row, idx) => (
                        <tr 
                          key={row.id} 
                          onClick={() => {
                            setFormData({
                              gstin: row.gstin || '', panNumber: row.pan_number || '', state: row.state || 'Maharashtra', stateCode: row.state_code || '27',
                              partyName: row.party_name || '', shortName: row.short_name || '', type: row.party_type || 'Sundry Debtor (Customer)',
                              line1: row.line1 || '', line2: row.line2 || '', line3: row.line3 || '', pincode: row.pincode || '', city: row.city || '', taluka: row.taluka || '', district: row.district || '',
                              contactPerson: row.contact_person || '', mobileNumber: row.mobile_number1 || '', email: row.email || '',
                              contactNumber2: row.contact_number2 || '', mobileNumber2: row.mobile_number2 || '', contactNumber3: row.contact_number3 || '', mobileNumber3: row.mobile_number3 || '',
                              accountName: row.account_name || '', bankName: row.bank_name || '', accountNumber: row.account_number || '', ifsc: row.ifsc || '', branch: row.branch || '', bankAccountType: row.bank_account_type || 'Savings',
                              gstRawData: row.gst_raw_data && typeof row.gst_raw_data === 'string' && row.gst_raw_data.trim().startsWith('{') ? JSON.parse(row.gst_raw_data) : null
                            });
                            setCategories(row.categories ? (typeof row.categories === 'string' ? JSON.parse(row.categories) : row.categories) : []);
                            setBrands(row.brands ? (typeof row.brands === 'string' ? JSON.parse(row.brands) : row.brands) : []);
                            setEditId(row.id);
                            setMode('create');
                            setSelectedIndex(idx);
                          }}
                          className={`text-[12px] border-b border-slate-300 ${idx === selectedIndex ? 'bg-[#ffe000]' : (idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]')} hover:bg-[#ffffe0] cursor-pointer`}
                        >
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700 text-center">{row.id}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-bold text-[#1b5e58]">{row.party_name}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.gstin || '-'}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.state || '-'}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.city || '-'}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.contact_person || '-'}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.mobile_number1 || row.mobile_number || '-'}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.email || '-'}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-bold text-slate-900 text-right">{row.opening_balance} {row.party_type === 'Sundry Creditor (Vendor)' ? 'Cr' : 'Dr'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Legal, Basic & Address */}
                    <div className="w-[32%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Legal Information</SectionTitle>
                      
                      <div className="flex items-center mb-[2px]">
                        <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">GSTIN</div>
                        <input 
                          id="input-gstin"
                          className={`flex-1 bg-white border ${gstStatusError ? 'border-red-500' : 'border-slate-400'} px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800`}
                          value={formData.gstin} 
                          onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            setFormData({...formData, gstin: val, gstRawData: val.length < 15 ? null : formData.gstRawData});
                            if (gstStatusError) setGstStatusError(null);
                          }} 
                          placeholder="15-digit GSTIN"
                        />
                        {(!formData.gstRawData) && (
                        <button 
                          type="button"
                          onClick={fetchGSTCaptcha}
                          className="bg-[#1b5e58] hover:bg-[#13423e] text-white px-2 py-[2px] text-[11px] font-bold shadow-[1px_1px_0_rgba(255,255,255,0.5)] border border-[#0d2d2a] ml-1"
                        >
                          {fetchingGST ? "Loading..." : "Fetch Details"}
                        </button>
                        )}
                      </div>

                      {gstStatusError && (
                        <div className="ml-[110px] text-red-600 font-bold text-[10px] leading-tight mb-2">
                          Cannot use this GSTIN. Status: {gstStatusError}
                        </div>
                      )}

                      {captchaData && (
                        <div className="ml-[110px] bg-white border border-slate-300 p-2 shadow flex flex-col gap-2 mb-2 w-[calc(100%-110px)]">
                          <img src={captchaData.image} alt="captcha" className="h-10 border border-slate-300 object-contain w-32 bg-white" />
                          <div className="flex items-center gap-1">
                            <input 
                              type="text" 
                              placeholder="Enter Captcha" 
                              value={captchaInput}
                              onChange={e => setCaptchaInput(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') submitCaptcha();
                              }}
                              className="border border-slate-400 px-1 py-[2px] text-[12px] flex-1 focus:outline-none focus:bg-[#ffffe0]"
                            />
                            <button 
                              onClick={submitCaptcha}
                              disabled={fetchingGST}
                              className="bg-[#1b5e58] text-white px-2 py-[2px] font-bold text-[11px] shadow-[1px_1px_0_rgba(0,0,0,1)] hover:bg-[#12423d] disabled:opacity-50"
                            >
                              Verify
                            </button>
                            <button 
                              onClick={() => setCaptchaData(null)}
                              className="bg-red-500 text-white px-2 py-[2px] font-bold text-[11px] shadow-[1px_1px_0_rgba(0,0,0,1)] hover:bg-red-600"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      )}

                      <InputRow label="PAN Number" value={formData.panNumber} onChange={(v: string) => setFormData({...formData, panNumber: v.toUpperCase()})} />
                      <InputRow label="State" value={formData.state} onChange={(v: string) => setFormData({...formData, state: v})} />
                      <InputRow label="State Code" value={formData.stateCode} onChange={(v: string) => setFormData({...formData, stateCode: v})} width="w-[60px]" />

                      <SectionTitle>Basic Party Information</SectionTitle>
                      <InputRow label="Party Name" value={formData.partyName} onChange={(v: string) => setFormData({...formData, partyName: v})} />
                      <InputRow label="Short Name" value={formData.shortName} onChange={(v: string) => setFormData({...formData, shortName: v})} />
                      
                      <div className="flex items-center mb-[2px]">
                        <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Type</div>
                        <select 
                          className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                          value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                          <option>Sundry Debtor (Customer)</option>
                          <option>Sundry Creditor (Vendor)</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <SectionTitle>Address Information</SectionTitle>
                      <InputRow label="Address Line 1" value={formData.line1} onChange={(v: string) => setFormData({...formData, line1: v})} />
                      <InputRow label="Address Line 2" value={formData.line2} onChange={(v: string) => setFormData({...formData, line2: v})} />
                      <InputRow label="Address Line 3" value={formData.line3} onChange={(v: string) => setFormData({...formData, line3: v})} />
                      <InputRow label="Pincode" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} width="w-[80px]" />
                      <InputRow label="City" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} />
                      <InputRow label="Taluka" value={formData.taluka} onChange={(v: string) => setFormData({...formData, taluka: v})} />
                      <InputRow label="District" value={formData.district} onChange={(v: string) => setFormData({...formData, district: v})} />
                    </div>

                    {/* Column 2: Contact & Bank */}
                    <div className="w-[32%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Contact Information</SectionTitle>
                      <InputRow label="Contact Person" value={formData.contactPerson} onChange={(v: string) => setFormData({...formData, contactPerson: v})} />
                      <InputRow label="Mobile Number" value={formData.mobileNumber} onChange={(v: string) => setFormData({...formData, mobileNumber: v})} />
                      <InputRow label="Email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
                      <InputRow label="Contact Person 2" value={formData.contactNumber2} onChange={(v: string) => setFormData({...formData, contactNumber2: v})} />
                      <InputRow label="Mobile Number 2" value={formData.mobileNumber2} onChange={(v: string) => setFormData({...formData, mobileNumber2: v})} />
                      <InputRow label="Contact Person 3" value={formData.contactNumber3} onChange={(v: string) => setFormData({...formData, contactNumber3: v})} />
                      <InputRow label="Mobile Number 3" value={formData.mobileNumber3} onChange={(v: string) => setFormData({...formData, mobileNumber3: v})} />

                      <SectionTitle>Bank Information</SectionTitle>
                      <InputRow label="Account Name" value={formData.accountName} onChange={(v: string) => setFormData({...formData, accountName: v})} />
                      <InputRow label="Bank Name" value={formData.bankName} onChange={(v: string) => setFormData({...formData, bankName: v})} />
                      <InputRow label="Account Number" value={formData.accountNumber} onChange={(v: string) => setFormData({...formData, accountNumber: v})} />
                      <InputRow label="IFSC Code" value={formData.ifsc} onChange={(v: string) => setFormData({...formData, ifsc: v.toUpperCase()})} />
                      <InputRow label="Branch" value={formData.branch} onChange={(v: string) => setFormData({...formData, branch: v})} />
                      
                      <div className="flex items-center mb-[2px]">
                        <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Account Type</div>
                        <select 
                          className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                          value={formData.bankAccountType} onChange={e => setFormData({...formData, bankAccountType: e.target.value})}
                        >
                          <option>Savings</option>
                          <option>Current</option>
                        </select>
                      </div>
                    </div>

                    {/* Column 3: Category */}
                    <div className="flex-1 flex flex-col gap-1 pr-2 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Categorization</SectionTitle>
                      
                      <div className="flex items-center gap-1 mb-1">
                        <input 
                          className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                          placeholder="Category" 
                          value={tempCat} 
                          onChange={e => setTempCat(e.target.value)} 
                        />
                        <input 
                          className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                          placeholder="Subcategory" 
                          value={tempSub} 
                          onChange={e => setTempSub(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addCategory();
                            }
                          }}
                        />
                        <button 
                          type="button"
                          onClick={addCategory}
                          className="bg-[#eef5ed] border border-[#a3c3be] px-2 py-[2px] font-bold text-black hover:bg-[#ffe000] text-[11px] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
                        >
                          Add
                        </button>
                      </div>

                      {categories.length > 0 && (
                        <table className='w-full text-left border-collapse border border-slate-400 mt-1'>
                          <thead className='bg-[#eef5ed]'>
                            <tr className='border-b border-slate-400 text-slate-900 font-bold text-[11px]'>
                              <th className="px-1 py-[2px] border-r border-slate-300">Category</th>
                              <th className="px-1 py-[2px] border-r border-slate-300">Subcategory</th>
                              <th className="px-1 py-[2px] w-[30px] text-center"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((c, i) => (
                              <tr key={i} className='text-[11px] border-b border-slate-300 bg-white'>
                                <td className="px-1 py-[2px] border-r border-slate-300 text-slate-700">{c.cat}</td>
                                <td className="px-1 py-[2px] border-r border-slate-300 text-slate-700">{c.sub}</td>
                                <td className="px-1 py-[2px] text-center">
                                  <button onClick={() => removeCategory(i)} className="text-red-600 font-bold hover:text-red-800 text-[10px]">X</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      <div className="mt-4">
                        <SectionTitle>Assigned Brands</SectionTitle>
                        <div className="relative flex items-center gap-1 mb-1">
                          <input 
                            className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                            placeholder="Type brand name or Alt+C to create" 
                            value={tempBrand}
                            onFocus={() => { setShowBrandSuggestions(true); setFocusedBrandIndex(0); }}
                            onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                            onChange={e => {
                              setTempBrand(e.target.value);
                              setShowBrandSuggestions(true);
                              setFocusedBrandIndex(0);
                            }}
                            onKeyDown={e => {
                              if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
                                e.preventDefault();
                                setMasterModal({ type: 'brand', initialValue: tempBrand });
                                return;
                              }
                              
                              const filtered = availableBrands.filter(b => b.name.toLowerCase().includes(tempBrand.toLowerCase()));
                              
                              if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setFocusedBrandIndex(prev => Math.min(prev + 1, filtered.length - 1));
                              } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setFocusedBrandIndex(prev => Math.max(prev - 1, 0));
                              } else if (e.key === 'Enter') {
                                e.preventDefault();
                                if (filtered[focusedBrandIndex]) {
                                  addBrand(filtered[focusedBrandIndex].name);
                                }
                              }
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const b = availableBrands.find(b => b.name.toLowerCase() === tempBrand.toLowerCase());
                              if (b) addBrand(b.name);
                              else alert('Please select a valid brand or press Alt+C to create one.');
                            }}
                            className="bg-[#eef5ed] border border-[#a3c3be] px-2 py-[2px] font-bold text-black hover:bg-[#ffe000] text-[11px] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
                          >
                            Add
                          </button>
                          
                          {showBrandSuggestions && tempBrand && (
                            <div className="absolute top-full left-0 z-50 w-[calc(100%-40px)] bg-white border border-slate-400 shadow-lg max-h-40 overflow-y-auto mt-0">
                              {availableBrands.filter(b => b.name.toLowerCase().includes(tempBrand.toLowerCase())).map((b, idx) => (
                                <div 
                                  key={idx}
                                  className={`px-2 py-1 text-[11px] cursor-pointer border-b border-slate-200 ${idx === focusedBrandIndex ? 'bg-[#ffe000] font-bold' : 'hover:bg-slate-100'}`}
                                  onClick={() => addBrand(b.name)}
                                >
                                  {b.name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {brands.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {brands.map((b, i) => (
                              <div key={i} className="flex items-center gap-1 bg-[#1b5e58] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                {b.name}
                                <button onClick={() => removeBrand(i)} className="text-red-300 hover:text-red-100 ml-1">X</button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    <button 
                      onClick={() => {
                        setFormData({
                          gstin: '', panNumber: '', state: 'Maharashtra', stateCode: '27',
                          partyName: '', shortName: '', type: 'Sundry Debtor (Customer)',
                          line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
                          contactPerson: '', mobileNumber: '', email: '',
                          contactNumber2: '', mobileNumber2: '', contactNumber3: '', mobileNumber3: '',
                          accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings',
                          gstRawData: null
                        });
                        setCategories([]);
                        setBrands([]);
                        setGstStatusError(null);
                        setEditId(null);
                      }}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleSaveParty}
                      className='bg-[#1b5e58] border border-[#1b5e58] px-6 py-1 text-white font-bold hover:bg-[#144743] shadow-[inset_1px_1px_0_rgba(255,255,255,0.2)] outline-none focus:bg-[#0f3632]'
                    >
                      Save (Ctrl+A)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className='w-[120px] flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb] shrink-0'>
             {mode === 'list' ? (
               [
                 { key: 'Alt+C', label: 'Create' },
                 { key: 'F4', label: 'Edit' },
                 { key: 'F5', label: 'Delete' },
               ].map((f) => (
                 <button 
                   key={f.key} 
                   onClick={() => f.key === 'Alt+C' && setMode('create')}
                   className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
                 >
                   <span className='font-bold text-black text-[11px] w-[35px]'>{f.key}</span>
                   <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
                 </button>
               ))
             ) : (
               [
                 { key: 'Cmd+A', label: 'Save' }
               ].map((f) => (
                 <button 
                   key={f.key} 
                   onClick={() => { alert('Party Saved!'); setMode('list'); }}
                   className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
                 >
                   <span className='font-bold text-black text-[11px] w-[35px]'>{f.key}</span>
                   <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>{f.label}</span>
                 </button>
               ))
             )}
             
             <div className='flex-1' />
             
             <button 
               onClick={() => mode === 'create' ? setMode('list') : navigate(-1)}
               className='flex flex-row items-center px-2 py-1 bg-[#e0efeb] border border-[#a3c3be] hover:bg-[#c9e1dd] hover:border-[#81a09d] text-left transition-all shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]'
             >
                 <span className='font-bold text-black text-[11px] w-[35px] underline'>Q</span>
                 <span className='text-black text-[11px] font-medium border-l border-[#a3c3be] pl-1 ml-1'>Quit</span>
             </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className='bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]'>
          <div className='font-medium tracking-wide'>Party Master (Ledger Creation)</div>
        </div>
      </div>
      
      {masterModal && (
        <MasterCreationModal 
          isOpen={true}
          masterType={masterModal.type}
          initialValue={masterModal.initialValue}
          onClose={() => {
            setMasterModal(null);
            setTimeout(() => document.getElementById('input-gstin')?.focus(), 100);
          }}
          onSave={(type, data) => {
            if (type === 'brand') {
              addBrand(data.name);
            }
            setMasterModal(null);
          }}
        />
      )}
    </>
  );
}
