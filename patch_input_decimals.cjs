const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// For discount percent
const oldDiscP = `handleInvoiceChange('discountPercent', parseFloat(e.target.value) || 0)`;
const newDiscP = `handleInvoiceChange('discountPercent', e.target.value)`;
piContent = piContent.replace(oldDiscP, newDiscP);

// For discount amount
const oldDiscA = `handleInvoiceChange('discountAmount', parseFloat(e.target.value) || 0)`;
const newDiscA = `handleInvoiceChange('discountAmount', e.target.value)`;
piContent = piContent.replace(oldDiscA, newDiscA);

// For commission percent
const oldCommP = `handleInvoiceChange('commissionPercent', parseFloat(e.target.value) || 0)`;
const newCommP = `handleInvoiceChange('commissionPercent', e.target.value)`;
piContent = piContent.replace(oldCommP, newCommP);

// For commission amount
const oldCommA = `handleInvoiceChange('commissionAmount', parseFloat(e.target.value) || 0)`;
const newCommA = `handleInvoiceChange('commissionAmount', e.target.value)`;
piContent = piContent.replace(oldCommA, newCommA);

// For round off
const oldRoundOff = `handleInvoiceChange('roundOff', parseFloat(e.target.value) || 0)`;
const newRoundOff = `handleInvoiceChange('roundOff', e.target.value)`;
piContent = piContent.replace(oldRoundOff, newRoundOff);

// For other charges? Wait, charges is parseFloat?
const oldCharges = `handleInvoiceChange('charges', parseFloat(e.target.value) || 0)`;
const newCharges = `handleInvoiceChange('charges', e.target.value)`;
piContent = piContent.replace(oldCharges, newCharges);

// Check if there are any other parseFloats that block decimal typing
// invoiceData.taxPercent
const oldTaxP = `handleInvoiceChange('taxPercent', parseFloat(e.target.value) || 0)`;
const newTaxP = `handleInvoiceChange('taxPercent', e.target.value)`;
piContent = piContent.replace(oldTaxP, newTaxP);

// Now in calculations, we need to make sure we use Number(invoiceData.discountPercent) || 0 if necessary
// Wait, the calculation logic is:
// invoiceData.discountPercent > 0
// If e.target.value is empty string "", "" > 0 is false.
// But we should make sure we don't pass empty string to backend.

fs.writeFileSync(piFile, piContent);
console.log("Patched onChange for decimal inputs!");
