const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className="flex items-center justify-between gap-3 w-full"/g, 'className="flex items-center justify-start gap-4"');

fs.writeFileSync(file, content);
console.log("Updated gap!");
