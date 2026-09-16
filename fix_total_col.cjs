const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Total th to absorb all remaining space
content = content.replace(
  /<th className="bg-slate-100 border-b border-slate-200 p-2 text-xs font-bold text-slate-700 text-right px-2">Total<\/th>/g,
  '<th className="bg-slate-100 border-b border-slate-200 p-2 text-xs font-bold text-slate-700 text-right px-2 w-[99%]">Total</th>'
);

fs.writeFileSync(file, content);
console.log("Fixed Total column to absorb space!");
