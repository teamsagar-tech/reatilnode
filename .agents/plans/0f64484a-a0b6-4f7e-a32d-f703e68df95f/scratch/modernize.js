const fs = require('fs');
const path = require('path');

const MASTERS_DIR = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('bg-[#e0efeb]')) {
    console.log(`Skipping (already modern): ${filePath}`);
    return;
  }

  console.log(`Modernizing: ${filePath}`);

  // 1. Add Search Icon import
  if (!content.includes('Search } from \'lucide-react\'')) {
    content = content.replace(
      "import { Helmet } from 'react-helmet-async';",
      "import { Helmet } from 'react-helmet-async';\nimport { Search } from 'lucide-react';"
    );
  }

  // 2. Replace SectionTitle
  content = content.replace(
    /const SectionTitle = \(\{ children \}: \{ children: React\.ReactNode \}\) => \([\s\S]*?<\/div>\n  \);/,
    `const SectionTitle = ({ children }: { children: React.ReactNode }) => (\n    <div className="font-bold text-indigo-900 text-xs border-b-2 border-indigo-100 mb-4 mt-2 pb-1.5 uppercase tracking-widest bg-gradient-to-r from-indigo-50/80 to-transparent px-2 rounded-t-lg">\n      {children}\n    </div>\n  );`
  );

  // 3. Replace InputRow
  content = content.replace(
    /const InputRow = \(\{ label, value, onChange, width = 'flex-1', type = 'text', placeholder = '' \}: any\) => \([\s\S]*?<\/div>\n  \);/,
    `const InputRow = ({ label, value, onChange, width = 'w-full', type = 'text', placeholder = '', id = '' }: any) => (\n    <div className="flex items-center mb-1.5 hover:bg-slate-50/50 p-1 rounded-lg transition-colors group">\n      <div className="w-[130px] text-slate-700 font-bold text-[11px] text-right pr-3 leading-tight tracking-wide group-hover:text-indigo-700 transition-colors">\n        {label}\n      </div>\n      <div className="flex-1">\n        <input \n          id={id}\n          type={type} \n          className={\`bg-white border border-slate-200 px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded-md shadow-sm focus:bg-indigo-50/30 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all \${width}\`}\n          value={value || ''}\n          onChange={e => onChange(e.target.value)}\n          placeholder={placeholder}\n        />\n      </div>\n    </div>\n  );`
  );

  // 4. Extract title dynamically
  const titleMatch = content.match(/<div className='text-yellow-300'>(.*?)<\/div>/);
  const title = titleMatch ? titleMatch[1] : 'Master Form';

  // 5. Replace Outer Container
  content = content.replace(
    /<div className='flex flex-col h-screen font-sans text-\[13px\] selection:bg-transparent overflow-hidden bg-\[#e0efeb\] w-full'>/g,
    "<div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full max-w-[1400px] mx-auto'>"
  );

  // 6. Replace Top Header & Main Container setup
  content = content.replace(
    /<div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>\s*{\/\* Main Container \*\/}\s*<div className='flex-1 bg-\[#fcfaf2\] border-2 border-\[#81a09d\] flex flex-col overflow-hidden shadow-inner relative'>\s*<div className='bg-\[#1b5e58\] text-white font-bold px-2 py-1 flex justify-between shrink-0'>\s*<div>Master Creation<\/div>\s*<div className='text-yellow-300'>.*?<\/div>\s*<\/div>/,
    `{/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">${title}</h1>
            <p className="text-sm font-medium text-slate-500">Configuration</p>
          </div>
          
          <div className="flex gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
              <span className="text-slate-400">ESC</span> Back
            </kbd>
            {mode === 'list' ? (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 shadow-sm">
                <span className="text-indigo-400">ALT+C</span> Create New
              </kbd>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-600 shadow-sm">
                <span className="text-emerald-400">CTRL+A</span> Save
              </kbd>
            )}
          </div>
        </div>

        <div className='flex flex-1 gap-4 overflow-hidden'>
          {/* Main Container */}
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden'>`
  );

  // 7. Replace List Mode Header
  content = content.replace(
    /<div className='flex justify-between items-center mb-2'>\s*<div className='font-bold text-slate-800 text-\[14px\]'>.*?<\/div>\s*<button\s*onClick=\{.*?\}\s*className='bg-\[#eef5ed\].*?'\s*>Create New \(Alt\/Opt\+C\)<\/button>\s*<\/div>/g,
    `<div className='flex justify-between items-center mb-4'>
                    <div className="relative w-full max-w-sm group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-400 transition-all placeholder-slate-400"
                      />
                    </div>
                    <button 
                      onClick={() => setMode('create')} 
                      className='bg-indigo-600 px-4 py-2 rounded-lg font-bold text-white shadow-md hover:bg-indigo-700 transition-all text-xs'
                    >Create New (Alt+C)</button>
                  </div>`
  );

  // 8. Replace Table Styles
  content = content.replace(/<table className='w-full text-left border-collapse border border-slate-400'>/g, "<table className='w-full text-left border-collapse'>");
  content = content.replace(/<thead className='bg-\[#eef5ed\]'>/g, "<thead className='bg-slate-50 border-b border-slate-200'>");
  content = content.replace(/<tr className='border-b-2 border-slate-400 text-slate-900 font-bold text-\[12px\]'>/g, "<tr className='text-slate-600 font-bold text-xs uppercase tracking-wider'>");
  content = content.replace(/className="px-2 py-1 border-r border-slate-300"/g, 'className="px-4 py-3"');
  
  content = content.replace(
    /<tr key=\{row\.id\} className=\{'text-\[12px\] border-b border-slate-300 ' \+ \(idx % 2 === 0 \? 'bg-white' : 'bg-\[#fcfaf2\]'\) \+ ' hover:bg-\[#ffffe0\] cursor-pointer'\}>/g,
    "<tr key={row.id} className='text-xs bg-white hover:bg-indigo-50/30 cursor-pointer transition-colors group border-b border-slate-100'>"
  );
  
  content = content.replace(/className="px-2 py-1 border-r border-slate-300 font-medium text-slate-700"/g, 'className="px-4 py-3 font-semibold text-slate-700"');

  // 9. Replace Buttons Group
  content = content.replace(
    /<div className='flex justify-end gap-2 pt-2 border-t border-slate-300 mt-2 shrink-0'>/g,
    "<div className='flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4 shrink-0'>"
  );
  
  content = content.replace(
    /className='bg-red-50 border border-red-300 px-6 py-1 text-red-700 font-bold hover:bg-red-100 shadow-\[inset_1px_1px_0_rgba\(255,255,255,0\.8\)\] outline-none focus:bg-red-200'/g,
    "className='bg-white border border-slate-200 px-6 py-2 text-slate-600 rounded-lg font-bold hover:bg-slate-50 shadow-sm transition-all text-xs'"
  );

  content = content.replace(
    /className='bg-\[#1b5e58\] border border-\[#1b5e58\] px-6 py-1 text-white font-bold hover:bg-\[#144743\] shadow-\[inset_1px_1px_0_rgba\(255,255,255,0\.2\)\] outline-none focus:bg-\[#0f3632\]'/g,
    "className='bg-indigo-600 border border-indigo-600 px-8 py-2 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5 text-xs'"
  );

  // 10. Remove Right Sidebar and Footer entirely
  content = content.replace(
    /\s*{\/\* Right Sidebar \*\/}\s*<div className='w-\[120px\].*?bg-\[#1b5e58\].*?<\/div>\s*<\/div>\s*<\/div>\s*<\/>/ms,
    `
          </div>
        </div>
      </div>
    </>
  `
  );

  // Alternative fallback if regex fails due to line endings
  if (content.includes('{/* Right Sidebar */}')) {
      const idx = content.indexOf('{/* Right Sidebar */}');
      content = content.substring(0, idx) + `
          </div>
        </div>
      </div>
    </>
  );
}`;
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(MASTERS_DIR);
console.log('Done!');
