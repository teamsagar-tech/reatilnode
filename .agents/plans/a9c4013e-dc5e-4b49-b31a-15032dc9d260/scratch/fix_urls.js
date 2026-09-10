const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const targetString = "https://api.retailnode.in";
const replacementBase = "${import.meta.env.VITE_API_URL || 'http://localhost:5000'}";

const files = walk('./FrontEndV2/src');
let filesModified = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Pattern 1: Single quotes 'https://api.retailnode.in...' -> `${import...}...`
    const singleQuoteRegex = /'https:\/\/api\.retailnode\.in([^']*)'/g;
    if (singleQuoteRegex.test(content)) {
        content = content.replace(singleQuoteRegex, `\`${replacementBase}$1\``);
        modified = true;
    }

    // Pattern 2: Double quotes "https://api.retailnode.in..." -> `${import...}...`
    const doubleQuoteRegex = /"https:\/\/api\.retailnode\.in([^"]*)"/g;
    if (doubleQuoteRegex.test(content)) {
        content = content.replace(doubleQuoteRegex, `\`${replacementBase}$1\``);
        modified = true;
    }

    // Pattern 3: Backticks `https://api.retailnode.in...` -> `${import...}...`
    const backtickRegex = /`https:\/\/api\.retailnode\.in([^`]*)`/g;
    if (backtickRegex.test(content)) {
        content = content.replace(backtickRegex, `\`${replacementBase}$1\``);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Modified: ${file}`);
        filesModified++;
    }
});

console.log(`\nTotal files modified: ${filesModified}`);
