const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace Pur. Rate Base
content = content.replace(
  /className="w-\[70px\] bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-xs text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" value=\{baseRate\}/g,
  `id="base-rate-input" className="w-[70px] bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-xs text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('rate-step-input')?.focus(); } }} value={baseRate}`
);

// Replace Pur. Rate Step
content = content.replace(
  /className="w-\[50px\] bg-transparent text-xs text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" value=\{rateStep\}/g,
  `id="rate-step-input" className="w-[50px] bg-transparent text-xs text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('base-mrp-input')?.focus(); } }} value={rateStep}`
);

// Replace MRP Base
content = content.replace(
  /className="w-\[70px\] bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-xs text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" value=\{baseMrp\}/g,
  `id="base-mrp-input" className="w-[70px] bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-xs text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('mrp-step-input')?.focus(); } }} value={baseMrp}`
);

// Replace MRP Step
content = content.replace(
  /className="w-\[50px\] bg-transparent text-xs text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" value=\{mrpStep\}/g,
  `id="mrp-step-input" className="w-[50px] bg-transparent text-xs text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById('qty-input-0')?.focus(); } }} value={mrpStep}`
);

fs.writeFileSync(file, content);
console.log("Fixed keyboard navigation!");
