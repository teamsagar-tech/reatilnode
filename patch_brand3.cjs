const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const regex = /const hasEmptyBrand = products\.some\(p => !p\.brand\);\n      if \(hasEmptyBrand\) \{\n        setProducts\(prev => prev\.map\(p => \{\n          if \(!p\.brand\) \{\n            return \{ \.\.\.p, brand: lockedBrand \};\n          \}\n          return p;\n        \}\)\);\n      \}/;

const replacement = `const hasEmptyBrand = products.some(p => !p.brand);
      if (hasEmptyBrand) {
        const bObj = availableBrands.find(b => b.name === lockedBrand);
        const bId = bObj ? bObj.id : null;
        setProducts(prev => prev.map(p => {
          if (!p.brand) {
            return { ...p, brand: lockedBrand, brand_id: bId };
          }
          return p;
        }));
      }`;

piContent = piContent.replace(regex, replacement);

fs.writeFileSync(piFile, piContent);
console.log("Patched auto-fill to include brand_id!");
