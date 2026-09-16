const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// 1. Tax double discount bug
piContent = piContent.replace(
  'const lineAmount = (p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100);',
  'const lineAmount = invoiceData.showMarkdown ? ((p.qty || 0) * (p.rate || 0)) : ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100));'
);
piContent = piContent.replace(
  'const lineAmount = (p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100);',
  'const lineAmount = invoiceData.showMarkdown ? ((p.qty || 0) * (p.rate || 0)) : ((p.qty || 0) * (p.rate || 0) * (1 - (p.disc || 0) / 100));'
);

// 2. Single Brand Bug
piContent = piContent.replace(
  "isSingle: matchedVendor.brand_type === 'Single',",
  "isSingle: matchedVendor.brand_type === 'Single' || allowedBrandNames.length === 1,"
);

// 3. Remove Narration & increase font size
// First, find the footer container
const flexContainerRegex = /\{\/\* Two-Part Footer: Narration \(Left\) and Detailed Totals \(Right\) \*\/\}[\s\S]*?\{\/\* Taxable Amount \*\/\}/;
const newFooter = `{/* Footer: Detailed Totals */}
              <div className="flex border-b-2 border-black bg-[#fcfaf2] shrink-0">
                
                {/* Left Part: Empty Space */}
                <div className="w-[60%] border-r-2 border-[#81a09d]"></div>

                {/* Right Part: Totals Table */}
                <div className="w-[40%] flex flex-col font-bold text-[13px] text-slate-800 leading-tight">
                  
                  {/* Taxable Amount */}`;
piContent = piContent.replace(flexContainerRegex, newFooter);

// Next, cleanly remove Narration from the end without messing up closing tags
const narrationRegex = /\{\/\* Left Part: Narration \*\/\}[\s\S]*?<\/textarea>\s*<\/div>\s*<\/div>/;
piContent = piContent.replace(narrationRegex, '');

fs.writeFileSync(piFile, piContent);
console.log("Patched clean!");
