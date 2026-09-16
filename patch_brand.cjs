const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// 1. Update lockedBrand logic to fallback to vendorAllowedBrands[0]
const lockedBrandRegex = /const lockedBrand = isSingleBrandVendor \? \(products\.find\(p => p\.brand\)\?\.brand \|\| null\) : null;/;
const newLockedBrand = `const lockedBrand = isSingleBrandVendor ? (products.find(p => p.brand)?.brand || (vendorAllowedBrands?.length === 1 ? vendorAllowedBrands[0] : null)) : null;`;
piContent = piContent.replace(lockedBrandRegex, newLockedBrand);

// 2. Add bypass logic to handleBrandFocus
const brandFocusRegex = /const handleBrandFocus = \(e: React\.FocusEvent<HTMLInputElement>, index: number\) => \{\n    e\.target\.select\(\);\n    setActiveBrandRow\(index\);\n    setBrandSuggestionIndex\(0\);\n  \};/;
const newBrandFocus = `const handleBrandFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    if (isSingleBrandVendor && lockedBrand) {
      setTimeout(() => {
        document.getElementById(\`row-\${index}-item\`)?.focus();
      }, 10);
      return;
    }
    e.target.select();
    setActiveBrandRow(index);
    setBrandSuggestionIndex(0);
  };`;
piContent = piContent.replace(brandFocusRegex, newBrandFocus);

fs.writeFileSync(piFile, piContent);
console.log("Patched handleBrandFocus!");
