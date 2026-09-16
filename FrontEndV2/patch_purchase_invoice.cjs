const fs = require('fs');
const file = './src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(file, 'utf-8');

// We need a helper to check the matchedVendor brands
const helperInjection = `
  const getVendorBrandConfig = () => {
    const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === (invoiceData.supplier || '').toLowerCase());
    if (!matchedVendor) return { isSingle: false, allowedBrands: null };
    
    let vendorBrands = [];
    try {
      vendorBrands = typeof matchedVendor.brands === 'string' ? JSON.parse(matchedVendor.brands) : (matchedVendor.brands || []);
    } catch(e) {}
    
    // Map to objects if they are strings, but the schema seems to save an array of strings? Or array of objects {name}? 
    // In partyController it saves the JSON. Let's extract names.
    const allowedBrandNames = vendorBrands.map(b => typeof b === 'string' ? b : b.name).filter(Boolean);
    
    return {
      isSingle: matchedVendor.brand_type === 'Single',
      allowedBrands: allowedBrandNames.length > 0 ? allowedBrandNames : null
    };
  };

  const { isSingle: isSingleBrandVendor, allowedBrands: vendorAllowedBrands } = getVendorBrandConfig();

  // Determine if a single brand is already locked in (for Single Brand parties)
  const lockedBrand = isSingleBrandVendor ? (products.find(p => p.brand)?.brand || null) : null;
`;

// Insert the helper at the beginning of the return statement or somewhere inside the component.
// We can just put it inside the component body, e.g. before `const handleKeyDown`
if (!content.includes('const getVendorBrandConfig')) {
  content = content.replace(
    /const handleKeyDown = \(e: React\.KeyboardEvent<HTMLInputElement>, index: number, field: string\) => \{/,
    `${helperInjection}\n\n  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number, field: string) => {`
  );
}

// Update Alt+C logic in handleKeyDown
// If field === 'brand', prevent Alt+C if vendorAllowedBrands is not null.
content = content.replace(
  /if \(\['brand', 'size', 'item', 'gst'\]\.includes\(field\)\) \{/,
  `if (['brand', 'size', 'item', 'gst'].includes(field)) {\n        if (field === 'brand' && vendorAllowedBrands !== null) {\n          alert('This party has specific brands assigned. You cannot create a new brand on the fly.');\n          return;\n        }`
);

// Update dropdown filteredBrands logic inside handleKeyDown (around line 790)
// wait, the dropdown logic in handleKeyDown also uses `availableBrands.filter(...)`.
// We need to inject `let filteredBrands = availableBrands;` properly in handleKeyDown!
content = content.replace(
  /const filtered = availableBrands\.filter\(b => \(b\.name \|\| ''\)\.toLowerCase\(\)\.startsWith\(query\)\)\.slice\(0, 8\);/,
  `let baseBrands = availableBrands;
      if (vendorAllowedBrands !== null) {
        baseBrands = baseBrands.filter(b => vendorAllowedBrands.includes(b.name));
      }
      if (isSingleBrandVendor && lockedBrand) {
        baseBrands = baseBrands.filter(b => b.name === lockedBrand);
      }
      const filtered = baseBrands.filter(b => (b.name || '').toLowerCase().startsWith(query)).slice(0, 8);`
);

// We need to also patch the dropdown logic in the JSX render!
content = content.replace(
  /let filteredBrands = availableBrands;[\s\S]*?if \(vendorBrands\.length > 0\) \{\s*filteredBrands = availableBrands\.filter\(b => vendorBrands\.includes\(b\.name\)\);\s*\}\s*\}/,
  `let filteredBrands = availableBrands;
                                if (vendorAllowedBrands !== null) {
                                  filteredBrands = filteredBrands.filter(b => vendorAllowedBrands.includes(b.name));
                                }
                                if (isSingleBrandVendor && lockedBrand) {
                                  filteredBrands = filteredBrands.filter(b => b.name === lockedBrand);
                                }`
);

// Ensure the "Alt+C" message is NOT shown if vendorAllowedBrands is not null
content = content.replace(
  /\} else if \(products\[index\]\.brand\) \{[\s\S]*?return \([\s\S]*?<div className="px-2 py-2 text-\[11px\] text-slate-500 italic bg-white">[\s\S]*?Press <span className="font-bold text-black">Alt\+C<\/span> to create "{products\[index\]\.brand}"[\s\S]*?<\/div>[\s\S]*?\);[\s\S]*?\}/,
  `} else if (products[index].brand && vendorAllowedBrands === null) {
                                  return (
                                    <div className="px-2 py-2 text-[11px] text-slate-500 italic bg-white">
                                      Press <span className="font-bold text-black">Alt+C</span> to create "{products[index].brand}"
                                    </div>
                                  );
                                }`
);

// If the user tries to type a brand that is NOT allowed and presses enter/tab?
// In handleKeyDown:
content = content.replace(
  /\} else if \(query\.trim\(\) !== ''\) \{/,
  `} else if (query.trim() !== '' && vendorAllowedBrands === null) {`
);

// Make the Brand input read-only or override onChange if it's a single brand party and already locked, BUT they can just clear it.
// Actually, if they try to type something else, `lockedBrand` will just filter `baseBrands` to the `lockedBrand`.

fs.writeFileSync(file, content);
console.log('Patched PurchaseInvoice.tsx');
