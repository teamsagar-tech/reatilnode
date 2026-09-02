const fs = require('fs');

function patchFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Change mapping to avoid PARTY overwriting SUPPLIER if SUPPLIER is present
    const oldCode = `
          const headerMap: { [key: string]: keyof typeof newInvoiceData } = {
            'Doc No.': 'billNo',
            'INVDATE': 'billDate',
            'Date': 'billDate',
            'LRNO': 'lrNo',
            'TRANSPORT': 'transporter',
            'ADAT %': 'commissionPercent',
            'SALESPERSON': 'purchaser',
            'SUPPLIER': 'supplier',
            'PARTY': 'supplier'
          };
          
          for (const [key, value] of Object.entries(firstRow)) {
            const trimmedKey = key.trim();
            if (headerMap[trimmedKey] && value) {
              (newInvoiceData as any)[headerMap[trimmedKey]] = value;
            }
          }`;

    const newCode = `
          const headerMap: { [key: string]: keyof typeof newInvoiceData } = {
            'Doc No.': 'billNo',
            'INVDATE': 'billDate',
            'Date': 'billDate',
            'LRNO': 'lrNo',
            'TRANSPORT': 'transporter',
            'ADAT %': 'commissionPercent',
            'SALESPERSON': 'purchaser',
            'SUPPLIER': 'supplier',
            'PARTY': 'supplier'
          };
          
          for (const [key, value] of Object.entries(firstRow)) {
            const trimmedKey = key.trim();
            if (headerMap[trimmedKey] && value) {
              // If we already mapped SUPPLIER, do not let PARTY overwrite it
              if (trimmedKey === 'PARTY' && newInvoiceData.supplier) {
                // skip
              } else {
                (newInvoiceData as any)[headerMap[trimmedKey]] = value;
              }
            }
          }`;

    content = content.replace(oldCode, newCode);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Patched Party in', filePath);
  }
}

patchFile('FrontEnd/src/pages/inventory/PurchaseInvoice.tsx');
patchFile('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx');
