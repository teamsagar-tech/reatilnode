const fs = require('fs');

const replacementCat = `<SectionTitle>Categorization & Brands</SectionTitle>
                        
                        <div className="flex items-center gap-1 mb-1">
                          {/* Category Input */}
                          <div className="relative flex-1">
                            <input 
                              className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                              placeholder="Category (Alt+C)" 
                              value={tempCat} 
                              onChange={(e) => {
                                setTempCat(e.target.value);
                                setShowCatSuggestions(true);
                                setFocusedCatIndex(-1);
                                if (e.target.value === '') setSelectedCatId(null);
                              }}
                              onFocus={() => setShowCatSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowCatSuggestions(false), 200)}
                              onKeyDown={(e) => {
                                if (e.altKey && e.key.toLowerCase() === 'c') {
                                  e.preventDefault();
                                  setMasterModal({ type: 'partycategory', initialValue: tempCat.trim() });
                                }
                                const filtered = availableCategories.filter(c => c.name.toLowerCase().includes(tempCat.toLowerCase()));
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setFocusedCatIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setFocusedCatIndex(prev => (prev > 0 ? prev - 1 : -1));
                                } else if (e.key === 'Enter') {
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
                                }
                              }}
                            />
                            {showCatSuggestions && (
                              <div className="absolute z-10 w-full bg-white border border-slate-400 shadow-lg max-h-[150px] overflow-y-auto">
                                {availableCategories.filter(c => c.name.toLowerCase().includes(tempCat.toLowerCase())).map((c, idx) => (
                                  <div 
                                    key={c.id} 
                                    className={\`px-2 py-1 text-[12px] cursor-pointer \${idx === focusedCatIndex ? 'bg-blue-500 text-white' : 'hover:bg-slate-100'}\`}
                                    onClick={() => {
                                      setTempCat(c.name);
                                      setSelectedCatId(c.id);
                                      setShowCatSuggestions(false);
                                    }}
                                  >
                                    {c.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Subcategory Input */}
                          <div className="relative flex-1">
                            <input 
                              className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 disabled:opacity-50" 
                              placeholder={selectedCatId ? "Subcat (Alt+C)" : "Select Category"}
                              value={tempSub} 
                              disabled={!selectedCatId}
                              onChange={(e) => {
                                setTempSub(e.target.value);
                                setShowSubSuggestions(true);
                                setFocusedSubIndex(-1);
                              }}
                              onFocus={() => setShowSubSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowSubSuggestions(false), 200)}
                              onKeyDown={(e) => {
                                if (e.altKey && e.key.toLowerCase() === 'c' && selectedCatId) {
                                  e.preventDefault();
                                  setMasterModal({ type: 'partysubcategory', initialValue: tempSub.trim(), parentId: selectedCatId });
                                }
                                const filtered = availableSubcategories.filter(s => s.name.toLowerCase().includes(tempSub.toLowerCase()));
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setFocusedSubIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setFocusedSubIndex(prev => (prev > 0 ? prev - 1 : -1));
                                } else if (e.key === 'Enter') {
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
                                }
                              }}
                            />
                            {showSubSuggestions && selectedCatId && (
                              <div className="absolute z-10 w-full bg-white border border-slate-400 shadow-lg max-h-[150px] overflow-y-auto">
                                {availableSubcategories.filter(s => s.name.toLowerCase().includes(tempSub.toLowerCase())).map((s, idx) => (
                                  <div 
                                    key={s.id} 
                                    className={\`px-2 py-1 text-[12px] cursor-pointer \${idx === focusedSubIndex ? 'bg-blue-500 text-white' : 'hover:bg-slate-100'}\`}
                                    onClick={() => {
                                      setTempSub(s.name);
                                      setShowSubSuggestions(false);
                                    }}
                                  >
                                    {s.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <button 
                            type="button"
                            onClick={handleAddCategory}
                            className="bg-[#eef5ed] border border-[#a3c3be] px-2 py-[2px] font-bold text-black hover:bg-[#ffe000] text-[11px] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
                          >
                            Add
                          </button>
                        </div>`;

const replacementBrand = `<SectionTitle>Assigned Brands</SectionTitle>
                        <div className="flex items-center gap-1 mb-1">
                          <div className="relative flex-1">
                            <input 
                              className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                              placeholder="Type brand name or Alt+C to create" 
                              value={tempBrand} 
                              onChange={(e) => {
                                setTempBrand(e.target.value);
                                setShowBrandSuggestions(true);
                                setFocusedBrandIndex(-1);
                              }}
                              onFocus={() => setShowBrandSuggestions(true)}
                              onBlur={() => setTimeout(() => setShowBrandSuggestions(false), 200)}
                              onKeyDown={(e) => {
                                if (e.altKey && e.key.toLowerCase() === 'c') {
                                  e.preventDefault();
                                  setMasterModal({ type: 'brand', initialValue: tempBrand.trim() });
                                }
                                const filtered = availableBrands.filter(b => b.name.toLowerCase().includes(tempBrand.toLowerCase()));
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  setFocusedBrandIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  setFocusedBrandIndex(prev => (prev > 0 ? prev - 1 : -1));
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (focusedBrandIndex >= 0 && filtered[focusedBrandIndex]) {
                                    handleAddBrand(filtered[focusedBrandIndex].name);
                                  } else {
                                    handleAddBrand(tempBrand);
                                  }
                                }
                              }}
                            />
                            {showBrandSuggestions && (
                              <div className="absolute z-10 w-full bg-white border border-slate-400 shadow-lg max-h-[150px] overflow-y-auto">
                                {availableBrands.filter(b => b.name.toLowerCase().includes(tempBrand.toLowerCase())).map((b, idx) => (
                                  <div 
                                    key={b.id} 
                                    className={\`px-2 py-1 text-[12px] cursor-pointer \${idx === focusedBrandIndex ? 'bg-blue-500 text-white' : 'hover:bg-slate-100'}\`}
                                    onClick={() => handleAddBrand(b.name)}
                                  >
                                    {b.name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <button 
                            type="button"
                            onClick={() => handleAddBrand(tempBrand)}
                            className="bg-[#eef5ed] border border-[#a3c3be] px-2 py-[2px] font-bold text-black hover:bg-[#ffe000] text-[11px] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8)]"
                          >
                            Add
                          </button>
                        </div>`;


const files = [
  './src/pages/masters/accounting/PartyMaster.tsx',
  './src/components/inventory/PartyModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // Replace Category Block
  const oldCatRegex = /<SectionTitle>Categorization & Brands<\/SectionTitle>[\s\S]*?<button \n\s*type="button"\n\s*onClick=\{addCategory\}[\s\S]*?Add\n\s*<\/button>\n\s*<\/div>/g;
  
  if (content.match(oldCatRegex)) {
    content = content.replace(oldCatRegex, replacementCat);
  } else {
    console.log("Could not find Categorization & Brands in " + file);
  }

  // Replace Brand Block
  const oldBrandRegex = /<SectionTitle>Assigned Brands<\/SectionTitle>[\s\S]*?<button \n\s*type="button"\n\s*onClick=\{\(\) => addBrand\(tempBrand\)\}[\s\S]*?Add\n\s*<\/button>\n\s*<\/div>/g;
  
  if (content.match(oldBrandRegex)) {
    content = content.replace(oldBrandRegex, replacementBrand);
  } else {
    console.log("Could not find Assigned Brands in " + file);
  }

  fs.writeFileSync(file, content);
  console.log('Fixed JSX in ' + file);
});
