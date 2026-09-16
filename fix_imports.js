const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<ConfirmModal') && !content.includes('import ConfirmModal')) {
        
        // Calculate relative path to src/components/ui/ConfirmModal
        const srcDir = path.resolve('FrontEndV2/src');
        const currentDir = path.dirname(fullPath);
        let relPath = path.relative(currentDir, path.join(srcDir, 'components', 'ui', 'ConfirmModal'));
        if (!relPath.startsWith('.')) relPath = './' + relPath;
        
        const importStmt = `import ConfirmModal from '${relPath}';\n`;
        
        // Add import after the last import statement
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
          const endOfLastImport = content.indexOf('\n', lastImportIndex);
          content = content.slice(0, endOfLastImport + 1) + importStmt + content.slice(endOfLastImport + 1);
        } else {
          content = importStmt + content;
        }
        
        fs.writeFileSync(fullPath, content);
        console.log('Fixed', fullPath);
      }
    }
  }
}

processDir('FrontEndV2/src/pages/masters');
