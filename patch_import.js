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
            'ADAT %': 'commissionPercent'
          };`;

const newHeaderMap = `          const headerMap: Record<string, keyof typeof invoiceData> = {
            'INVNO': 'billNo',
            'Doc No.': 'billNo',
            'INVDATE': 'billDate',
            'Date': 'billDate',
            'LRNO': 'lrNo',
            'TRANSPORT': 'transporter',
            'ADAT %': 'commissionPercent',
            'SALESPERSON': 'purchaser'
          };`;

const oldForLoop = `                if (headerMap[trimmedKey] === 'billDate' && typeof value === 'string') {`;
const newForLoop = `                if (headerMap[trimmedKey] === 'purchaser' && typeof value === 'string') {
                    const matchedUser = activeUsers.find((u: any) => 
                        value.toLowerCase().includes((u.name || '').toLowerCase()) || 
                        (u.name || '').toLowerCase().includes(value.toLowerCase())
                    );
                    if (matchedUser) {
                        (newInvoiceData as any)[headerMap[trimmedKey]] = matchedUser.name;
                    } else {
                        (newInvoiceData as any)[headerMap[trimmedKey]] = value;
                    }
                } else if (headerMap[trimmedKey] === 'billDate' && typeof value === 'string') {`;

content = content.replace(oldHeaderMap, newHeaderMap);
content = content.replace(oldForLoop, newForLoop);

fs.writeFileSync(filePath, content, 'utf8');
