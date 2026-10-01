const fs = require('fs');
const path = require('path');

const filePath = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/PartyModal.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const startStr = `<div className="flex-1 flex overflow-hidden p-4 gap-6">`;
const endStr = `        {/* Footer */}`;

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr, startIndex);

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find boundaries.');
    process.exit(1);
}

const newBlock = `
        <div className='flex flex-col flex-1 gap-4 overflow-y-auto p-4 custom-scrollbar pr-2'>
          {/* Top Row: Legal & Party Details */}
          <div className="flex w-full gap-6">
            <div className="w-1/2 flex flex-col gap-1 border-r-2 border-slate-300 pr-4">
              <SectionTitle>Legal Information</SectionTitle>
              <div className="flex items-center mb-[2px]">
                <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">GSTIN</div>
                <input 
                  className={\`flex-1 bg-white border \${gstStatusError ? 'border-red-500' : 'border-slate-400'} px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800\`}
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
            </div>
            
            <div className="w-1/2 flex flex-col gap-1">
              <SectionTitle>Party Details</SectionTitle>
              <InputRow label="Party Name" value={formData.partyName} onChange={(v: string) => setFormData({...formData, partyName: v})} />
              <InputRow label="Short Name" value={formData.shortName} onChange={(v: string) => setFormData({...formData, shortName: v})} />
              <InputRow label="Email ID" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} />
              <InputRow label="Opening Balance" value={formData.openingBalance} onChange={(v: string) => setFormData({...formData, openingBalance: Number(v) || 0})} />
            </div>
          </div>

          {/* Middle Row: Address & Contact */}
          <div className="flex w-full gap-6 border-t-2 border-slate-300 pt-2">
            <div className="w-1/2 flex flex-col gap-1 border-r-2 border-slate-300 pr-4">
              <SectionTitle>Address Information</SectionTitle>
              <InputRow label="Address Line 1" value={formData.addressLine1} onChange={(v: string) => setFormData({...formData, addressLine1: v})} width="w-[calc(100%-120px)]" />
              <InputRow label="Address Line 2" value={formData.addressLine2} onChange={(v: string) => setFormData({...formData, addressLine2: v})} width="w-[calc(100%-120px)]" />
              <InputRow label="Address Line 3" value={formData.addressLine3} onChange={(v: string) => setFormData({...formData, addressLine3: v})} width="w-[calc(100%-120px)]" />
              <InputRow label="Pincode" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} width="w-[80px]" />
              <InputRow label="City" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} />
              <InputRow label="Taluka" value={formData.taluka} onChange={(v: string) => setFormData({...formData, taluka: v})} />
              <InputRow label="District" value={formData.district} onChange={(v: string) => setFormData({...formData, district: v})} />
            </div>

            <div className="w-1/2 flex flex-col gap-1">
              <SectionTitle>Contact Information</SectionTitle>
              <div className="flex flex-col gap-1 w-full pr-2">
                {formData.contacts && formData.contacts.map((contact: any, index: number) => (
                  <div key={index} className="flex flex-col gap-[2px] mb-2 border-b border-slate-200 pb-2">
                    <div className="flex items-center">
                       <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Contact {index + 1}</div>
                       <select 
                         className="w-[120px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
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
                    </div>
                    <div className="flex items-center">
                      <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Name</div>
                      <input 
                        type="text"
                        className="w-[200px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
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
                        className="w-[120px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                        value={contact.mobile}
                        onChange={e => {
                          const newContacts = [...formData.contacts];
                          newContacts[index].mobile = e.target.value;
                          setFormData({...formData, contacts: newContacts});
                        }}
                      />
                      {index > 0 && (
                        <button 
                          type="button"
                          onClick={() => {
                            const newContacts = formData.contacts.filter((_, i) => i !== index);
                            setFormData({...formData, contacts: newContacts});
                          }}
                          className="text-red-500 font-bold text-[11px] hover:underline ml-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="pl-[118px] mb-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, contacts: [...(formData.contacts || []), { type: 'Office', name: '', mobile: '' }]})}
                    className="bg-slate-200 border border-slate-400 px-2 py-1 text-[10px] font-bold text-slate-800 hover:bg-slate-300"
                  >
                    + Add Contact
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Bank & Categorization */}
          <div className="flex w-full gap-6 border-t-2 border-slate-300 pt-2">
            <div className="w-1/2 flex flex-col gap-1 border-r-2 border-slate-300 pr-4">
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

            <div className="w-1/2 flex flex-col gap-1 pr-2">
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
        </div>

`;

const newContent = content.substring(0, startIndex) + newBlock + content.substring(endIndex);
fs.writeFileSync(filePath, newContent);
console.log('Successfully refactored Modal');
