const fs = require('fs');
const filePath = 'FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldHeaderMap = `          const headerMap: Record<string, keyof typeof invoiceData> = {
            'INVNO': 'billNo',
            'Doc No.': 'billNo',
            'INVDATE': 'billDate',
            'Date': 'billDate',
            'LRNO': 'lrNo',
            'TRANSPORT': 'transporter',
            'ADAT %': 'commissionPercent',
            'SALESPERSON': 'purchaser'
          };`;

const newHeaderMap = `          const headerMap: Record<string, keyof typeof invoiceData> = {
            'INVNO': 'billNo',
            'Doc No.': 'billNo',
            'INVDATE': 'billDate',
            'Date': 'billDate',
            'LRNO': 'lrNo',
            'TRANSPORT': 'transporter',
            'ADAT %': 'commissionPercent',
            'SALESPERSON': 'purchaser',
            'SUPPLIER': 'supplier',
            'PARTY': 'supplier'
          };`;

const oldForLoop = `                } else if (headerMap[trimmedKey] === 'billDate' && typeof value === 'string') {`;

const newForLoop = `                } else if (headerMap[trimmedKey] === 'supplier' && typeof value === 'string') {
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
                } else if (headerMap[trimmedKey] === 'billDate' && typeof value === 'string') {`;

content = content.replace(oldHeaderMap, newHeaderMap);
content = content.replace(oldForLoop, newForLoop);

fs.writeFileSync(filePath, content, 'utf8');
