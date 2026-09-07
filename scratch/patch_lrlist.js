const fs = require('fs');
const path = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/purchase/LRList.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "const [formData, setFormData] = useState<any>({});",
  "const [formData, setFormData] = useState<any>({});\n  const [initialData, setInitialData] = useState<any[]>([]);"
);

code = code.replace(
  /const initialData = React\.useMemo\(\(\) => \[\s+[\s\S]*?\], \[\]\);/m,
  `useEffect(() => {
    fetch('/api/logistics/pending-lrs', {
      headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` }
    })
    .then(res => res.json())
    .then(data => setInitialData(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, []);`
);

fs.writeFileSync(path, code);
console.log('Patched LRList.tsx');
