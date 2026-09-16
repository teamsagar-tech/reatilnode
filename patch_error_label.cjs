const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add submitError state
content = content.replace(/const \[name, setName\] = useState\(''\);/, "const [name, setName] = useState('');\n  const [submitError, setSubmitError] = useState('');");

// Clear submitError when typing name
content = content.replace(/onChange=\{\(e\) => setName\(e\.target\.value\)\}/g, "onChange={(e) => { setName(e.target.value); setSubmitError(''); }}");

// Clear submitError when opening modal
content = content.replace(/setFocusedIndex\(-1\);/g, "setFocusedIndex(-1);\n      setSubmitError('');");

// Replace alert(errText) with setSubmitError(errText)
content = content.replace(/alert\(errText\);/g, "setSubmitError(errText);");

// Render submitError below the name field
const nameRowRegex = /<\/div>\s*\{masterType === 'item'/;
const errorRender = `
          </div>
          {submitError && <div className="text-red-600 text-[11px] font-bold mt-1 text-center bg-red-50 py-1 border border-red-200">{submitError}</div>}

          {masterType === 'item'`;
content = content.replace(/<\/div>\s*\{masterType === 'item'/, errorRender);

fs.writeFileSync(file, content);
console.log('Patched error label');
