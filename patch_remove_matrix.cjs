const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `               setTimeout(() => {
                 setActiveSizeMatrixRow(rowIndex);
               }, 100);
               setMasterModal(null);
               return; // Skip moving focus to next field`;

const replacement = `               setMasterModal(null);
               // Removed setActiveSizeMatrixRow so it falls through and focuses Quantity`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Patched remove matrix');
} else {
  console.log('Target not found');
}
