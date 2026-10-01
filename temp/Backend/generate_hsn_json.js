const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, 'hsn_dump.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');
const regex = /\(1,\s*'([^']+)',\s*'([^']*)',\s*1,\s*([\d\.]+)\)/g;

const hsnList = [];
let match;
while ((match = regex.exec(sql)) !== null) {
  hsnList.push({
    code: match[1],
    description: match[2].replace(/''/g, "'"), // handle SQL escaped quotes
    tax_percent: parseFloat(match[3])
  });
}

fs.writeFileSync(path.join(__dirname, 'data', 'hsn_catalog.json'), JSON.stringify(hsnList, null, 2));
console.log(`Generated hsn_catalog.json with ${hsnList.length} records.`);
