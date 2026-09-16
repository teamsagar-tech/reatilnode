const fs = require('fs');
const file = '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/components/inventory/SizeAllocationModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div>\s*<h2 className="text-\[13px\] font-black uppercase tracking-wider">Size Allocation Matrix<\/h2>\s*<p className="text-\[10px\] text-emerald-100 font-bold uppercase tracking-wider">{itemName}<\/p>\s*<\/div>\s*<\/div>\s*<\/div>/m;

const replacement = `<div>
            <h2 className="text-[13px] font-black uppercase tracking-wider">Size Allocation Matrix</h2>
            <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">{itemName}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-emerald-200 transition-colors p-1 rounded-full hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Setup Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 z-[70] relative">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] relative z-[60]">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select Size Set</label>
              <div className="w-[300px]">
                <SearchableDropdown 
                  value={searchText}
                  onChange={(val) => {
                    setSearchText(val);
                    const group = sizeGroups.find(g => (g.name || '').toLowerCase() === val.toLowerCase());
                    setSelectedGroupId(group ? group.id : '');
                  }}
                  onSelect={(opt) => {
                    setSearchText(opt.name);
                    setSelectedGroupId(opt.id);
                    generateGrid(opt, '', rateStep, '', mrpStep, 'first-qty');
                  }}
                  options={sizeGroups}
                  displayKey="name"
                  placeholder="Select Group or Alt+C to create"
                  className="w-full bg-white border border-[#a3c3be] px-2 py-1 text-[12px] font-bold text-black focus:bg-[#ffffe0] focus:outline-none focus:border-slate-800"
                  width="100%"
                  renderOption={(opt, isSelected) => {
                    let sizesStr = '';
                    if (opt.sizes_list) {
                      try {
                        const arr = typeof opt.sizes_list === 'string' ? JSON.parse(opt.sizes_list) : opt.sizes_list;
                        sizesStr = Array.isArray(arr) ? arr.join(', ') : '';
                      } catch(e) {}
                    }
                    return (
                      <div className="flex justify-between items-center w-full gap-2">
                        <span className="font-bold text-slate-800 whitespace-nowrap">{opt.name}</span>
                        <span className="text-slate-500 text-[10px] truncate">{sizesStr}</span>
                      </div>
                    );
                  }}
                  onKeyDown={(e) => {
                    if (e.altKey && (e.key.toLowerCase() === 'c' || e.code === 'KeyC')) {
                      e.preventDefault();
                      setShowMasterModal(true);
                    }
                  }}
                  onNotFound={() => setShowMasterModal(true)}
                  width="w-[300px]"
                />
              </div>
            </div>
          </div>
        </div>`;

if(content.match(regex)) {
   content = content.replace(regex, replacement);
   fs.writeFileSync(file, content);
   console.log("Restored header and searchable dropdown!");
} else {
   console.log("Failed to match regex");
}
