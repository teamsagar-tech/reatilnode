import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SearchableDropdown from '../../../components/SearchableDropdown';

export default function PartyMaster() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('list'); // 'list' or 'create'
  
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
          navigate(-1);
        }
      } else if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
        e.preventDefault();
        if (mode === 'list') setMode('create');
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
                        <th className="px-2 py-1 border-r border-slate-300 w-[50px]">ID</th>
                        <th className="px-2 py-1 border-r border-slate-300">Party Name</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[150px]">GSTIN</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[120px]">State</th>
                        <th className="px-2 py-1 border-r border-slate-300 w-[120px] text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.map((row, idx) => (
                        <tr key={row.id} className={`text-[12px] border-b border-slate-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfaf2]'} hover:bg-[#ffffe0] cursor-pointer`}>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700 text-center">{row.id}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-bold text-[#1b5e58]">{row.name}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.gstin}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700">{row.state}</td>
                          <td className="px-2 py-1 border-r border-slate-300 font-bold text-slate-900 text-right">{row.balance}</td>
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
                      <InputRow label="GSTIN" value={formData.gstin} onChange={(v: string) => setFormData({...formData, gstin: v.toUpperCase()})} placeholder="15-digit GSTIN" />
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
                    </div>

                  </div>
                  
                  {/* Action Buttons */}
                  <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
                    <button 
                      onClick={() => setFormData({
                        gstin: '', panNumber: '', state: 'Maharashtra', stateCode: '27',
                        partyName: '', shortName: '', type: 'Single Brand',
                        line1: '', line2: '', line3: '', pincode: '', city: '', taluka: '', district: '',
                        contactPerson: '', mobileNumber: '', email: '',
                        contactNumber2: '', mobileNumber2: '', contactNumber3: '', mobileNumber3: '',
                        accountName: '', bankName: '', accountNumber: '', ifsc: '', branch: '', bankAccountType: 'Savings',
                        category: '', subcategory: ''
                      })}
                      className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)] outline-none focus:bg-red-200'
                    >
                      Reset
                    </button>
                    <button 
                      onClick={() => {
                        alert('Party Saved Successfully!');
                        setMode('list');
                      }}
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
    </>
  );
}
