const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const amountLogic1 = `value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (item.disc || 0)/100)).toFixed(2)}`;
const newAmountLogic1 = `value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)) > 0 ? ((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0) * (1 - (parseFloat(item.disc) || 0)/100)).toFixed(2) : ''}`;

const amountLogic2 = `value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}`;
const newAmountLogic2 = `value={((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)) > 0 ? ((parseFloat(item.qty) || 0) * (parseFloat(item.rate) || 0)).toFixed(2) : ''}`;

content = content.replace(amountLogic1, newAmountLogic1);
content = content.replace(amountLogic2, newAmountLogic2);

// Fix the read-only MRP column displaying 0
const mrpReadOnlyLogic = `value={item.mrp === undefined || item.mrp === null ? '' : item.mrp}`;
const newMrpReadOnlyLogic = `value={item.mrp === undefined || item.mrp === null || parseFloat(item.mrp) === 0 ? '' : item.mrp}`;
content = content.replace(mrpReadOnlyLogic, newMrpReadOnlyLogic);

fs.writeFileSync(file, content);
console.log("Updated amount zeros!");
