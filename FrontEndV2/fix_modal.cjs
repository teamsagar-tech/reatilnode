const fs = require('fs');

let content = fs.readFileSync('src/components/inventory/PartyModal.tsx', 'utf-8');

// Apply grid
content = content.replace(/<div className="w-full flex flex-row flex-wrap gap-x-8 gap-y-2">/g, 
  `<div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">`);

content = content.replace(/<SectionTitle>/g, `<div className="col-span-full"><SectionTitle>`);
content = content.replace(/<\/SectionTitle>/g, `</SectionTitle></div>`);

// Copy the Address block from PartyMaster to PartyModal
let masterContent = fs.readFileSync('src/pages/masters/accounting/PartyMaster.tsx', 'utf-8');
let addrStart = masterContent.indexOf('<div className="col-span-full">\n                        <SectionTitle>Address Information</SectionTitle>');
let addrEnd = masterContent.indexOf('</div>\n                      </div>\n                    </div>\n\n                    {/* Column 2: Contact & Bank */}');
if (addrStart !== -1 && addrEnd !== -1) {
  let newAddrBlock = masterContent.substring(addrStart, addrEnd + '</div>\n                      </div>'.length);
  // PartyModal might use addressLine1 instead of line1
  newAddrBlock = newAddrBlock.replace(/formData\.line1/g, 'formData.addressLine1');
  newAddrBlock = newAddrBlock.replace(/formData\.line2/g, 'formData.addressLine2');
  newAddrBlock = newAddrBlock.replace(/formData\.line3/g, 'formData.addressLine3');
  
  let oldModalAddrStart = content.indexOf('<div className="col-span-full"><SectionTitle>Address Information</SectionTitle></div>');
  let oldModalAddrEnd = content.indexOf('</div>\n\n          {/* Column 2: Contact & Bank */}');
  
  if (oldModalAddrStart !== -1 && oldModalAddrEnd !== -1) {
     content = content.substring(0, oldModalAddrStart) + newAddrBlock + content.substring(oldModalAddrEnd);
  }
}

// Wrap Captcha in Modal
let gstStart = content.indexOf('<div className="flex items-center mb-[2px]">\n              <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">GSTIN</div>');
let gstEndString = '              </div>\n            )}';
let gstEnd = content.indexOf(gstEndString, gstStart);
if (gstStart !== -1 && gstEnd !== -1) {
  let oldGst = content.substring(gstStart, gstEnd + gstEndString.length);
  let newGst = `<div className="relative flex flex-col">\n              ` + oldGst + `\n            </div>`;
  newGst = newGst.replace(/<div className="ml-\[110px\] bg-white border border-slate-300 p-2 shadow flex flex-col gap-2 mb-2 w-\[calc\(100%-110px\)\]">/,
    `<div className="absolute top-[100%] left-[110px] z-[60] bg-white border-2 border-slate-400 p-2 shadow-2xl flex flex-col gap-2 w-[250px]">`);
  content = content.substring(0, gstStart) + newGst + content.substring(gstEnd + gstEndString.length);
}

// Remove State from Modal Legal
content = content.replace(/<InputRow label="State" value={formData.state} onChange={\(v: string\) => setFormData\(\{\.\.\.formData, state: v\}\)} \/>\n\s*/, '');


fs.writeFileSync('src/components/inventory/PartyModal.tsx', content);
