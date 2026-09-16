const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('<div className="w-[100px]">\n              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Base Rate</label>');
const endStr = '<button \n              onClick={handleGenerateGrid}';
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + content.substring(endIdx);
    fs.writeFileSync(file, content);
    console.log("Top bar removed via substring!");
} else {
    // If handleGenerateGrid is gone, try another end string
    const fallbackEndStr = '</button>';
    console.log("startIdx", startIdx, "endIdx", endIdx);
}
