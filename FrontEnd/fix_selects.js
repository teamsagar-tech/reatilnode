const fs = require('fs');

const filesToFix = [
  '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/SubStyleMaster.tsx',
  '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/SubCategoryMaster.tsx',
  '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/inventory/SizeSetMaster.tsx'
];

for (const file of filesToFix) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('SearchableDropdown')) {
    content = "import SearchableDropdown from '../../../components/SearchableDropdown';\n" + content;
  }
  
  const selectGroupRegex = /const SelectGroup = \(\{ label, id, value, onChange, nextId, options, width = 'w-full', autoFocus = false \}: any\) => \([\s\S]*?<\/div>\n  \);/g;
  
  content = content.replace(selectGroupRegex, `const SelectGroup = ({ label, id, value, onChange, nextId, options, width = 'w-full', autoFocus = false }: any) => (
    <div className="flex flex-col gap-[2px] mb-2.5 group w-full">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-indigo-600 transition-colors">{label}</label>
      <SearchableDropdown
        id={id}
        autoFocus={autoFocus}
        className={\`bg-slate-50 border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all hover:border-slate-300 w-full\`}
        value={value || ''}
        onChange={v => onChange(v)}
        onKeyDown={e => { if(nextId && typeof handleFieldKeyDown !== 'undefined') handleFieldKeyDown(e, nextId) }}
        options={options}
        displayKey="name"
        placeholder={label}
        width="100%"
      />
    </div>
  );`);
  
  fs.writeFileSync(file, content);
}
