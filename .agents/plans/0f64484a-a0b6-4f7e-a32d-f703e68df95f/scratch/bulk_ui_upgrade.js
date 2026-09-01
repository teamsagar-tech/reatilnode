const fs = require('fs');
const path = require('path');

const directoryPath = path.join(process.cwd(), 'src/pages');

// Premium Tailwind Classes
const inputClasses = 'w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none';
const selectClasses = 'w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none';
const tableClasses = 'w-full text-left border-collapse whitespace-nowrap min-w-[800px] bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm';
const theadClasses = 'bg-slate-50/90 backdrop-blur-md sticky top-0 z-10';
const thClasses = 'px-4 py-3.5 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider text-center';
const tdClasses = 'px-4 py-2.5 font-bold text-slate-700 border-b border-slate-100 text-center';
const trClasses = 'text-[13px] hover:bg-slate-50/50 transition-colors';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Upgrade Inputs (but leave transparent/table inputs alone)
  // Let's target inputs inside the top filter cards.
  // A heuristic: if it has border-slate-400 or border-slate-500 and is an input/select.
  content = content.replace(/className=(["'])[^"']*border-slate-[345]00[^"']*["']/g, (match) => {
    if (match.includes('bg-transparent')) return match; // table inputs
    return `className="${inputClasses}"`;
  });

  // 2. Upgrade Tables
  content = content.replace(/<table className=["'][^"']*["']>/g, `<table className="${tableClasses}">`);
  content = content.replace(/<thead className=["'][^"']*["']>/g, `<thead className="${theadClasses}">`);
  
  // Replace all th classes (except those that might already be upgraded)
  content = content.replace(/<th className=(["'])[^"']*["']/g, `<th className="${thClasses}"`);

  // 3. Upgrade table inputs (the transparent ones)
  const tableInputClasses = 'w-full bg-transparent focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 py-1 font-semibold text-slate-700 text-center';
  content = content.replace(/className=(["'])w-full bg-transparent focus:outline-none px-1["']/g, `className="${tableInputClasses}"`);
  content = content.replace(/className=(["'])w-full bg-transparent focus:bg-\[#ffffe0\] focus:outline-none px-1["']/g, `className="${tableInputClasses}"`);
  
  // Upgrade tr classes in tbody
  content = content.replace(/<tr key=\{([^\}]+)\} className=["'][^"']*["']>/g, `<tr key={$1} className="${trClasses}">`);

  // Upgrade td classes
  content = content.replace(/<td className=(["'])border-r border-slate-300 px-1 py-\[2px\]["']/g, `<td className="${tdClasses}">`);
  
  // Upgrade Top Container to Filter Card look
  // Search for something like p-2 border-b-2 border-black (the old tally style)
  content = content.replace(/className=["']p-2 border-b-2 border-black flex gap-4["']/g, `className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-5 shrink-0 grid grid-cols-1 md:grid-cols-4 gap-4"`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Upgraded internal UI for: ${filePath}`);
  }
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverseDirectory(fullPath);
    } else if (file.endsWith('.tsx') && !file.includes('SalesReturn') && !file.includes('PurchaseInvoice') && !file.includes('PointOfSales')) {
      processFile(fullPath);
    }
  });
}

traverseDirectory(directoryPath);
console.log("Bulk UI Upgrade Complete!");
