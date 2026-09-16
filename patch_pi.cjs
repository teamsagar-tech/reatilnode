const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// Fix Taxable Amount Double Discount Bug
piContent = piContent.replace(
  'const lineAmount = (p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100);',
  'const lineAmount = invoiceData.showMarkdown ? ((p.qty || 0) * (p.rate || 0)) : ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100));'
);

// Do it again because it appears twice (once in `tax` and once maybe in `subtotal`? No, subtotal uses different)
piContent = piContent.replace(
  'const lineAmount = (p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100);',
  'const lineAmount = invoiceData.showMarkdown ? ((p.qty || 0) * (p.rate || 0)) : ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100));'
);

// Single Brand Auto Focus
// Search for handleBrandFocus
piContent = piContent.replace(
  /const handleBrandFocus = \(e: React\.FocusEvent<HTMLInputElement>, index: number\) => \{/,
  `const handleBrandFocus = (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    if (isSingleBrandVendor && lockedBrand) {
      setTimeout(() => {
        document.getElementById(\`row-\${index}-item\`)?.focus();
      }, 10);
      return;
    }`
);

// Swap Narration and Totals DOM order for Tab index
const flexContainerRegex = /<div className="flex border-b-2 border-black bg-\[#fcfaf2\] shrink-0">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
const match = flexContainerRegex.exec(piContent);
if (match) {
   let innerContent = match[1];
   // Split into Narration and Totals
   const narrationRegex = /\{\/\* Left Part: Narration \*\/\}[\s\S]*?\{\/\* Right Part: Totals Table \*\/}/;
   const splitPart = innerContent.split('{/* Right Part: Totals Table */}');
   if (splitPart.length === 2) {
      const narrationPart = splitPart[0];
      const totalsPart = '{/* Right Part: Totals Table */}' + splitPart[1];
      
      const newFlex = `<div className="flex flex-row-reverse border-b-2 border-black bg-[#fcfaf2] shrink-0">
                
                ${totalsPart}
                ${narrationPart}
                `;
      
      piContent = piContent.replace(match[0], newFlex + '</div>\n            </div>\n          </div>\n        </div>\n      </div>');
   }
}

fs.writeFileSync(piFile, piContent);
console.log("Patched PurchaseInvoice!");
