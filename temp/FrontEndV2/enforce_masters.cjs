const fs = require('fs');

const files = [
  './src/pages/masters/accounting/PartyMaster.tsx',
  './src/components/inventory/PartyModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Replace handleAddCategory
  const oldHandleAddCategory = /  const handleAddCategory = \(\) => \{[\s\S]*?setShowSubSuggestions\(false\);\n    \}\n  \};\n/g;
  const newHandleAddCategory = `  const handleAddCategory = () => {
    if (!tempCat.trim()) return;

    const catMatch = availableCategories.find(c => c.name.toLowerCase() === tempCat.trim().toLowerCase());
    if (!catMatch) {
      setMasterModal({ type: 'partycategory', initialValue: tempCat.trim() });
      return;
    }

    if (tempSub.trim()) {
      const subMatch = availableSubcategories.find(s => s.name.toLowerCase() === tempSub.trim().toLowerCase());
      if (!subMatch) {
        setMasterModal({ type: 'partysubcategory', initialValue: tempSub.trim(), parentId: catMatch.id });
        return;
      }
    }

    setCategories([...categories, { cat: catMatch.name, sub: tempSub.trim() }]);
    setTempCat('');
    setTempSub('');
    setSelectedCatId(null);
    setShowCatSuggestions(false);
    setShowSubSuggestions(false);
  };\n`;
  content = content.replace(oldHandleAddCategory, newHandleAddCategory);

  // Remove old addCategory if it exists
  const oldAddCategory = /  const addCategory = \(\) => \{[\s\S]*?setTempSub\(''\);\n    \}\n  \};\n/g;
  content = content.replace(oldAddCategory, '');

  // Replace addBrand with handleAddBrand
  const oldAddBrandDef = /  const addBrand = \(name: string\) => \{[\s\S]*?setFocusedBrandIndex\(-1\);\n  \};\n/g;
  const newAddBrandDef = `  const handleAddBrand = (nameToSearch?: string) => {
    const val = (nameToSearch || tempBrand).trim();
    if (!val) return;
    
    const brandMatch = availableBrands.find(b => b.name.toLowerCase() === val.toLowerCase());
    if (!brandMatch) {
      setMasterModal({ type: 'brand', initialValue: val });
      return;
    }

    if (!brands.some(b => b.name.toLowerCase() === brandMatch.name.toLowerCase())) {
      setBrands([...brands, { name: brandMatch.name }]);
    }
    setTempBrand('');
    setShowBrandSuggestions(false);
    setFocusedBrandIndex(-1);
  };\n`;
  content = content.replace(oldAddBrandDef, newAddBrandDef);

  // Replace Category onKeyDown
  content = content.replace(
    /\} else if \(e\.key === 'Enter' && focusedCatIndex >= 0\) \{\n[\s\S]*?setShowCatSuggestions\(false\);\n\s*\}/g,
    `} else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (focusedCatIndex >= 0 && filtered[focusedCatIndex]) {
                        setTempCat(filtered[focusedCatIndex].name);
                        setSelectedCatId(filtered[focusedCatIndex].id);
                        setShowCatSuggestions(false);
                      } else {
                        const exactMatch = availableCategories.find(c => c.name.toLowerCase() === tempCat.trim().toLowerCase());
                        if (exactMatch) {
                          setTempCat(exactMatch.name);
                          setSelectedCatId(exactMatch.id);
                          setShowCatSuggestions(false);
                        } else if (tempCat.trim()) {
                          setMasterModal({ type: 'partycategory', initialValue: tempCat.trim() });
                        }
                      }
                    }`
  );

  // Replace Subcategory onKeyDown
  content = content.replace(
    /\} else if \(e\.key === 'Enter' && focusedSubIndex >= 0\) \{\n[\s\S]*?setShowSubSuggestions\(false\);\n\s*\}/g,
    `} else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (focusedSubIndex >= 0 && filtered[focusedSubIndex]) {
                        setTempSub(filtered[focusedSubIndex].name);
                        setShowSubSuggestions(false);
                      } else {
                        const exactMatch = availableSubcategories.find(s => s.name.toLowerCase() === tempSub.trim().toLowerCase());
                        if (exactMatch) {
                          setTempSub(exactMatch.name);
                          setShowSubSuggestions(false);
                        } else if (tempSub.trim() && selectedCatId) {
                          setMasterModal({ type: 'partysubcategory', initialValue: tempSub.trim(), parentId: selectedCatId });
                        }
                      }
                    }`
  );

  // Replace Brand onKeyDown
  content = content.replace(
    /\} else if \(e\.key === 'Enter' && focusedBrandIndex >= 0\) \{\n\s*e\.preventDefault\(\);\n\s*addBrand\(filtered\[focusedBrandIndex\]\.name\);\n\s*\}/g,
    `} else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (focusedBrandIndex >= 0 && filtered[focusedBrandIndex]) {
                      handleAddBrand(filtered[focusedBrandIndex].name);
                    } else {
                      handleAddBrand(tempBrand);
                    }
                  }`
  );

  // Replace <button onClick={() => addBrand(tempBrand)}> with onClick={() => handleAddBrand()}
  content = content.replace(
    /onClick=\{\(\) => addBrand\(tempBrand\)\}/g,
    `onClick={() => handleAddBrand()}`
  );

  // Replace onSave callback usage from addBrand(data.name) to setBrands([...brands, { name: data.name }])
  // Because when returning from MasterModal, we just inject it directly since it was just created.
  content = content.replace(
    /addBrand\(data\.name\);/g,
    `setBrands([...brands, { name: data.name }]);`
  );

  fs.writeFileSync(file, content);
  console.log('Enforced strict matching in ' + file);
});
