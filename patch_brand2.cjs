const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const regex = /\/\/ Determine if a single brand is already locked in \(for Single Brand parties\)\n  const lockedBrand = isSingleBrandVendor \? \(products\.find\(p => p\.brand\)\?\.brand \|\| \(vendorAllowedBrands\?\.length === 1 \? vendorAllowedBrands\[0\] : null\)\) : null;/;

const replacement = `// Determine if a single brand is already locked in (for Single Brand parties)
  const lockedBrand = isSingleBrandVendor ? (products.find(p => p.brand)?.brand || (vendorAllowedBrands?.length === 1 ? vendorAllowedBrands[0] : null)) : null;

  // Auto-fill empty brands for Single Brand vendors
  useEffect(() => {
    if (isSingleBrandVendor && lockedBrand) {
      const hasEmptyBrand = products.some(p => !p.brand);
      if (hasEmptyBrand) {
        setProducts(prev => prev.map(p => {
          if (!p.brand) {
            return { ...p, brand: lockedBrand };
          }
          return p;
        }));
      }
    }
  }, [isSingleBrandVendor, lockedBrand, products]);`;

piContent = piContent.replace(regex, replacement);

fs.writeFileSync(piFile, piContent);
console.log("Patched auto-fill!");
