import os

filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters/inventory/CategoryMaster.tsx'

components_to_add = """
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="font-bold text-[#1b5e58] text-[12px] border-b border-[#a3c3be] mb-2 mt-2 pb-1 uppercase tracking-wider bg-[#eef5ed] px-1">
    {children}
  </div>
);

const InputRow = ({ id, label, value, onChange, width = 'flex-1', type = 'text', placeholder = '' }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
      {label}
    </div>
    <input 
      id={id}
      type={type} 
      className={`bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 ${width}`}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const SelectRow = ({ id, label, value, onChange, options, width = 'flex-1' }: any) => (
  <div className="flex items-center mb-[2px]">
    <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">
      {label}
    </div>
    <select 
      id={id}
      className={`bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 ${width}`}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    >
      <option value="">Select Parent Category</option>
      {options.map((opt: any) => (
        <option key={opt.id} value={opt.id}>{opt.name}</option>
      ))}
    </select>
  </div>
);
"""

with open(filepath, 'r') as f:
    content = f.read()

# Only add them if they are missing
if "const InputRow" not in content:
    content = content.replace("export default function CategoryMaster() {", components_to_add + "\nexport default function CategoryMaster() {")

with open(filepath, 'w') as f:
    f.write(content)

print("Done fixing CategoryMaster")
