const fs = require('fs');

function fixFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // FIX 1: Party priority
    // Let's just do a RegExp replace to be robust.
    content = content.replace(
      /if \(headerMap\[trimmedKey\] && value\) \{\s*\(newInvoiceData as any\)\[headerMap\[trimmedKey\]\] = value;\s*\}/g,
      `if (headerMap[trimmedKey] && value) {
              if (trimmedKey === 'PARTY' && newInvoiceData.supplier) {
                // Do not overwrite supplier with party
              } else {
                (newInvoiceData as any)[headerMap[trimmedKey]] = value;
              }
            }`
    );

    // FIX 2: Commission and Discount Inputs (type="number" needs a number, not a string)
    // Discount
    content = content.replace(
      `value={invoiceData.discountPercent > 0 ? calcDiscount.toFixed(2) : (invoiceData.discountAmount || '')}`,
      `value={invoiceData.discountPercent > 0 ? Number(calcDiscount.toFixed(2)) : (invoiceData.discountAmount || '')}`
    );
    // Commission
    content = content.replace(
      `value={invoiceData.commissionPercent > 0 ? calcCommission.toFixed(2) : (invoiceData.commissionAmount || '')}`,
      `value={invoiceData.commissionPercent > 0 ? Number(calcCommission.toFixed(2)) : (invoiceData.commissionAmount || '')}`
    );

    // FIX 3: Empty row filtering to be absolutely bulletproof
    content = content.replace(
      `.filter(p => (p.item && p.item.trim()) || Number(p.qty) > 0);`,
      `.filter(p => (p.item !== undefined && p.item !== null && String(p.item).trim() !== '') || Number(p.qty) > 0);`
    );
    // Also support the old one if it wasn't patched properly:
    content = content.replace(
      `.filter(p => p.item || Number(p.qty) > 0);`,
      `.filter(p => (p.item !== undefined && p.item !== null && String(p.item).trim() !== '') || Number(p.qty) > 0);`
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

fixFile('FrontEnd/src/pages/inventory/PurchaseInvoice.tsx');
fixFile('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx');
