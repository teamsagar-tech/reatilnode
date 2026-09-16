const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove min-w-full from the table
content = content.replace(/<table className="w-max border-collapse text-left min-w-full">/g, '<table className="w-max border-collapse text-left">');

// Remove w-[99%] from the Total column
content = content.replace(/<th className="bg-slate-100 border-b border-slate-200 p-2 text-xs font-bold text-slate-700 text-right px-2 w-\[99%\]">Total<\/th>/g, '<th className="bg-slate-100 border-b border-slate-200 p-2 text-xs font-bold text-slate-700 text-right px-4 whitespace-nowrap">Total</th>');

fs.writeFileSync(file, content);
console.log("Fixed table wrap!");
