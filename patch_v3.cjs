const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Full width modal
content = content.replace(/max-w-5xl/, 'w-[95vw] max-w-[1400px]');

// 2. Remove min-widths
content = content.replace(/w-\[120px\]/g, 'px-2');
content = content.replace(/min-w-\[80px\]/g, 'px-1');
content = content.replace(/min-w-\[100px\]/g, 'px-2');
content = content.replace(/min-w-max/g, '');

// 3. Remove auto-generate useEffect that destroys Qty
const autoGenEffectRegex = /useEffect\(\(\) => {\s*if \(selectedGroupId && sizeGroups\.length > 0\) {[\s\S]*?generateGrid[\s\S]*?}\s*}, \[baseRate, rateStep, baseMrp, mrpStep, selectedGroupId\]\);\s*/m;
content = content.replace(autoGenEffectRegex, '');

// 4. Remove handleGenerateGrid function completely
const hggRegex = /const handleGenerateGrid = \(\) => {[\s\S]*?};\n/m;
content = content.replace(hggRegex, '');

// 5. Remove Top Inputs and Button, leave only SearchableDropdown wrapper
// The structure is:
// <div className="w-[100px]"> ... Base Rate ... </div>
// <div className="w-[100px]"> ... Step ... </div>
// <div className="w-[100px]"> ... Base MRP ... </div>
// <div className="w-[100px]"> ... Step ... </div>
// <button onClick={handleGenerateGrid} ...> Generate Grid </button>
const topInputsRegex = /<div className="w-\[100px\]">[\s\S]*?Base Rate[\s\S]*?<\/div>\s*<div className="w-\[100px\]">[\s\S]*?Step \(\+₹\)[\s\S]*?<\/div>\s*<div className="w-\[100px\]">[\s\S]*?Base MRP[\s\S]*?<\/div>\s*<div className="w-\[100px\]">[\s\S]*?Step \(\+₹\)[\s\S]*?<\/div>\s*<button[\s\S]*?<\/button>/m;
content = content.replace(topInputsRegex, '');

// 6. Update SearchableDropdown onSelect to generateGrid
const onSelectRegex = /onSelect={\(opt\) => {\s*setSearchText\(opt\.name\);\s*setSelectedGroupId\(opt\.id\);\s*}}/m;
content = content.replace(onSelectRegex, `onSelect={(opt) => {
                    setSearchText(opt.name);
                    setSelectedGroupId(opt.id);
                    setTimeout(() => generateGrid(opt, baseRate, rateStep, baseMrp, mrpStep, 'first-qty'), 0);
                  }}`);

// 7. Add step/base handlers (replacing the empty onChange handlers or just creating new ones)
// We need to find where handleRateChange is defined and inject these above it.
const handlersRegex = /const handleRateChange = \(index: number, value: string\) => {/;
const newHandlers = `
  const handleBaseRateChange = (value: string) => {
    setBaseRate(value);
    const stepVal = parseFloat(rateStep) || 0;
    const currentBase = parseFloat(value) || 0;
    if (value === '') return;
    setMatrixData(prev => {
      const newData = [...prev];
      for (let i = 0; i < newData.length; i++) {
         newData[i].rate = (currentBase + (stepVal * i)).toFixed(2);
      }
      return newData;
    });
  };

  const handleBaseMrpChange = (value: string) => {
    setBaseMrp(value);
    const stepVal = parseFloat(mrpStep) || 0;
    const currentBase = parseFloat(value) || 0;
    if (value === '') return;
    setMatrixData(prev => {
      const newData = [...prev];
      for (let i = 0; i < newData.length; i++) {
         newData[i].mrp = (currentBase + (stepVal * i)).toString();
      }
      return newData;
    });
  };

  const handleRateStepChange = (value: string) => {
    setRateStep(value);
    const stepVal = parseFloat(value) || 0;
    const currentBase = parseFloat(baseRate) || 0;
    if (baseRate === '') return;
    setMatrixData(prev => {
      const newData = [...prev];
      for (let i = 0; i < newData.length; i++) {
         newData[i].rate = (currentBase + (stepVal * i)).toFixed(2);
      }
      return newData;
    });
  };

  const handleMrpStepChange = (value: string) => {
    setMrpStep(value);
    const stepVal = parseFloat(value) || 0;
    const currentBase = parseFloat(baseMrp) || 0;
    if (baseMrp === '') return;
    setMatrixData(prev => {
      const newData = [...prev];
      for (let i = 0; i < newData.length; i++) {
         newData[i].mrp = (currentBase + (stepVal * i)).toString();
      }
      return newData;
    });
  };

const handleRateChange = (index: number, value: string) => {`;
content = content.replace(handlersRegex, newHandlers);

// 8. Replace Pur. Rate Row Header
const purHeaderRegex = /<td className="[^"]*?">[\s\S]*?Pur\. Rate[\s\S]*?<\/td>/;
const newPurHeader = `<td className="bg-white border-b border-r border-slate-200 p-1 px-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-bold text-slate-600">Pur. Rate</span>
                        <div className="flex items-center gap-1 w-full justify-between">
                          <input autoComplete="off" placeholder="Base" type="number" className="w-[45px] bg-indigo-50 border border-indigo-200 px-1 py-0.5 rounded text-[10px] text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" value={baseRate} onChange={e => handleBaseRateChange(e.target.value)} />
                          <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                            <span className="text-[9px] text-emerald-700 uppercase font-bold">+</span>
                            <input autoComplete="off" placeholder="Step" type="number" className="w-[30px] bg-transparent text-[10px] text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" value={rateStep} onChange={e => handleRateStepChange(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </td>`;
