const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Remove baseRate, baseMrp state
content = content.replace(/const \[baseRate, setBaseRate\] = useState\(''\);\n/g, '');
content = content.replace(/const \[baseMrp, setBaseMrp\] = useState\(''\);\n/g, '');

// 2. Change width
content = content.replace(/max-w-5xl/g, 'w-[95vw] max-w-[1400px]');

// 3. Remove Top Inputs & Button
const topBarRegex = /<div className="w-\[100px\]">\s*<label.*?Base Rate.*?<\/div>\s*<div className="w-\[100px\]">\s*<label.*?Step.*?(rateStep).*?<\/div>\s*<div className="w-\[100px\]">\s*<label.*?Base MRP.*?<\/div>\s*<div className="w-\[100px\]">\s*<label.*?Step.*?(mrpStep).*?<\/div>\s*<button[\s\S]*?<\/button>/;
content = content.replace(topBarRegex, '');

// 4. Update dropdown onSelect to generate Grid
const onSelectRegex = /onSelect={\(opt\) => {[\s\S]*?setSelectedGroupId\(opt\.id\);\s*}}/m;
content = content.replace(onSelectRegex, `onSelect={(opt) => {
                    setSearchText(opt.name);
                    setSelectedGroupId(opt.id);
                    generateGrid(opt, '', rateStep, '', mrpStep, 'first-qty');
                  }}`);

// 5. Update generateGrid definition
const generateGridRegex = /const generateGrid = \(group: any, bRate = baseRate, rStep = rateStep, bMrp = baseMrp, mStep = mrpStep, focusTarget: 'none' \| 'base-rate' \| 'first-qty' = 'none'\) => {/;
content = content.replace(generateGridRegex, `const generateGrid = (group: any, bRate = '', rStep = rateStep, bMrp = '', mStep = mrpStep, focusTarget: 'none' | 'base-rate' | 'first-qty' = 'none') => {`);

// 6. Update Table th widths
content = content.replace(/w-\[120px\]/g, 'px-2');
content = content.replace(/min-w-\[80px\]/g, 'px-1');
content = content.replace(/min-w-\[100px\]/g, 'px-2');
content = content.replace(/min-w-max/g, '');

// 7. Remove Amount Row
const amountRowRegex = /{\/\* Amount Row \(Calculated\) \*\/}[\s\S]*?<\/tr>/;
content = content.replace(amountRowRegex, '');

// 8. Add step change handlers and update rate handlers
const handlersRegex = /const handleRateChange = \(index: number, value: string\) => {[\s\S]*?};\n\n  const handleMrpChange = \(index: number, value: string\) => {[\s\S]*?};/m;
const newHandlers = `const handleRateChange = (index: number, value: string) => {
    setMatrixData(prev => {
      const newData = [...prev];
      newData[index].rate = value;
      if (index === 0 && value !== '') {
        const stepVal = parseFloat(rateStep) || 0;
        let currentBase = parseFloat(value) || 0;
        for (let i = 1; i < newData.length; i++) {
           newData[i].rate = (currentBase + (stepVal * i)).toFixed(2);
        }
      }
      return newData;
    });
  };

  const handleRateStepChange = (value: string) => {
    setRateStep(value);
    const stepVal = parseFloat(value) || 0;
    setMatrixData(prev => {
      if (prev.length > 0 && prev[0].rate !== undefined && prev[0].rate !== '') {
        const newData = [...prev];
        let currentBase = parseFloat(newData[0].rate) || 0;
        for (let i = 1; i < newData.length; i++) {
           newData[i].rate = (currentBase + (stepVal * i)).toFixed(2);
        }
        return newData;
      }
      return prev;
    });
  };

  const handleMrpChange = (index: number, value: string) => {
    setMatrixData(prev => {
      const newData = [...prev];
      newData[index].mrp = value;
      if (index === 0 && value !== '') {
        const stepVal = parseFloat(mrpStep) || 0;
        let currentBase = parseFloat(value) || 0;
        for (let i = 1; i < newData.length; i++) {
           newData[i].mrp = (currentBase + (stepVal * i)).toString();
        }
      }
      return newData;
    });
  };
  
  const handleMrpStepChange = (value: string) => {
    setMrpStep(value);
    const stepVal = parseFloat(value) || 0;
    setMatrixData(prev => {
      if (prev.length > 0 && prev[0].mrp !== undefined && prev[0].mrp !== '') {
        const newData = [...prev];
        let currentBase = parseFloat(newData[0].mrp) || 0;
        for (let i = 1; i < newData.length; i++) {
           newData[i].mrp = (currentBase + (stepVal * i)).toString();
        }
        return newData;
      }
      return prev;
    });
  };`;
content = content.replace(handlersRegex, newHandlers);

// 9. Replace Pur. Rate Header
const purRateHeaderRegex = /<td className="[^"]*?">[\s\S]*?Pur\. Rate[\s\S]*?<\/td>/;
const newPurRateHeader = `<td className="bg-white border-b border-r border-slate-200 p-1 px-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-bold text-slate-600">Pur. Rate</span>
                        <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                          <span className="text-[9px] text-emerald-700 uppercase font-bold">Step</span>
                          <input autoComplete="off" type="number" className="w-[35px] bg-transparent text-[10px] text-emerald-900 font-bold focus:outline-none" value={rateStep} onChange={e => handleRateStepChange(e.target.value)} />
                        </div>
                      </div>
                    </td>`;
content = content.replace(purRateHeaderRegex, newPurRateHeader);

// 10. Replace MRP Header
const mrpHeaderRegex = /<td className="[^"]*?">[\s\S]*?MRP[\s\S]*?<\/td>/;
const newMrpHeader = `<td className="bg-white border-b border-r border-slate-200 p-1 px-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-bold text-slate-600">MRP</span>
                        <div className="flex items-center gap-1 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                          <span className="text-[9px] text-emerald-700 uppercase font-bold">Step</span>
                          <input autoComplete="off" type="number" className="w-[35px] bg-transparent text-[10px] text-emerald-900 font-bold focus:outline-none" value={mrpStep} onChange={e => handleMrpStepChange(e.target.value)} />
                        </div>
                      </div>
                    </td>`;
content = content.replace(mrpHeaderRegex, newMrpHeader);


// Save
fs.writeFileSync(file, content);
console.log("Patched Full Width, Removed Amount Row, and Inline Steps");
