const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'FrontEnd', 'src', 'pages', 'masters');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if it already has the auto-focus useEffect
    if (content.includes('// Auto-focus on mode change')) {
        return;
    }

    // Check if the file has `const [mode, setMode] = useState`
    if (!content.includes('mode === \'create\'') || !content.includes('setMode')) {
        return;
    }

    // We want to insert a useEffect right before `const SectionTitle` or `const InputGroup` or `useEffect(() => { fetchList();`
    // Let's insert it right after `useEffect(() => { fetchList(); }, [fetchList]);`
    const insertPoint = `useEffect(() => { fetchList(); }, [fetchList]);`;
    
    if (content.includes(insertPoint)) {
        const replacement = `${insertPoint}\n
  // Auto-focus on mode change
  useEffect(() => {
    if (mode === 'create') {
      setTimeout(() => {
        // Try to find the input with autoFocus=true or id="field-0" or just the first input
        const firstInput = (document.querySelector('input[autofocus]') || document.getElementById('field-0') || document.querySelector('input[type="text"]')) as any;
        if (firstInput && typeof firstInput.focus === 'function') {
          firstInput.focus();
        }
      }, 50);
    }
  }, [mode]);\n`;
        content = content.replace(insertPoint, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${path.basename(filePath)}`);
    } else {
        console.log(`Could not find insert point in ${path.basename(filePath)}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

processDirectory(directoryPath);
console.log('Done processing inventory masters.');
