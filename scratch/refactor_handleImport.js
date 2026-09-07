const fs = require('fs');
let content = fs.readFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'utf8');

const handleImportStart = content.indexOf(`  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {`);
const handleImportEndStr = `      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };`;
const handleImportEndIdx = content.indexOf(handleImportEndStr) + handleImportEndStr.length;

let handleImportContent = content.substring(handleImportStart, handleImportEndIdx);

const newHandleImport = `  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (data.length > 0) {
            const getValStr = (row: any, keys: string[]) => {
                for (const k of keys) {
                    if (row[k] !== undefined && row[k] !== '') return String(row[k]);
                }
                return '';
            };
            const grouped: Record<string, any[]> = {};
            let unassignedCount = 0;
            for (const row of (data as any[])) {
                const invno = getValStr(row, ['INVNO', 'Doc No.']);
                const key = invno || \`UNASSIGNED_\${++unassignedCount}\`;
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(row);
            }
            let groups = Object.values(grouped);
            
            // Check which invoices already exist
            const checkPayload = groups.map(g => {
                const firstRow = g[0];
                const bill_no = getValStr(firstRow, ['INVNO', 'Doc No.']);
                const supplierName = getValStr(firstRow, ['SUPPLIER', 'PARTY']);
                const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === supplierName.toLowerCase());
                return {
                    bill_no,
                    vendor_id: matchedVendor ? matchedVendor.id : null
                };
            }).filter(p => p.bill_no && p.vendor_id);
            
            if (checkPayload.length > 0) {
                try {
                    const res = await fetch('https://api.retailnode.in/api/purchase-invoices/check-bulk', {
                        method: 'POST',
                        headers: {
                            'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ invoices: checkPayload })
                    });
                    if (res.ok) {
                        const { existing } = await res.json();
                        if (existing && existing.length > 0) {
                            const existingKeys = new Set(existing.map((e: any) => \`\${e.vendor_id}_\${e.bill_no}\`));
                            const originalLength = groups.length;
                            groups = groups.filter(g => {
                                const firstRow = g[0];
                                const bill_no = getValStr(firstRow, ['INVNO', 'Doc No.']);
                                const supplierName = getValStr(firstRow, ['SUPPLIER', 'PARTY']);
                                const matchedVendor = vendors.find(v => (v.name || '').toLowerCase() === supplierName.toLowerCase());
                                if (matchedVendor && bill_no) {
                                    if (existingKeys.has(\`\${matchedVendor.id}_\${bill_no}\`)) return false;
                                }
                                return true;
                            });
                            const skipped = originalLength - groups.length;
                            if (skipped > 0) {
                                alert(\`Skipped \${skipped} invoice(s) from the CSV because they are already saved in the system.\`);
                            }
                        }
                    }
                } catch(e) {
                    console.error("Error checking bulk existing", e);
                }
            }
            
            if (groups.length > 0) {
                processInvoiceGroup(groups[0]);
                if (groups.length > 1) {
                    setImportQueue(groups.slice(1));
                }
            } else {
                alert('No new invoices to import (all invoices in the CSV were already saved).');
            }
        }
      } catch (err) {
        console.error('Error parsing file:', err);
        alert('Failed to parse the file. Ensure it is a valid Excel or CSV.');
      }
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };`;

content = content.replace(handleImportContent, newHandleImport);
fs.writeFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', content);
console.log("Replaced handleImport");
