const fs = require('fs');

const files = [
  './src/pages/masters/accounting/PartyMaster.tsx',
  './src/components/inventory/PartyModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // 1. Add brandType state
  // Check if it's already there
  if (!content.includes('const [brandType, setBrandType]')) {
    const isModal = file.includes('PartyModal');
    // For modal, it sets form data directly in some cases or has its own state.
    // Wait, PartyMaster and PartyModal have state `categories`, `brands`, etc.
    const hookInjection = "  const [brands, setBrands] = useState<{name: string}[]>([]);\n  const [brandType, setBrandType] = useState<'Single' | 'Multi'>('Multi');";
    content = content.replace(/  const \[brands, setBrands\] = useState<\{name: string\}\[\]>\(\[\]\);/, hookInjection);
  }

  // 2. Add Brand Type Dropdown in UI
  // Find <SectionTitle>Assigned Brands</SectionTitle> and add the dropdown right before it
  const brandSectionInjection = `<div className="flex items-center gap-2 mb-2">
                          <label className="text-[12px] font-bold text-slate-700">Brand Type:</label>
                          <select 
                            className="bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none"
                            value={brandType}
                            onChange={(e) => setBrandType(e.target.value as 'Single' | 'Multi')}
                          >
                            <option value="Multi">Multi Brand Party</option>
                            <option value="Single">Single Brand Party</option>
                          </select>
                        </div>
                        <SectionTitle>Assigned Brands</SectionTitle>`;
  
  if (!content.includes('Brand Type:')) {
    content = content.replace(/<SectionTitle>Assigned Brands<\/SectionTitle>/, brandSectionInjection);
  }

  // 3. Update the payload in save function
  // We need to pass brandType to the backend
  if (file.includes('PartyMaster.tsx')) {
    // `const payload = { ... }` inside handleSave
    content = content.replace(
      /brands: brands\.length > 0 \? brands : null,?\n\s*\};/,
      `brands: brands.length > 0 ? brands : null,\n      brandType\n    };`
    );
    // Fetch logic on edit
    content = content.replace(
      /setBrands\(partyToEdit\.brands \|\| \[\]\);/,
      `setBrands(partyToEdit.brands || []);\n      setBrandType(partyToEdit.brand_type || 'Multi');`
    );
    // Fetch logic on reset
    content = content.replace(
      /setBrands\(\[\]\);/,
      `setBrands([]);\n    setBrandType('Multi');`
    );
  } else if (file.includes('PartyModal.tsx')) {
    content = content.replace(
      /brands: brands\.length > 0 \? brands : null,?\n\s*\};/,
      `brands: brands.length > 0 ? brands : null,\n      brandType\n    };`
    );
    content = content.replace(
      /setBrands\(\[\]\);/,
      `setBrands([]);\n    setBrandType('Multi');`
    );
  }

  fs.writeFileSync(file, content);
  console.log('Patched ' + file);
});
