const fs = require('fs');

function refactorFile(filePath, isModal) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Fix InputRow default width to 'w-[250px]' instead of 'flex-1'
  content = content.replace(/width = 'flex-1'/g, "width = 'w-[250px]'");

  // 2. Change the main flex wrapper to stack vertically full width
  content = content.replace(/className="flex flex-row flex-wrap gap-8 items-start pb-10"/g, 'className="flex flex-col gap-4 pb-10 w-full"');

  // 3. Change all Section wrappers (w-[400px]) to full width and wrap their contents in flex-row flex-wrap
  // We want: 
  // <div className="w-full flex flex-col gap-1">
  //   <SectionTitle>...</SectionTitle>
  //   <div className="flex flex-row flex-wrap gap-x-6 gap-y-2">
  //      ... inputs ...
  //   </div>
  // </div>
  
  // This regex matches: <div className="w-[400px] flex flex-col gap-1">
  content = content.replace(/<div className="w-\[400px\] flex flex-col gap-1">/g, '<div className="w-full flex flex-col gap-1">');
  
  // We need to inject the <div className="flex flex-row flex-wrap gap-x-6 gap-y-2"> right after <SectionTitle>...</SectionTitle>
  // or right after the flex items-center mb-[2px] if it's the title block.
  // Actually, wait! The SectionTitle is currently:
  // <div className="flex items-center mb-[2px]">
  //   <div className="w-[110px] text-right pr-2"></div>
  //   <div className="flex-1 bg-[#1b5e58] text-white text-[10px] font-bold px-2 py-[2px] tracking-wider">LEGAL INFORMATION</div>
  // </div>
  // Let's replace the block entirely or just inject around the inputs.
  
  // Let's do a more robust regex to find the Section header block and inject the wrap div
  content = content.replace(/(<div className="flex items-center mb-\[2px\]">\s*<div className="w-\[110px\] text-right pr-2"><\/div>\s*<div className="flex-1 bg-\[#1b5e58\] text-white text-\[10px\] font-bold px-2 py-\[2px\] tracking-wider">.*?<\/div>\s*<\/div>)/g, '$1\n                        <div className="flex flex-row flex-wrap gap-x-6 gap-y-1 mt-1">');
  
  // Now we need to close this new div just before the </div> that closes the section.
  // We can just add </div> before </div> \n <div className="w-full flex flex-col gap-1">
  // But doing this with regex is hard.
