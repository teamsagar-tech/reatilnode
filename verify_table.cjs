const fs = require('fs');
let file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const tHeadStart = content.indexOf('<thead');
const tHeadEnd = content.indexOf('</thead>');
console.log("THEAD:");
console.log(content.substring(tHeadStart, tHeadEnd));

const tBodyStart = content.indexOf('<tbody');
const tBodyEnd = content.indexOf('</tbody>');
console.log("\nTBODY (first 20 lines):");
console.log(content.substring(tBodyStart, tBodyStart + 2000));
