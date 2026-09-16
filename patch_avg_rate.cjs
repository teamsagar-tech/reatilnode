const fs = require('fs');
let modalFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let modalContent = fs.readFileSync(modalFile, 'utf8');

const oldAvgRate = `const avgRate = totalQty > 0 ? (totalAmount / totalQty) : 0;`;
const newAvgRate = `const avgRate = totalQty > 0 ? (totalAmount / totalQty).toFixed(2) : 0;`;
modalContent = modalContent.replace(oldAvgRate, newAvgRate);

const oldAvgMrp = `const avgMrp = totalQty > 0 ? (totalMrpAmount / totalQty) : 0;`;
const newAvgMrp = `const avgMrp = totalQty > 0 ? (totalMrpAmount / totalQty).toFixed(2) : 0;`;
modalContent = modalContent.replace(oldAvgMrp, newAvgMrp);

fs.writeFileSync(modalFile, modalContent);
console.log("Patched avg rate format!");
