const fs = require('fs');

const files = [
  './src/pages/masters/accounting/PartyMaster.tsx',
  './src/components/inventory/PartyModal.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  // 1. Update masterModal type
  content = content.replace(
    /const \[masterModal, setMasterModal\] = useState<\{type: 'brand', initialValue: string\} \| null>\(null\);/,
    `const [masterModal, setMasterModal] = useState<{type: 'brand' | 'partycategory' | 'partysubcategory', initialValue: string, parentId?: number} | null>(null);`
  );

  // 2. Add the new state variables
  const oldState = `  const [categories, setCategories] = useState<{cat: string, sub: string}[]>([]);
  const [tempCat, setTempCat] = useState('');
  const [tempSub, setTempSub] = useState('');`;

  const newState = `  const [categories, setCategories] = useState<{cat: string, sub: string}[]>([]);
  const [tempCat, setTempCat] = useState('');
  const [tempSub, setTempSub] = useState('');
  
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([]);
  const [showCatSuggestions, setShowCatSuggestions] = useState(false);
  const [focusedCatIndex, setFocusedCatIndex] = useState(-1);
  const [showSubSuggestions, setShowSubSuggestions] = useState(false);
  const [focusedSubIndex, setFocusedSubIndex] = useState(-1);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);

  useEffect(() => {
    fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/partycategories\`, {
      headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` }
    })
    .then(res => res.json())
    .then(data => setAvailableCategories(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, [masterModal]);

  useEffect(() => {
    if (!selectedCatId) {
      setAvailableSubcategories([]);
      return;
    }
    fetch(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/masters/generic/partysubcategories?categoryId=\${selectedCatId}\`, {
      headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` }
    })
    .then(res => res.json())
    .then(data => setAvailableSubcategories(Array.isArray(data) ? data : []))
    .catch(console.error);
  }, [selectedCatId, masterModal]);

  const handleAddCategory = () => {
    if (tempCat || tempSub) {
      setCategories([...categories, { cat: tempCat, sub: tempSub }]);
      setTempCat('');
      setTempSub('');
      setSelectedCatId(null);
      setShowCatSuggestions(false);
      setShowSubSuggestions(false);
    }
  };`;

  content = content.replace(oldState, newState);

  // 3. Update the JSX section
  const oldJSX = `<SectionTitle>Categorization</SectionTitle>
            <div className="flex items-center gap-1 mb-1">
              <input 
                className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                placeholder="Category" 
                value={tempCat} 
                onChange={(e) => setTempCat(e.target.value)} 
              />
              <input 
                className="flex-1 bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                placeholder="Subcategory" 
                value={tempSub} 
                onChange={(e) => setTempSub(e.target.value)} 
              />
              <button 
                className="bg-slate-200 text-black border border-slate-400 px-3 py-[2px] text-[11px] font-bold hover:bg-slate-300" 
                onClick={() => {
                  if (tempCat || tempSub) {
                    setCategories([...categories, { cat: tempCat, sub: tempSub }]);
                    setTempCat('');
                    setTempSub('');
                  }
                }}
              >
                Add
              </button>
            </div>`;

  const newJSX = `<SectionTitle>Categorization</SectionTitle>
            <div className="flex items-center gap-1 mb-1">
              {/* Category Input */}
              <div className="relative flex-1">
                <input 
                  className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800" 
                  placeholder="Category (Alt+C to create)" 
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
                      setMasterModal({ type: 'partycategory', initialValue: tempCat });
                    }
                    const filtered = availableCategories.filter(c => c.name.toLowerCase().includes(tempCat.toLowerCase()));
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setFocusedCatIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setFocusedCatIndex(prev => (prev > 0 ? prev - 1 : -1));
                    } else if (e.key === 'Enter' && focusedCatIndex >= 0) {
                      e.preventDefault();
                      setTempCat(filtered[focusedCatIndex].name);
                      setSelectedCatId(filtered[focusedCatIndex].id);
                      setShowCatSuggestions(false);
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
                    {availableCategories.filter(c => c.name.toLowerCase().includes(tempCat.toLowerCase())).length === 0 && (
                      <div className="px-2 py-1 text-[11px] text-slate-500 italic">Press Alt+C to create</div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Subcategory Input */}
              <div className="relative flex-1">
                <input 
                  className="w-full bg-white border border-slate-400 px-1 py-[2px] text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800 disabled:opacity-50" 
                  placeholder={selectedCatId ? "Subcat (Alt+C to create)" : "Select Category first"}
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
                      setMasterModal({ type: 'partysubcategory', initialValue: tempSub, parentId: selectedCatId });
                    }
                    const filtered = availableSubcategories.filter(s => s.name.toLowerCase().includes(tempSub.toLowerCase()));
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setFocusedSubIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setFocusedSubIndex(prev => (prev > 0 ? prev - 1 : -1));
                    } else if (e.key === 'Enter' && focusedSubIndex >= 0) {
                      e.preventDefault();
                      setTempSub(filtered[focusedSubIndex].name);
                      setShowSubSuggestions(false);
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
                    {availableSubcategories.filter(s => s.name.toLowerCase().includes(tempSub.toLowerCase())).length === 0 && tempCat && (
                      <div className="px-2 py-1 text-[11px] text-slate-500 italic">Press Alt+C to create</div>
                    )}
                  </div>
                )}
              </div>

              <button 
                className="bg-slate-200 text-black border border-slate-400 px-3 py-[2px] text-[11px] font-bold hover:bg-slate-300" 
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>`;

  content = content.replace(oldJSX, newJSX);

  // 4. Update the MasterCreationModal rendering block at the bottom
  const oldModal = `<MasterCreationModal 
          isOpen={true}
          masterType={masterModal.type}
          initialValue={masterModal.initialValue}
          onClose={() => {
            setMasterModal(null);
            setTimeout(() => document.getElementById('input-gstin')?.focus(), 100);
          }}
          onSave={(type, data) => {
            if (type === 'brand') {
              addBrand(data.name);
            }
            setMasterModal(null);
            setTimeout(() => document.getElementById('input-gstin')?.focus(), 100);
          }}
        />`;

  const newModal = `<MasterCreationModal 
          isOpen={true}
          masterType={masterModal.type as any}
          initialValue={masterModal.initialValue}
          parentId={masterModal.parentId}
          onClose={() => {
            setMasterModal(null);
            setTimeout(() => document.getElementById('input-gstin')?.focus(), 100);
          }}
          onSave={(type, data) => {
            if (type === 'brand') {
              addBrand(data.name);
            } else if (type === 'partycategory') {
              setTempCat(data.name);
              setSelectedCatId(data.id);
            } else if (type === 'partysubcategory') {
              setTempSub(data.name);
            }
            setMasterModal(null);
            setTimeout(() => document.getElementById('input-gstin')?.focus(), 100);
          }}
        />`;

  content = content.replace(oldModal, newModal);

  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});
