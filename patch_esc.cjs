const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `else if (activeHsnRow !== null) setActiveHsnRow(null);`;
const replacement = `else if (activeHsnRow !== null) setActiveHsnRow(null);
        else if (activeSizeRow !== null) setActiveSizeRow(null);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Patched escape key');
} else {
  console.log('Target not found');
}
