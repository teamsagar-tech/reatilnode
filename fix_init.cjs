const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// Fix the initial state and reset state
piContent = piContent.replace(/last \? \(last\.disc \|\| 0\) : 0/g, '0');

fs.writeFileSync(piFile, piContent);
