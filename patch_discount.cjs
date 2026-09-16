const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// For discount percent
const oldDiscP = `value={invoiceData.discountPercent > 0 ? Number(invoiceData.discountPercent).toFixed(2) : (invoiceData.discountAmount > 0 && taxableAmount > 0 ? ((invoiceData.discountAmount / taxableAmount) * 100).toFixed(2) : '')}`;
const newDiscP = `value={invoiceData.discountPercent > 0 ? invoiceData.discountPercent : (invoiceData.discountAmount > 0 && taxableAmount > 0 ? ((invoiceData.discountAmount / taxableAmount) * 100).toFixed(2) : '')}`;

// For discount amount
const oldDiscA = `value={invoiceData.discountAmount > 0 ? Number(invoiceData.discountAmount).toFixed(2) : (invoiceData.discountPercent > 0 ? Number(calcDiscount).toFixed(2) : '')}`;
const newDiscA = `value={invoiceData.discountAmount > 0 ? invoiceData.discountAmount : (invoiceData.discountPercent > 0 ? Number(calcDiscount).toFixed(2) : '')}`;

// For commission percent
const oldCommP = `value={invoiceData.commissionPercent > 0 ? Number(invoiceData.commissionPercent).toFixed(2) : (invoiceData.commissionAmount > 0 && afterDiscount > 0 ? ((invoiceData.commissionAmount / afterDiscount) * 100).toFixed(2) : '')}`;
const newCommP = `value={invoiceData.commissionPercent > 0 ? invoiceData.commissionPercent : (invoiceData.commissionAmount > 0 && afterDiscount > 0 ? ((invoiceData.commissionAmount / afterDiscount) * 100).toFixed(2) : '')}`;

// For commission amount
const oldCommA = `value={invoiceData.commissionAmount > 0 ? Number(invoiceData.commissionAmount).toFixed(2) : (invoiceData.commissionPercent > 0 ? Number(calcCommission).toFixed(2) : '')}`;
const newCommA = `value={invoiceData.commissionAmount > 0 ? invoiceData.commissionAmount : (invoiceData.commissionPercent > 0 ? Number(calcCommission).toFixed(2) : '')}`;

// For other charges (freight, insurance, packing) - wait, these might also have toFixed?
// Wait, the user didn't mention other charges but they might have the same bug. Let's check.

piContent = piContent.replace(oldDiscP, newDiscP);
piContent = piContent.replace(oldDiscA, newDiscA);
piContent = piContent.replace(oldCommP, newCommP);
piContent = piContent.replace(oldCommA, newCommA);

fs.writeFileSync(piFile, piContent);
console.log("Patched totals inputs!");
