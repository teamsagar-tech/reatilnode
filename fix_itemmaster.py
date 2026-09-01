import os

filepath = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters/inventory/ItemMaster.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Add categories state and fetch logic
content = content.replace(
    'const [brands, setBrands] = useState<any[]>([]);',
    'const [brands, setBrands] = useState<any[]>([]);\n  const [categories, setCategories] = useState<any[]>([]);'
)

content = content.replace(
    """  const fetchBrands = () => {
    fetch('https://api.retailnode.in/api/masters/generic/brands', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setBrands(Array.isArray(data) ? data : []))
    .catch(console.error);
  };""",
    """  const fetchBrands = () => {
    fetch('https://api.retailnode.in/api/masters/generic/brands', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setBrands(Array.isArray(data) ? data : []))
    .catch(console.error);
  };
  
  const fetchCategories = () => {
    fetch('https://api.retailnode.in/api/masters/category', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(res => res.json())
    .then(data => setCategories(Array.isArray(data) ? data : []))
    .catch(console.error);
  };"""
)

# Add to useEffect
content = content.replace(
    'fetchBrands();\n    fetchItems();',
    'fetchBrands();\n    fetchCategories();\n    fetchItems();'
)

# Add category UI states
content = content.replace(
    'const [showBrandDropdown, setShowBrandDropdown] = useState(false);',
    'const [showBrandDropdown, setShowBrandDropdown] = useState(false);\n  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);\n  const [categorySuggestionIndex, setCategorySuggestionIndex] = useState(0);'
)

# Add categoryName to selected row
content = content.replace(
    'brandName: brands.find(b => b.id === row.brand_id)?.name || '',',
    "brandName: brands.find(b => b.id === row.brand_id)?.name || '',\n                              categoryName: categories.find(c => c.id === row.category_id)?.name || '',"
)

# Add category keydown handler
content = content.replace(
    """  const handleBrandKeyDown = (e: React.KeyboardEvent) => {""",
    """  const handleCategoryKeyDown = (e: React.KeyboardEvent) => {
    const val = formData.categoryName || '';
    const filtered = categories.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 8);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCategorySuggestionIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCategorySuggestionIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (showCategoryDropdown && filtered.length > 0) {
        e.preventDefault();
        const selected = filtered[categorySuggestionIndex];
        setFormData({ 
          ...formData, 
          categoryName: selected.name,
          hsnsacCode: selected.hsn_code || formData.hsnsacCode,
          gstPercent: selected.tax_percent || formData.gstPercent
        });
        setShowCategoryDropdown(false);
        document.getElementById('input-brandName')?.focus();
        return;
      }
      e.preventDefault();
      setShowCategoryDropdown(false);
      document.getElementById('input-brandName')?.focus();
    }
  };

  const handleBrandKeyDown = (e: React.KeyboardEvent) => {"""
)

# Add save item payload
content = content.replace(
    """    const foundBrand = brands.find(b => b.name === formData.brandName);
    let finalBrandId = foundBrand?.id || null;""",
    """    const foundBrand = brands.find(b => b.name === formData.brandName);
    let finalBrandId = foundBrand?.id || null;
    
    const foundCategory = categories.find(c => c.name === formData.categoryName);
    let finalCategoryId = foundCategory?.id || null;"""
)

content = content.replace(
    'brand_id: finalBrandId,',
    'brand_id: finalBrandId,\n          category_id: finalCategoryId,'
)

# Inject InputRow into UI
content = content.replace(
    """                    <InputRow id="input-marathiName" label="Marathi Name" value={formData.marathiName} onChange={(v: string) => setFormData({...formData, marathiName: v})} onKeyDown={(e: any) => handleFieldKeyDown(e, 'input-brandName')} />
                    <InputRow id="input-brandName" label="Brand Name" value={formData.brandName} """,
    """                    <InputRow id="input-marathiName" label="Marathi Name" value={formData.marathiName} onChange={(v: string) => setFormData({...formData, marathiName: v})} onKeyDown={(e: any) => handleFieldKeyDown(e, 'input-categoryName')} />
                    
                    <InputRow id="input-categoryName" label="Category" value={formData.categoryName} 
                      onChange={(v: string) => { setFormData({...formData, categoryName: v}); setCategorySuggestionIndex(0); setShowCategoryDropdown(true); }} 
                      onFocus={() => setShowCategoryDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                      onKeyDown={handleCategoryKeyDown}>
                      {showCategoryDropdown && categories.filter(c => c.name.toLowerCase().includes((formData.categoryName || '').toLowerCase())).length > 0 && (
                        <div className="absolute top-full left-[110px] right-[4px] mt-0 bg-white border-2 border-black z-50 shadow-md max-h-[150px] overflow-y-auto">
                          {categories.filter(c => c.name.toLowerCase().includes((formData.categoryName || '').toLowerCase())).slice(0, 8).map((suggestion, sIdx) => (
                            <div key={suggestion.id} className={`px-2 py-1 flex flex-col cursor-pointer ${sIdx === categorySuggestionIndex ? 'bg-[#ffe000] text-black font-bold' : 'hover:bg-slate-200'}`} 
                              onClick={() => {
                                setFormData({ 
                                  ...formData, 
                                  categoryName: suggestion.name,
                                  hsnsacCode: suggestion.hsn_code || formData.hsnsacCode,
                                  gstPercent: suggestion.tax_percent || formData.gstPercent 
                                });
                                setShowCategoryDropdown(false);
                                document.getElementById('input-brandName')?.focus();
                              }}>
                              <span>{suggestion.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </InputRow>

                    <InputRow id="input-brandName" label="Brand Name" value={formData.brandName} """
)

with open(filepath, 'w') as f:
    f.write(content)

print("Updated ItemMaster.tsx")
