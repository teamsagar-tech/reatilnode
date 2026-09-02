import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newParty: any) => void;
  initialPartyName?: string;
}

// Reusable components matching PartyMaster.tsx style
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-[#eef5ed] text-[#1b5e58] font-bold text-[11px] px-2 py-1 mb-1 border-b border-[#a3c3be] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]">
    {children}
  </div>
);

const InputRow = ({ label, value, onChange, placeholder = "", width = "flex-1" }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">{label}</div>
    <input 
      className={`${width} bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800`}
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder={placeholder}
      autoComplete="new-password"
    />
  </div>
);

export default function PartyModal({ isOpen, onClose, onSave, initialPartyName = '' }: PartyModalProps) {
  const [formData, setFormData] = useState({
    // Basic Party Info
    partyName: initialPartyName,
    shortName: '',
    type: 'Single Brand',
    openingBalance: 0,
    // Legal Info
    gstin: '',
    panNumber: '',
    state: '',
    stateCode: '',
    // Address Info
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    pincode: '',
    city: '',
    taluka: '',
    district: '',
    // Contact Info
    contactPerson: '',
    mobileNumber: '',
    email: '',
    contactPerson2: '',
    mobileNumber2: '',
    contactPerson3: '',
    mobileNumber3: '',
    // Bank Info
    accountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    accountType: 'Savings',
    gstRawData: null as any
  });

  const [categories, setCategories] = useState<{cat: string, sub: string}[]>([]);
  const [tempCat, setTempCat] = useState('');
  const [tempSub, setTempSub] = useState('');

  const [loading, setLoading] = useState(false);
  
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
    if (formData.ifscCode && formData.ifscCode.length === 11) {
      fetch(`https://ifsc.razorpay.com/${formData.ifscCode}`)
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
  }, [formData.ifscCode]);

  const addCategory = () => {
    if (tempCat && tempSub) {
      setCategories([...categories, { cat: tempCat, sub: tempSub }]);
      setTempCat('');
      setTempSub('');
    }
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

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
      
      // Extract 6-digit pin code
      const pinMatch = adr.match(/\b\d{6}\b/);
      if (pinMatch) {
        pin = pinMatch[0];
        adr = adr.replace(pin, '');
      }

      // Remove state from address string
      if (stateName) {
        adr = adr.replace(new RegExp(`\\b${stateName}\\b`, 'i'), '');
      }

      // Clean up commas
      adr = adr.replace(/,\s*,/g, ',').replace(/,\s*$/, '').trim();
      if (adr.endsWith(',')) adr = adr.slice(0, -1);
      
      address1 = adr;

      // Attempt to extract city (usually the last word before state/pin)
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
      addressLine1: address1,
      addressLine2: '',
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
           // Silently ignore if not in cache
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
      
      console.log('====== RAW GST PORTAL RESPONSE ======');
      console.log(JSON.stringify(data, null, 2));
      console.log('=====================================');
      
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

  const handleSave = async () => {
    if (gstStatusError) {
      return alert(`Cannot save this Party. The GSTIN status is: ${gstStatusError}`);
    }
    if (!formData.partyName) return alert('Party Name is required');

    setLoading(true);
    try {
      const payload = {
        name: formData.partyName,
        short_name: formData.shortName,
        type: formData.type,
        opening_balance: formData.openingBalance,
        gst_no: formData.gstin,
        pan_number: formData.panNumber,
        state: formData.state,
        state_code: formData.stateCode,
        address_line1: formData.addressLine1,
        address_line2: formData.addressLine2,
        address_line3: formData.addressLine3,
        pincode: formData.pincode,
        city: formData.city,
        taluka: formData.taluka,
        district: formData.district,
        contact_person: formData.contactPerson,
        mobile: formData.mobileNumber,
        email: formData.email,
        contact_person2: formData.contactPerson2,
        mobile_number2: formData.mobileNumber2,
        contact_person3: formData.contactPerson3,
        mobile_number3: formData.mobileNumber3,
        account_name: formData.accountName,
        bank_name: formData.bankName,
        account_number: formData.accountNumber,
        ifsc_code: formData.ifscCode,
        branch: formData.branch,
        account_type: formData.accountType,
        categories: categories,
        billing_address: [formData.addressLine1, formData.addressLine2, formData.addressLine3, formData.city].filter(Boolean).join(', '),
        gst_raw_data: formData.gstRawData
      };

      const res = await fetch('https://api.retailnode.in/api/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        onSave({ id: data.id, ...payload });
        setFormData({
          partyName: '', shortName: '', type: 'Single Brand', openingBalance: 0,
          gstin: '', panNumber: '', state: '', stateCode: '',
          addressLine1: '', addressLine2: '', addressLine3: '', pincode: '', city: '', taluka: '', district: '',
          contactPerson: '', mobileNumber: '', email: '', contactPerson2: '', mobileNumber2: '', contactPerson3: '', mobileNumber3: '',
          accountName: '', bankName: '', accountNumber: '', ifscCode: '', branch: '', accountType: 'Savings',
          gstRawData: null
        });
        setGstStatusError(null);
        setCategories([]);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create party');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-8">
      <div className="bg-[#fcfaf2] border-2 border-black w-full max-w-[1100px] h-[90vh] shadow-[4px_4px_0_rgba(0,0,0,1)] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#1b5e58] text-white px-4 py-2 flex justify-between items-center border-b-2 border-black">
          <h2 className="font-bold tracking-wide">Party Master (Ledger Creation)</h2>
          <button onClick={onClose} className="hover:bg-red-500 rounded p-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body (3 Columns exactly like PartyMaster.tsx) */}
        <div className="flex-1 flex overflow-hidden p-4 gap-6">
          
          {/* Column 1: Legal, Basic & Address */}
          <div className="w-[32%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
            <SectionTitle>Legal Information</SectionTitle>
            
            <div className="flex items-center mb-[2px]">
              <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">GSTIN</div>
              <input 
                className={`flex-1 bg-white border ${gstStatusError ? 'border-red-500' : 'border-slate-400'} px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800`}
                value={formData.gstin} 
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setFormData({...formData, gstin: val, gstRawData: val.length < 15 ? null : formData.gstRawData});
                  if (gstStatusError) setGstStatusError(null);
                }} 
                placeholder="15-digit GSTIN"
                autoComplete="new-password"
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
                <option>Single Brand</option>
                <option>Multi Brand</option>
              </select>
            </div>
            <InputRow label="Opening Balance" value={formData.openingBalance} onChange={(v: string) => setFormData({...formData, openingBalance: Number(v) || 0})} />

            <SectionTitle>Address Information</SectionTitle>
            <InputRow label="Address Line 1" value={formData.addressLine1} onChange={(v: string) => setFormData({...formData, addressLine1: v})} />
            <InputRow label="Address Line 2" value={formData.addressLine2} onChange={(v: string) => setFormData({...formData, addressLine2: v})} />
            <InputRow label="Address Line 3" value={formData.addressLine3} onChange={(v: string) => setFormData({...formData, addressLine3: v})} />
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
            <InputRow label="Contact Person 2" value={formData.contactPerson2} onChange={(v: string) => setFormData({...formData, contactPerson2: v})} />
            <InputRow label="Mobile Number 2" value={formData.mobileNumber2} onChange={(v: string) => setFormData({...formData, mobileNumber2: v})} />
            <InputRow label="Contact Person 3" value={formData.contactPerson3} onChange={(v: string) => setFormData({...formData, contactPerson3: v})} />
            <InputRow label="Mobile Number 3" value={formData.mobileNumber3} onChange={(v: string) => setFormData({...formData, mobileNumber3: v})} />

            <SectionTitle>Bank Information</SectionTitle>
            <InputRow label="Account Name" value={formData.accountName} onChange={(v: string) => setFormData({...formData, accountName: v})} />
            <InputRow label="Bank Name" value={formData.bankName} onChange={(v: string) => setFormData({...formData, bankName: v})} />
            <InputRow label="Account Number" value={formData.accountNumber} onChange={(v: string) => setFormData({...formData, accountNumber: v})} />
            <InputRow label="IFSC Code" value={formData.ifscCode} onChange={(v: string) => setFormData({...formData, ifscCode: v.toUpperCase()})} />
            <InputRow label="Branch" value={formData.branch} onChange={(v: string) => setFormData({...formData, branch: v})} />
            <div className="flex items-center mb-[2px]">
              <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Account Type</div>
              <select 
                className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                value={formData.accountType} onChange={e => setFormData({...formData, accountType: e.target.value})}
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
          </div>

        </div>

        {/* Footer */}
        <div className="border-t-2 border-black p-3 bg-white flex justify-end gap-2 shadow-[inset_0_4px_6px_-1px_rgba(0,0,0,0.1)]">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-400 font-bold hover:bg-slate-100 transition-colors text-sm shadow-[1px_1px_0_rgba(0,0,0,0.5)]"
          >
            Reset
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-[#1b5e58] text-white border border-black font-bold hover:bg-[#12423d] transition-colors shadow-[2px_2px_0_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] text-sm flex items-center gap-2"
          >
            {loading ? 'Saving...' : 'Save (Ctrl+A)'}
          </button>
        </div>

      </div>
    </div>
  );
}
