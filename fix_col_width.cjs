const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Update Details th
content = content.replace(
  /<th className="bg-slate-100 border-b border-r border-slate-200 p-2 text-xs font-bold text-slate-700 px-2 sticky left-0 z-10 shadow-\[1px_0_0_#e2e8f0\]">Details<\/th>/g,
  '<th className="bg-slate-100 border-b border-r border-slate-200 p-2 text-xs font-bold text-slate-700 px-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0] w-[1%] whitespace-nowrap">Details</th>'
);

// We can also remove w-full from the table just to be safe so it doesn't artificially stretch
content = content.replace(/<table className="w-full border-collapse text-left ">/g, '<table className="w-max border-collapse text-left min-w-full">');

fs.writeFileSync(file, content);
console.log("Fixed Details column width!");
