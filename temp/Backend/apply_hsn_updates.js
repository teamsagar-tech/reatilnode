const fs = require('fs');
const path = require('path');

const updatesText = fs.readFileSync(path.join(__dirname, 'hsn_updates.txt'), 'utf8');
const lines = updatesText.split('\n');

const updatesMap = {}; // mapping of prefix -> rate

lines.forEach(line => {
    // example: Corrugated paper or cardboard boxes — Common HSN (4-digit): 4819; GST rate: 18%
    // or: Refined or crude edible oil, branded — Common HSN (4-digit): 1507–1515; GST rate: 5%
    // or: Nil
    if (!line.includes('Common HSN')) return;

    let rate = 0;
    const rateMatch = line.match(/GST rate:\s*([\d\.]+)%/);
    if (rateMatch) {
        rate = parseFloat(rateMatch[1]);
    } else if (line.toLowerCase().includes('nil')) {
        rate = 0;
    }

    const codeMatch = line.match(/\(4-digit\):\s*([\d\–\-or\s]+);/);
    if (codeMatch) {
        const codesStr = codeMatch[1].replace(/or/g, ',').trim();
        const parts = codesStr.split(/[,–\-]/).map(c => c.trim()).filter(c => c.length > 0);
        
        if (parts.length === 2 && codesStr.includes('–') || codesStr.includes('-')) {
             // Range
             let start = parseInt(parts[0]);
             let end = parseInt(parts[1]);
             for (let i = start; i <= end; i++) {
                 updatesMap[String(i)] = rate;
             }
        } else {
             parts.forEach(p => updatesMap[p] = rate);
        }
    }
});

// Hardcode the ones user mentioned
updatesMap['5802'] = 5;
updatesMap['5407'] = 5; // since 540754 is in the CSV
updatesMap['540754'] = 5;

// Now apply
const catalogPath = path.join(__dirname, 'data', 'hsn_catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

let updatedCount = 0;
catalog.forEach(item => {
    // Find the longest matching prefix
    let bestMatch = null;
    let maxLen = 0;
    
    for (const prefix in updatesMap) {
        if (item.code.startsWith(prefix)) {
            if (prefix.length > maxLen) {
                maxLen = prefix.length;
                bestMatch = updatesMap[prefix];
            }
        }
    }

    if (bestMatch !== null) {
        item.tax_percent = bestMatch;
        updatedCount++;
    }
});

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log(`Updated ${updatedCount} records with new tax percentages!`);
