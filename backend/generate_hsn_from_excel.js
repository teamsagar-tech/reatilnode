const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const workbook = xlsx.readFile('/Users/ratan/Downloads/RetailNodeV2/sample/HSN_SAC.xlsx');

const hsnList = [];

// Process HSN
const hsnSheet = workbook.Sheets['HSN_MSTR'];
if (hsnSheet) {
    const hsnData = xlsx.utils.sheet_to_json(hsnSheet);
    hsnData.forEach(row => {
        if (row.HSN_CD) {
            hsnList.push({
                code: String(row.HSN_CD).trim(),
                description: String(row.HSN_Description || '').trim(),
                tax_percent: 0 // Default to 0 since it's not in the file
            });
        }
    });
}

// Process SAC
const sacSheet = workbook.Sheets['SAC_MSTR'];
if (sacSheet) {
    const sacData = xlsx.utils.sheet_to_json(sacSheet);
    sacData.forEach(row => {
        if (row.SAC_CD) {
            hsnList.push({
                code: String(row.SAC_CD).trim(),
                description: String(row.SAC_Description || '').trim(),
                tax_percent: 0 // Default to 0 since it's not in the file
            });
        }
    });
}

fs.writeFileSync(path.join(__dirname, 'data', 'hsn_catalog.json'), JSON.stringify(hsnList, null, 2));
console.log(`Generated hsn_catalog.json with ${hsnList.length} records.`);
