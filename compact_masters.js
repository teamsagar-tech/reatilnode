const fs = require('fs');
const path = require('path');

const targetDirs = [
  '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages/masters/',
  '/Users/ratan/Downloads/RetailNodeV2/FrontEndV2/src/pages/masters/'
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      compactFile(fullPath);
    }
  }
}

function compactFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Container wrappers
  content = content.replace(/h-\[calc\(100vh-6rem\)\] font-sans selection:bg-indigo-100 w-full px-2/g, 'h-[calc(100vh-64px)] font-sans selection:bg-indigo-100 w-full bg-slate-50');
  content = content.replace(/h-\[calc\(100vh-64px\)\] font-sans selection:bg-indigo-100 w-full px-2 pt-2 pb-2/g, 'h-[calc(100vh-64px)] font-sans selection:bg-indigo-100 w-full bg-slate-50');
  content = content.replace(/flex flex-1 gap-4 overflow-hidden/g, 'flex flex-1 overflow-hidden');
  content = content.replace(/bg-white\/70 backdrop-blur-xl border border-slate-200\/60 rounded-2xl shadow-xl shadow-slate-200\/40/g, 'bg-white border-none');
  
  // 2. Header and Main Paddings
  content = content.replace(/p-4 sm:p-6 flex-1 overflow-y-auto/g, 'flex-1 overflow-y-auto flex flex-col');
  content = content.replace(/p-4 sm:p-5 border-b/g, 'px-2 py-1 border-b');
  content = content.replace(/flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4/g, 'flex flex-col sm:flex-row sm:items-center justify-between px-2 py-1 border-b border-slate-200 shrink-0 bg-white');

  // 3. Header Text
  content = content.replace(/text-2xl font-black text-slate-800/g, 'text-sm font-black text-slate-800 uppercase');
  content = content.replace(/text-sm font-medium text-slate-500/g, 'text-[10px] font-bold text-slate-500');
  content = content.replace(/gap-3 shrink-0/g, 'gap-2 shrink-0');

  // 4. Tables and Lists
  content = content.replace(/px-4 py-3/g, 'px-2 py-1 text-[11px]');
  content = content.replace(/border border-slate-200 rounded-xl overflow-y-auto/g, 'overflow-y-auto');
  content = content.replace(/bg-slate-50 border-b border-slate-200 sticky top-0 z-10/g, 'bg-slate-100 border-b border-slate-200 sticky top-0 z-10');
  content = content.replace(/text-slate-600 font-bold text-xs uppercase tracking-wider/g, 'text-slate-800 font-bold text-[10px] uppercase tracking-widest');

  // 5. Search Bar & Action Buttons
  content = content.replace(/px-4 py-2 rounded-lg font-bold text-white shadow-md/g, 'px-2 py-1 rounded bg-indigo-600 font-bold text-white shadow-none');
  content = content.replace(/pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs/g, 'pl-7 pr-2 py-1 bg-slate-50 border border-slate-300 rounded text-[11px]');
  
  // 6. Form Columns
  content = content.replace(/flex-1 flex flex-col gap-1 border-r border-slate-100 pr-6/g, 'flex-1 flex flex-col gap-1 border-r border-slate-200 px-2');
  content = content.replace(/flex-1 flex flex-col gap-1 overflow-y-auto pb-4/g, 'flex-1 flex flex-col gap-1 overflow-y-auto px-2 pb-2');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Compacted:', filePath);
  }
}

targetDirs.forEach(processDir);
