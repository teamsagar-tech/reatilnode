const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // We are looking to remove the div block containing "Ctrl+M".
      // It always starts with <div className="... bg-[#1b5e58] text-white flex justify-between px-4 py-1 text-xs border-b-2 border-[#12423d]..."
      // and ends with </div>
      // and may have a comment above it.
      
      const regex = /(?:\{\/\*\s*[^\*]*Header[^\*]*\s*\*\/\}\s*)?<div className=(?:'|")bg-\[#1b5e58\] text-white flex justify-between px-4 py-1 text-xs border-b-2 border-\[#12423d\](?: shrink-0)?(?:'|")>[\s\S]*?Ctrl\+M[\s\S]*?<\/div>\s*<\/div>/g;
      
      const newContent = content.replace(regex, '');
      
      // Also catch any variations without comments
      const regex2 = /<div className=(?:'|")bg-\[#1b5e58\] text-white flex justify-between px-4 py-1 text-xs border-b-2 border-\[#12423d\](?: shrink-0)?(?:'|")>[\s\S]*?Ctrl\+M[\s\S]*?<\/div>\s*<\/div>/g;
      
      const newerContent = newContent.replace(regex2, '');
      
      if (content !== newerContent) {
        fs.writeFileSync(fullPath, newerContent, 'utf8');
        console.log('Removed from:', fullPath);
      }
    }
  }
}

processDir('/Users/ratan/Downloads/frost-pivot/RetailNode/FrontEndV2/src/pages');
