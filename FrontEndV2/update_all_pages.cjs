const fs = require('fs');
const path = require('path');

const logoSvg = `             <div className="flex flex-col items-center justify-center p-2 mb-2 border-t border-[#a3c3be] mx-2 pt-4">
               <svg width="64" height="64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="100" cy="100" r="86" fill="transparent" stroke="#1b5e58" strokeWidth="14" />
                 <circle cx="14" cy="100" r="8" fill="transparent" stroke="#1b5e58" strokeWidth="5" />
                 <circle cx="186" cy="100" r="8" fill="transparent" stroke="#1b5e58" strokeWidth="5" />
                 <text x="100" y="100" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="72" textAnchor="middle" dominantBaseline="central">
                   <tspan fill="#12423d">RN</tspan><tspan fill="#1b5e58">.</tspan>
                 </text>
               </svg>
               <span className="font-extrabold text-[13px] text-[#12423d] mt-2 uppercase tracking-widest text-center">RetailNode</span>
             </div>`;

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // 1. ADD COPYRIGHT TO FOOTER
      // Match the entire bottom footer block up to the end of the file.
      const footerRegexG = /(<div className=(?:'|")bg-\[#1b5e58\] text-white text-\[11px\] px-4 py-1 flex justify-between items-center border-t-2 border-\[#12423d\](?: shrink-0)?(?:'|")>)([\s\S]*?)(<\/div>\s*<\/div>\s*(?:<\/>|<\/div>|\s*)$)/g;

      content = content.replace(footerRegexG, (match, p1, p2, p3) => {
        // Extract the title (left side) which is the first child div.
        const titleMatch = p2.match(/<div className=(?:'|")font-medium tracking-wide(?:'|")>.*?<\/div>/);
        const leftSide = titleMatch ? titleMatch[0] : `<div className="font-medium tracking-wide">RetailNode</div>`;
        return `${p1}\n          ${leftSide}\n          <div className="font-bold text-[#a3c3be] tracking-wide">&copy; RetailNode. &amp; V R Pawar</div>\n        ${p3}`;
      });

      // 2. ADD LOGO ABOVE QUIT/EXIT BUTTON
      // Find where we have `<div className="flex-1" />` followed by the Quit button
      // Some use <div className='flex-1' />
      // Some use "flex-1"
      
      // First, check if logo is already there, if so remove it so we don't duplicate
      const stripLogoRegex = /<div className=(?:'|")flex flex-col items-center justify-center p-2 mb-2 border-t border-\[#a3c3be\] mx-2 pt-4(?:'|")>[\s\S]*?<\/div>\s*(?=<button)/g;
      content = content.replace(stripLogoRegex, '');

      // Now add it back right after the flex-1 spacer
      // We look for: <div className="flex-1" /> OR <div className='flex-1' />
      // And we insert the logo right after it.
      const spacerRegex = /(<div className=(?:'|")flex-1(?:'|")\s*\/>)/g;
      content = content.replace(spacerRegex, `$1\n${logoSvg}\n`);

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir('/Users/ratan/Downloads/frost-pivot/RetailNode/FrontEndV2/src/pages');
