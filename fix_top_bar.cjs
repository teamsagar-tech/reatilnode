const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="w-\[100px\]">[\s\S]*?<label className="block text-\[10px\].*?Base Rate[\s\S]*?<\/div>[\s\S]*?<div className="w-\[100px\]">[\s\S]*?<label className="block text-\[10px\].*?Step.*?(rateStep)[\s\S]*?<\/div>[\s\S]*?<div className="w-\[100px\]">[\s\S]*?<label className="block text-\[10px\].*?Base MRP[\s\S]*?<\/div>[\s\S]*?<div className="w-\[100px\]">[\s\S]*?<label className="block text-\[10px\].*?Step.*?(mrpStep)[\s\S]*?<\/div>/;

if (regex.test(content)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content);
    console.log("Top bar inputs removed!");
} else {
    console.log("Regex didn't match.");
}
