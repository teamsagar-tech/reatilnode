const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const helper = `
  const fetchMatchedSizes = async (rangeName: string, scale: string) => {
    try {
      const parts = rangeName.split('-');
      if (parts.length === 2) {
        const start = parseFloat(parts[0]);
        const end = parseFloat(parts[1]);
        if (!isNaN(start) && !isNaN(end) && start < end) {
          const res = await fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizes\`, {
            headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` }
          });
          if (res.ok) {
            const allSizes = await res.json();
            const matchedSizes = allSizes.filter((s: any) => {
                if (s.size_group !== scale) return false;
                const val = parseFloat(s.name);
                return !isNaN(val) && val >= start && val <= end;
            });
            matchedSizes.sort((a: any, b: any) => parseFloat(a.name) - parseFloat(b.name));
            const sizesArray = matchedSizes.map((s: any) => s.name);
            if (sizesArray.length > 0) return sizesArray;
          }
        }
      }
    } catch (err) {
      console.error("Error fetching master sizes", err);
    }
    return null;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
`;

content = content.replace(/const handleSave = async \(\) => {/, helper);

const sizeBlock = `
    } else if (masterType === 'size') {
      if (name.includes('-')) {
        let sizesArray = await fetchMatchedSizes(name, sizeScale);
        if (!sizesArray) {
          sizesArray = [];
          const parts = name.split('-');
          if (parts.length === 2) {
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            if (!isNaN(start) && !isNaN(end) && start < end) {
              let step = 1;
              if (sizeScale === 'CM') {
                step = (end - start) % 5 === 0 ? 5 : ((end - start) % 2 === 0 ? 2 : 1);
              } else {
                step = (end - start) % 2 === 0 ? 2 : 1;
              }
              for (let i = start; i <= end; i += step) {
                sizesArray.push(i.toString());
              }
            }
          }
        }
        data = { name, size_scale: sizeScale, sizes_list: sizesArray };
        endpoint = \`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets\`;
      } else {
`;
content = content.replace(/} else if \(masterType === 'size'\) \{[\s\S]*?endpoint = \`\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}\/api\/masters\/generic\/sizesets\`;\s*\} else \{/, sizeBlock.trim());

const sizesetBlock = `
    } else if (masterType === 'sizeset') {
      let sizesArray: any[] = (extra1 || '').split(',').map(s => s.trim()).filter(Boolean);
      if (sizesArray.length === 0 && name.includes('-')) {
        const fetched = await fetchMatchedSizes(name, sizeScale);
        if (fetched) {
           sizesArray = fetched;
        } else {
          const parts = name.split('-');
          if (parts.length === 2) {
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            if (!isNaN(start) && !isNaN(end) && start < end) {
              let step = 1;
              if (sizeScale === 'CM') {
                step = (end - start) % 5 === 0 ? 5 : ((end - start) % 2 === 0 ? 2 : 1);
              } else {
                step = (end - start) % 2 === 0 ? 2 : 1;
              }
              for (let i = start; i <= end; i += step) {
                sizesArray.push(i.toString());
              }
            }
          }
        }
      }
      data = { name: name, size_scale: sizeScale, sizes_list: sizesArray };
      endpoint = \`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/sizesets\`;
`;
content = content.replace(/} else if \(masterType === 'sizeset'\) \{[\s\S]*?endpoint = \`\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}\/api\/masters\/generic\/sizesets\`;/, sizesetBlock.trim());

const sizegroupBlock = `
    } else if (masterType === 'sizegroup') {
      let sizesArray: any[] = (extra1 || '').split(',').map(s => s.trim()).filter(Boolean);
      if (sizesArray.length === 0 && name.includes('-')) {
        const fetched = await fetchMatchedSizes(name, sizeScale);
        if (fetched) {
           sizesArray = fetched;
        } else {
          const parts = name.split('-');
          if (parts.length === 2) {
            const start = parseInt(parts[0], 10);
            const end = parseInt(parts[1], 10);
            if (!isNaN(start) && !isNaN(end) && start < end) {
              let step = 1;
              if (sizeScale === 'CM') {
                step = (end - start) % 5 === 0 ? 5 : ((end - start) % 2 === 0 ? 2 : 1);
              } else {
                step = (end - start) % 2 === 0 ? 2 : 1;
              }
              for (let i = start; i <= end; i += step) {
                sizesArray.push(i.toString());
              }
            }
          }
        }
      }
      data = { groupName: name, size_scale: sizeScale, sizes: sizesArray };
      endpoint = \`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/size-groups\`;
`;
content = content.replace(/} else if \(masterType === 'sizegroup'\) \{[\s\S]*?endpoint = \`\$\{import\.meta\.env\.VITE_API_URL \|\| 'http:\/\/localhost:5000'\}\/api\/masters\/size-groups\`;/, sizegroupBlock.trim());

fs.writeFileSync(file, content);
console.log('Patched MasterCreationModal.tsx');
