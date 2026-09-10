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
  if (content.includes('\\${import.meta.env.VITE_API_URL')) {
    const newContent = content.replace(/\\\$\{import\.meta\.env\.VITE_API_URL/g, '${import.meta.env.VITE_API_URL');
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Fixed:', file);
  }
});
