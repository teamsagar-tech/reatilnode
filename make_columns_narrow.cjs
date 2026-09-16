const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove "Size " from column headers
content = content.replace(/>\s*Size {col\.size}\s*<\/th>/g, '>{col.size}</th>');

// Ensure inputs in the matrix have a small fixed width if w-full is too wide, 
// actually w-full is fine as long as the cell itself is narrow.
// Let's add min-w-[50px] to the Size headers to make them tiny but readable
content = content.replace(/className="bg-indigo-50 border-b border-r border-slate-200 p-2 text-xs font-black text-indigo-900 text-center px-1"/g, 'className="bg-indigo-50 border-b border-r border-slate-200 p-1 text-xs font-black text-indigo-900 text-center min-w-[45px] w-[50px]"');

// Fix Amount row at bottom (it had p-2, change to p-1 to save space)
content = content.replace(/className="bg-slate-50 border-r border-slate-200 p-2 text-\[11px\] font-bold text-indigo-700 text-center"/g, 'className="bg-slate-50 border-r border-slate-200 p-1 px-0 text-[11px] font-bold text-indigo-700 text-center"');

fs.writeFileSync(file, content);
console.log("Made columns narrow!");
