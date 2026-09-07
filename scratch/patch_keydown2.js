const fs = require('fs');
const path = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseOrder.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/} else if \(e.key === 'Enter' && filtered.length > 0\) {/g, "} else if ((e.key === 'Enter' || e.key === 'Tab' || e.key === 'ArrowRight') && filtered.length > 0) {");
code = code.replace(/https:\/\/api\.retailnode\.in/g, "");

fs.writeFileSync(path, code);
console.log('Patched PurchaseOrder.tsx');
