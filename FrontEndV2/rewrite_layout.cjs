const fs = require('fs');

let content = fs.readFileSync('src/pages/masters/accounting/PartyMaster.tsx', 'utf-8');

// 1. Fix handleSaveParty
content = content.replace(/setMode\('list'\);\n\s*fetchParties\(\);/g, "fetchParties();\n        setTimeout(() => document.getElementById('input-gstin')?.focus(), 100);");

// 2. Fix InputRow width
content = content.replace(/width = 'flex-1'/g, "width = 'w-[250px]'");

// 3. Add onKeyDown to <select> elements for Enter-to-focus-next
content = content.replace(/<select\s+className="flex-1/g, `<select \n                          className="w-[250px]`);
// Wait, I will just do a global replace for the <select className="flex-1 ...">
content = content.replace(/<select \n\s*className="flex-1 bg-white border border-slate-400 px-1 py-\[2px\] text-\[12px\] font-bold text-black focus:bg-\[#ffffe0\] focus:outline-none focus:border-slate-800"\n\s*value=\{formData.type\} onChange=\{e => setFormData\(\{\.\.\.formData, type: e\.target\.value\}\)\}\n\s*>/, 
`<select 
                          className="w-[250px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                          value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const formElements = Array.from(document.querySelectorAll('input:not([disabled]), select:not([disabled])'));
                              const index = formElements.indexOf(e.target);
                              if (index > -1 && index < formElements.length - 1) formElements[index + 1].focus();
                            }
                          }}
                        >`);
                        
content = content.replace(/<select \n\s*className="flex-1 bg-white border border-slate-400 px-1 py-\[2px\] text-\[12px\] font-bold text-black focus:bg-\[#ffffe0\] focus:outline-none focus:border-slate-800"\n\s*value=\{formData.bankAccountType\} onChange=\{e => setFormData\(\{\.\.\.formData, bankAccountType: e\.target\.value\}\)\}\n\s*>/, 
`<select 
                          className="w-[250px] bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                          value={formData.bankAccountType} onChange={e => setFormData({...formData, bankAccountType: e.target.value})}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const formElements = Array.from(document.querySelectorAll('input:not([disabled]), select:not([disabled])'));
                              const index = formElements.indexOf(e.target);
                              if (index > -1 && index < formElements.length - 1) formElements[index + 1].focus();
                            }
                          }}
                        >`);

// 4. Change GSTIN flex-1 to w-[250px]
content = content.replace(/className={`flex-1 bg-white border \$\{gstStatusError/g, 'className={`w-[250px] bg-white border ${gstStatusError');

// 5. Rewrite layout
// Currently we have:
// <div className='flex flex-col h-full overflow-hidden'>
//   <div className='flex flex-1 gap-6 overflow-hidden'>
//     <div className="w-[32%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
// ...
//     </div>
//     <div className="w-[32%] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">
// ...
//     </div>
//     <div className="w-[32%] flex flex-col gap-1 pr-4 overflow-y-auto pb-4 custom-scrollbar">
// ...
//     </div>
//   </div>
//   <div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>
// ...
//   </div>
// </div>

// First, replace the container to allow scrolling on the whole form instead of individual columns
content = content.replace(/<div className='flex flex-1 gap-6 overflow-hidden'>/, 
`<div className='flex-1 overflow-y-auto p-4 custom-scrollbar'>
  <div className='flex flex-col gap-6 w-full pb-10'>`);

// Next, replace each 32% column div with a generic div that just contains its children.
// The easiest way is to just remove the column wrappers entirely!
// Wait, if I remove the column wrappers, I have to match the exact closing </div>s which is extremely dangerous with regex.
// Instead of removing them, I will just make them full-width wrappers with flex-row flex-wrap!
content = content.replace(/<div className="w-\[32%\] flex flex-col gap-1 border-r-2 border-slate-300 pr-4 overflow-y-auto pb-4 custom-scrollbar">/g, 
  `<div className="w-full flex flex-row flex-wrap gap-x-8 gap-y-2">`);
content = content.replace(/<div className="w-\[32%\] flex flex-col gap-1 pr-4 overflow-y-auto pb-4 custom-scrollbar">/g, 
  `<div className="w-full flex flex-row flex-wrap gap-x-8 gap-y-2">`);

// Wait! If they are flex-row flex-wrap, then the <SectionTitle> will only take up a small portion unless it's w-full!
// SectionTitle is currently:
// const SectionTitle = ({ children }: any) => ( ... <div className="flex items-center mb-[2px]"> ... )
content = content.replace(/<div className="flex items-center mb-\[2px\]">\n\s*<div className="w-\[110px\] text-right pr-2"><\/div>\n\s*<div className="flex-1 bg-\[#1b5e58\] text-white text-\[10px\] font-bold px-2 py-\[2px\] tracking-wider">/g, 
  `<div className="w-full flex items-center mt-2 mb-[2px]">
    <div className="w-full bg-[#1b5e58] text-white text-[11px] font-bold px-3 py-[4px] tracking-wider">`);

// Let's run this script and see what we get!
fs.writeFileSync('src/pages/masters/accounting/PartyMaster.tsx', content);
console.log("Successfully rewrote layout");
