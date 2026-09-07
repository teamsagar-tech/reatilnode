const fs = require('fs');

function fixFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Fix the supplier mapping logic
    const oldCode = `                } else if (headerMap[trimmedKey] === 'supplier' && typeof value === 'string') {
                    const matchedVendor = vendors.find((v: any) => 
                        value.toLowerCase().includes((v.name || '').toLowerCase()) || 
                        (v.name || '').toLowerCase().includes(value.toLowerCase())
                    );
                    if (matchedVendor) {
                        (newInvoiceData as any)[headerMap[trimmedKey]] = matchedVendor.name;
                    } else {
                        alert("Vendor '" + value + "' from the imported file was not found in your database. Please select it manually or create a new vendor.");
                        (newInvoiceData as any)[headerMap[trimmedKey]] = value; // Keep it so they can see what it was
                    }
                }`;

    const newCode = `                } else if (headerMap[trimmedKey] === 'supplier' && typeof value === 'string') {
                    // Prevent PARTY from overwriting an already established SUPPLIER
                    if (trimmedKey === 'PARTY' && (newInvoiceData as any)['supplier']) {
                        // Skip mapping PARTY because we already mapped SUPPLIER
                    } else {
                        const matchedVendor = vendors.find((v: any) => 
                            value.toLowerCase().includes((v.name || '').toLowerCase()) || 
                            (v.name || '').toLowerCase().includes(value.toLowerCase())
                        );
                        if (matchedVendor) {
                            (newInvoiceData as any)[headerMap[trimmedKey]] = matchedVendor.name;
                        } else {
                            // Don't alert for PARTY if it fails to find, only alert for actual SUPPLIER
                            if (trimmedKey !== 'PARTY') {
                                alert("Vendor '" + value + "' from the imported file was not found in your database. Please select it manually or create a new vendor.");
                            }
                            (newInvoiceData as any)[headerMap[trimmedKey]] = value; // Keep it so they can see what it was
                        }
                    }
                }`;

    content = content.replace(oldCode, newCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed Party in', filePath);
  }
}

fixFile('FrontEnd/src/pages/inventory/PurchaseInvoice.tsx');
fixFile('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx');
