const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                 setActiveSizeMatrixRow(rowIndex);
               }, 100);
               return; // Skip moving focus to next field`;

const replacement = `                 setActiveSizeMatrixRow(rowIndex);
               }, 100);
               setMasterModal(null);
               return; // Skip moving focus to next field`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Patched modal close');
} else {
  console.log('Target not found');
}
