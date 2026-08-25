const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('Master.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix the JS keydown logic:
      // Replace: e.altKey && e.key.toLowerCase() === 'c'
      // With: e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')
      let newContent = content.replace(/e\.altKey && e\.key\.toLowerCase\(\) === 'c'/g, "e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC' || e.key === 'ç')");
      
      // Fix the UI label:
      // Replace: Create New (Alt+C)
      // With: Create New (Alt/Opt+C)
      newContent = newContent.replace(/Create New \(Alt\+C\)/g, "Create New (Alt/Opt+C)");
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Fixed shortcut in:', fullPath);
      }
    }
  }
}

processDir('/Users/ratan/Downloads/frost-pivot/RetailNode/FrontEndV2/src/pages/masters');
