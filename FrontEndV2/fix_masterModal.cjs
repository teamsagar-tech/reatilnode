const fs = require('fs');
const files = [
  './src/pages/masters/accounting/PartyMaster.tsx',
  './src/components/inventory/PartyModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Find the exact masterModal declaration
  const declRegex = /  const \[masterModal, setMasterModal\] = useState<\{type: 'brand' \| 'partycategory' \| 'partysubcategory', initialValue: string, parentId\?: number\} \| null>\(null\);\n/;
  
  if (content.match(declRegex)) {
    // Remove it from its current position
    content = content.replace(declRegex, '');
    
    // Inject it right after setFocusedCatIndex
    const injectTarget = /  const \[focusedCatIndex, setFocusedCatIndex\] = useState\(-1\);\n/;
    const injection = "  const [focusedCatIndex, setFocusedCatIndex] = useState(-1);\n  const [masterModal, setMasterModal] = useState<{type: 'brand' | 'partycategory' | 'partysubcategory', initialValue: string, parentId?: number} | null>(null);\n";
    
    content = content.replace(injectTarget, injection);
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
  }
});
