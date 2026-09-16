const fs = require('fs');
let piFile = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/inventory/PurchaseInvoice.tsx';
let piContent = fs.readFileSync(piFile, 'utf8');

const regex = /<div className="w-\[35%\] px-1 py-\[2px\] text-right text-\[12px\]">\{finalAmount\.toFixed\(2\)\}[\s\S]*?\{!isReadOnly && \(/;

const newHTML = `<div className="w-[35%] px-1 py-[2px] text-right text-[13px]">{finalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Action Sidebar (F-keys) */}
      <div className="w-[120px] pointer-events-auto flex-col gap-[2px] overflow-y-auto hidden lg:flex bg-[#e0efeb]">
         {[
           { key: "F1", label: "Help" },
           { key: "F2", label: "Date" },
           { key: "F3", label: "Company" },
           { key: "F4", label: "Contra" },
           { key: "F5", label: "Payment" },
           { key: "F6", label: "Receipt" },
           { key: "F7", label: "Journal" },
           { key: "F8", label: "Sales" },
           { key: "F9", label: "Purchase" },
         ].map(btn => (
           <button key={btn.key} className="bg-[#e0efeb] hover:bg-[#d0e5df] text-black text-left px-2 py-1 text-[11px] font-semibold border-b border-[#a8c6c1] flex justify-between">
             <span>{btn.key}</span>
             <span className="font-normal text-slate-700">{btn.label}</span>
           </button>
         ))}
      </div>
    </div>

    {!isReadOnly && (`;

piContent = piContent.replace(regex, newHTML);

fs.writeFileSync(piFile, piContent);
console.log("Patched PurchaseInvoice 3!");
