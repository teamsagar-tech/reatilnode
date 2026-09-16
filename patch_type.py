import re

with open("FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx", "r") as f:
    master_code = f.read()

type_dropdown = """                  <InputRow label="Email ID" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
                  
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
                  </div>"""

master_code = master_code.replace(
    '<InputRow label="Email ID" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />',
    type_dropdown
)

with open("FrontEndV2/src/pages/masters/accounting/PartyMaster.tsx", "w") as f:
    f.write(master_code)

print("Added Type dropdown back to PartyMaster.")
