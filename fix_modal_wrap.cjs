const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className="bg-white rounded-xl shadow-2xl w-full w-\[95vw\] max-w-\[1400px\] max-h-\[90vh\] flex flex-col border border-slate-200 relative"/g, 'className="bg-white rounded-xl shadow-2xl w-max max-w-[95vw] max-h-[90vh] flex flex-col border border-slate-200 relative mx-auto"');

fs.writeFileSync(file, content);
console.log("Fixed modal wrap!");
