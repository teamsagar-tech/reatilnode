const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const statesToAdd = `
  const [availableScaleSizes, setAvailableScaleSizes] = useState<any[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
`;
content = content.replace(/const \[sizeScale, setSizeScale\] = useState\('Inch'\);/, \`const [sizeScale, setSizeScale] = useState('Inch');\n\${statesToAdd}\`);

const useEffectsToAdd = `
  useEffect(() => {
    if (isOpen && ['size', 'sizeset', 'sizegroup'].includes(masterType)) {
      fetch(\\\`\\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes\\\`, {
        headers: { 'Authorization': \\\`Bearer \\\${localStorage.getItem('token')}\\\` }
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
  
  useEffect(() => {
    if (selectedSizes.length > 0) {
      setExtra1(selectedSizes.join(', '));
    } else {
      setExtra1('');
    }
  }, [selectedSizes]);
`;
content = content.replace(/const firstInputRef = useRef<HTMLInputElement>\(null\);/, \`const firstInputRef = useRef<HTMLInputElement>(null);\n\${useEffectsToAdd}\`);

// Now let's remove the extra useEffect I incorrectly appended in patch_master_ui2
content = content.replace(/useEffect\(\(\) => \{\s*if \(selectedSizes\.length > 0\) \{\s*setExtra1\(selectedSizes\.join\(', '\)\);\s*\} else \{\s*setExtra1\(''\);\s*\}\s*\}, \[selectedSizes\]\);\s*$/gm, '');

fs.writeFileSync(file, content);
console.log('Patched states');
