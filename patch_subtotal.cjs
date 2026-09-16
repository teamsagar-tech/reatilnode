const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const oldSubtotalLogic1 = `const subtotal = products.reduce((acc: any, p: any) => acc + ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100)), 0);`;
const newSubtotalLogic1 = `const subtotal = products.reduce((acc: any, p: any) => acc + (invoiceData.showMarkdown ? ((p.qty || 0) * (p.rate || 0)) : ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100))), 0);`;

const oldSubtotalLogic2 = `const subtotal = products.reduce((acc, p) => acc + ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100)), 0);`;
const newSubtotalLogic2 = `const subtotal = products.reduce((acc, p) => acc + (invoiceData.showMarkdown ? ((p.qty || 0) * (p.rate || 0)) : ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100))), 0);`;

piContent = piContent.replace(oldSubtotalLogic1, newSubtotalLogic1);
piContent = piContent.replace(oldSubtotalLogic2, newSubtotalLogic2);

fs.writeFileSync(piFile, piContent);
console.log("Patched subtotal!");