content = content.replace(purHeaderRegex, newPurHeader);

// 9. Replace MRP Row Header
const mrpHeaderRegex = /<td className="[^"]*?">[\s\S]*?MRP[\s\S]*?<\/td>/;
const newMrpHeader = `<td className="bg-white border-b border-r border-slate-200 p-1 px-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-bold text-slate-600">MRP</span>
                        <div className="flex items-center gap-1 w-full justify-between">
                          <input autoComplete="off" placeholder="Base" type="number" className="w-[45px] bg-indigo-50 border border-indigo-200 px-1 py-0.5 rounded text-[10px] text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" value={baseMrp} onChange={e => handleBaseMrpChange(e.target.value)} />
                          <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                            <span className="text-[9px] text-emerald-700 uppercase font-bold">+</span>
                            <input autoComplete="off" placeholder="Step" type="number" className="w-[30px] bg-transparent text-[10px] text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" value={mrpStep} onChange={e => handleMrpStepChange(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </td>`;
content = content.replace(mrpHeaderRegex, newMrpHeader);

// 10. Remove Amount Row
const amountRowRegex = /{\/\* Amount Row \(Calculated\) \*\/}[\s\S]*?<\/tr>/;
content = content.replace(amountRowRegex, '');

// 11. InitialMatrixData logic
// The file is currently clean, so it doesn't have initialMatrixData props. Let's add them back!
content = content.replace(/expectedTotalQty\?: number \| null;\n}/, 'expectedTotalQty?: number | null;\n  initialMatrixData?: any[];\n}');
content = content.replace(/expectedTotalQty }: SizeAllocationModalProps/, 'expectedTotalQty, initialMatrixData }: SizeAllocationModalProps');
content = content.replace(/setMatrixData\(\[\]\);/g, 'if (initialMatrixData && initialMatrixData.length > 0) { setMatrixData(initialMatrixData); } else { setMatrixData([]); }');

// Update fetchSizeGroups initialMatrixData load
const fetchTimeoutRegex = /setTimeout\(\(\) => {\s*generateGrid\(match, '', '0', '', '0', 'base-rate'\);\s*}, 0\);/m;
content = content.replace(fetchTimeoutRegex, `setTimeout(() => {
              if (initialMatrixData && initialMatrixData.length > 0) {
                 // already set by isOpen useEffect
              } else {
                 generateGrid(match, '', '', '', '', 'first-qty');
              }
            }, 0);`);

// 12. Fix '0' initial states
content = content.replace(/useState\('0'\)/g, "useState('')");
content = content.replace(/setRateStep\('0'\)/g, "setRateStep('')");
content = content.replace(/setMrpStep\('0'\)/g, "setMrpStep('')");

fs.writeFileSync(file, content);
console.log("Patched pristine file successfully");
