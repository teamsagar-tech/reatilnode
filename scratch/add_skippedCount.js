const fs = require('fs');
let content = fs.readFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', 'utf8');

// Add state
const queueStateStr = `  const [importQueue, setImportQueue] = useState<any[][]>([]);`;
content = content.replace(queueStateStr, queueStateStr + `\n  const [skippedCount, setSkippedCount] = useState(0);`);

// Reset state in handleImport
const handleImportStart = `  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;`;
content = content.replace(handleImportStart, handleImportStart + `\n    setSkippedCount(0);`);

// Replace alert with setSkippedCount
const alertCode = `const skipped = originalLength - groups.length;
                            if (skipped > 0) {
                                alert(\`Skipped \${skipped} invoice(s) from the CSV because they are already saved in the system.\`);
                            }`;
const newSkippedCode = `const skipped = originalLength - groups.length;
                            if (skipped > 0) {
                                setSkippedCount(skipped);
                            }`;
content = content.replace(alertCode, newSkippedCode);

// Update JSX Banner
const oldBanner = `<span>Import Queue: {importQueue.length} more invoice(s) waiting to be loaded from the imported file.</span>`;
const newBanner = `<span>Import Queue: {importQueue.length} more invoice(s) waiting to be loaded from the imported file. {skippedCount > 0 && <span className="text-red-700 ml-2">(Automatically skipped {skippedCount} already-saved invoice(s))</span>}</span>`;
content = content.replace(oldBanner, newBanner);

fs.writeFileSync('FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx', content);
console.log("Updated PurchaseInvoice.tsx");
