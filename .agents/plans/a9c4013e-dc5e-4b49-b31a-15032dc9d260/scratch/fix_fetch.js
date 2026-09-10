const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(getFiles(file));
    } else {
      if (file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = getFiles('/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("fetch('/api/")) {
    const newContent = content.replace(/fetch\('(\/api\/[^']*)'/g, "fetch(`\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed:', file);
  }
});
