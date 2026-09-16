const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Wrap the GSTIN section
  // It starts with `<div className="flex items-center mb-[2px]">\n                        <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">GSTIN</div>`
  
  // Actually, I can use multi_replace_file_content or a script. Let's do a regex replacement.
  let startIndex = content.indexOf('<div className="flex items-center mb-[2px]">\n                        <div className="w-[110px] text-slate-800 font-bold text-[11px] text-right pr-2 leading-tight">GSTIN</div>');
  
  if (startIndex === -1) {
     console.log("Could not find start for " + filePath);
     return;
  }
  
  let endString = '                        </div>\n                      )}';
  let endIndex = content.indexOf(endString, startIndex);
  if (endIndex === -1) {
      console.log("Could not find end for " + filePath);
      return;
  }
  endIndex += endString.length;
  
  let oldBlock = content.substring(startIndex, endIndex);
  
  let newBlock = `<div className="relative flex flex-col">\n                        ` + oldBlock + `\n                      </div>`;
  
  // Make captcha absolute
  newBlock = newBlock.replace(/<div className="ml-\[110px\] bg-white border border-slate-300 p-2 shadow flex flex-col gap-2 mb-2 w-\[calc\(100%-110px\)\]">/,
    `<div className="absolute top-[100%] left-[110px] z-[60] bg-white border-2 border-slate-400 p-2 shadow-2xl flex flex-col gap-2 w-[250px]">`);
    
  content = content.substring(0, startIndex) + newBlock + content.substring(endIndex);
  
  fs.writeFileSync(filePath, content);
  console.log("Fixed " + filePath);
}

fixFile('src/pages/masters/accounting/PartyMaster.tsx');
fixFile('src/components/inventory/PartyModal.tsx');
