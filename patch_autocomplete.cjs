const fs = require('fs');

const filesToPatch = [
    '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx',
    '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/PartyModal.tsx',
    '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx',
    '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/TransporterModal.tsx',
    '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx'
];

for (const file of filesToPatch) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // In InputRows, replace new-password with off
    content = content.replace(/autoComplete="new-password"/g, 'autoComplete="off"');
    
    // For inputs missing autoComplete, add it.
    // A regex to match `<input ` but only if it doesn't already contain `autoComplete`
    // We can do this safely by matching the input tag and appending autoComplete="off" if not present.
    content = content.replace(/<input\b([^>]*)>/g, (match, attrs) => {
        if (attrs.includes('autoComplete')) return match;
        // don't add to checkbox or radio or file
        if (attrs.includes('type="checkbox"') || attrs.includes('type="radio"') || attrs.includes('type="file"')) return match;
        return `<input autoComplete="off" ${attrs}>`;
    });
    
    fs.writeFileSync(file, content);
    console.log(`Patched ${file}`);
}
