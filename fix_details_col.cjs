const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add baseRate and baseMrp back
const stateRegex = /const \[rateStep, setRateStep\] = useState\(''\);\n/;
content = content.replace(stateRegex, `const [rateStep, setRateStep] = useState('');\n  const [baseRate, setBaseRate] = useState('');\n  const [baseMrp, setBaseMrp] = useState('');\n`);

// 2. Add baseRate change handlers
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
`;

// 3. Update existing step handlers to use baseRate instead of prev[0].rate
const stepHandlersRegex = /const handleRateStepChange = \(value: string\) => {[\s\S]*?};\n\n  const handleMrpChange =/m;
const newStepHandlers = `const handleRateStepChange = (value: string) => {
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

  const handleMrpChange =`;
content = content.replace(stepHandlersRegex, newStepHandlers);

const mrpStepRegex = /const handleMrpStepChange = \(value: string\) => {[\s\S]*?};\n/m;
const newMrpStep = `const handleMrpStepChange = (value: string) => {
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
  };\n`;
content = content.replace(mrpStepRegex, newMrpStep);

// Add the base handlers before handleRateChange
content = content.replace(/const handleRateChange =/m, newHandlers + '\n  const handleRateChange =');

// 4. Remove index === 0 cascading logic from handleRateChange and handleMrpChange
content = content.replace(/if \(index === 0 && value !== ''\) {[\s\S]*?}/g, '');

// 5. Update Pur. Rate Header to include BOTH inputs
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

// 6. Update MRP Header
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

fs.writeFileSync(file, content);
console.log("Patched to use Base Rate in Details Column");
