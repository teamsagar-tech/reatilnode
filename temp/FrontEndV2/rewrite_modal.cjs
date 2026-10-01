const fs = require('fs');

function rewriteFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update InputRow
  content = content.replace(
    /const InputRow = \(\{ label, value, onChange, width = 'w-\[200px\]', type = 'text', placeholder = '' \}: any\) => \(/,
    `const InputRow = ({ label, value, onChange, width = 'w-[200px]', type = 'text', placeholder = '', containerClassName = '' }: any) => (`
  );
  content = content.replace(
    /<div className="flex items-center mb-\[2px\]">/,
    `<div className={\`flex items-center mb-[2px] \${containerClassName}\`}>`
  );

  // 2. Update initial formData state
  content = content.replace(
    /contactPerson: '', mobileNumber: '', email: '',\s+contactPerson2: '', mobileNumber2: '', contactPerson3: '', mobileNumber3: '',/,
    `contacts: [{ type: 'Office', name: '', mobile: '' }],\n    email: '',`
  );

  // 3. Remove "type" dropdown and hardcode "type" default (it might not exist in modal, but let's try)
  // Check if type exists in initial state
  content = content.replace(
    /type: 'Sundry Debtor \(Customer\)'/,
    `type: 'Sundry Creditor (Vendor)'`
  );
  content = content.replace(/<div className="flex items-center mb-\[2px\]">\s*<div className="w-\[110px\][^>]*>Type<\/div>\s*<select[^>]*>\s*(<option>.*?<\/option>\s*)+<\/select>\s*<\/div>/g, '');

  // 4. Update Address widths
  content = content.replace(
    /<InputRow label="Address Line 1" value=\{formData.addressLine1\}/g,
    `<InputRow label="Address Line 1" containerClassName="col-span-2" width="w-[calc(100%-8px)]" value={formData.addressLine1}`
  );
  content = content.replace(
    /<InputRow label="Address Line 2" value=\{formData.addressLine2\}/g,
    `<InputRow label="Address Line 2" containerClassName="col-span-2" width="w-[calc(100%-8px)]" value={formData.addressLine2}`
  );
  content = content.replace(
    /<InputRow label="Address Line 3" value=\{formData.addressLine3\}/g,
    `<InputRow label="Address Line 3" containerClassName="col-span-2" width="w-[calc(100%-8px)]" value={formData.addressLine3}`
  );

  // 5. Replace Contact Information block
  const contactStart = content.indexOf('<SectionTitle>Contact Information</SectionTitle>');
  if (contactStart !== -1) {
    const nextSectionStart = content.indexOf('<SectionTitle>Bank Information</SectionTitle>');
    if (nextSectionStart !== -1) {
      const oldBlock = content.substring(contactStart, nextSectionStart);
      
      const newBlock = `<div className="col-span-full"><SectionTitle>Contact Information</SectionTitle></div>
                      <div className="col-span-full flex flex-col gap-1">
                        {formData.contacts.map((contact: any, index: number) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex items-center">
                               <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">Contact {index + 1}</div>
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
                              <div className="text-slate-800 font-bold text-[11px] pr-2 leading-tight">Name</div>
                              <input 
                                type="text"
                                className="w-[150px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                                value={contact.name}
                                onChange={e => {
                                  const newContacts = [...formData.contacts];
                                  newContacts[index].name = e.target.value;
                                  setFormData({...formData, contacts: newContacts});
                                }}
                              />
                            </div>
                            <div className="flex items-center">
                              <div className="text-slate-800 font-bold text-[11px] pr-2 leading-tight">Mobile</div>
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
                        <div className="pl-[118px] mt-1">
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, contacts: [...formData.contacts, { type: 'Office', name: '', mobile: '' }]})}
                            className="bg-slate-200 border border-slate-400 px-2 py-1 text-[10px] font-bold text-slate-800 hover:bg-slate-300"
                          >
                            + Add Contact
                          </button>
                        </div>
                        <InputRow label="Email Address" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} width="w-[300px]" containerClassName="mt-2" />
                      </div>\n\n                      <div className="col-span-full">`;
      
      content = content.replace(oldBlock, newBlock);
    }
  }

  // Also remove old contact variables if any from save logic
  // No, in modal, backend expects the payload! We'll update the backend API to handle `contacts` array directly.
  fs.writeFileSync(filePath, content);
  console.log('Processed ' + filePath);
}

rewriteFile('src/components/inventory/PartyModal.tsx');
