const fs = require('fs');
const path = require('path');

const PAGES_DIR = '/Users/ratan/Downloads/RetailNodeV2/FrontEnd/src/pages';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('bg-[#e0efeb]')) {
    return; // Already modernized
  }
  
  console.log(`Modernizing: ${filePath}`);

  // 1. Extract the title
  let title = 'RetailNode Page';
  const titleMatch = content.match(/<div className='bg-\[#1b5e58\].*?>\s*<div>(.*?)<\/div>/);
  if (titleMatch) {
    title = titleMatch[1].replace(/<\/?[^>]+(>|$)/g, ""); // Strip any nested tags just in case
  } else {
    // Fallback to checking the yellow tag like master forms
    const titleMatchYellow = content.match(/<div className='bg-\[#1b5e58\].*?>(.*?)<div className='text-yellow-300'/);
    if (titleMatchYellow) {
      title = titleMatchYellow[1].trim();
    }
  }

  // 2. Replace the outer container and Top Header
  // The old title bar sometimes has inner divs. We use a more forgiving match that eats the title bar completely.
  const oldHeaderRegex = /<div className='flex flex-col h-screen font-sans.*?bg-\[#e0efeb\].*?>\s*<div className='flex flex-1 p-1 gap-1 overflow-hidden h-full'>\s*{\/\* Main Container \*\/}\s*<div className='flex-1 bg-\[#fcfaf2\] border-2 border-\[#81a09d\] flex flex-col overflow-hidden shadow-inner relative'>\s*<div className='bg-\[#1b5e58\].*?>(\s*<div>.*?<\/div>)*\s*(<div className='text-yellow-300'>.*?<\/div>)?\s*<\/div>/ms;
  
  const newHeader = `<div className='flex flex-col h-[calc(100vh-6rem)] font-sans selection:bg-indigo-100 w-full max-w-[1400px] mx-auto'>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">${title}</h1>
            <p className="text-sm font-medium text-slate-500">RetailNode Module</p>
          </div>
          
          <div className="flex gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-500 shadow-sm">
              <span className="text-slate-400">ESC</span> Back
            </kbd>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-600 shadow-sm">
              <span className="text-emerald-400">CTRL+S</span> Save
            </kbd>
          </div>
        </div>

        <div className='flex flex-1 gap-4 overflow-hidden'>
          {/* Main Container */}
          <div className='flex-1 bg-white/70 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/40 flex flex-col overflow-hidden'>`;

  content = content.replace(oldHeaderRegex, newHeader);

  // 3. Remove Right Sidebar and Footer entirely
  // Remove 1 </div> because the Main Container is closed by the existing </div> before the sidebar!
  const rightSidebarRegex = /\s*{\/\* Right Sidebar \*\/}\s*<div className='w-\[120px\].*/ms;
  
  if (content.match(rightSidebarRegex)) {
    content = content.replace(rightSidebarRegex, `
        </div>
      </div>
    </>
  );
}`);
  }

  // 4. Convert internal backgrounds and borders
  // Convert standard Tally colors in the inner components to neutral slate
  content = content.replace(/bg-\[#fcfaf2\]/g, 'bg-white');
  content = content.replace(/bg-\[#eef5ed\]/g, 'bg-slate-50');
  content = content.replace(/bg-\[#e0efeb\]/g, 'bg-slate-50');
  content = content.replace(/bg-\[#1b5e58\]/g, 'bg-indigo-600');
  content = content.replace(/bg-\[#12423d\]/g, 'bg-indigo-700');
  content = content.replace(/bg-\[#81a09d\]/g, 'bg-slate-200');
  content = content.replace(/border-\[#81a09d\]/g, 'border-slate-200');
  content = content.replace(/border-\[#a3c3be\]/g, 'border-slate-200');
  content = content.replace(/border-\[#1b5e58\]/g, 'border-slate-200');
  content = content.replace(/border-\[#12423d\]/g, 'border-slate-200');
  content = content.replace(/text-\[#1b5e58\]/g, 'text-indigo-600');
  
  // Specific fix for SalesReturn's Bottom Footer Action Area
  content = content.replace(/bg-\[#ccffcc\]/g, 'bg-emerald-50');
  content = content.replace(/border-\[#a3e8a3\]/g, 'border-emerald-200');

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

walkDir(PAGES_DIR);
console.log('Done modernizing all remaining pages!');
