const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      // Update UI labels
      newContent = newContent.replace(/Save \(Ctrl\+A\)/g, "Save (Cmd/Ctrl+A)");
      newContent = newContent.replace(/Create New \(Alt\+C\)/g, "Create New (Alt/Opt+C)");
      
      // Update event listeners for Ctrl+A -> Cmd/Ctrl+A
      // No standard JS event listener for Save was added in previous scripts, only the UI button.
      // But for Alt+C -> Alt/Opt+C, we can replace it globally if found.
      newContent = newContent.replace(/e\.altKey && e\.key\.toLowerCase\(\) === 'c'/g, "e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC' || e.key === 'ç')");
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated labels in:', fullPath);
      }
    }
  }
}

processDir('/Users/ratan/Downloads/frost-pivot/RetailNode/FrontEndV2/src/pages');
