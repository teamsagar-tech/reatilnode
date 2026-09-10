import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MasterCreationModal from './MasterCreationModal';

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
    type: 'Sundry Creditor (Vendor)',
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
  
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);
  const [showCatSuggestions, setShowCatSuggestions] = useState(false);
  const [focusedCatIndex, setFocusedCatIndex] = useState(-1);
  const [masterModal, setMasterModal] = useState<{type: 'brand' | 'partycategory' | 'partysubcategory', initialValue: string, parentId?: number} | null>(null);
  const [showSubSuggestions, setShowSubSuggestions] = useState(false);
  const [focusedSubIndex, setFocusedSubIndex] = useState(-1);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/partycategories`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableCategories(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, [masterModal]);

  useEffect(() => {
    if (!selectedCatId) {
      setAvailableSubcategories([]);
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/partysubcategories?categoryId=${selectedCatId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableSubcategories(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, [selectedCatId, masterModal]);

  const handleAddCategory = () => {
    if (!tempCat.trim()) return;

    const catMatch = availableCategories.find(c => c.name.toLowerCase() === tempCat.trim().toLowerCase());
    if (!catMatch) {
      setMasterModal({ type: 'partycategory', initialValue: tempCat.trim() });
      return;
    }

    if (tempSub.trim()) {
      const subMatch = availableSubcategories.find(s => s.name.toLowerCase() === tempSub.trim().toLowerCase());
      if (!subMatch) {
        setMasterModal({ type: 'partysubcategory', initialValue: tempSub.trim(), parentId: catMatch.id });
        return;
      }
    }

    setCategories([...categories, { cat: catMatch.name, sub: tempSub.trim() }]);
    setTempCat('');
    setTempSub('');
    setSelectedCatId(null);
    setShowCatSuggestions(false);
    setShowSubSuggestions(false);
  };

  const [brands, setBrands] = useState<{name: string}[]>([]);
  const [brandType, setBrandType] = useState<'Single' | 'Multi'>('Multi');
  const [tempBrand, setTempBrand] = useState('');
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [focusedBrandIndex, setFocusedBrandIndex] = useState(-1);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/brand`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setAvailableBrands(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, [masterModal]);

  const handleAddBrand = (nameToSearch?: string) => {
    const val = (nameToSearch || tempBrand).trim();
    if (!val) return;
    
    const brandMatch = availableBrands.find(b => b.name.toLowerCase() === val.toLowerCase());
    if (!brandMatch) {
      setMasterModal({ type: 'brand', initialValue: val });
      return;
    }

    if (!brands.some(b => b.name.toLowerCase() === brandMatch.name.toLowerCase())) {
      setBrands([...brands, { name: brandMatch.name }]);
    }
    setTempBrand('');
    setShowBrandSuggestions(false);
    setFocusedBrandIndex(-1);
  };

  const removeBrand = (idx: number) => {
    setBrands(brands.filter((_, i) => i !== idx));
  };

  const [loading, setLoading] = useState(false);
  
  const [fetchingGST, setFetchingGST] = useState(false);
  const [captchaData, setCaptchaData] = useState<{sessionId: string, image: string} | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [gstStatusError, setGstStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        partyName: initialPartyName || '',
        shortName: '',
        type: 'Sundry Creditor (Vendor)',
        openingBalance: 0,
        gstin: '',
        panNumber: '',
        state: '',
        stateCode: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        taluka: '',
        pincode: '',
        mobileNumber: '',
        email: '',
        contactPerson: '',
        designation: '',
        bankName: '',
        branch: '',
        accountNumber: '',
        ifscCode: '',
        swiftCode: '',
        gstRawData: null
      });
      setGstStatusError(null);
    }
  }, [isOpen, initialPartyName]);

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
        partyName: formData.partyName,
        shortName: formData.shortName,
        type: formData.type,
        openingBalance: formData.openingBalance,
        gstin: formData.gstin,
        panNumber: formData.panNumber,
        state: formData.state,
        stateCode: formData.stateCode,
        line1: formData.addressLine1,
        line2: formData.addressLine2,
        line3: formData.addressLine3,
        pincode: formData.pincode,
        city: formData.city,
        taluka: formData.taluka,
        district: formData.district,
        contactPerson: formData.contactPerson,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        contactNumber2: formData.contactPerson2, 
        mobileNumber2: formData.mobileNumber2,
        contactNumber3: formData.contactPerson3,
        mobileNumber3: formData.mobileNumber3,
        accountName: formData.accountName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifsc: formData.ifscCode,
        branch: formData.branch,
        bankAccountType: formData.accountType,
        gstRawData: formData.gstRawData,
        categories: categories.length > 0 ? categories : null,
        brands: brands.length > 0 ? brands : null,
        brandType: brandType
      };

      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/party`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok) {
        onSave({ id: data.partyId, ...payload, name: payload.partyName, brand_type: payload.brandType });
        setFormData({
          partyName: '', shortName: '', type: 'Sundry Creditor (Vendor)', openingBalance: 0,
          gstin: '', panNumber: '', state: '', stateCode: '',
          addressLine1: '', addressLine2: '', addressLine3: '', pincode: '', city: '', taluka: '', district: '',
          contactPerson: '', mobileNumber: '', email: '', contactPerson2: '', mobileNumber2: '', contactPerson3: '', mobileNumber3: '',
          accountName: '', bankName: '', accountNumber: '', ifscCode: '', branch: '', accountType: 'Savings',
          gstRawData: null
        });
        setGstStatusError(null);
        setCategories([]);
        setBrands([]);
        setBrandType('Multi');
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

        {/* Body (Exactly like PartyMaster.tsx) */}
        <div className='flex flex-col flex-1 gap-4 overflow-y-auto pb-4 custom-scrollbar pr-2'>
          {/* Top Row */}
          <div className="flex w-full gap-6">
            {/* Party Information (spans 2/3) */}
            <div className="w-2/3 flex flex-col border-r-2 border-slate-300 pr-4">
              <SectionTitle>Party Information</SectionTitle>
              <div className="flex w-full gap-6 mt-1">
                {/* Col 1 */}
                <div className="w-1/2 flex flex-col gap-1">
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
                      autoComplete="new-password"
                    />
                    {(!formData.gstRawData) && (
                    <button 
                      type="button"
                      onClick={fetchGSTCaptcha}
                      className="bg-[#1b5e58] hover:bg-[#13423e] text-white px-2 py-[2px] text-[11px] font-bold shadow-[1px_1px_0_rgba(255,255,255,0.5)] border border-[#0d2d2a] ml-1"
                    >
                      {fetchingGST ? "Loading..." : "Fetch"}
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

                  <InputRow label="PAN Number" value={formData.panNumber} onChange={(v) => setFormData({...formData, panNumber: v.toUpperCase()})} />
                  <InputRow label="State" value={formData.state} onChange={(v) => setFormData({...formData, state: v})} />
                  <InputRow label="State Code" value={formData.stateCode} onChange={(v) => setFormData({...formData, stateCode: v})} />
                </div>
                
                {/* Col 2 */}
                <div className="w-1/2 flex flex-col gap-1">
                  <InputRow label="Party Name" value={formData.partyName} onChange={(v) => setFormData({...formData, partyName: v})} />
                  <InputRow label="Short Name" value={formData.shortName} onChange={(v) => setFormData({...formData, shortName: v})} />
                  <InputRow label="Email ID" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                </div>
              </div>
            </div>

            {/* Bank Details (spans 1/3) */}
            <div className="w-1/3 flex flex-col gap-1 pr-2">
              <SectionTitle>Bank Details</SectionTitle>
              <InputRow label="Account Name" value={formData.accountName} onChange={(v) => setFormData({...formData, accountName: v})} />
              <InputRow label="Bank Name" value={formData.bankName} onChange={(v) => setFormData({...formData, bankName: v})} />
              <InputRow label="Account No" value={formData.accountNumber} onChange={(v) => setFormData({...formData, accountNumber: v})} />
              <InputRow label="IFSC Code" value={formData.ifsc} onChange={(v) => setFormData({...formData, ifsc: v.toUpperCase()})} />
              <InputRow label="Branch" value={formData.branch} onChange={(v) => setFormData({...formData, branch: v})} />
              
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
          </div>

          {/* Bottom Row */}
          <div className="flex w-full gap-6 border-t-2 border-slate-300 pt-2 mt-2">
            {/* Address Information */}
            <div className="w-1/3 flex flex-col gap-1 border-r-2 border-slate-300 pr-4">
              <SectionTitle>Address Information</SectionTitle>
              <InputRow label="Address Line 1" value={formData.line1} onChange={(v) => setFormData({...formData, line1: v})} />
              <InputRow label="Address Line 2" value={formData.line2} onChange={(v) => setFormData({...formData, line2: v})} />
              <InputRow label="Address Line 3" value={formData.line3} onChange={(v) => setFormData({...formData, line3: v})} />
              <InputRow label="Pincode" value={formData.pincode} onChange={(v) => setFormData({...formData, pincode: v})} width="w-[80px]" />
              <InputRow label="City" value={formData.city} onChange={(v) => setFormData({...formData, city: v})} />
              <InputRow label="Taluka" value={formData.taluka} onChange={(v) => setFormData({...formData, taluka: v})} />
              <InputRow label="District" value={formData.district} onChange={(v) => setFormData({...formData, district: v})} />
            </div>

            {/* Contact Information */}
            <div className="w-1/3 flex flex-col gap-1 border-r-2 border-slate-300 pr-4">
              <SectionTitle>Contact Information</SectionTitle>
              <div className="flex flex-col gap-1 w-full">
                {formData.contacts && formData.contacts.map((contact: any, index: number) => (
                  <div key={index} className="flex flex-col gap-[2px] mb-2 border-b border-slate-200 pb-2 bg-[#fcfaf2]">
                    <div className="flex items-center">
                       <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Type</div>
                       <select 
                         className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                         value={contact.type}
                         onChange={e => {
                           const newContacts = [...formData.contacts];
                           newContacts[index].type = e.target.value;
                           setFormData({...formData, contacts: newContacts});
                         }}
                       >
                         <option>Office</option>
                         <option>Factory</option>
                         <option>Warehouse</option>
                         <option>Personal</option>
                         <option>Other</option>
                       </select>
                       {index > 0 && (
                         <button 
                           type="button"
                           onClick={() => {
                             const newContacts = formData.contacts.filter((_: any, i: number) => i !== index);
                             setFormData({...formData, contacts: newContacts});
                           }}
                           className="text-red-500 font-bold text-[11px] hover:underline ml-2 mr-1"
                         >
                           X
                         </button>
                       )}
                    </div>
                    <div className="flex items-center">
                      <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Name</div>
                      <input 
                        type="text"
                        className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                        value={contact.name}
                        onChange={e => {
                          const newContacts = [...formData.contacts];
                          newContacts[index].name = e.target.value;
                          setFormData({...formData, contacts: newContacts});
                        }}
                      />
                    </div>
                    <div className="flex items-center">
                      <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Mobile</div>
                      <input 
                        type="text"
                        className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                        value={contact.mobile}
                        onChange={e => {
                          const newContacts = [...formData.contacts];
                          newContacts[index].mobile = e.target.value;
                          setFormData({...formData, contacts: newContacts});
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pl-[110px] mb-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, contacts: [...(formData.contacts || []), { type: 'Office', name: '', mobile: '' }]})}
                    className="bg-[#1b5e58] border border-[#0d2d2a] px-2 py-1 text-[10px] font-bold text-white shadow-[1px_1px_0_rgba(0,0,0,0.5)] hover:bg-[#12423d]"
                  >
                    + Add Contact
                  </button>
                </div>
              </div>
            </div>

            {/* Categorization & Brands */}
            <div className="w-1/3 flex flex-col gap-1 pr-2">
              <SectionTitle>Categorization & Brands</SectionTitle>
                        
                        <div className="flex items-center gap-1 mb-1">
                          {/* Category Input */}
                          <div className="relative flex-1">
                            <input 
                              className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                              placeholder="Category (Alt+C)" 
                              value={tempCat} 
                              onChange={(e) => {
                                setTempCat(e.target.value);
                                setShowCatSuggestions(true);
                                setFocusedCatIndex(-1);
                                if (e.target.value === '') setSelectedCatId(null);
                              }}
                              onFocus={() => setShowCatSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowCatSuggestions(false), 200)}
                              onKeyDown={(e) => {
                                if (e.altKey && e.key.toLowerCase() === 'c') {
                                  e.preventDefault();
                                  setMasterModal({ type: 'partycategory', initialValue: tempCat.trim() });
                                }
                                const filtered = availableCategories.filter(c => c.name.toLowerCase().includes(tempCat.toLowerCase()));
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setFocusedCatIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setFocusedCatIndex(prev => (prev > 0 ? prev - 1 : -1));
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (focusedCatIndex >= 0 && filtered[focusedCatIndex]) {
                                    setTempCat(filtered[focusedCatIndex].name);
                                    setSelectedCatId(filtered[focusedCatIndex].id);
                                    setShowCatSuggestions(false);
                                  } else {
                                    const exactMatch = availableCategories.find(c => c.name.toLowerCase() === tempCat.trim().toLowerCase());
                                    if (exactMatch) {
                                      setTempCat(exactMatch.name);
                                      setSelectedCatId(exactMatch.id);
                                      setShowCatSuggestions(false);
                                    } else if (tempCat.trim()) {
                                      setMasterModal({ type: 'partycategory', initialValue: tempCat.trim() });
                                    }
                                  }
                                }
                              }}
                            />
                            {showCatSuggestions && (
                              <div className="absolute z-10 w-full bg-white border border-slate-400 shadow-lg max-h-[150px] overflow-y-auto">
                                {availableCategories.filter(c => c.name.toLowerCase().includes(tempCat.toLowerCase())).map((c, idx) => (
                                  <div 
                                    key={c.id} 
                                    className={`px-2 py-1 text-[12px] cursor-pointer ${idx === focusedCatIndex ? 'bg-blue-500 text-white' : 'hover:bg-slate-100'}`}
                                    onClick={() => {
                                      setTempCat(c.name);
                                      setSelectedCatId(c.id);
                                      setShowCatSuggestions(false);
                                    }}
                                  >
                                    {c.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Subcategory Input */}
                          <div className="relative flex-1">
                            <input 
                              className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 disabled:opacity-50" 
                              placeholder={selectedCatId ? "Subcat (Alt+C)" : "Select Category"}
                              value={tempSub} 
                              disabled={!selectedCatId}
                              onChange={(e) => {
                                setTempSub(e.target.value);
                                setShowSubSuggestions(true);
                                setFocusedSubIndex(-1);
                              }}
                              onFocus={() => setShowSubSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowSubSuggestions(false), 200)}
                              onKeyDown={(e) => {
                                if (e.altKey && e.key.toLowerCase() === 'c' && selectedCatId) {
                                  e.preventDefault();
                                  setMasterModal({ type: 'partysubcategory', initialValue: tempSub.trim(), parentId: selectedCatId });
                                }
                                const filtered = availableSubcategories.filter(s => s.name.toLowerCase().includes(tempSub.toLowerCase()));
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setFocusedSubIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setFocusedSubIndex(prev => (prev > 0 ? prev - 1 : -1));
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (focusedSubIndex >= 0 && filtered[focusedSubIndex]) {
                                    setTempSub(filtered[focusedSubIndex].name);
                                    setShowSubSuggestions(false);
                                  } else {
                                    const exactMatch = availableSubcategories.find(s => s.name.toLowerCase() === tempSub.trim().toLowerCase());
                                    if (exactMatch) {
                                      setTempSub(exactMatch.name);
                                      setShowSubSuggestions(false);
                                    } else if (tempSub.trim() && selectedCatId) {
                                      setMasterModal({ type: 'partysubcategory', initialValue: tempSub.trim(), parentId: selectedCatId });
                                    }
                                  }
                                }
                              }}
                            />
                            {showSubSuggestions && selectedCatId && (
                              <div className="absolute z-10 w-full bg-white border border-slate-400 shadow-lg max-h-[150px] overflow-y-auto">
                                {availableSubcategories.filter(s => s.name.toLowerCase().includes(tempSub.toLowerCase())).map((s, idx) => (
                                  <div 
                                    key={s.id} 
                                    className={`px-2 py-1 text-[12px] cursor-pointer ${idx === focusedSubIndex ? 'bg-blue-500 text-white' : 'hover:bg-slate-100'}`}
                                    onClick={() => {
                                      setTempSub(s.name);
                                      setShowSubSuggestions(false);
                                    }}
                                  >
                                    {s.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <button 
                            type="button"
                            onClick={handleAddCategory}
                            className="bg-[#eef5ed] border border-[#a3c3be] px-2 py-[2px] font-bold text-black hover:bg-[#ffe000] text-[11px] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
                          >
                            Add
                          </button>
                        </div>

              {categories.length > 0 && (
                <table className='w-full text-left border-collapse border border-slate-400 mt-1 mb-2'>
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
                          <button type="button" onClick={() => removeCategory(i)} className="text-red-600 font-bold hover:text-red-800 text-[10px]">X</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                          <label className="text-[12px] font-bold text-slate-700">Brand Type:</label>
                          <select 
                            className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none"
                            value={brandType}
                            onChange={(e) => setBrandType(e.target.value as 'Single' | 'Multi')}
                          >
                            <option value="Multi">Multi Brand Party</option>
                            <option value="Single">Single Brand Party</option>
                          </select>
                        </div>
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
                    <div className="absolute top-[100%] left-0 z-50 w-[calc(100%-32px)] bg-white border border-slate-400 shadow-xl max-h-40 overflow-y-auto mt-[1px]">
                      {availableBrands.filter(b => b.name.toLowerCase().includes(tempBrand.toLowerCase())).map((b, idx) => (
                        <div 
                          key={idx}
                          className={`px-2 py-1 text-[12px] cursor-pointer border-b border-slate-200 ${idx === focusedBrandIndex ? 'bg-[#ffe000] font-bold text-black' : 'hover:bg-slate-100 text-slate-800'}`}
                          onMouseDown={() => addBrand(b.name)}
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
                        <button type="button" onClick={() => removeBrand(i)} className="text-red-300 hover:text-red-100 ml-1">X</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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

      {masterModal && (
        <MasterCreationModal 
          isOpen={true}
          masterType={masterModal.type as any}
          initialValue={masterModal.initialValue}
          parentId={masterModal.parentId}
          onClose={() => {
            setMasterModal(null);
            setTimeout(() => document.getElementById('input-gstin')?.focus(), 100);
          }}
          onSave={(type, data) => {
            if (type === 'brand') {
              setBrands([...brands, { name: data.name }]);
            } else if (type === 'partycategory') {
              setTempCat(data.name);
              setSelectedCatId(data.id);
            } else if (type === 'partysubcategory') {
              setTempSub(data.name);
            }
            setMasterModal(null);
            setTimeout(() => document.getElementById('input-gstin')?.focus(), 100);
          }}
        />
      )}
    </div>
  );
}
