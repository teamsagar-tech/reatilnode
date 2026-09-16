const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

// 1. Fix getVendorBrandConfig to consider length === 1 as Single
piContent = piContent.replace(
  "isSingle: matchedVendor.brand_type === 'Single',",
  "isSingle: matchedVendor.brand_type === 'Single' || allowedBrandNames.length === 1,"
);

// 2. Remove Narration and increase Totals font size
const flexContainerRegex = /\{\/\* Two-Part Footer: Narration \(Left\) and Detailed Totals \(Right\) \*\/\}[\s\S]*?\{\/\* Taxable Amount \*\/\}/;
const newFooter = `{/* Footer: Detailed Totals */}
              <div className="flex border-b-2 border-black bg-[#fcfaf2] shrink-0">
                
                {/* Left Part: Empty Space */}
                <div className="w-[60%] border-r-2 border-[#81a09d]"></div>

                {/* Right Part: Totals Table */}
                <div className="w-[40%] flex flex-col font-bold text-[13px] text-slate-800 leading-tight">
                  
                  {/* Taxable Amount */}`;

piContent = piContent.replace(flexContainerRegex, newFooter);

fs.writeFileSync(piFile, piContent);
console.log("Patched PurchaseInvoice 2!");
