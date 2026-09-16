const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const regex = /\}, \[isSingleBrandVendor, lockedBrand, products\]\);/;
const replacement = `}, [isSingleBrandVendor, lockedBrand, products, availableBrands]);`;

piContent = piContent.replace(regex, replacement);

fs.writeFileSync(piFile, piContent);
console.log("Patched useEffect deps!");
