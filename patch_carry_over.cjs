const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// Patch addProduct
const regexAdd = /qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0/;
const replacementAdd = `qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: last ? (last.disc || 0) : 0, gst: 0, design: '', colour: '', size: '', mrp: 0`;

piContent = piContent.replace(regexAdd, replacementAdd); // will replace the first occurrence (addProduct)
piContent = piContent.replace(regexAdd, replacementAdd); // will replace the second occurrence (size matrix save)

fs.writeFileSync(piFile, piContent);
console.log("Patched carry-over discount!");
