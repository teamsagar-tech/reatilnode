const fs = require('fs');
let file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const tHeadStart = content.indexOf('<thead className="sticky top-0 bg-[#eef5ed]');
const tHeadEnd = content.indexOf('</thead>', tHeadStart);
console.log("THEAD:");
console.log(content.substring(tHeadStart, tHeadEnd));

const tBodyStart = content.indexOf('<tbody>', tHeadEnd);
const tBodyEnd = content.indexOf('</tbody>', tBodyStart);
console.log("\nTBODY (first 2000 chars):");
console.log(content.substring(tBodyStart, Math.min(tBodyEnd, tBodyStart + 2000)));
