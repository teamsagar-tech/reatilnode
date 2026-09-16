const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const stateRegex = /const \[submitError, setSubmitError\] = useState\(''\);/;
const stateReplacement = `const [submitError, setSubmitError] = useState('');
  const [existingNames, setExistingNames] = useState<string[]>([]);`;

content = content.replace(stateRegex, stateReplacement);

const useEffectRegex = /useEffect\(\(\) => \{\s*if \(isOpen && \['size', 'sizeset', 'sizegroup'\]\.includes\(masterType\)\) \{/;
const fetchExistingNamesEffect = `
  useEffect(() => {
    if (isOpen && masterType) {
      let endpoint = '';
      if (masterType === 'item') endpoint = '/api/masters/item';
      else if (masterType === 'brand') endpoint = '/api/masters/brand';
      else if (masterType === 'hsn') endpoint = '/api/masters/generic/hsnsacs';
      else if (masterType === 'size' || masterType === 'sizeset') endpoint = '/api/masters/generic/sizesets'; // for size/sizeset we usually check sizesets if it has a hyphen, but let's check sizes AND sizesets
      else if (masterType === 'sizegroup') endpoint = '/api/masters/size-groups';
      else if (masterType === 'partycategory' || masterType === 'partysubcategory') endpoint = '/api/masters/category';

      if (masterType === 'size' || masterType === 'sizeset') {
        Promise.all([
          fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes\`, { headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` } }).then(r=>r.json()),
          fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets\`, { headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` } }).then(r=>r.json())
        ]).then(([sizes, sizesets]) => {
          const names = [...(Array.isArray(sizes)?sizes:[]), ...(Array.isArray(sizesets)?sizesets:[])].map(d => (d.name || '').toLowerCase().replace(/\\s+/g, ''));
          setExistingNames(names);
        }).catch(()=>{});
      } else if (endpoint) {
        fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}\${endpoint}\`, {
          headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` }
        })
        .then(res => res.json())
        .then(data => {
           if (Array.isArray(data)) {
             setExistingNames(data.map(d => (d.name || '').toLowerCase().replace(/\\s+/g, '')));
           }
        })
        .catch(() => {});
      }
    }
  }, [isOpen, masterType]);

  useEffect(() => {
    if (name) {
      const normalized = name.toLowerCase().replace(/\\s+/g, '');
      if (existingNames.includes(normalized)) {
        setSubmitError(\`Record '\${name}' already exists.\`);
      } else {
        setSubmitError('');
      }
    } else {
      setSubmitError('');
    }
  }, [name, existingNames]);

  useEffect(() => {
    if (isOpen && ['size', 'sizeset', 'sizegroup'].includes(masterType)) {`;

content = content.replace(useEffectRegex, fetchExistingNamesEffect);

// Wait, the input onChange is `onChange={(e) => { setName(e.target.value); setSubmitError(''); }}`
// Since I added a useEffect on `name` that sets submitError, I should remove the `setSubmitError('')` from onChange so it doesn't fight.
content = content.replace(/onChange=\{\(e\) => \{ setName\(e\.target\.value\); setSubmitError\(''\); \}\}/g, "onChange={(e) => setName(e.target.value)}");

fs.writeFileSync(file, content);
console.log('Patched instant error');
