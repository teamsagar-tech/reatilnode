const fs = require('fs');

function rewriteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update InputRow definition
  content = content.replace(
    /const InputRow = \(\{ label, value, onChange, width = 'flex-1', type = 'text', placeholder = '' \}: any\) => \(/,
    `const InputRow = ({ label, value, onChange, width = 'w-[200px]', type = 'text', placeholder = '', containerClassName = '' }: any) => (`
  );
  content = content.replace(
    /<div className="flex items-center mb-\[2px\]">/,
    `<div className={\`flex items-center mb-[2px] \${containerClassName}\`}>`
  );

  // 2. Update initial formData
  content = content.replace(
    /contactPerson: '', mobileNumber: '', email: '',\s+contactNumber2: '', mobileNumber2: '', contactNumber3: '', mobileNumber3: '',/,
    `contacts: [{ type: 'Office', name: '', mobile: '' }],\n    email: '',`
  );
  content = content.replace(
    /contactPerson: '', mobileNumber: '', email: '',\s+contactPerson2: '', mobileNumber2: '', contactPerson3: '', mobileNumber3: '',/,
    `contacts: [{ type: 'Office', name: '', mobile: '' }],\n    email: '',`
  );
  content = content.replace(
    /type: 'Sundry Debtor \(Customer\)'/,
    `type: 'Sundry Creditor (Vendor)'`
  );

  // 3. Remove old form body (everything between "Master Creation" header and Footer)
  // We'll replace the `<div className="flex flex-row ... overflow-hidden">` block.
  
  // Find the start of the form body
  const bodyStartStr = `<div className="flex flex-row h-[calc(100vh-130px)] w-full overflow-hidden">`;
  const bodyStartStrModal = `<div className="flex flex-row w-full h-[500px] overflow-hidden">`;
  
  let startIdx = content.indexOf(bodyStartStr);
  let isModal = false;
  if (startIdx === -1) {
    startIdx = content.indexOf(bodyStartStrModal);
    isModal = true;
  }
  
  if (startIdx !== -1) {
    const footerStart = content.indexOf(`{/* Footer */}`);
    if (footerStart !== -1) {
      const formBody = content.substring(startIdx, footerStart);
      
      const newFormBody = `<div className="w-full ${isModal ? 'h-[500px]' : 'h-[calc(100vh-130px)]'} overflow-y-auto custom-scrollbar p-4 bg-white">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2">
            
            <div className="col-span-full"><SectionTitle>Address Information</SectionTitle></div>
            
            <InputRow label="Address Line 1" containerClassName="col-span-2" width="flex-1" value={formData.line1 || formData.addressLine1} onChange={(v: string) => setFormData({...formData, line1: v, addressLine1: v})} />
            <InputRow label="Pin Code" value={formData.pincode} onChange={(v: string) => setFormData({...formData, pincode: v})} width="w-[120px]" />
            <InputRow label="City" value={formData.city} onChange={(v: string) => setFormData({...formData, city: v})} />
            
            <InputRow label="Address Line 2" containerClassName="col-span-2" width="flex-1" value={formData.line2 || formData.addressLine2} onChange={(v: string) => setFormData({...formData, line2: v, addressLine2: v})} />
            <InputRow label="Tal" value={formData.taluka} onChange={(v: string) => setFormData({...formData, taluka: v})} />
            <InputRow label="Dist" value={formData.district} onChange={(v: string) => setFormData({...formData, district: v})} />
            
            <InputRow label="Address Line 3" containerClassName="col-span-2" width="flex-1" value={formData.line3 || formData.addressLine3} onChange={(v: string) => setFormData({...formData, line3: v, addressLine3: v})} />
            <InputRow label="State" value={formData.state} onChange={(v: string) => setFormData({...formData, state: v})} />
            <InputRow label="GSTIN" value={formData.gstin} onChange={(v: string) => setFormData({...formData, gstin: v.toUpperCase()})} />

            <div className="col-span-full"><SectionTitle>Contact Information</SectionTitle></div>
            <div className="col-span-full flex flex-col gap-1 pl-4">
              {formData.contacts && formData.contacts.map((contact: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex items-center">
                     <div className="w-[80px] text-slate-800 font-bold text-[11px] pr-2 leading-tight">Contact {index + 1}</div>
                     <select 
                       className="w-[100px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
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
                    <div className="text-slate-800 font-bold text-[11px] pr-2 pl-2 leading-tight">Name</div>
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
                    <div className="text-slate-800 font-bold text-[11px] pr-2 pl-2 leading-tight">Mobile</div>
                    <input 
                      type="text"
                      className="w-[150px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                      value={contact.mobile}
                      onChange={e => {
                        const newContacts = [...formData.contacts];
                        newContacts[index].mobile = e.target.value;
                        setFormData({...formData, contacts: newContacts});
                      }}
                    />
                  </div>
                  {index > 0 && (
                    <button 
                      type="button"
                      onClick={() => {
                        const newContacts = formData.contacts.filter((_, i) => i !== index);
                        setFormData({...formData, contacts: newContacts});
                      }}
                      className="text-red-500 font-bold text-[11px] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="mt-1">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, contacts: [...formData.contacts, { type: 'Office', name: '', mobile: '' }]})}
                  className="bg-slate-200 border border-slate-400 px-2 py-1 text-[10px] font-bold text-slate-800 hover:bg-slate-300"
                >
                  + Add Contact
                </button>
              </div>
            </div>
            
            <div className="col-span-full mt-2"><InputRow label="Email Address" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} width="w-[300px]" containerClassName="col-span-2" /></div>

            <div className="col-span-full"><SectionTitle>Bank Information</SectionTitle></div>
            <InputRow label="Account Name" value={formData.accountName} onChange={(v: string) => setFormData({...formData, accountName: v})} width="flex-1" />
            <InputRow label="Bank Name" value={formData.bankName} onChange={(v: string) => setFormData({...formData, bankName: v})} width="flex-1" />
            <InputRow label="Account Number" value={formData.accountNumber} onChange={(v: string) => setFormData({...formData, accountNumber: v})} width="flex-1" />
            <InputRow label="IFSC Code" value={formData.ifsc} onChange={(v: string) => setFormData({...formData, ifsc: v.toUpperCase()})} width="w-[120px]" />
            <InputRow label="Branch" value={formData.branch} onChange={(v: string) => setFormData({...formData, branch: v})} width="flex-1" />
            <div className="flex items-center mb-[2px]">
              <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Account Type</div>
              <select 
                className="w-[150px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                value={formData.bankAccountType} onChange={e => setFormData({...formData, bankAccountType: e.target.value})}
              >
                <option>Savings</option>
                <option>Current</option>
              </select>
            </div>

            <div className="col-span-full grid grid-cols-2 gap-6">
              <div>
                <SectionTitle>Categorization</SectionTitle>
                <div className="relative flex items-center gap-1 mb-1">
                  <input 
                    className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                    placeholder="Category" value={tempCat} onChange={e => setTempCat(e.target.value)} 
                  />
                  <input 
                    className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                    placeholder="Subcategory" value={tempSub} onChange={e => setTempSub(e.target.value)}
                    onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
                  />
                  <button type="button" onClick={addCategory} className="bg-[#eef5ed] border border-[#a3c3be] px-2 py-[2px] font-bold text-black hover:bg-[#ffe000] text-[11px]">Add</button>
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
                          <td className="px-1 py-[2px] border-r border-slate-300">{c.cat}</td>
                          <td className="px-1 py-[2px] border-r border-slate-300">{c.sub}</td>
                          <td className="px-1 py-[2px] text-center">
                            <button type="button" onClick={() => removeCategory(i)} className="text-red-600 font-bold hover:text-red-800">X</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              <div>
                <SectionTitle>Assigned Brands</SectionTitle>
                <div className="relative flex items-center gap-1 mb-1">
                  <input 
                    className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                    placeholder="Type brand name or Alt+C" 
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
                        if (typeof setMasterModal !== 'undefined') setMasterModal({ type: 'brand', initialValue: tempBrand });
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
                        if (filtered[focusedBrandIndex]) addBrand(filtered[focusedBrandIndex].name);
                      }
                    }}
                  />
                  <button type="button" onClick={() => {
                    const b = availableBrands.find(b => b.name.toLowerCase() === tempBrand.toLowerCase());
                    if (b) addBrand(b.name);
                    else alert('Please select a valid brand or press Alt+C to create one.');
                  }} className="bg-[#eef5ed] border border-[#a3c3be] px-2 py-[2px] font-bold text-black hover:bg-[#ffe000] text-[11px]">Add</button>
                  
                  {/* FIX SUGGESTION DROPDOWN STYLING */}
                  {showBrandSuggestions && tempBrand && (
                    <div className="absolute top-[100%] left-0 z-50 w-[calc(100%-40px)] bg-white border border-slate-400 shadow-xl max-h-40 overflow-y-auto mt-[1px]">
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
        
        `;
      content = content.replace(formBody, newFormBody);
    }
  }

  // Update Edit parsing
  content = content.replace(/setFormData\(\{ \.\.\.p, gstRawData: p\.gst_raw_data, type: p\.party_type \}\);/,
    `setFormData({ ...p, gstRawData: p.gst_raw_data, type: p.party_type || 'Sundry Creditor (Vendor)', contacts: p.dynamic_contacts ? (typeof p.dynamic_contacts === 'string' ? JSON.parse(p.dynamic_contacts) : p.dynamic_contacts) : [{ type: 'Office', name: '', mobile: '' }] });`);

  fs.writeFileSync(filePath, content);
  console.log('Processed ' + filePath);
}

rewriteFile('src/pages/masters/accounting/PartyMaster.tsx');
rewriteFile('src/components/inventory/PartyModal.tsx');
