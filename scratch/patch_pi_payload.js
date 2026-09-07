const fs = require('fs');
const path = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /net_amount: Number\(invoiceData\.billAmount\) || 0,/g,
  "net_amount: Number(invoiceData.billAmount) || 0,\n      lr_no: invoiceData.lrNo || null,\n      transporter: invoiceData.transporter || null,\n      bales: Number(invoiceData.bale) || null,"
);

fs.writeFileSync(path, code);
console.log('Patched PI Payload');
