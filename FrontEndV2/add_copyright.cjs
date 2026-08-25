const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We want to find the footer:
      // <div className="bg-[#1b5e58] text-white text-[11px] px-4 py-1 flex justify-between items-center border-t-2 border-[#12423d]">
      //   <div>...</div>
      //   <div>...</div>
      // </div>
      // And we want to replace whatever is on the right side with the copyright text.
      // But some files might already have it, or it might just be easier to completely replace the inner contents of the footer.
      
      // Let's match the start of the footer tag
      const footerRegex = /<div className=(?:'|")bg-\[#1b5e58\] text-white text-\[11px\] px-4 py-1 flex justify-between items-center border-t-2 border-\[#12423d\](?: shrink-0)?(?:'|")>([\s\S]*?)<\/div>\s*<\/div>\s*(?:<\/>|<\/div>)$/m;
      // Wait, regex matching till end of file is safer.
      
      const footerRegexG = /(<div className=(?:'|")bg-\[#1b5e58\] text-white text-\[11px\] px-4 py-1 flex justify-between items-center border-t-2 border-\[#12423d\](?: shrink-0)?(?:'|")>)([\s\S]*?)(<\/div>\s*<\/div>\s*(?:<\/>|<\/div>|\s*)$)/g;

      let newContent = content.replace(footerRegexG, (match, p1, p2, p3) => {
        // Extract the title (left side) which is the first child div.
        // It's usually <div className="font-medium tracking-wide">...</div>
        const titleMatch = p2.match(/<div className=(?:'|")font-medium tracking-wide(?:'|")>.*?<\/div>/);
        const leftSide = titleMatch ? titleMatch[0] : `<div className="font-medium tracking-wide">RetailNode</div>`;
        
        return `${p1}\n          ${leftSide}\n          <div className="font-bold text-[#a3c3be] tracking-wide">&copy; RetailNode. &amp; V R Pawar</div>\n        ${p3}`;
      });
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Added copyright to:', fullPath);
      }
    }
  }
}

processDir('/Users/ratan/Downloads/frost-pivot/RetailNode/FrontEndV2/src/pages');
