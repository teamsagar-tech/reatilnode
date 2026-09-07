const fs = require('fs');
const path = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/https:\/\/api\.retailnode\.in/g, "");

fs.writeFileSync(path, code);
console.log('Patched API URLs');
