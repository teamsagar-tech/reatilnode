const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const oldPush = `                  qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0 `;
const newPush = `                  qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: last ? last.disc : '', disc2: last ? last.disc2 : '', gst: last ? last.gst : '', design: '', colour: '', size: '', mrp: '' `;

piContent = piContent.replace(oldPush, newPush);

fs.writeFileSync(piFile, piContent);
console.log("Patched next row logic!");
