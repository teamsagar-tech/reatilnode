const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldPurHtml = `<td className="bg-white border-b border-r border-slate-200 p-1 px-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
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
                    
const newPurHtml = `<td className="bg-white border-b border-r border-slate-200 p-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      <div className="flex items-center justify-between gap-3 w-full">
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Pur. Rate</span>
                        <div className="flex items-center gap-1.5">
                          <input autoComplete="off" placeholder="Base" type="number" className="w-[70px] bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-xs text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" value={baseRate} onChange={e => handleBaseRateChange(e.target.value)} />
                          <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-1 rounded border border-emerald-200">
                            <span className="text-[10px] text-emerald-700 uppercase font-bold">+</span>
                            <input autoComplete="off" placeholder="Step" type="number" className="w-[50px] bg-transparent text-xs text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" value={rateStep} onChange={e => handleRateStepChange(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </td>`;

const oldMrpHtml = `<td className="bg-white border-b border-r border-slate-200 p-1 px-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
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

const newMrpHtml = `<td className="bg-white border-b border-r border-slate-200 p-2 sticky left-0 z-10 shadow-[1px_0_0_#e2e8f0]">
                      <div className="flex items-center justify-between gap-3 w-full">
                        <span className="text-xs font-bold text-slate-600 whitespace-nowrap">MRP</span>
                        <div className="flex items-center gap-1.5">
                          <input autoComplete="off" placeholder="Base" type="number" className="w-[70px] bg-indigo-50 border border-indigo-200 px-2 py-1 rounded text-xs text-indigo-900 font-bold focus:outline-none placeholder-indigo-300" value={baseMrp} onChange={e => handleBaseMrpChange(e.target.value)} />
                          <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-1 rounded border border-emerald-200">
                            <span className="text-[10px] text-emerald-700 uppercase font-bold">+</span>
                            <input autoComplete="off" placeholder="Step" type="number" className="w-[50px] bg-transparent text-xs text-emerald-900 font-bold focus:outline-none placeholder-emerald-300" value={mrpStep} onChange={e => handleMrpStepChange(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </td>`;

if (content.includes(oldPurHtml) && content.includes(oldMrpHtml)) {
    content = content.replace(oldPurHtml, newPurHtml);
    content = content.replace(oldMrpHtml, newMrpHtml);
    fs.writeFileSync(file, content);
    console.log("Updated Details column perfectly.");
} else {
    console.log("Could not find exact HTML to replace!");
}
