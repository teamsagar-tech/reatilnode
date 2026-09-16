const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<button[\s\S]*?onClick={handleGenerateGrid}[\s\S]*?<\/button>/;
content = content.replace(regex, '');

fs.writeFileSync(file, content);
console.log("Removed handleGenerateGrid button.");
