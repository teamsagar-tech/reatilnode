const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/MasterCreationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the Sizes (Optional) input with a dynamic Checkbox grid if availableScaleSizes exist
const sizesInputRegex = /<InputRow label="Sizes \(Optional, Comma separated\)" value=\{extra1\} onChange=\{setExtra1\} placeholder="e.g. 28, 30, 32" \/>/g;
const checkboxGrid = `
              {availableScaleSizes.length > 0 ? (
                <div className="mt-3 border border-slate-300 p-2 bg-slate-50 max-h-[150px] overflow-y-auto">
                  <div className="text-[10px] font-bold text-slate-600 mb-2">AVAILABLE SIZES IN {sizeScale.toUpperCase()}</div>
                  <div className="flex flex-wrap gap-2">
                    {availableScaleSizes.map(s => (
                      <label key={s.name} className="flex items-center gap-1 text-[11px] font-bold cursor-pointer bg-white px-2 py-1 border border-slate-200 hover:border-slate-400">
                        <input 
                          type="checkbox" 
                          checked={selectedSizes.includes(s.name)}
                          onChange={() => handleCheckboxToggle(s.name)}
                          className="accent-[#1b5e58]"
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <InputRow label="Sizes (Optional, Comma separated)" value={extra1} onChange={setExtra1} placeholder="e.g. 28, 30, 32" />
              )}
`;
content = content.replace(sizesInputRegex, checkboxGrid.trim());

// We need to make sure selectedSizes syncs with extra1 so the existing handleSave logic works!
const useEffectExtra1 = `
  useEffect(() => {
    if (selectedSizes.length > 0) {
      setExtra1(selectedSizes.join(', '));
    } else {
      setExtra1('');
    }
  }, [selectedSizes]);
`;
// Let's add useEffectExtra1 to the useEffectsToAdd
content = content.replace(/const handleCheckboxToggle = [^\}]+\};\s*\n/m, (match) => match + useEffectExtra1);

fs.writeFileSync(file, content);
console.log('Patched UI');
