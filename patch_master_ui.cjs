const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add states
const statesToAdd = `
  const [availableScaleSizes, setAvailableScaleSizes] = useState<any[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
`;
content = content.replace(/const \[sizeScale, setSizeScale\] = useState\('Inch'\);/, `const [sizeScale, setSizeScale] = useState('Inch');\n${statesToAdd}`);

// Add useEffects for fetching sizes and parsing name
const useEffectsToAdd = `
  useEffect(() => {
    if (isOpen && ['size', 'sizeset', 'sizegroup'].includes(masterType)) {
      fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes\`, {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` }
      })
      .then(res => res.json())
      .then(data => {
        const matched = data.filter((s: any) => s.size_group === sizeScale);
        matched.sort((a: any, b: any) => parseFloat(a.name) - parseFloat(b.name));
        setAvailableScaleSizes(matched);
      })
      .catch(err => console.error("Error fetching scale sizes", err));
    }
  }, [isOpen, masterType, sizeScale]);

  useEffect(() => {
    if (['size', 'sizeset', 'sizegroup'].includes(masterType) && name.includes('-')) {
      const parts = name.split('-');
      if (parts.length === 2) {
        const start = parseFloat(parts[0]);
        const end = parseFloat(parts[1]);
        if (!isNaN(start) && !isNaN(end) && start < end) {
          const autoSelected = availableScaleSizes.filter(s => {
            const val = parseFloat(s.name);
            return !isNaN(val) && val >= start && val <= end;
          }).map(s => s.name);
          setSelectedSizes(autoSelected);
        }
      }
    } else {
      setSelectedSizes([]);
    }
  }, [name, availableScaleSizes, masterType]);

  const handleCheckboxToggle = (sizeName: string) => {
    setSelectedSizes(prev => 
      prev.includes(sizeName) ? prev.filter(s => s !== sizeName) : [...prev, sizeName]
    );
  };
`;
content = content.replace(/const firstInputRef = useRef<HTMLInputElement>\(null\);/, `const firstInputRef = useRef<HTMLInputElement>(null);\n${useEffectsToAdd}`);

// Update handleSave to use selectedSizes
const handleSaveRegex = /const fetched = await fetchMatchedSizes\(name, sizeScale\);\n\s*if \(fetched\) \{\n\s*sizesArray = fetched;\n\s*\}/g;
content = content.replace(handleSaveRegex, `
        if (selectedSizes.length > 0) {
          sizesArray = selectedSizes;
        } else {
          const fetched = await fetchMatchedSizes(name, sizeScale);
          if (fetched) sizesArray = fetched;
        }
`);
// Wait, the regex might replace 3 places.
// Let's replace 'sizesArray = fetched;' with 'sizesArray = selectedSizes.length > 0 ? selectedSizes : fetched;'
// Wait, what if selectedSizes is empty because they didn't use a hyphen but manually clicked checkboxes?
// If they manually clicked checkboxes, `extra1` was empty, `name` doesn't have a hyphen?
// "Sizes (Optional, Comma separated)" input handles `extra1`.
// We can just set `extra1` to `selectedSizes.join(', ')` whenever `selectedSizes` changes!
// Then the existing logic `(extra1 || '').split(',').map...` works perfectly!
