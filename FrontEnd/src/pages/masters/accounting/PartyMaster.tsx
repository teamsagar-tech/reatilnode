import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import SearchableDropdown from '../../../components/SearchableDropdown';

export default function PartyMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create'>('list');
  
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (mode === 'create') {
          setMode('list');
        } else {
          navigate('/dashboard');
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC') && mode === 'list') {
        e.preventDefault();
        setMode('create');
        setTimeout(() => {
          document.getElementById('field-0')?.focus();
        }, 50);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a' && mode === 'create') {
        e.preventDefault();
        alert('Party Saved Successfully!');
        setMode('list');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, mode]);

  const sampleData = [
    { id: 1, name: 'Ramesh Enterprises', gstin: '27AADCB2230M1Z2', state: 'Maharashtra', balance: '1,50,000 Dr' },
    { id: 2, name: 'Gupta Traders', gstin: '24BBXPT1122K1Z9', state: 'Gujarat', balance: '45,000 Cr' },
    { id: 3, name: 'Fashion Hub', gstin: '07CCAPT9988L1Z1', state: 'Delhi', balance: '0' },
  ];

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="font-bold text-indigo-900 text-xs border-b-2 border-indigo-100 mb-4 mt-2 pb-1.5 uppercase tracking-widest bg-gradient-to-r from-indigo-50/80 to-transparent px-2 rounded-t-lg">
      {children}
    </div>
  );

  const InputRow = ({ label, value, onChange, width = 'w-full', type = 'text', placeholder = '', id = '' }: any) => (
    <div className="flex items-center mb-1.5 hover:bg-slate-50/50 p-1 rounded-lg transition-colors group">
      <div className="w-[130px] text-slate-700 font-bold text-[11px] text-right pr-3 leading-tight tracking-wide group-hover:text-indigo-700 transition-colors">
        {label}
      </div>
      <div className="flex-1">
        <input 
          id={id}
          type={type} 
          className={`bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-indigo-50/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all ${width}`}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Party Master | RetailNode</title>
      </Helmet>
      
      <div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full max-w-[1400px] mx-auto'>
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Party Master</h1>
            <p className="text-sm font-medium text-slate-500">Ledger Configuration</p>
          </div>
          
          <div className="flex gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
              <span className="text-slate-400">ESC</span> Back
            </kbd>
            {mode === 'list' ? (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 shadow-sm">
                <span className="text-indigo-400">ALT+C</span> Create New
              </kbd>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-600 shadow-sm">
                <span className="text-emerald-400">CTRL+A</span> Save
              </kbd>
            )}
          </div>
        </div>

        <div className='flex flex-1 gap-4 overflow-hidden'>
          {/* Main Container */}
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden'>
            
            <div className='p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col'>
              {mode === 'list' ? (
                <>
                  <div className='flex justify-between items-center mb-4'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search parties..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button 
                      onClick={() => setMode('create')} 
                      className='bg-indigo-600 px-4 py-2 rounded-lg font-bold text-white shadow-md hover:bg-indigo-700 transition-all text-xs'
                    >Create New (Alt+C)</button>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden flex-1">
                    <table className='w-full text-left border-collapse'>
                      <thead className='bg-slate-50 border-b border-slate-200'>
                        <tr className='text-slate-600 font-bold text-xs uppercase tracking-wider'>
                          <th className="px-4 py-3 w-[60px]">ID</th>
                          <th className="px-4 py-3">Party Name</th>
                          <th className="px-4 py-3 w-[160px]">GSTIN</th>
                          <th className="px-4 py-3 w-[140px]">State</th>
                          <th className="px-4 py-3 w-[140px] text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sampleData.map((row) => (
                          <tr key={row.id} className='text-xs bg-white hover:bg-indigo-50/30 cursor-pointer transition-colors group'>
                            <td className="px-4 py-3 font-semibold text-slate-500">#{row.id}</td>
                            <td className="px-4 py-3 font-bold text-slate-800">{row.name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-600">{row.gstin}</td>
                            <td className="px-4 py-3 font-semibold text-slate-600">{row.state}</td>
                            <td className="px-4 py-3 font-bold text-slate-900 text-right">{row.balance}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className='flex flex-col h-full overflow-hidden'>
                  {/* Premium Tally-style 3 Column Layout */}
                  <div className='flex flex-1 gap-6 overflow-hidden'>
                    
                    {/* Column 1: Legal & Basic */}
                    <div className="flex-1 flex flex-col gap-1 border-r border-slate-100 pr-6 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Legal Information</SectionTitle>
                      <InputRow id="field-0" label="GSTIN" value={formData.gstin} onChange={(v: string) => setFormData({...formData, gstin: v.toUpperCase()})} placeholder="15-digit GSTIN" />
                      <InputRow label="PAN Number" value={formData.panNumber} onChange={(v: string) => setFormData({...formData, panNumber: v.toUpperCase()})} />
                      <InputRow label="State" value={formData.state} onChange={(v: string) => setFormData({...formData, state: v})} />
                      <InputRow label="State Code" value={formData.stateCode} onChange={(v: string) => setFormData({...formData, stateCode: v})} width="w-[80px]" />

                      <SectionTitle>Basic Party Information</SectionTitle>
                      <InputRow label="Party Name" value={formData.partyName} onChange={(v: string) => setFormData({...formData, partyName: v})} />
                      <InputRow label="Short Name" value={formData.shortName} onChange={(v: string) => setFormData({...formData, shortName: v})} />
                      
                      <div className="flex items-center mb-1.5 hover:bg-slate-50/50 p-1 rounded-lg transition-colors group">
                        <div className="w-[130px] text-slate-700 font-bold text-[11px] text-right pr-3 leading-tight tracking-wide group-hover:text-indigo-700 transition-colors">Type</div>
                        <select 
                          className="flex-1 bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-indigo-50/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                          value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                        >
                          <option>Single Brand</option>
                          <option>Multi Brand</option>
                        </select>
                      </div>

                      <SectionTitle>Address Information</SectionTitle>
                      <InputRow label="Address Line 1" value={formData.line1} onChange={(v: string) => setFormData({...formData, line1: v})} />
                      <InputRow label="Address Line 2" value={formData.line2} onChange={(v: string) => setFormData({...formData, line2: v})} />
                      <InputRow label="Address Line 3" value={formData.line3} onChange={(v: string) => setFormData({...formData, line3: v})} />
                      <InputRow label="Pincode" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} width="w-[100px]" />
                      <InputRow label="City" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} />
                      <InputRow label="Taluka" value={formData.taluka} onChange={(v: string) => setFormData({...formData, taluka: v})} />
                      <InputRow label="District" value={formData.district} onChange={(v: string) => setFormData({...formData, district: v})} />
                    </div>

                    {/* Column 2: Contact & Bank */}
                    <div className="flex-1 flex flex-col gap-1 border-r border-slate-100 pr-6 overflow-y-auto pb-4 custom-scrollbar">
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
                      
                      <div className="flex items-center mb-1.5 hover:bg-slate-50/50 p-1 rounded-lg transition-colors group">
                        <div className="w-[130px] text-slate-700 font-bold text-[11px] text-right pr-3 leading-tight tracking-wide group-hover:text-indigo-700 transition-colors">Account Type</div>
                        <select 
                          className="flex-1 bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-indigo-50/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                          value={formData.bankAccountType} onChange={e => setFormData({...formData, bankAccountType: e.target.value})}
                        >
                          <option>Savings</option>
                          <option>Current</option>
                        </select>
                      </div>
                    </div>

                    {/* Column 3: Configuration */}
                    <div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4 custom-scrollbar">
                      <SectionTitle>Categorization</SectionTitle>
                      
                      <div className="flex items-center gap-2 mb-2 p-1">
                        <input 
                          className="flex-1 bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:outline-none focus:border-indigo-400 transition-all" 
                          placeholder="Category" 
                          value={tempCat} 
                          onChange={e => setTempCat(e.target.value)} 
                        />
                        <input 
                          className="flex-1 bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:outline-none focus:border-indigo-400 transition-all" 
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
                          className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 font-bold text-indigo-700 rounded-md hover:bg-indigo-100 text-[11px] shadow-sm transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      {categories.length > 0 && (
                        <div className="border border-slate-200 rounded-lg overflow-hidden mx-1">
                          <table className='w-full text-left border-collapse'>
                            <thead className='bg-slate-50 border-b border-slate-200'>
                              <tr className='text-slate-600 font-bold text-[10px] uppercase tracking-wider'>
                                <th className="px-3 py-2">Category</th>
                                <th className="px-3 py-2">Subcategory</th>
                                <th className="px-3 py-2 w-[40px] text-center"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {categories.map((c, i) => (
                                <tr key={i} className='text-[11px] bg-white hover:bg-slate-50 transition-colors'>
                                  <td className="px-3 py-2 font-semibold text-slate-700">{c.cat}</td>
                                  <td className="px-3 py-2 font-semibold text-slate-700">{c.sub}</td>
                                  <td className="px-3 py-2 text-center">
                                    <button onClick={() => removeCategory(i)} className="text-rose-500 font-bold hover:text-rose-700 p-1 rounded-md hover:bg-rose-50 transition-colors">✕</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>
                    <button 
                      onClick={() => setFormData({
                        gstin: '', panNumber: '', state: 'Maharashtra', stateCode: '27',
                        partyName: '', shortName: '', type: 'Single Brand',
                        line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
                        contactPerson: '', mobileNumber: '', email: '',
                        contactNumber2: '', mobileNumber2: '', contactNumber3: '', mobileNumber3: '',
                        accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings'
                      })}
                      className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => {
                        alert('Party Saved Successfully!');
                        setMode('list');
                      }}
                      className='bg-indigo-600 border border-indigo-600 px-8 py-2 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 text-xs'
                    >
                      Save (Ctrl+A)
                    </button>
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
