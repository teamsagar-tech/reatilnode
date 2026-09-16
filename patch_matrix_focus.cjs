const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const oldOnClose = `        onClose={() => {
          const idx = activeSizeMatrixRow;
          setActiveSizeMatrixRow(null);
          if (idx !== null) {
            setTimeout(() => document.getElementById(\`row-\${idx}-qty\`)?.focus(), 100);
          }
        }}`;
const newOnClose = `        onClose={() => {
          const idx = activeSizeMatrixRow;
          setActiveSizeMatrixRow(null);
          if (idx !== null) {
            setTimeout(() => {
              const nextField = invoiceData.showMarkdown ? 'mrp' : 'rate';
              document.getElementById(\`row-\${idx}-\${nextField}\`)?.focus();
            }, 100);
          }
        }}`;
piContent = piContent.replace(oldOnClose, newOnClose);

const oldOnSaveFocus = `          const idx = activeSizeMatrixRow;
          setActiveSizeMatrixRow(null);
          if (idx !== null) {
            setTimeout(() => document.getElementById(\`row-\${idx}-qty\`)?.focus(), 100);
          }`;
          
const newOnSaveFocus = `          const idx = activeSizeMatrixRow;
          setActiveSizeMatrixRow(null);
          if (idx !== null) {
            setTimeout(() => {
              const nextField = invoiceData.showMarkdown ? 'disc' : 'rate'; // Since they already updated MRP/Rate inside matrix? 
              // Actually they want next input value. The user says "dont focus to Quantity focus to next input value"
              const fieldToFocus = invoiceData.showMarkdown ? 'mrp' : 'rate';
              document.getElementById(\`row-\${idx}-\${fieldToFocus}\`)?.focus();
            }, 100);
          }`;
          
piContent = piContent.replace(oldOnSaveFocus, newOnSaveFocus);

// Fix the new row generation in onSave matrix:
const oldNewRow = `qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: 0, gst: 0, design: '', colour: '', size: '', mrp: 0`;
const newNewRow = `qty: '', cut_size: '', pieces: '', rate: '', last_rate: null, disc: last ? last.disc : '', disc2: last ? last.disc2 : '', gst: '', design: '', colour: '', size: '', mrp: ''`;
piContent = piContent.replace(oldNewRow, newNewRow);

fs.writeFileSync(piFile, piContent);
console.log("Patched matrix focus!");
