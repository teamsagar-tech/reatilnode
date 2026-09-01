const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Replace localStorage.getItem("token")
  // Using regex to handle single/double quotes and optional spacing
  const tokenRegex = /localStorage\.getItem\(\s*(['"])token\1\s*\)/g;
  if (tokenRegex.test(content)) {
    content = content.replace(tokenRegex, "(sessionStorage.getItem('token') || localStorage.getItem('token'))");
    changed = true;
  }

  // Replace localStorage.getItem("user")
  const userRegex = /localStorage\.getItem\(\s*(['"])user\1\s*\)/g;
  if (userRegex.test(content)) {
    content = content.replace(userRegex, "(sessionStorage.getItem('user') || localStorage.getItem('user'))");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

processDirectory(path.join(__dirname, 'FrontEnd', 'src'));
processDirectory(path.join(__dirname, 'FrontEndV2', 'src'));

console.log("Storage replacement complete.");
