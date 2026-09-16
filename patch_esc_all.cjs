const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `else if (activeSizeRow !== null) setActiveSizeRow(null);`;
const replacement = `else if (activeSizeRow !== null) setActiveSizeRow(null);
        else if (activeBrandRow !== null) setActiveBrandRow(null);
        else if (activeDesignRow !== null) setActiveDesignRow(null);
        else if (activeColourRow !== null) setActiveColourRow(null);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
  console.log('Patched all escape keys');
} else {
  console.log('Target not found');
}
